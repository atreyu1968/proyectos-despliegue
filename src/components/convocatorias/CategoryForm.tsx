import React, { useState } from 'react';
import { Plus, Trash2, Settings } from 'lucide-react';
import { Category } from '../../types/convocatoria';
import RubricForm from './RubricForm';

interface CategoryFormProps {
  category: Partial<Category>;
  onUpdate: (category: Partial<Category>) => void;
  onRemove: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onUpdate,
  onRemove,
}) => {
  const [showRubricForm, setShowRubricForm] = useState(false);

  // Ensure all form values have defaults
  const formData = {
    name: category.name || '',
    description: category.description || '',
    maxParticipants: category.maxParticipants || 4,
    minCorrections: category.minCorrections || 2,
    cutoffScore: category.cutoffScore || 5,
    totalBudget: category.totalBudget || 0,
    requirements: category.requirements || [],
    rubric: category.rubric || {
      id: '',
      sections: [],
      totalScore: 0
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onUpdate({ 
      ...category, 
      [name]: name === 'cutoffScore' || name === 'totalBudget' || name === 'maxParticipants' || name === 'minCorrections' ? 
        Number(value) : value 
    });
  };

  const handleRequirementAdd = () => {
    onUpdate({
      ...category,
      requirements: [...formData.requirements, '']
    });
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    onUpdate({
      ...category,
      requirements: newRequirements
    });
  };

  const handleRequirementRemove = (index: number) => {
    const newRequirements = [...formData.requirements];
    newRequirements.splice(index, 1);
    onUpdate({
      ...category,
      requirements: newRequirements
    });
  };

  const handleRubricUpdate = (sections: any[]) => {
    onUpdate({
      ...category,
      rubric: {
        id: formData.rubric.id || Date.now().toString(),
        sections,
        totalScore: sections.reduce((total, section) => 
          total + section.criteria.reduce((sum: number, criterion: any) => 
            sum + criterion.maxScore, 0), 0)
      }
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la categoría
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={2}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Máximo de participantes
            </label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleInputChange}
              min="1"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mínimo de correcciones
            </label>
            <input
              type="number"
              name="minCorrections"
              value={formData.minCorrections}
              onChange={handleInputChange}
              min="1"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nota de corte
            </label>
            <input
              type="number"
              name="cutoffScore"
              value={formData.cutoffScore}
              onChange={handleInputChange}
              min="0"
              max="10"
              step="0.1"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Presupuesto total (€)
            </label>
            <input
              type="number"
              name="totalBudget"
              value={formData.totalBudget}
              onChange={handleInputChange}
              min="0"
              step="100"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="ml-4 text-gray-400 hover:text-red-500"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Requisitos
        </label>
        <div className="space-y-2">
          {formData.requirements.map((req, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={req}
                onChange={(e) => handleRequirementChange(index, e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Requisito"
              />
              <button
                type="button"
                onClick={() => handleRequirementRemove(index)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleRequirementAdd}
            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Plus size={20} className="inline-block mr-2" />
            Añadir requisito
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Rúbrica de evaluación
          </label>
          <button
            type="button"
            onClick={() => setShowRubricForm(!showRubricForm)}
            className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <Settings size={20} />
            <span>{showRubricForm ? 'Ocultar rúbrica' : 'Configurar rúbrica'}</span>
          </button>
        </div>

        {showRubricForm && (
          <RubricForm
            sections={formData.rubric.sections}
            onUpdate={handleRubricUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryForm;