import React from 'react';
import { Edit, Trash2, CheckCircle, XCircle, Plus, RefreshCw } from 'lucide-react';
import { MasterDataType } from '../../types/master';
import { usePermissions } from '../../hooks/usePermissions';
import { deleteEntity } from '../../services/masterDataService';

interface MasterDataTableProps {
  type: MasterDataType;
  searchTerm: string;
  filters: {
    active: boolean;
  };
  onEdit: (id: string) => void;
  onNew: () => void;
  data: any[];
  onRefresh: () => void;
}

const MasterDataTable: React.FC<MasterDataTableProps> = ({
  type,
  searchTerm,
  filters,
  onEdit,
  onNew,
  data,
  onRefresh
}) => {
  const { canEdit, canDelete } = usePermissions();

  const getColumns = (type: MasterDataType) => {
    const commonColumns = ['Código', 'Nombre', 'Estado', 'Acciones'];
    switch (type) {
      case 'centers':
        return [...commonColumns.slice(0, -1), 'Ciudad', 'Provincia', 'Email', commonColumns.slice(-1)[0]];
      case 'families':
        return [...commonColumns.slice(0, -1), 'Descripción', commonColumns.slice(-1)[0]];
      case 'cycles':
        return [...commonColumns.slice(0, -1), 'Familia', 'Nivel', 'Duración', commonColumns.slice(-1)[0]];
      case 'courses':
        return [...commonColumns.slice(0, -1), 'Ciclo', 'Año', commonColumns.slice(-1)[0]];
      case 'departments':
        return [...commonColumns.slice(0, -1), 'Centro', 'Familia', 'Jefe', commonColumns.slice(-1)[0]];
      default:
        return commonColumns;
    }
  };

  const filteredData = data.filter(item => {
    const matchesSearch = Object.values(item).some(
      value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesActive = filters.active ? item.active : true;
    return matchesSearch && matchesActive;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      return;
    }

    try {
      await deleteEntity(type, id);
      onRefresh();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error al eliminar el registro');
    }
  };

  return (
    <div>
      <div className="p-6 flex justify-between items-center">
        <button
          onClick={onRefresh}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <RefreshCw size={20} />
          <span>Actualizar</span>
        </button>

        {canEdit('master_data') && (
          <button
            onClick={onNew}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nuevo registro</span>
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {getColumns(type).map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {row.active ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircle className="w-4 h-4 mr-1" />
                      Inactivo
                    </span>
                  )}
                </td>
                {type === 'centers' && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.province}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.email}
                    </td>
                  </>
                )}
                {type === 'families' && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.description}
                  </td>
                )}
                {type === 'cycles' && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.family}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.level === 'basic' ? 'Básico' :
                       row.level === 'medium' ? 'Medio' : 'Superior'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.duration} horas
                    </td>
                  </>
                )}
                {type === 'courses' && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.cycle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.year}º
                    </td>
                  </>
                )}
                {type === 'departments' && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.center}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.family}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.head}
                    </td>
                  </>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {canEdit('master_data') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(row.id);
                        }}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg"
                        title="Editar"
                      >
                        <Edit size={20} />
                      </button>
                    )}
                    {canDelete('master_data') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(row.id);
                        }}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg"
                        title="Eliminar"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No hay datos para mostrar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterDataTable;