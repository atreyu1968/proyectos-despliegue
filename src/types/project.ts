export type ProjectStatus = 'draft' | 'submitted' | 'reviewing' | 'reviewed' | 'approved' | 'rejected' | 'needs_changes';

export interface CollaboratingCenter {
  id: string;
  name: string;
  department?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: {
    id: string;
    name: string;
    description: string;
    maxParticipants: number;
    minCorrections: number;
    requirements: string[];
    cutoffScore: number;
    totalBudget: number;
    rubric: {
      id: string;
      sections: any[];
      totalScore: number;
    };
  };
  requestedAmount: number;
  center: string;
  collaboratingCenters: CollaboratingCenter[]; // Changed to array of CollaboratingCenter
  department: string;
  status: ProjectStatus;
  submissionDate?: string;
  lastModified: string;
  presenters: string[];
  reviewers?: string[];
  score?: number | null;
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadDate: string;
    status: 'pending' | 'approved' | 'rejected';
  }[];
  convocatoriaId: string;
  reviews?: any[];
}

export const statusLabels: Record<ProjectStatus, string> = {
  draft: 'Borrador',
  submitted: 'Presentado',
  reviewing: 'En revisión',
  reviewed: 'Corregido',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  needs_changes: 'Requiere cambios'
};

export const statusColors: Record<ProjectStatus, { bg: string; text: string }> = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-700' },
  submitted: { bg: 'bg-blue-100', text: 'text-blue-700' },
  reviewing: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  reviewed: { bg: 'bg-green-100', text: 'text-green-700' },
  approved: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700' },
  needs_changes: { bg: 'bg-orange-100', text: 'text-orange-700' }
};