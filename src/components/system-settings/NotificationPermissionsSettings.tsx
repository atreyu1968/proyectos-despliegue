import React, { useState, useEffect } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { UserRole } from '../../types/auth';
import { NotificationPreference } from '../../types/message';

interface NotificationPermissionsSettingsProps {
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}

const NotificationPermissionsSettingsProps: React.FC<NotificationPermissionsSettingsProps> = ({
  onSave,
  isSaving,
}) => {
  const { settings, updateSettings } = useSettings();
  const [preferences, setPreferences] = useState<Record<UserRole, NotificationPreference[]>>({
    admin: [],
    coordinator: [],
    presenter: [],
    reviewer: [],
    guest: [],
  });

  useEffect(() => {
    if (settings?.notifications?.preferences) {
      setPreferences(settings.notifications.preferences);
    }
  }, [settings]);

  const handleTogglePreference = (
    role: UserRole,
    type: NotificationPreference['type'],
    field: keyof NotificationPreference
  ) => {
    setPreferences(prev => ({
      ...prev,
      [role]: prev[role].map(pref =>
        pref.type === type
          ? { ...pref, [field]: !pref[field] }
          : pref
      ),
    }));
  };

  const handleSave = async () => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings?.notifications,
        preferences,
      },
    };

    await updateSettings(newSettings);
    if (onSave) {
      await onSave(newSettings);
    }
  };

  const notificationTypes: Array<{
    type: NotificationPreference['type'];
    label: string;
    description: string;
  }> = [
    {
      type: 'project_assigned',
      label: 'Asignación de proyectos',
      description: 'Cuando se asigna un nuevo proyecto para revisar',
    },
    {
      type: 'project_status',
      label: 'Cambios de estado',
      description: 'Cuando cambia el estado de un proyecto',
    },
    {
      type: 'review_assigned',
      label: 'Asignación de revisiones',
      description: 'Cuando se asigna una nueva revisión',
    },
    {
      type: 'amendment_requested',
      label: 'Solicitud de subsanaciones',
      description: 'Cuando se solicitan subsanaciones en un proyecto',
    },
    {
      type: 'message_received',
      label: 'Mensajes recibidos',
      description: 'Cuando se recibe un nuevo mensaje',
    },
  ];

  const roleLabels: Record<UserRole, string> = {
    admin: 'Administrador',
    coordinator: 'Coordinador',
    presenter: 'Presentador',
    reviewer: 'Revisor',
    guest: 'Invitado',
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <Bell className="text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Permisos de Notificaciones</h3>
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
                        Tipo de notificación
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Habilitada
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        En app
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {notificationTypes.map(({ type, label, description }) => (
                      <tr key={type}>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{label}</p>
                            <p className="text-sm text-gray-500">{description}</p>
                          </div>
                        </td>
                        {['enabled', 'email', 'inApp'].map((field) => (
                          <td key={field} className="px-6 py-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={preferences[role as UserRole]
                                  .find(p => p.type === type)?.[field as keyof NotificationPreference] || false}
                                onChange={() => handleTogglePreference(
                                  role as UserRole,
                                  type,
                                  field as keyof NotificationPreference
                                )}
                                className="sr-only peer"
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

export default NotificationPermissionsSettingsProps;