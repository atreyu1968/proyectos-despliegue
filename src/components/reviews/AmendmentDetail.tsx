import React, { useState } from 'react';
import { X, Upload, Check, AlertCircle } from 'lucide-react';
import { ProjectAmendment } from '../../types/amendment';

interface AmendmentDetailProps {
  amendment: ProjectAmendment;
  onClose: () => void;
  onUploadDocument: (documentId: string, file: File) => Promise<void>;
}

const AmendmentDetail: React.FC<AmendmentDetailProps> = ({
  amendment,
  onClose,
  onUploadDocument,
}) => {
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const handleFileUpload = async (documentId: string, file: File) => {
    setUploading(prev => ({ ...prev, [documentId]: true }));
    try {
      await onUploadDocument(documentId, file);
    } finally {
      setUploading(prev => ({ ...prev, [documentId]: false }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Subsanación #{amendment.id.slice(0, 8)}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Plazo hasta el {new Date(amendment.deadline).toLocaleDateString('es-ES')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {amendment.documents.map(doc => (
              <div
                key={doc.id}
                className="bg-white p-4 rounded-lg border border-gray-200"
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      {doc.documentName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {doc.justification}
                    </p>
                  </div>

                  {doc.status === 'completed' ? (
                    <div className="flex items-center text-green-600">
                      <Check size={20} className="mr-2" />
                      <span>Documento subsanado</span>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        id={`file-${doc.id}`}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(doc.id, file);
                          }
                        }}
                      />
                      <label
                        htmlFor={`file-${doc.id}`}
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        <Upload size={20} className="mr-2" />
                        {uploading[doc.id] ? 'Subiendo...' : 'Subir documento'}
                      </label>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {new Date(amendment.deadline) < new Date() && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <div className="flex">
                <AlertCircle className="text-red-400" size={20} />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Plazo expirado
                  </h3>
                  <p className="mt-1 text-sm text-red-600">
                    El plazo para realizar las subsanaciones ha finalizado.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full btn btn-primary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmendmentDetail;