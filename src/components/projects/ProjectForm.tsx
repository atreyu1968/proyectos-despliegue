import React, { useState, useRef } from 'react';
import { Plus, X, Upload, FileText } from 'lucide-react';
import { Project, ProjectStatus, statusLabels, CollaboratingCenter } from '../../types/project';
import { v4 as uuidv4 } from 'uuid';

interface ProjectFormProps {
  project?: Project;
  categories: string[];
  onSubmit: (data: Partial<Project>) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  categories,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    category: '',
    center: '',
    collaboratingCenters: [], // Initialize as empty array
    department: '',
    status: 'draft',
    presenters: [],
    documents: [],
    ...project,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addCollaboratingCenter = () => {
    const newCenter: CollaboratingCenter = {
      id: uuidv4(),
      name: '',
      department: ''
    };
    setFormData(prev => ({
      ...prev,
      collaboratingCenters: [...(prev.collaboratingCenters || []), newCenter]
    }));
  };

  const updateCollaboratingCenter = (id: string, field: keyof CollaboratingCenter, value: string) => {
    setFormData(prev => ({
      ...prev,
      collaboratingCenters: prev.collaboratingCenters?.map(center =>
        center.id === id ? { ...center, [field]: value } : center
      )
    }));
  };

  const removeCollaboratingCenter = (id: string) => {
    setFormData(prev => ({
      ...prev,
      collaboratingCenters: prev.collaboratingCenters?.filter(center => center.id !== id)
    }));
  };

  // Rest of the file handling code remains the same...

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Previous form fields remain the same... */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Centro Educativo</label>
          <input
            type="text"
            name="center"
            value={formData.center}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Departamento</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {/* Collaborating Centers Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Centros Colaboradores
          </label>
          <button
            type="button"
            onClick={addCollaboratingCenter}
            className="btn btn-secondary flex items-center space-x-2 text-sm"
          >
            <Plus size={16} />
            <span>Añadir centro colaborador</span>
          </button>
        </div>

        <div className="space-y-4">
          {formData.collaboratingCenters?.map((center) => (
            <div
              key={center.id}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre del centro
                  </label>
                  <input
                    type="text"
                    value={center.name}
                    onChange={(e) => updateCollaboratingCenter(center.id, 'name', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Nombre del centro colaborador"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Departamento (Opcional)
                  </label>
                  <input
                    type="text"
                    value={center.department || ''}
                    onChange={(e) => updateCollaboratingCenter(center.id, 'department', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Departamento colaborador"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeCollaboratingCenter(center.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Rest of the form remains the same... */}
    </form>
  );
};

export default ProjectForm;