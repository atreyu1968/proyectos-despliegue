export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  center?: string;
  department?: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  recoveryCode?: string;
  lastLogin?: string;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  recoveryCode: string;
}

export type UserRole = 'admin' | 'coordinator' | 'presenter' | 'reviewer' | 'guest';

export const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  coordinator: 'Coordinador',
  presenter: 'Presentador',
  reviewer: 'Revisor',
  guest: 'Invitado'
};

export interface Permission {
  action: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'review' | 'export' | 'assign' | 'request_amendments' | 'upload_amendments' | 'manage_codes' | 'manage_settings' | 'manage_master_data';
  resource: 'projects' | 'users' | 'convocatorias' | 'reviews' | 'settings' | 'system' | 'reports' | 'amendments' | 'verification_codes' | 'master_data';
}

export const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    // Projects
    { action: 'view', resource: 'projects' },
    { action: 'create', resource: 'projects' },
    { action: 'edit', resource: 'projects' },
    { action: 'delete', resource: 'projects' },
    { action: 'approve', resource: 'projects' },
    { action: 'assign', resource: 'projects' },
    // Users
    { action: 'view', resource: 'users' },
    { action: 'create', resource: 'users' },
    { action: 'edit', resource: 'users' },
    { action: 'delete', resource: 'users' },
    // Convocatorias
    { action: 'view', resource: 'convocatorias' },
    { action: 'create', resource: 'convocatorias' },
    { action: 'edit', resource: 'convocatorias' },
    { action: 'delete', resource: 'convocatorias' },
    // Reviews
    { action: 'view', resource: 'reviews' },
    { action: 'create', resource: 'reviews' },
    { action: 'edit', resource: 'reviews' },
    { action: 'delete', resource: 'reviews' },
    { action: 'review', resource: 'reviews' },
    { action: 'request_amendments', resource: 'reviews' },
    // Settings
    { action: 'view', resource: 'settings' },
    { action: 'edit', resource: 'settings' },
    { action: 'manage_settings', resource: 'settings' },
    // System
    { action: 'view', resource: 'system' },
    { action: 'manage_codes', resource: 'system' },
    { action: 'manage_master_data', resource: 'system' },
    // Reports
    { action: 'view', resource: 'reports' },
    { action: 'export', resource: 'reports' }
  ],
  coordinator: [
    // Projects
    { action: 'view', resource: 'projects' },
    { action: 'create', resource: 'projects' },
    { action: 'edit', resource: 'projects' },
    { action: 'approve', resource: 'projects' },
    { action: 'assign', resource: 'projects' },
    // Users
    { action: 'view', resource: 'users' },
    { action: 'create', resource: 'users' },
    { action: 'edit', resource: 'users' },
    // Reviews
    { action: 'view', resource: 'reviews' },
    { action: 'create', resource: 'reviews' },
    { action: 'edit', resource: 'reviews' },
    { action: 'review', resource: 'reviews' },
    { action: 'request_amendments', resource: 'reviews' },
    // Settings
    { action: 'view', resource: 'settings' },
    { action: 'edit', resource: 'settings' },
    // Reports
    { action: 'view', resource: 'reports' },
    { action: 'export', resource: 'reports' }
  ],
  presenter: [
    // Projects
    { action: 'view', resource: 'projects' },
    { action: 'create', resource: 'projects' },
    { action: 'edit', resource: 'projects' },
    // Reviews
    { action: 'view', resource: 'reviews' },
    // Amendments
    { action: 'view', resource: 'amendments' },
    { action: 'upload_amendments', resource: 'amendments' },
    // Settings
    { action: 'view', resource: 'settings' },
    { action: 'edit', resource: 'settings' }
  ],
  reviewer: [
    // Projects
    { action: 'view', resource: 'projects' },
    // Reviews
    { action: 'view', resource: 'reviews' },
    { action: 'create', resource: 'reviews' },
    { action: 'edit', resource: 'reviews' },
    { action: 'review', resource: 'reviews' },
    { action: 'request_amendments', resource: 'reviews' },
    // Amendments
    { action: 'view', resource: 'amendments' },
    { action: 'create', resource: 'amendments' },
    // Settings
    { action: 'view', resource: 'settings' },
    { action: 'edit', resource: 'settings' }
  ],
  guest: [
    // Projects
    { action: 'view', resource: 'projects' },
    // Settings
    { action: 'view', resource: 'settings' }
  ]
};