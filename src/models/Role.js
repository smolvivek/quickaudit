import { databaseService } from '../services/databaseService';

class Role {
  static TABLE_NAME = 'roles';

  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS ${this.TABLE_NAME} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        permissions TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `;
    await databaseService.executeQuery(query);
  }

  static async create(role) {
    const { name, description, permissions } = role;
    const now = Date.now();
    const query = `
      INSERT INTO ${this.TABLE_NAME} (name, description, permissions, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await databaseService.executeQuery(query, [
      name,
      description,
      JSON.stringify(permissions),
      now,
      now
    ]);
    return result.insertId;
  }

  static async findById(id) {
    const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = ?`;
    const result = await databaseService.executeQuery(query, [id]);
    if (result.rows.length > 0) {
      const role = result.rows.item(0);
      return {
        ...role,
        permissions: JSON.parse(role.permissions)
      };
    }
    return null;
  }

  static async findByName(name) {
    const query = `SELECT * FROM ${this.TABLE_NAME} WHERE name = ?`;
    const result = await databaseService.executeQuery(query, [name]);
    if (result.rows.length > 0) {
      const role = result.rows.item(0);
      return {
        ...role,
        permissions: JSON.parse(role.permissions)
      };
    }
    return null;
  }

  static async update(id, role) {
    const { name, description, permissions } = role;
    const now = Date.now();
    const query = `
      UPDATE ${this.TABLE_NAME}
      SET name = ?, description = ?, permissions = ?, updated_at = ?
      WHERE id = ?
    `;
    await databaseService.executeQuery(query, [
      name,
      description,
      JSON.stringify(permissions),
      now,
      id
    ]);
  }

  static async delete(id) {
    const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = ?`;
    await databaseService.executeQuery(query, [id]);
  }

  static async list() {
    const query = `SELECT * FROM ${this.TABLE_NAME}`;
    const result = await databaseService.executeQuery(query);
    const roles = [];
    for (let i = 0; i < result.rows.length; i++) {
      const role = result.rows.item(i);
      roles.push({
        ...role,
        permissions: JSON.parse(role.permissions)
      });
    }
    return roles;
  }
}

export default Role; 