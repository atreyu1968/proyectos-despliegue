import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Project } from '../../types/project';
import { useAuth } from '../../hooks/useAuth';
import ReviewModal from '../reviews/ReviewModal';
import ReviewsList from '../reviews/ReviewsList';
import ReviewDetail from '../reviews/ReviewDetail';
import { saveReview } from '../../services/reviewService';

interface ProjectDetailsProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose }) => {
  const { user } = useAuth();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviewsList, setShowReviewsList] = useState(true);
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewers, setReviewers] = useState<any[]>([]);

  const isAdmin = user?.role === 'admin';
  const isCoordinator = user?.role === 'coordinator';
  const isReviewer = user?.role === 'reviewer';
  const isAssignedReviewer = project.reviewers?.includes(user?.id || '');
  const canManageReviews = isAdmin || isCoordinator;
  const canReview = canManageReviews || (isReviewer && isAssignedReviewer);

  // Check if user has already reviewed this project
  const hasAlreadyReviewed = reviews.some(
    review => review.reviewerId === user?.id && !review.isDraft
  );

  // Only allow review if user hasn't submitted a final review yet
  const canCreateReview = canReview && (!hasAlreadyReviewed || canManageReviews);

  useEffect(() => {
    loadReviews();
  }, [project.id]);

  const loadReviews = async () => {
    try {
      const storedReviews = localStorage.getItem('project_reviews');
      const projectReviews = storedReviews ? 
        Object.values(JSON.parse(storedReviews))
          .filter((r: any) => r.projectId === project.id) : 
        [];

      const storedReviewers = localStorage.getItem('project_reviewers');
      const projectReviewers = storedReviewers ? 
        JSON.parse(storedReviewers)[project.id] || [] :
        [];

      setReviews(projectReviews);
      setReviewers(projectReviewers);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleReviewSave = async (reviewData: any, isDraft: boolean) => {
    if (!user) return;

    // Check if user already has a final review
    if (!isDraft && hasAlreadyReviewed && !canManageReviews) {
      alert('Ya has realizado una corrección final para este proyecto.');
      return;
    }

    try {
      await saveReview(
        reviewData,
        user.id,
        user.role,
        project.id,
        user.name
      );
      setShowReviewModal(false);
      loadReviews();
    } catch (error) {
      console.error('Error saving review:', error);
    }
  };

  const handleViewReview = (reviewId: string) => {
    setSelectedReview(reviewId);
    setShowReviewsList(false);
  };

  const handleEditReview = (reviewId: string) => {
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
      // Only allow editing draft reviews or if user is admin/coordinator
      if (review.isDraft || canManageReviews) {
        setSelectedReview(reviewId);
        setShowReviewModal(true);
      } else {
        alert('No se pueden editar correcciones finalizadas.');
      }
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta corrección?')) return;

    try {
      const storedReviews = localStorage.getItem('project_reviews');
      if (storedReviews) {
        const allReviews = JSON.parse(storedReviews);
        delete allReviews[reviewId];
        localStorage.setItem('project_reviews', JSON.stringify(allReviews));
        loadReviews();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] flex flex-col">
        {showReviewsList ? (
          <ReviewsList
            project={{
              id: project.id,
              title: project.title,
              category: {
                minCorrections: project.category.minCorrections || 2
              }
            }}
            reviews={reviews}
            assignedReviewers={[
              ...reviewers,
              ...(canManageReviews && user ? [{
                id: user.id,
                name: user.name,
                role: user.role,
                hasReviewed: reviews.some(r => r.reviewerId === user.id && !r.isDraft),
                score: reviews.find(r => r.reviewerId === user.id)?.score
              }] : [])
            ].filter(Boolean)}
            onClose={onClose}
            onViewReview={handleViewReview}
            onEditReview={canManageReviews ? handleEditReview : undefined}
            onDeleteReview={canManageReviews ? handleDeleteReview : undefined}
            onNewReview={canCreateReview ? () => setShowReviewModal(true) : undefined}
          />
        ) : selectedReview ? (
          <ReviewDetail
            review={reviews.find(r => r.id === selectedReview)}
            rubric={project.category.rubric}
            onClose={() => {
              setSelectedReview(null);
              setShowReviewsList(true);
            }}
          />
        ) : null}

        {showReviewModal && (
          <ReviewModal
            project={project}
            rubric={project.category.rubric}
            initialData={selectedReview ? reviews.find(r => r.id === selectedReview) : undefined}
            onClose={() => {
              setShowReviewModal(false);
              setSelectedReview(null);
            }}
            onSave={handleReviewSave}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;