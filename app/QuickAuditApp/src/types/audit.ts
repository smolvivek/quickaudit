/**
 * Audit Types
 * Type definitions for audit-related data
 */

export interface Audit {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  status: AuditStatus;
  score?: number;
  sections: AuditSection[];
  assignedTo?: string;
  clientId: string;
  locationId?: string;
  photos?: string[];
  notes?: string;
}

export interface AuditSection {
  id: string;
  title: string;
  description: string;
  weight: number;
  items: AuditItem[];
  score?: number;
  order: number;
}

export interface AuditItem {
  id: string;
  title: string;
  description: string;
  type: AuditItemType;
  required: boolean;
  options?: string[];
  value?: any;
  score?: number;
  weight: number;
  order: number;
  photos?: string[];
  notes?: string;
}

export enum AuditStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REVIEWED = 'reviewed',
  ARCHIVED = 'archived'
}

export enum AuditItemType {
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  TEXT = 'text',
  NUMBER = 'number',
  PHOTO = 'photo',
  SIGNATURE = 'signature'
}