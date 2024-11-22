import React, { useState } from 'react';
import { AlertCircle, FileText, Plus, X } from 'lucide-react';
import { Project } from '../../types/project';
import { DocumentAmendment } from '../../types/amendment';
import { v4 as uuidv4 } from 'uuid';

interface AmendmentRequestFormProps {
  project: Project;
  onSubmit: (amendments: DocumentAmendment[]) => void;
  onCancel: () => void;
  onContinue: () => void;
}

const AmendmentRequestForm: React.FC<AmendmentRequestFormProps> = ({
  project,
  onSubmit,
  onCancel,
  onContinue,
}) => {
  const [amendments, setAmendments] = useState<DocumentAmendment[]>([]);
  const [needsAmendments, setNeedsAmendments] = useState<boolean | null>(null);

  const addAmendment = () => {
    const newAmendment: DocumentAmendment = {
      id: uuidv4(),
      documentId: '',
      documentName: '',
      justification: '',
      status: 'pending',
      requestedAt: new Date().toISOString(),
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days by default
    };
    setAmendments([...amendments, newAmendment]);
  };

  const updateAmendment = (id: string, field: keyof DocumentAmendment, value: string) => {
    setAmendments(prev =>
      prev.map(amendment =>
        amendment.id === id ? { ...amendment, [field]: value } : amendment
      )
    );
  };

  const removeAmendment = (id: string) => {
    setAmendments(prev => prev.filter(amendment => amendment.id !== id));
  };

  const handleSubmit = () => {
    onSubmit(amendments);
  };

  if (needsAmendments === null) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-blue-500 mt-0.5" size={20} />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Revisión preliminar
              </h3>
              <p className="mt-1 text-sm text-blue-600">
                ¿Requiere el proyecto subsanaciones en la documentación?
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setNeedsAmendments(true)}
            className="btn btn-secondary"
          >
            Sí, requiere subsanaciones
          </button>
          <button
            onClick={() => {
              setNeedsAmendments(false);
              onContinue();
            }}
            className="btn btn-primary"
          >
            No, continuar con la evaluación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex">
          <AlertCircle className="text-yellow-500 mt-0.5" size={20} />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Solicitud de subsanaciones
            </h3>
            <p className="mt-1 text-sm text-yellow-600">
              Especifica los documentos que requieren subsanación y la justificación para cada uno.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {amendments.map(amendment => (
          <div
            key={amendment.id}
            className="bg-white p-4 rounded-lg border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Documento
                  </label>
                  <select
                    value={amendment.documentId}
                    onChange={(e) => updateAmendment(amendment.id, 'documentId', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar documento</option>
                    {project.documents.map(doc => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Justificación
                  </label>
                  <textarea
                    value={amendment.justification}
                    onChange={(e) => updateAmendment(amendment.id, 'justification', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Explica los cambios necesarios..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha límite
                  </label>
                  <input
                    type="date"
                    value={amendment.deadline.split('T')[0]}
                    onChange={(e) => updateAmendment(amendment.id, 'deadline', new Date(e.target.value).toISOString())}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={() => removeAmendment(amendment.id)}
                className="ml-4 text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={addAmendment}
          className="w-full flex items-center justify-center py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500"
        >
          <Plus size={20} className="mr-2" />
          Añadir subsanación
        </button>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={amendments.length === 0}
          className="btn btn-primary"
        >
          Continuar con la evaluación
        </button>
      </div>
    </div>
  );
};

export default AmendmentRequestForm;