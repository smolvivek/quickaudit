/**
 * Mock Backend Service
 * Provides mock API responses for development and testing
 */

import { Audit, AuditStatus, AuditItemType } from '../types/audit';
import { User, UserRole } from '../types/auth';

interface AuthResponse {
  user: User;
  token: string;
}

// Mock users data
const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@quickaudit.com',
    role: UserRole.ADMIN,
    organizationId: '1',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '2',
    name: 'Field Auditor',
    email: 'auditor@quickaudit.com',
    role: UserRole.FIELD_AUDITOR,
    organizationId: '1',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

// Mock audits data
const audits: Audit[] = [
  {
    id: '1',
    title: 'Safety Audit - Main Office',
    description: 'Quarterly safety audit for the main office location',
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    status: AuditStatus.COMPLETED,
    score: 85,
    sections: [],
    clientId: '1',
    locationId: '1',
    assignedTo: '2'
  },
  {
    id: '2',
    title: 'Quality Check - Production Line',
    description: 'Monthly quality check for the production line',
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    status: AuditStatus.IN_PROGRESS,
    sections: [],
    clientId: '2',
    locationId: '2',
    assignedTo: '2'
  }
];

// Track current user and auth token
let currentUser: User | null = null;
let authToken: string | null = null;

export const mockBackend = {
  // Authentication
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = users.find(u => u.email === email);
      if (!user || password !== 'password') {
        throw new Error('Invalid email or password');
      }
      
      currentUser = user;
      authToken = 'mock_token_' + Math.random();
      
      return { user, token: authToken };
    },
    
    register: async (name: string, email: string, password: string, organizationName: string): Promise<AuthResponse> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (users.some(u => u.email === email)) {
        throw new Error('Email already registered');
      }
      
      const newUser: User = {
        id: String(users.length + 1),
        name,
        email,
        role: UserRole.ADMIN,
        organizationId: String(Date.now()),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      users.push(newUser);
      currentUser = newUser;
      authToken = 'mock_token_' + Math.random();
      
      return { user: newUser, token: authToken };
    },
    
    logout: async (): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      currentUser = null;
      authToken = null;
    },
    
    getCurrentUser: async (): Promise<User | null> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return currentUser;
    },
    
    forgotPassword: async (email: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user = users.find(u => u.email === email);
      if (!user) {
        throw new Error('Email not found');
      }
      
      // In a real app, this would send an email
      console.log(`Password reset link sent to ${email}`);
    },
    
    resetPassword: async (token: string, newPassword: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would validate the token and update the password
      console.log(`Password reset with token ${token}`);
    }
  },
  
  // Audits
  audits: {
    getAll: async (page: number = 1, limit: number = 10): Promise<{ audits: Audit[]; total: number }> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedAudits = audits.slice(start, end);
      
      return {
        audits: paginatedAudits,
        total: audits.length
      };
    },
    
    getById: async (id: string): Promise<Audit> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const audit = audits.find(a => a.id === id);
      if (!audit) {
        throw new Error(`Audit with ID ${id} not found`);
      }
      
      return audit;
    },
    
    create: async (auditData: Omit<Audit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Audit> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAudit: Audit = {
        ...auditData,
        id: String(Date.now()),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: auditData.status || AuditStatus.DRAFT
      };
      
      audits.push(newAudit);
      return newAudit;
    },
    
    update: async (id: string, data: Partial<Audit>): Promise<Audit> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const index = audits.findIndex(a => a.id === id);
      if (index === -1) {
        throw new Error(`Audit with ID ${id} not found`);
      }
      
      audits[index] = {
        ...audits[index],
        ...data,
        updatedAt: Date.now()
      };
      
      return audits[index];
    },
    
    delete: async (id: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const index = audits.findIndex(a => a.id === id);
      if (index === -1) {
        throw new Error(`Audit with ID ${id} not found`);
      }
      
      audits.splice(index, 1);
    },
    
    updateStatus: async (id: string, status: AuditStatus): Promise<Audit> => {
      return mockBackend.audits.update(id, { status });
    }
  }
};