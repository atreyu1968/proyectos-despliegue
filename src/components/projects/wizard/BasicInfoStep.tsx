import React from 'react';
import { Project } from '../../../types/project';

interface BasicInfoStepProps {
  data: Partial<Project>;
  convocatoria: any;
  onChange: (data: Partial<Project>) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  data,
  convocatoria,
  onChange,
}) => {
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const requestedAmount = Number(e.target.value);
    const maxBudget = data.category?.totalBudget || 0;

    if (requestedAmount > maxBudget) {
      alert(`El importe solicitado no puede superar el máximo de la categoría (${maxBudget}€)`);
      return;
    }

    onChange({ requestedAmount });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Título del proyecto *
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descripción *
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Categoría *
        </label>
        <select
          value={data.category?.id}
          onChange={(e) => {
            const category = convocatoria.categories.find(
              (c: any) => c.id === e.target.value
            );
            onChange({ 
              category,
              requestedAmount: 0 // Reset requested amount when category changes
            });
          }}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Selecciona una categoría</option>
          {convocatoria.categories.map((category: any) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {data.category && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">{data.category.description}</p>
            <div className="mt-2 bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                Requisitos de la categoría:
              </h4>
              <ul className="list-disc list-inside text-sm text-blue-700">
                {data.category.requirements.map((req: string) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm font-medium text-blue-800">
                Presupuesto máximo: {data.category.totalBudget}€
              </p>
            </div>
          </div>
        )}
      </div>

      {data.category && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Importe solicitado *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              value={data.requestedAmount || ''}
              onChange={handleBudgetChange}
              min="0"
              max={data.category.totalBudget}
              step="100"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">€</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            El importe solicitado no puede superar los {data.category.totalBudget}€
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Centro educativo *
          </label>
          <input
            type="text"
            value={data.center}
            onChange={(e) => onChange({ center: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Departamento *
          </label>
          <input
            type="text"
            value={data.department}
            onChange={(e) => onChange({ department: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        * Campos obligatorios
      </p>
    </div>
  );
};

export default BasicInfoStep;