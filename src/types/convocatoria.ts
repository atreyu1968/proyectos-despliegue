export type ConvocatoriaStatus = 'draft' | 'active' | 'closed' | 'archived';

export interface DateRange {
  start: string;
  end: string;
}

export interface Convocatoria {
  id: string;
  title: string;
  description: string;
  year: number;
  status: ConvocatoriaStatus;
  maxProjectsPerCenter: number; // New field
  phases: {
    submission: DateRange;
    firstReview: DateRange;
    corrections: DateRange;
    resultsPublication: string;
  };
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  maxParticipants: number;
  minCorrections: number;
  requirements: string[];
  cutoffScore: number;
  totalBudget: number;
  rubric: Rubric;
}

export interface Rubric {
  id: string;
  sections: RubricSection[];
  totalScore: number;
}

export interface RubricSection {
  id: string;
  name: string;
  description: string;
  weight: number;
  criteria: RubricCriterion[];
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  sectionId: string;
  levels: RubricLevel[];
}

export interface RubricLevel {
  id: string;
  score: number;
  description: string;
}