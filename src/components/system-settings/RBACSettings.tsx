import React, { useState } from 'react';
import { Shield, Loader2, RotateCcw } from 'lucide-react';
import { UserRole, rolePermissions, Permission } from '../../types/auth';
import { useSettings } from '../../hooks/useSettings';

interface RBACSettingsProps {
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}

const RBACSettingsProps: React.FC<RBACSettingsProps> = ({ onSave, isSaving }) => {
  const { settings, updateSettings } = useSettings();
  const [permissions, setPermissions] = useState(settings?.rbac?.permissions || rolePermissions);

  const resources: Permission['resource'][] = [
    'projects',
    'users',
    'convocatorias',
    'reviews',
    'amendments',
    'settings',
    'system',
    'reports',
    'verification_codes',
    'master_data'
  ];

  const actions: Permission['action'][] = [
    'view',
    'create',
    'edit',
    'delete',
    'approve',
    'review',
    'export',
    'assign',
    'request_amendments',
    'upload_amendments',
    'manage_codes',
    'manage_settings',
    'manage_master_data'
  ];

  const roleLabels: Record<UserRole, string> = {
    admin: 'Administrador',
    coordinator: 'Coordinador',
    presenter: 'Presentador',
    reviewer: 'Revisor',
    guest: 'Invitado'
  };

  const actionLabels: Record<Permission['action'], string> = {
    view: 'Ver',
    create: 'Crear',
    edit: 'Editar',
    delete: 'Eliminar',
    approve: 'Aprobar',
    review: 'Revisar',
    export: 'Exportar',
    assign: 'Asignar',
    request_amendments: 'Solicitar subsanaciones',
    upload_amendments: 'Subir subsanaciones',
    manage_codes: 'Gestionar códigos',
    manage_settings: 'Gestionar configuración',
    manage_master_data: 'Gestionar datos maestros'
  };

  const resourceLabels: Record<Permission['resource'], string> = {
    projects: 'Proyectos',
    users: 'Usuarios',
    convocatorias: 'Convocatorias',
    reviews: 'Revisiones',
    amendments: 'Subsanaciones',
    settings: 'Configuración',
    system: 'Sistema',
    reports: 'Informes',
    verification_codes: 'Códigos de verificación',
    master_data: 'Datos maestros'
  };

  const hasPermission = (
    role: UserRole,
    action: Permission['action'],
    resource: Permission['resource']
  ): boolean => {
    return permissions[role].some(
      p => p.action === action && p.resource === resource
    );
  };

  const togglePermission = (
    role: UserRole,
    action: Permission['action'],
    resource: Permission['resource']
  ) => {
    if (role === 'admin') return; // Admin always has all permissions

    setPermissions(prev => {
      const rolePerms = [...prev[role]];
      const exists = rolePerms.some(
        p => p.action === action && p.resource === resource
      );

      if (exists) {
        return {
          ...prev,
          [role]: rolePerms.filter(
            p => !(p.action === action && p.resource === resource)
          )
        };
      } else {
        return {
          ...prev,
          [role]: [...rolePerms, { action, resource }]
        };
      }
    });
  };

  const handleSave = async () => {
    const newSettings = {
      ...settings,
      rbac: {
        permissions
      }
    };

    await updateSettings(newSettings);
    if (onSave) {
      await onSave(newSettings);
    }
  };

  const handleRestoreDefaults = () => {
    if (confirm('¿Estás seguro de que deseas restaurar los permisos por defecto?')) {
      setPermissions(rolePermissions);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Shield className="text-gray-400" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Control de Acceso</h3>
          </div>
          <button
            onClick={handleRestoreDefaults}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <RotateCcw size={20} />
            <span>Restaurar permisos</span>
          </button>
        </div>

        <div className="space-y-8">
          {Object.entries(roleLabels).map(([role, label]) => (
            <div key={role} className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">{label}</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recurso
                      </th>
                      {actions.map(action => (
                        <th key={action} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {actionLabels[action]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {resources.map(resource => (
                      <tr key={resource}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {resourceLabels[resource]}
                        </td>
                        {actions.map(action => (
                          <td key={action} className="px-6 py-4 whitespace-nowrap">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={hasPermission(role as UserRole, action, resource)}
                                onChange={() => togglePermission(role as UserRole, action, resource)}
                                className="sr-only peer"
                                disabled={role === 'admin'} // Admin always has full access
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-primary flex items-center space-x-2"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{isSaving ? 'Guardando...' : 'Guardar cambios'}</span>
        </button>
      </div>
    </div>
  );
};

export default RBACSettingsProps;