// Types for master data entities
export interface EducationalCenter {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfessionalFamily {
  id: string;
  code: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EducationalCycle {
  id: string;
  code: string;
  name: string;
  familyId: string;
  level: 'basic' | 'medium' | 'higher';
  duration: number; // Hours
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  cycleId: string;
  year: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  description: string;
  familyId: string; // Reference to professional family
  centerId: string; // Reference to educational center
  head?: string; // User ID of department head
  email?: string;
  phone?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MasterDataType = 'centers' | 'families' | 'cycles' | 'courses' | 'departments';

export interface ImportResult {
  success: boolean;
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}

export interface AuditLog {
  id: string;
  entityType: MasterDataType;
  entityId: string;
  action: 'create' | 'update' | 'delete';
  userId: string;
  userName: string;
  changes: Record<string, { old: any; new: any }>;
  timestamp: string;
}