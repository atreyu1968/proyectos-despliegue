import { v4 as uuidv4 } from 'uuid';
import { ReviewData } from '../types/review';
import { DocumentAmendment, ProjectAmendment } from '../types/amendment';

const REVIEWS_STORAGE_KEY = 'project_reviews';
const REVIEWERS_STORAGE_KEY = 'project_reviewers';
const AMENDMENTS_STORAGE_KEY = 'project_amendments';

function getStoredData(key: string) {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : {};
}

function saveStoredData(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

function updateProjectStatus(projectId: string, status: string) {
  try {
    const projectsData = localStorage.getItem('projects');
    if (!projectsData) return;

    const projects = JSON.parse(projectsData);
    const updatedProjects = projects.map((p: any) => 
      p.id === projectId ? { ...p, status } : p
    );

    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  } catch (error) {
    console.error('Error updating project status:', error);
  }
}

export async function saveAmendments(
  projectId: string,
  reviewerId: string,
  amendments: DocumentAmendment[]
): Promise<ProjectAmendment> {
  const storedAmendments = getStoredData(AMENDMENTS_STORAGE_KEY);
  
  const projectAmendment: ProjectAmendment = {
    id: uuidv4(),
    projectId,
    reviewerId,
    documents: amendments,
    status: 'pending',
    createdAt: new Date().toISOString(),
    deadline: amendments[0]?.deadline || new Date().toISOString(),
  };

  if (!storedAmendments[projectId]) {
    storedAmendments[projectId] = [];
  }
  
  storedAmendments[projectId].push(projectAmendment);
  saveStoredData(AMENDMENTS_STORAGE_KEY, storedAmendments);
  
  // Update project status
  updateProjectStatus(projectId, 'needs_changes');

  return projectAmendment;
}

export async function getProjectAmendments(projectId: string): Promise<ProjectAmendment[]> {
  const storedAmendments = getStoredData(AMENDMENTS_STORAGE_KEY);
  return storedAmendments[projectId] || [];
}

export async function uploadAmendedDocument(
  amendmentId: string,
  documentId: string,
  file: File
): Promise<void> {
  const storedAmendments = getStoredData(AMENDMENTS_STORAGE_KEY);
  
  // Find and update the amendment
  Object.keys(storedAmendments).forEach(projectId => {
    storedAmendments[projectId] = storedAmendments[projectId].map((amendment: ProjectAmendment) => {
      if (amendment.id === amendmentId) {
        const updatedDocuments = amendment.documents.map(doc => 
          doc.id === documentId ? { ...doc, status: 'completed' } : doc
        );
        
        // Check if all documents are completed
        const allCompleted = updatedDocuments.every(doc => doc.status === 'completed');
        
        return {
          ...amendment,
          documents: updatedDocuments,
          status: allCompleted ? 'completed' : 'in_progress',
          completedAt: allCompleted ? new Date().toISOString() : undefined
        };
      }
      return amendment;
    });
  });

  saveStoredData(AMENDMENTS_STORAGE_KEY, storedAmendments);
}

export async function saveReview(
  reviewData: ReviewData, 
  reviewerId: string, 
  userRole: string, 
  projectId: string,
  reviewerName: string
) {
  try {
    const reviews = getStoredData(REVIEWS_STORAGE_KEY);
    const reviewId = reviewData.id || uuidv4();

    // Calculate review score based on criteria scores
    const scores = Object.values(reviewData.scores);
    const totalScore = scores.reduce((a, b) => a + b, 0);
    const normalizedScore = Number((totalScore / scores.length).toFixed(2));

    // Create or update review
    const review = {
      id: reviewId,
      projectId,
      reviewerId,
      reviewerName,
      scores: reviewData.scores,
      comments: reviewData.comments,
      generalObservations: reviewData.generalObservations,
      proposedAmount: reviewData.proposedAmount,
      amountJustification: reviewData.amountJustification,
      isDraft: reviewData.isDraft,
      score: normalizedScore,
      createdAt: reviews[reviewId]?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    reviews[reviewId] = review;
    saveStoredData(REVIEWS_STORAGE_KEY, reviews);

    // Auto-assign reviewer if admin or coordinator
    if ((userRole === 'admin' || userRole === 'coordinator') && !reviewData.isDraft) {
      const reviewers = getStoredData(REVIEWERS_STORAGE_KEY);
      if (!reviewers[projectId]) {
        reviewers[projectId] = [];
      }
      if (!reviewers[projectId].some((r: any) => r.id === reviewerId)) {
        reviewers[projectId].push({
          id: reviewerId,
          name: reviewerName,
          role: userRole,
          hasReviewed: true,
          score: normalizedScore
        });
        saveStoredData(REVIEWERS_STORAGE_KEY, reviewers);
      } else {
        // Update existing reviewer's status and score
        reviewers[projectId] = reviewers[projectId].map((r: any) => 
          r.id === reviewerId ? { ...r, hasReviewed: true, score: normalizedScore } : r
        );
        saveStoredData(REVIEWERS_STORAGE_KEY, reviewers);
      }
    }

    // Update project status if not a draft
    if (!reviewData.isDraft) {
      updateProjectStatus(projectId, 'reviewed');
    }

    return { reviewId };
  } catch (error) {
    console.error('Error saving review:', error);
    throw error;
  }
}

export async function getReview(projectId: string, reviewerId: string) {
  const reviews = getStoredData(REVIEWS_STORAGE_KEY);
  return Object.values(reviews).find((r: any) => 
    r.projectId === projectId && r.reviewerId === reviewerId
  ) || null;
}

export async function listProjectReviews(projectId: string) {
  const reviews = getStoredData(REVIEWS_STORAGE_KEY);
  return Object.values(reviews).filter((r: any) => r.projectId === projectId);
}

export async function deleteReview(reviewId: string) {
  const reviews = getStoredData(REVIEWS_STORAGE_KEY);
  const review = reviews[reviewId];
  
  if (review) {
    delete reviews[reviewId];
    saveStoredData(REVIEWS_STORAGE_KEY, reviews);
    updateProjectStatus(review.projectId, 'submitted');
  }
}