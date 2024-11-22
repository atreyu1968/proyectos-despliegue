export interface Review {
  id: string;
  projectId: string;
  reviewerId: string;
  score?: number;
  generalObservations?: string;
  proposedAmount?: number;
  amountJustification?: string;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewScore {
  id: string;
  reviewId: string;
  criterionId: string;
  score: number;
  comment?: string;
}

export interface ReviewData {
  projectId: string;
  scores: Record<string, number>;
  comments: Record<string, string>;
  generalObservations: string;
  proposedAmount: number;
  amountJustification: string;
  isDraft: boolean;
}