export type AuditStatus = 'draft' | 'in_progress' | 'completed' | 'approved' | 'rejected';

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  photos: string[];
  location?: string;
  assignedTo?: string;
  dueDate?: string;
  notes?: string;
}

export interface Audit {
  id: string;
  title: string;
  location: string;
  status: AuditStatus;
  createdAt: string;
  findings: Finding[];
  assignedTo?: string;
  dueDate?: string;
  notes?: string;
  template?: string;
  category?: string;
  tags?: string[];
}

export interface AuditFilters {
  search?: string;
  status?: AuditStatus;
  assignedTo?: string;
  category?: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
}

export interface Pagination {
  page: number;
  totalPages: number;
  total: number;
}

export interface AuditResponse {
  data: Audit[];
  pagination: Pagination;
} 