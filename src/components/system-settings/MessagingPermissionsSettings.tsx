import React, { useState } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { UserRole } from '../../types/auth';
import { MessagePermission } from '../../types/message';

interface MessagingPermissionsSettingsProps {
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}

const MessagingPermissionsSettings: React.FC<MessagingPermissionsSettingsProps> = ({
  onSave,
  isSaving,
}) => {
  const { settings, updateSettings } = useSettings();
  const [permissions, setPermissions] = useState<MessagePermission[]>(
    settings?.messaging?.permissions || []
  );

  const roles: UserRole[] = ['admin', 'coordinator', 'presenter', 'reviewer', 'guest'];

  const roleLabels: Record<UserRole, string> = {
    admin: 'Administrador',
    coordinator: 'Coordinador',
    presenter: 'Presentador',
    reviewer: 'Revisor',
    guest: 'Invitado',
  };

  const hasPermission = (fromRole: string, toRole: string): boolean => {
    return permissions.some(
      p => p.fromRole === fromRole && p.toRole === toRole && p.allowed
    );
  };

  const togglePermission = (fromRole: string, toRole: string) => {
    setPermissions(prev => {
      const existingPermission = prev.find(
        p => p.fromRole === fromRole && p.toRole === toRole
      );

      if (existingPermission) {
        return prev.map(p =>
          p.fromRole === fromRole && p.toRole === toRole
            ? { ...p, allowed: !p.allowed }
            : p
        );
      }

      return [...prev, { fromRole, toRole, allowed: true }];
    });
  };

  const handleSave = async () => {
    const newSettings = {
      ...settings,
      messaging: {
        ...settings?.messaging,
        permissions,
      },
    };

    await updateSettings(newSettings);
    if (onSave) {
      await onSave(newSettings);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <MessageSquare className="text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Permisos de Mensajería</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  De \ A
                </th>
                {roles.map(role => (
                  <th
                    key={role}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {roleLabels[role]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roles.map(fromRole => (
                <tr key={fromRole}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {roleLabels[fromRole]}
                  </td>
                  {roles.map(toRole => (
                    <td key={toRole} className="px-6 py-4 whitespace-nowrap">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasPermission(fromRole, toRole)}
                          onChange={() => togglePermission(fromRole, toRole)}
                          className="sr-only peer"
                          disabled={fromRole === toRole} // No self-messaging
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

        <div className="mt-6 text-sm text-gray-500">
          <p>Notas:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Los administradores siempre pueden enviar mensajes a todos los roles</li>
            <li>Los usuarios no pueden enviarse mensajes a sí mismos</li>
            <li>Los grupos heredan los permisos de mensajería de sus participantes</li>
          </ul>
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

export default MessagingPermissionsSettings;