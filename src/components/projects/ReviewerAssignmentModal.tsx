import React, { useState, useEffect } from 'react';
import { X, Search, AlertCircle, Loader2 } from 'lucide-react';
import { Project } from '../../types/project';
import { User } from '../../types/user';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from '../../hooks/useSettings';

interface ReviewerAssignmentModalProps {
  project: Project;
  onClose: () => void;
  onSave: (reviewerIds: string[]) => Promise<void>;
}

const ReviewerAssignmentModal: React.FC<ReviewerAssignmentModalProps> = ({
  project,
  onClose,
  onSave,
}) => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>(project.reviewers || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const minReviewers = project.category?.minCorrections || 2;

  // Mock data - Replace with API call
  const [availableReviewers, setAvailableReviewers] = useState<User[]>([
    {
      id: '1',
      name: 'Ana Martínez',
      email: 'ana@example.com',
      role: 'reviewer',
      center: 'IES Tecnológico',
      department: 'Informática',
      active: true,
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Carlos López',
      email: 'carlos@example.com',
      role: 'reviewer',
      center: 'IES Innovación',
      department: 'Electrónica',
      active: true,
      createdAt: '2024-01-01',
    },
  ]);

  useEffect(() => {
    // Add admin and coordinator to available reviewers if enabled
    if (settings?.reviews?.allowAdminReview || settings?.reviews?.allowCoordinatorReview) {
      const additionalReviewers = [];
      
      if (settings.reviews.allowAdminReview) {
        additionalReviewers.push({
          id: 'admin',
          name: 'Administrador',
          email: 'admin@example.com',
          role: 'admin',
          center: 'Sistema',
          department: 'Administración',
          active: true,
          createdAt: new Date().toISOString(),
        });
      }

      if (settings.reviews.allowCoordinatorReview) {
        additionalReviewers.push({
          id: 'coordinator',
          name: 'Coordinador',
          email: 'coordinator@example.com',
          role: 'coordinator',
          center: 'Sistema',
          department: 'Coordinación',
          active: true,
          createdAt: new Date().toISOString(),
        });
      }

      setAvailableReviewers(prev => [...prev, ...additionalReviewers]);
    }
  }, [settings]);

  const filteredReviewers = availableReviewers.filter(
    reviewer =>
      reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reviewer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleReviewer = (reviewerId: string) => {
    setSelectedReviewers(prev =>
      prev.includes(reviewerId)
        ? prev.filter(id => id !== reviewerId)
        : [...prev, reviewerId]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(selectedReviewers);
      onClose();
    } catch (error) {
      console.error('Error saving reviewers:', error);
      alert('Error al guardar los correctores');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Asignar Correctores</h2>
            <p className="mt-1 text-sm text-gray-500">
              Proyecto: {project.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar correctores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mb-4 p-4 bg-blue-50 rounded-lg flex items-start space-x-2">
            <AlertCircle className="text-blue-500 mt-0.5" size={20} />
            <div>
              <p className="text-sm text-blue-800">
                Se recomienda asignar al menos <strong>{minReviewers} correctores</strong> para este proyecto.
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Correctores seleccionados: {selectedReviewers.length}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {filteredReviewers.map((reviewer) => (
              <div
                key={reviewer.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  selectedReviewers.includes(reviewer.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{reviewer.name}</h3>
                  <p className="text-sm text-gray-500">{reviewer.email}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    {reviewer.center} • {reviewer.department}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedReviewers.includes(reviewer.id)}
                    onChange={() => toggleReviewer(reviewer.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}

            {filteredReviewers.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No se encontraron correctores
              </p>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="btn btn-secondary"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary flex items-center space-x-2"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewerAssignmentModal;