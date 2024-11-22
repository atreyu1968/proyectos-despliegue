import React from 'react';
import { X, Plus, Search, Filter, Trash2, Edit, Eye, AlertCircle } from 'lucide-react';
import { Project } from '../../types/project';
import { Review } from '../../types/review';
import { ProjectAmendment } from '../../types/amendment';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from '../../hooks/useSettings';

interface ReviewsListProps {
  project: Project;
  reviews: Review[];
  amendments: ProjectAmendment[];
  onClose: () => void;
  onViewReview: (reviewId: string) => void;
  onEditReview?: (reviewId: string) => void;
  onDeleteReview?: (reviewId: string) => void;
  onNewReview?: () => void;
  onViewAmendment?: (amendmentId: string) => void;
}

const ReviewsList: React.FC<ReviewsListProps> = ({
  project,
  reviews,
  amendments,
  onClose,
  onViewReview,
  onEditReview,
  onDeleteReview,
  onNewReview,
  onViewAmendment,
}) => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const isAdmin = user?.role === 'admin';
  const isCoordinator = user?.role === 'coordinator';
  const isReviewer = user?.role === 'reviewer';
  const canManageReviews = isAdmin || isCoordinator;

  // Check if user has already reviewed this project
  const hasAlreadyReviewed = reviews.some(
    review => review.reviewerId === user?.id && !review.isDraft
  );

  // Only allow review if user hasn't submitted a final review yet or is admin/coordinator
  const canCreateReview = (isReviewer || canManageReviews) && (!hasAlreadyReviewed || canManageReviews);

  const completedReviews = reviews.filter(r => !r.isDraft).length;
  const minReviews = project.category?.minCorrections || 2;
  const reviewProgress = (completedReviews / minReviews) * 100;

  return (
    <>
      <div className="p-6 border-b border-gray-200 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Correcciones del Proyecto</h2>
          <p className="mt-1 text-sm text-gray-500">{project.title}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X size={24} />
        </button>
      </div>

      <div className="p-6">
        {/* Project Documents Review */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Documentación del proyecto</h3>
          <div className="space-y-2">
            {project.documents?.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      Subido el {new Date(doc.uploadDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  doc.status === 'approved' ? 'bg-green-100 text-green-700' :
                  doc.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {doc.status === 'approved' ? 'Aprobado' :
                   doc.status === 'rejected' ? 'Rechazado' :
                   'Pendiente'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Estado de las correcciones</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              {completedReviews} de {minReviews} correcciones mínimas requeridas
            </span>
            <span className="text-sm font-medium text-gray-900">
              {Math.round(reviewProgress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                completedReviews >= minReviews ? 'bg-green-600' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(reviewProgress, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Amendments Section */}
        {amendments && amendments.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Subsanaciones</h3>
            <div className="space-y-2">
              {amendments.map(amendment => (
                <div
                  key={amendment.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => onViewAmendment?.(amendment.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Subsanación #{amendment.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Plazo: {new Date(amendment.deadline).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      amendment.status === 'completed' ? 'bg-green-100 text-green-700' :
                      amendment.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      amendment.status === 'expired' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {amendment.status === 'completed' ? 'Completada' :
                       amendment.status === 'in_progress' ? 'En proceso' :
                       amendment.status === 'expired' ? 'Expirada' :
                       'Pendiente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-gray-900">
                      {review.reviewerName}
                    </h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      review.isDraft ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {review.isDraft ? 'Borrador' : 'Final'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(review.updatedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {!review.isDraft && (
                    <div className="text-lg font-semibold text-blue-600">
                      {review.score.toFixed(2)}/10
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onViewReview(review.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Ver corrección"
                    >
                      <Eye size={20} />
                    </button>
                    {onEditReview && (review.isDraft || canManageReviews) && (
                      <button
                        onClick={() => onEditReview(review.id)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Editar corrección"
                      >
                        <Edit size={20} />
                      </button>
                    )}
                    {onDeleteReview && canManageReviews && (
                      <button
                        onClick={() => onDeleteReview(review.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Eliminar corrección"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay correcciones</p>
            </div>
          )}

          {canCreateReview && onNewReview && (
            <button
              onClick={onNewReview}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center space-x-2"
            >
              <Plus size={20} />
              <span>Nueva corrección</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewsList;