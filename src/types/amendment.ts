export type AmendmentStatus = 'pending' | 'in_progress' | 'completed' | 'expired';

export interface DocumentAmendment {
  id: string;
  documentId: string;
  documentName: string;
  justification: string;
  status: AmendmentStatus;
  requestedAt: string;
  deadline: string;
  completedAt?: string;
}

export interface ProjectAmendment {
  id: string;
  projectId: string;
  reviewerId: string;
  documents: DocumentAmendment[];
  status: AmendmentStatus;
  createdAt: string;
  deadline: string;
  completedAt?: string;
  verificationCode?: string;
}