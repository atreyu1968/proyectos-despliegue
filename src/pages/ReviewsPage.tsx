import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Project } from '../types/project';
import { Review } from '../types/review';
import { ProjectAmendment } from '../types/amendment';
import ReviewsList from '../components/reviews/ReviewsList';
import ReviewModal from '../components/reviews/ReviewModal';
import ReviewDetail from '../components/reviews/ReviewDetail';
import AmendmentRequestForm from '../components/reviews/AmendmentRequestForm';
import AmendmentsList from '../components/reviews/AmendmentsList';
import AmendmentDetail from '../components/reviews/AmendmentDetail';
import { saveReview, saveAmendments, getProjectAmendments, uploadAmendedDocument } from '../services/reviewService';

const ReviewsPage: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviewsList, setShowReviewsList] = useState(true);
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [amendments, setAmendments] = useState<ProjectAmendment[]>([]);
  const [showAmendmentForm, setShowAmendmentForm] = useState(false);
  const [showAmendmentDetail, setShowAmendmentDetail] = useState(false);
  const [selectedAmendment, setSelectedAmendment] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadReviews(selectedProject.id);
      loadAmendments(selectedProject.id);
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    try {
      const storedProjects = localStorage.getItem('projects');
      if (storedProjects) {
        const allProjects = JSON.parse(storedProjects);
        const filteredProjects = allProjects.filter((project: Project) => {
          if (user?.role === 'admin' || user?.role === 'coordinator') {
            return true;
          }
          if (user?.role === 'reviewer') {
            return project.reviewers?.includes(user.id);
          }
          return false;
        });
        setProjects(filteredProjects);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadReviews = async (projectId: string) => {
    try {
      const storedReviews = localStorage.getItem('project_reviews');
      const projectReviews = storedReviews ? 
        Object.values(JSON.parse(storedReviews))
          .filter((r: any) => r.projectId === projectId) : 
        [];
      setReviews(projectReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const loadAmendments = async (projectId: string) => {
    try {
      const projectAmendments = await getProjectAmendments(projectId);
      setAmendments(projectAmendments);
    } catch (error) {
      console.error('Error loading amendments:', error);
    }
  };

  const handleProjectSelect = async (project: Project) => {
    setSelectedProject(project);
    setShowReviewsList(true);
    setShowAmendmentForm(false);
    setShowAmendmentDetail(false);
  };

  const handleReviewSave = async (reviewData: any, isDraft: boolean) => {
    if (!user || !selectedProject) return;

    try {
      await saveReview(
        reviewData,
        user.id,
        user.role,
        selectedProject.id,
        user.name
      );
      await loadReviews(selectedProject.id);
      setShowReviewModal(false);
      setShowAmendmentForm(false);
    } catch (error) {
      console.error('Error saving review:', error);
    }
  };

  const handleAmendmentSubmit = async (amendmentData: any) => {
    if (!user || !selectedProject) return;

    try {
      await saveAmendments(selectedProject.id, user.id, amendmentData);
      await loadAmendments(selectedProject.id);
      setShowAmendmentForm(false);
      setShowReviewModal(true);
    } catch (error) {
      console.error('Error saving amendments:', error);
    }
  };

  const handleUploadAmendedDocument = async (documentId: string, file: File) => {
    if (!selectedAmendment) return;

    try {
      await uploadAmendedDocument(selectedAmendment, documentId, file);
      await loadAmendments(selectedProject?.id || '');
    } catch (error) {
      console.error('Error uploading amended document:', error);
    }
  };

  const handleNewReview = () => {
    setShowAmendmentForm(true);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Revisiones</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Proyectos asignados</h2>
          {projects.map(project => (
            <div
              key={project.id}
              onClick={() => handleProjectSelect(project)}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedProject?.id === project.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <h3 className="font-medium text-gray-900">{project.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{project.center}</p>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay proyectos asignados para revisar
            </div>
          )}
        </div>

        {/* Reviews Panel */}
        <div className="lg:col-span-3">
          {selectedProject ? (
            <>
              {showAmendmentForm ? (
                <AmendmentRequestForm
                  project={selectedProject}
                  onSubmit={handleAmendmentSubmit}
                  onCancel={() => setShowAmendmentForm(false)}
                  onContinue={() => {
                    setShowAmendmentForm(false);
                    setShowReviewModal(true);
                  }}
                />
              ) : showAmendmentDetail && selectedAmendment ? (
                <AmendmentDetail
                  amendment={amendments.find(a => a.id === selectedAmendment)!}
                  onClose={() => {
                    setShowAmendmentDetail(false);
                    setSelectedAmendment(null);
                  }}
                  onUploadDocument={handleUploadAmendedDocument}
                />
              ) : showReviewsList ? (
                <ReviewsList
                  project={selectedProject}
                  reviews={reviews}
                  amendments={amendments}
                  onClose={() => setSelectedProject(null)}
                  onViewReview={(reviewId) => {
                    setSelectedReview(reviewId);
                    setShowReviewsList(false);
                  }}
                  onEditReview={(reviewId) => {
                    setSelectedReview(reviewId);
                    setShowReviewModal(true);
                  }}
                  onNewReview={handleNewReview}
                  onViewAmendment={(amendmentId) => {
                    setSelectedAmendment(amendmentId);
                    setShowAmendmentDetail(true);
                  }}
                />
              ) : selectedReview ? (
                <ReviewDetail
                  review={reviews.find(r => r.id === selectedReview)!}
                  rubric={selectedProject.category.rubric}
                  onClose={() => {
                    setSelectedReview(null);
                    setShowReviewsList(true);
                  }}
                />
              ) : null}

              {showReviewModal && (
                <ReviewModal
                  project={selectedProject}
                  rubric={selectedProject.category.rubric}
                  initialData={selectedReview ? reviews.find(r => r.id === selectedReview) : undefined}
                  onClose={() => {
                    setShowReviewModal(false);
                    setSelectedReview(null);
                  }}
                  onSave={handleReviewSave}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">
                Selecciona un proyecto para ver sus revisiones
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;