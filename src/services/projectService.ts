import { Project, ProjectStatus } from '../types/project';

const PROJECTS_STORAGE_KEY = 'projects';
const REVIEWERS_STORAGE_KEY = 'project_reviewers';

function getStoredData(key: string) {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : {};
}

function saveStoredData(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

export async function assignReviewers(projectId: string, reviewers: Array<{ id: string; name: string; role: string }>) {
  try {
    // Get current project data
    const projectsData = localStorage.getItem(PROJECTS_STORAGE_KEY);
    const projects = projectsData ? JSON.parse(projectsData) : [];
    
    // Update project reviewers
    const updatedProjects = projects.map((p: Project) => {
      if (p.id === projectId) {
        // Update project status to 'reviewing' if not in draft
        const newStatus = p.status === 'draft' ? 'draft' : 'reviewing';
        return {
          ...p,
          reviewers: reviewers.map(r => r.id),
          status: newStatus
        };
      }
      return p;
    });

    // Save updated projects
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));

    // Update reviewers data
    const reviewersData = getStoredData(REVIEWERS_STORAGE_KEY);
    reviewersData[projectId] = reviewers.map(r => ({
      ...r,
      hasReviewed: false,
      score: null
    }));
    saveStoredData(REVIEWERS_STORAGE_KEY, reviewersData);

    return true;
  } catch (error) {
    console.error('Error assigning reviewers:', error);
    throw error;
  }
}

export async function getProjectReviewers(projectId: string) {
  const reviewersData = getStoredData(REVIEWERS_STORAGE_KEY);
  return reviewersData[projectId] || [];
}

export async function updateReviewerStatus(projectId: string, reviewerId: string, hasReviewed: boolean, score?: number) {
  const reviewersData = getStoredData(REVIEWERS_STORAGE_KEY);
  
  if (reviewersData[projectId]) {
    reviewersData[projectId] = reviewersData[projectId].map((r: any) => 
      r.id === reviewerId ? { ...r, hasReviewed, score } : r
    );
    saveStoredData(REVIEWERS_STORAGE_KEY, reviewersData);
  }
}

// ... (resto del archivo permanece igual)