import SQLite from 'react-native-sqlite-storage';
import { Platform } from 'react-native';
import User from '../models/User';
import Role from '../models/Role';
import PermissionService from './permissionService';

// Enable promise-based SQLite
SQLite.enablePromise(true);

// Database name
const DATABASE_NAME = 'quickaudit.db';

// Database version
const DATABASE_VERSION = 1;

// Database singleton
let database = null;

// Initialize database
export const initDatabase = async () => {
  try {
    if (database) {
      console.log('Database already initialized');
      return database;
    }

    // Open database
    database = await SQLite.openDatabase({
      name: DATABASE_NAME,
      location: 'default'
    });

    console.log('Database initialized successfully');

    // Check if database needs setup
    await setupDatabase();

    // Create tables
    await User.createTable();
    await Role.createTable();

    // Initialize default roles and permissions
    await PermissionService.initialize();

    return database;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Setup database schema
const setupDatabase = async () => {
  try {
    // Get current version
    const currentVersion = await getDatabaseVersion();

    if (currentVersion === 0) {
      // First-time setup
      await database.executeSql('PRAGMA foreign_keys = ON;');

      // Create version table
      await database.executeSql(`
        CREATE TABLE IF NOT EXISTS version (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          version INTEGER NOT NULL
        );
      `);

      // Create users table
      await database.executeSql(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          firstName TEXT NOT NULL,
          lastName TEXT NOT NULL,
          role TEXT NOT NULL,
          organization TEXT NOT NULL,
          profileImage TEXT,
          settings TEXT,
          lastSync TEXT NOT NULL
        );
      `);

      // Create templates table
      await database.executeSql(`
        CREATE TABLE IF NOT EXISTS templates (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          category TEXT NOT NULL,
          sections TEXT NOT NULL,
          isActive INTEGER NOT NULL DEFAULT 1,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          syncStatus TEXT NOT NULL DEFAULT 'synced',
          syncId TEXT NOT NULL
        );
      `);

      // Create audits table
      await database.executeSql(`
        CREATE TABLE IF NOT EXISTS audits (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          template TEXT NOT NULL,
          location TEXT NOT NULL,
          auditor TEXT NOT NULL,
          supervisor TEXT,
          status TEXT NOT NULL,
          score INTEGER,
          startTime TEXT,
          endTime TEXT,
          sections TEXT,
          findings TEXT,
          actions TEXT,
          notes TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          syncStatus TEXT NOT NULL DEFAULT 'synced',
          syncId TEXT NOT NULL
        );
      `);

      // Create actions table
      await database.executeSql(`
        CREATE TABLE IF NOT EXISTS actions (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          audit TEXT NOT NULL,
          assignee TEXT NOT NULL,
          assignedBy TEXT NOT NULL,
          dueDate TEXT NOT NULL,
          status TEXT NOT NULL,
          progress INTEGER NOT NULL DEFAULT 0,
          priority TEXT NOT NULL,
          completedDate TEXT,
          attachments TEXT,
          comments TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          syncStatus TEXT NOT NULL DEFAULT 'synced',
          syncId TEXT NOT NULL
        );
      `);

      // Create files table
      await database.executeSql(`
        CREATE TABLE IF NOT EXISTS files (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          path TEXT NOT NULL,
          size INTEGER NOT NULL,
          mimeType TEXT NOT NULL,
          entityType TEXT NOT NULL,
          entityId TEXT NOT NULL,
          isUploaded INTEGER NOT NULL DEFAULT 0,
          createdAt TEXT NOT NULL
        );
      `);

      // Set database version
      await database.executeSql(
        'INSERT INTO version (id, version) VALUES (1, ?);',
        [DATABASE_VERSION]
      );

      console.log('Database setup completed');
    } else if (currentVersion < DATABASE_VERSION) {
      // Handle migrations here if needed
      await database.executeSql(
        'UPDATE version SET version = ? WHERE id = 1;',
        [DATABASE_VERSION]
      );
      console.log(`Database migrated from version ${currentVersion} to ${DATABASE_VERSION}`);
    }
  } catch (error) {
    console.error('Database setup error:', error);
    throw error;
  }
};

// Get database version
const getDatabaseVersion = async () => {
  try {
    // Check if version table exists
    const tables = await database.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='version';"
    );

    if (tables[0].rows.length === 0) {
      return 0; // No version table, needs setup
    }

    // Get version
    const result = await database.executeSql('SELECT version FROM version WHERE id = 1;');

    if (result[0].rows.length === 0) {
      return 0; // No version record, needs setup
    }

    return result[0].rows.item(0).version;
  } catch (error) {
    console.error('Get database version error:', error);
    return 0; // Assume needs setup on error
  }
};

// Close database
export const closeDatabase = async () => {
  try {
    if (database) {
      await database.close();
      database = null;
      console.log('Database closed successfully');
    }
  } catch (error) {
    console.error('Database close error:', error);
    throw error;
  }
};

// Base repository class
export class Repository {
  constructor(tableName) {
    this.tableName = tableName;
  }

  // Get all items
  async getAll(filters = {}) {
    try {
      let query = `SELECT * FROM ${this.tableName}`;
      const params = [];

      // Add filters if provided
      if (Object.keys(filters).length > 0) {
        query += ' WHERE ';
        const filterClauses = [];

        for (const [key, value] of Object.entries(filters)) {
          filterClauses.push(`${key} = ?`);
          params.push(value);
        }

        query += filterClauses.join(' AND ');
      }

      const result = await database.executeSql(query, params);
      const items = [];

      for (let i = 0; i < result[0].rows.length; i++) {
        const item = result[0].rows.item(i);
        items.push(this.parseItem(item));
      }

      return items;
    } catch (error) {
      console.error(`Get all ${this.tableName} error:`, error);
      throw error;
    }
  }

  // Get item by ID
  async getById(id) {
    try {
      const result = await database.executeSql(
        `SELECT * FROM ${this.tableName} WHERE id = ?;`,
        [id]
      );

      if (result[0].rows.length === 0) {
        return null;
      }

      return this.parseItem(result[0].rows.item(0));
    } catch (error) {
      console.error(`Get ${this.tableName} by ID error:`, error);
      throw error;
    }
  }

  // Create item
  async create(item) {
    try {
      const { columns, placeholders, values } = this.prepareInsert(item);

      const result = await database.executeSql(
        `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders.join(', ')});`,
        values
      );

      return { ...item, id: item.id || result[0].insertId };
    } catch (error) {
      console.error(`Create ${this.tableName} error:`, error);
      throw error;
    }
  }

  // Update item
  async update(id, item) {
    try {
      const { setClause, values } = this.prepareUpdate(item);

      await database.executeSql(
        `UPDATE ${this.tableName} SET ${setClause.join(', ')} WHERE id = ?;`,
        [...values, id]
      );

      return { ...item, id };
    } catch (error) {
      console.error(`Update ${this.tableName} error:`, error);
      throw error;
    }
  }

  // Delete item
  async delete(id) {
    try {
      await database.executeSql(
        `DELETE FROM ${this.tableName} WHERE id = ?;`,
        [id]
      );

      return true;
    } catch (error) {
      console.error(`Delete ${this.tableName} error:`, error);
      throw error;
    }
  }

  // Get pending sync items
  async getPendingSyncItems() {
    try {
      const result = await database.executeSql(
        `SELECT * FROM ${this.tableName} WHERE syncStatus = 'pending_sync';`
      );

      const items = [];

      for (let i = 0; i < result[0].rows.length; i++) {
        const item = result[0].rows.item(i);
        items.push(this.parseItem(item));
      }

      return items;
    } catch (error) {
      console.error(`Get pending sync ${this.tableName} error:`, error);
      throw error;
    }
  }

  // Helper methods
  prepareInsert(item) {
    const columns = [];
    const placeholders = [];
    const values = [];

    for (const [key, value] of Object.entries(item)) {
      columns.push(key);
      placeholders.push('?');
      values.push(value);
    }

    return { columns, placeholders, values };
  }

  prepareUpdate(item) {
    const setClause = [];
    const values = [];

    for (const [key, value] of Object.entries(item)) {
      if (key !== 'id') {
        setClause.push(`${key} = ?`);
        values.push(value);
      }
    }

    return { setClause, values };
  }

  parseItem(item) {
    // Convert SQLite boolean values
    const parsed = { ...item };
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'number' && (value === 0 || value === 1)) {
        parsed[key] = Boolean(value);
      }
    }
    return parsed;
  }
}

// Create repositories for each entity type
export const userRepository = new Repository('users');
export const templateRepository = new Repository('templates');
export const auditRepository = new Repository('audits');
export const actionRepository = new Repository('actions');
export const fileRepository = new Repository('files');

// Export database service
export const databaseService = {
  initDatabase,
  userRepository,
  templateRepository,
  auditRepository,
  actionRepository,
  fileRepository
};
