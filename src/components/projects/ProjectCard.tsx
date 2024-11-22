import React from 'react';
import { FileText, Users, Calendar, Star, Eye, Edit, UserPlus, ClipboardList, CheckCircle, XCircle, Building2 } from 'lucide-react';
import { Project } from '../../types/project';

interface ProjectWithReviewers extends Project {
  mappedReviewers: Array<{ id: string; name: string; hasReviewed: boolean }>;
}

interface ProjectCardProps {
  project: ProjectWithReviewers;
  onClick: () => void;
  onEdit: () => void;
  onView: () => void;
  onViewReviews: () => void;
  onAssignReviewers: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
  onEdit,
  onView,
  onViewReviews,
  onAssignReviewers,
}) => {
  const getReviewStatusColor = () => {
    if (project.status === 'draft') return 'border-l-4 border-gray-300';
    
    const reviewers = project.reviewers || [];
    const minReviews = project.category?.minCorrections || 2;
    const completedReviews = project.reviews?.filter(r => !r.isDraft).length || 0;

    if (completedReviews === 0) return 'border-l-4 border-red-500';
    if (completedReviews < minReviews) return 'border-l-4 border-orange-500';
    return 'border-l-4 border-green-500';
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer ${getReviewStatusColor()}`}
      onClick={onClick}
    >
      {/* Project header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{project.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          {typeof project.score === 'number' && (
            <div className="flex items-center space-x-1 text-sm">
              <Star className="text-yellow-400" size={16} />
              <span className="font-medium">{project.score.toFixed(1)}</span>
            </div>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            project.status === 'draft' ? 'bg-gray-100 text-gray-700' :
            project.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
            project.status === 'reviewing' ? 'bg-yellow-100 text-yellow-700' :
            project.status === 'reviewed' ? 'bg-green-100 text-green-700' :
            project.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
            project.status === 'rejected' ? 'bg-red-100 text-red-700' :
            'bg-orange-100 text-orange-700'
          }`}>
            {project.status === 'draft' ? 'Borrador' :
             project.status === 'submitted' ? 'Presentado' :
             project.status === 'reviewing' ? 'En revisión' :
             project.status === 'reviewed' ? 'Corregido' :
             project.status === 'approved' ? 'Aprobado' :
             project.status === 'rejected' ? 'Rechazado' :
             'Requiere cambios'}
          </span>
        </div>
      </div>

      {/* Project details */}
      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2" />
          <span>
            {project.submissionDate ? 
              `Presentado el ${new Date(project.submissionDate).toLocaleDateString('es-ES')}` :
              'No presentado'}
          </span>
        </div>

        {/* Main center */}
        <div className="flex items-center text-sm text-gray-600">
          <Building2 size={16} className="mr-2" />
          <span>{project.center}</span>
        </div>

        {/* Collaborating centers */}
        {project.collaboratingCenters && project.collaboratingCenters.length > 0 && (
          <div className="ml-6 space-y-1">
            {project.collaboratingCenters.map((center, index) => (
              <div key={center.id} className="flex items-center text-sm text-blue-600">
                <span>• Colabora: {center.name}</span>
                {center.department && (
                  <span className="text-gray-500 ml-1">({center.department})</span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center text-sm text-gray-600">
          <Users size={16} className="mr-2" />
          <span>{project.presenters?.length || 0} presentadores</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <FileText size={16} className="mr-2" />
          <span>{project.documents?.length || 0} documentos</span>
        </div>

        {project.reviewers && project.reviewers.length > 0 && (
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle size={16} className="mr-2" />
            <span>{project.reviewers.length} correctores asignados</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span className="block">{project.center}</span>
            <span className="block">{project.department}</span>
          </div>
          <div className="flex items-center space-x-2">
            {project.status !== 'draft' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAssignReviewers();
                }}
                className="btn btn-secondary flex items-center space-x-2 text-sm"
                title="Asignar correctores"
              >
                <UserPlus size={16} />
                <span>Asignar</span>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewReviews();
              }}
              className="btn btn-secondary flex items-center space-x-2 text-sm"
              title="Ver correcciones"
            >
              <ClipboardList size={16} />
              <span>Correcciones</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="btn btn-secondary flex items-center space-x-2 text-sm"
              title="Ver proyecto"
            >
              <Eye size={16} />
              <span>Ver</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="btn btn-primary flex items-center space-x-2 text-sm"
              title="Editar proyecto"
            >
              <Edit size={16} />
              <span>Editar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;