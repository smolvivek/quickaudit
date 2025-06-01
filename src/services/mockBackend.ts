import { User, AuthResponse } from '../types/auth';
import { Audit, Finding, AuditStatus, AuditFilters, AuditResponse } from '../types/audit';

// Mock data
const users: User[] = [
  {
    id: '1',
    email: 'admin@quickaudit.com',
    name: 'Admin User',
    role: 'admin',
    company: 'QuickAudit Inc.',
  },
  {
    id: '2',
    email: 'supervisor@quickaudit.com',
    name: 'Supervisor User',
    role: 'supervisor',
    company: 'QuickAudit Inc.',
  },
  {
    id: '3',
    email: 'auditor@quickaudit.com',
    name: 'Auditor User',
    role: 'auditor',
    company: 'QuickAudit Inc.',
  },
];

const audits: Audit[] = [
  {
    id: '1',
    title: 'Safety Inspection - Building A',
    location: '123 Main St, City',
    status: 'in_progress',
    createdAt: '2024-03-15T10:00:00Z',
    findings: [],
  },
  {
    id: '2',
    title: 'Quality Check - Production Line',
    location: '456 Industrial Ave, City',
    status: 'completed',
    createdAt: '2024-03-14T15:30:00Z',
    findings: [],
  },
];

// Mock authentication
let currentUser: User | null = null;
let authToken: string | null = null;

export const mockBackend = {
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = users.find(u => u.email === email);
      if (!user || password !== 'password123') {
        throw new Error('Invalid email or password');
      }

      currentUser = user;
      authToken = 'mock_token_' + Math.random();
      return { user, token: authToken };
    },

    register: async (name: string, email: string, password: string, company?: string): Promise<AuthResponse> => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (users.some(u => u.email === email)) {
        throw new Error('Email already registered');
      }

      const newUser: User = {
        id: String(users.length + 1),
        name,
        email,
        role: 'auditor',
        company,
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

    getCurrentUser: async (): Promise<User> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!currentUser) {
        throw new Error('Not authenticated');
      }
      return currentUser;
    },

    forgotPassword: async (email: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!users.some(u => u.email === email)) {
        throw new Error('Email not found');
      }
      // In a real app, we would send a password reset email
    },

    resetPassword: async (token: string, password: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!token.startsWith('mock_token_')) {
        throw new Error('Invalid token');
      }
      // In a real app, we would update the user's password
    },
  },

  audits: {
    getAll: async (page: number, filters: AuditFilters): Promise<AuditResponse> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      let filteredAudits = [...audits];

      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredAudits = filteredAudits.filter(
          audit => audit.title.toLowerCase().includes(search) ||
                  audit.location.toLowerCase().includes(search)
        );
      }

      if (filters.status) {
        filteredAudits = filteredAudits.filter(
          audit => audit.status === filters.status
        );
      }

      const pageSize = 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedAudits = filteredAudits.slice(start, end);

      return {
        data: paginatedAudits,
        pagination: {
          page,
          totalPages: Math.ceil(filteredAudits.length / pageSize),
          total: filteredAudits.length,
        },
      };
    },

    getById: async (id: string): Promise<Audit> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const audit = audits.find(a => a.id === id);
      if (!audit) {
        throw new Error('Audit not found');
      }
      return audit;
    },

    create: async (data: Omit<Audit, 'id' | 'createdAt'>): Promise<Audit> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newAudit: Audit = {
        id: String(audits.length + 1),
        ...data,
        createdAt: new Date().toISOString(),
        findings: [],
      };
      audits.push(newAudit);
      return newAudit;
    },

    update: async (id: string, data: Partial<Omit<Audit, 'id' | 'createdAt'>>): Promise<Audit> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const index = audits.findIndex(a => a.id === id);
      if (index === -1) {
        throw new Error('Audit not found');
      }
      audits[index] = { ...audits[index], ...data };
      return audits[index];
    },

    delete: async (id: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = audits.findIndex(a => a.id === id);
      if (index === -1) {
        throw new Error('Audit not found');
      }
      audits.splice(index, 1);
    },

    updateStatus: async (id: string, status: AuditStatus): Promise<Audit> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const audit = await mockBackend.audits.getById(id);
      audit.status = status;
      return audit;
    },

    addFinding: async (auditId: string, data: Omit<Finding, 'id' | 'createdAt' | 'photos'>): Promise<Finding> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const audit = await mockBackend.audits.getById(auditId);
      const finding: Finding = {
        id: String(audit.findings.length + 1),
        ...data,
        createdAt: new Date().toISOString(),
        photos: [],
      };
      audit.findings.push(finding);
      return finding;
    },

    updateFinding: async (auditId: string, findingId: string, data: Partial<Omit<Finding, 'id' | 'createdAt' | 'photos'>>): Promise<Finding> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const audit = await mockBackend.audits.getById(auditId);
      const finding = audit.findings.find(f => f.id === findingId);
      if (!finding) {
        throw new Error('Finding not found');
      }
      Object.assign(finding, data);
      return finding;
    },

    deleteFinding: async (auditId: string, findingId: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const audit = await mockBackend.audits.getById(auditId);
      const index = audit.findings.findIndex(f => f.id === findingId);
      if (index === -1) {
        throw new Error('Finding not found');
      }
      audit.findings.splice(index, 1);
    },

    uploadPhoto: async (auditId: string, findingId: string, photo: any): Promise<{ url: string }> => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const audit = await mockBackend.audits.getById(auditId);
      const finding = audit.findings.find(f => f.id === findingId);
      if (!finding) {
        throw new Error('Finding not found');
      }
      const photoUrl = 'https://example.com/mock-photo.jpg';
      finding.photos.push(photoUrl);
      return { url: photoUrl };
    },
  },
}; 