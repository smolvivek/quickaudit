import { databaseService } from '../services/databaseService';
import Role from './Role';

class User {
  static TABLE_NAME = 'users';

  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS ${this.TABLE_NAME} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        role_id INTEGER,
        is_active INTEGER DEFAULT 1,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (role_id) REFERENCES roles (id)
      )
    `;
    await databaseService.executeQuery(query);
  }

  static async create(user) {
    const { email, password, firstName, lastName, roleId } = user;
    const now = Date.now();
    const query = `
      INSERT INTO ${this.TABLE_NAME} (
        email, password, first_name, last_name, role_id, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await databaseService.executeQuery(query, [
      email,
      password,
      firstName,
      lastName,
      roleId,
      now,
      now
    ]);
    return result.insertId;
  }

  static async findById(id) {
    const query = `
      SELECT u.*, r.name as role_name, r.permissions
      FROM ${this.TABLE_NAME} u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `;
    const result = await databaseService.executeQuery(query, [id]);
    if (result.rows.length > 0) {
      const user = result.rows.item(0);
      return {
        ...user,
        permissions: user.permissions ? JSON.parse(user.permissions) : []
      };
    }
    return null;
  }

  static async findByEmail(email) {
    const query = `
      SELECT u.*, r.name as role_name, r.permissions
      FROM ${this.TABLE_NAME} u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.email = ?
    `;
    const result = await databaseService.executeQuery(query, [email]);
    if (result.rows.length > 0) {
      const user = result.rows.item(0);
      return {
        ...user,
        permissions: user.permissions ? JSON.parse(user.permissions) : []
      };
    }
    return null;
  }

  static async update(id, user) {
    const { email, firstName, lastName, roleId, isActive } = user;
    const now = Date.now();
    const query = `
      UPDATE ${this.TABLE_NAME}
      SET email = ?, first_name = ?, last_name = ?, role_id = ?, is_active = ?, updated_at = ?
      WHERE id = ?
    `;
    await databaseService.executeQuery(query, [
      email,
      firstName,
      lastName,
      roleId,
      isActive ? 1 : 0,
      now,
      id
    ]);
  }

  static async delete(id) {
    const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = ?`;
    await databaseService.executeQuery(query, [id]);
  }

  static async list() {
    const query = `
      SELECT u.*, r.name as role_name, r.permissions
      FROM ${this.TABLE_NAME} u
      LEFT JOIN roles r ON u.role_id = r.id
    `;
    const result = await databaseService.executeQuery(query);
    const users = [];
    for (let i = 0; i < result.rows.length; i++) {
      const user = result.rows.item(i);
      users.push({
        ...user,
        permissions: user.permissions ? JSON.parse(user.permissions) : []
      });
    }
    return users;
  }

  static async hasPermission(userId, permission) {
    const user = await this.findById(userId);
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }

  static async updatePassword(id, newPassword) {
    const now = Date.now();
    const query = `
      UPDATE ${this.TABLE_NAME}
      SET password = ?, updated_at = ?
      WHERE id = ?
    `;
    await databaseService.executeQuery(query, [newPassword, now, id]);
  }
}

export default User; 