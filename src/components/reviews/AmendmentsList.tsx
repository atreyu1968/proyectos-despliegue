import React from 'react';
import { Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { ProjectAmendment, AmendmentStatus } from '../../types/amendment';

interface AmendmentsListProps {
  amendments: ProjectAmendment[];
  onViewAmendment: (amendmentId: string) => void;
}

const statusLabels: Record<AmendmentStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En proceso',
  completed: 'Completado',
  expired: 'Caducado'
};

const statusColors: Record<AmendmentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  expired: 'bg-red-100 text-red-700'
};

const AmendmentsList: React.FC<AmendmentsListProps> = ({
  amendments,
  onViewAmendment,
}) => {
  return (
    <div className="space-y-6">
      {amendments.map(amendment => (
        <div
          key={amendment.id}
          className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onViewAmendment(amendment.id)}
        >
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Subsanación #{amendment.id.slice(0, 8)}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusColors[amendment.status]
                  }`}>
                    {statusLabels[amendment.status]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Solicitada el {new Date(amendment.createdAt).toLocaleDateString('es-ES')}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={16} className="mr-1" />
                  Plazo: {new Date(amendment.deadline).toLocaleDateString('es-ES')}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {amendment.documents.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {doc.documentName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {doc.status === 'completed' ? 'Subsanado' : 'Pendiente de subsanación'}
                      </p>
                    </div>
                  </div>
                  {doc.status === 'completed' ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <AlertCircle className="text-yellow-500" size={20} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {amendments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay subsanaciones pendientes</p>
        </div>
      )}
    </div>
  );
};

export default AmendmentsList;