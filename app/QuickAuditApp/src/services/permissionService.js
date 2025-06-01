import User from '../models/User';
import Role from '../models/Role';

class PermissionService {
  static PERMISSIONS = {
    // User Management
    USER_CREATE: 'user:create',
    USER_READ: 'user:read',
    USER_UPDATE: 'user:update',
    USER_DELETE: 'user:delete',

    // Role Management
    ROLE_CREATE: 'role:create',
    ROLE_READ: 'role:read',
    ROLE_UPDATE: 'role:update',
    ROLE_DELETE: 'role:delete',

    // Audit Management
    AUDIT_CREATE: 'audit:create',
    AUDIT_READ: 'audit:read',
    AUDIT_UPDATE: 'audit:update',
    AUDIT_DELETE: 'audit:delete',
    AUDIT_APPROVE: 'audit:approve',

    // Report Management
    REPORT_CREATE: 'report:create',
    REPORT_READ: 'report:read',
    REPORT_UPDATE: 'report:update',
    REPORT_DELETE: 'report:delete',
    REPORT_EXPORT: 'report:export',

    // Settings Management
    SETTINGS_READ: 'settings:read',
    SETTINGS_UPDATE: 'settings:update',
  };

  static DEFAULT_ROLES = {
    ADMIN: {
      name: 'admin',
      description: 'Administrator with full access',
      permissions: Object.values(this.PERMISSIONS),
    },
    MANAGER: {
      name: 'manager',
      description: 'Manager with audit and report access',
      permissions: [
        this.PERMISSIONS.AUDIT_CREATE,
        this.PERMISSIONS.AUDIT_READ,
        this.PERMISSIONS.AUDIT_UPDATE,
        this.PERMISSIONS.AUDIT_APPROVE,
        this.PERMISSIONS.REPORT_CREATE,
        this.PERMISSIONS.REPORT_READ,
        this.PERMISSIONS.REPORT_UPDATE,
        this.PERMISSIONS.REPORT_EXPORT,
      ],
    },
    AUDITOR: {
      name: 'auditor',
      description: 'Auditor with basic audit access',
      permissions: [
        this.PERMISSIONS.AUDIT_CREATE,
        this.PERMISSIONS.AUDIT_READ,
        this.PERMISSIONS.AUDIT_UPDATE,
        this.PERMISSIONS.REPORT_READ,
      ],
    },
  };

  static async initialize() {
    // Create default roles if they don't exist
    for (const role of Object.values(this.DEFAULT_ROLES)) {
      const existingRole = await Role.findByName(role.name);
      if (!existingRole) {
        await Role.create(role);
      }
    }
  }

  static async checkPermission(userId, permission) {
    return await User.hasPermission(userId, permission);
  }

  static async checkPermissions(userId, permissions) {
    const user = await User.findById(userId);
    if (!user || !user.permissions) {
      return false;
    }
    return permissions.every(permission =>
      user.permissions.includes(permission),
    );
  }

  static async getUserPermissions(userId) {
    const user = await User.findById(userId);
    return user ? user.permissions : [];
  }

  static async assignRole(userId, roleId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const role = await Role.findById(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    await User.update(userId, {roleId});
  }

  static async createCustomRole(role) {
    return await Role.create(role);
  }

  static async updateRolePermissions(roleId, permissions) {
    const role = await Role.findById(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    await Role.update(roleId, {...role, permissions});
  }
}

export default PermissionService;
