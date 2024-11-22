import React, { useState } from 'react';
import { Globe, Mail, HelpCircle, Loader2 } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { UserRole, roleLabels } from '../../types/auth';

interface GeneralSettingsProps {
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ onSave, isSaving }) => {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState({
    timezone: settings?.general?.timezone || 'Europe/Madrid',
    dateFormat: settings?.general?.dateFormat || 'DD/MM/YYYY',
    timeFormat: settings?.general?.timeFormat || '24h',
    defaultLanguage: settings?.general?.defaultLanguage || 'es',
    emailNotifications: settings?.general?.emailNotifications ?? true,
    systemEmails: settings?.general?.systemEmails || {
      from: 'noreply@fpinnova.es',
      replyTo: 'support@fpinnova.es',
    },
    help: settings?.help || {
      enabled: false,
      helpUrls: {
        admin: '',
        coordinator: '',
        presenter: '',
        reviewer: '',
        guest: ''
      }
    }
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSystemEmailChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      systemEmails: {
        ...prev.systemEmails,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    const newSettings = {
      general: {
        timezone: formData.timezone,
        dateFormat: formData.dateFormat,
        timeFormat: formData.timeFormat,
        defaultLanguage: formData.defaultLanguage,
        emailNotifications: formData.emailNotifications,
        systemEmails: formData.systemEmails,
      },
      help: formData.help
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
          <Globe className="text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Localización y Formato</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Zona horaria
            </label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Europe/Madrid">España (Península)</option>
              <option value="Atlantic/Canary">España (Canarias)</option>
              <option value="Europe/London">Reino Unido</option>
              <option value="America/New_York">Estados Unidos (Este)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Formato de fecha
            </label>
            <select
              name="dateFormat"
              value={formData.dateFormat}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Formato de hora
            </label>
            <select
              name="timeFormat"
              value={formData.timeFormat}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="24h">24 horas</option>
              <option value="12h">12 horas (AM/PM)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Idioma por defecto
            </label>
            <select
              name="defaultLanguage"
              value={formData.defaultLanguage}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="ca">Català</option>
              <option value="gl">Galego</option>
              <option value="eu">Euskara</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <Mail className="text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Notificaciones por email</p>
              <p className="text-sm text-gray-500">
                Habilitar notificaciones por correo electrónico por defecto
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <Mail className="text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Correos del Sistema</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dirección de envío
            </label>
            <input
              type="email"
              value={formData.systemEmails.from}
              onChange={(e) => handleSystemEmailChange('from', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Dirección desde la que se enviarán los correos del sistema
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dirección de respuesta
            </label>
            <input
              type="email"
              value={formData.systemEmails.replyTo}
              onChange={(e) => handleSystemEmailChange('replyTo', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Dirección a la que llegarán las respuestas
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <HelpCircle className="text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Botón de Ayuda</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Mostrar botón de ayuda</p>
              <p className="text-sm text-gray-500">
                Habilitar el botón flotante de ayuda
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.help.enabled}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  help: {
                    ...prev.help,
                    enabled: e.target.checked
                  }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {formData.help.enabled && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">URLs de ayuda por rol</h4>
              
              {Object.entries(roleLabels).map(([role, label]) => (
                <div key={role}>
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    type="url"
                    value={formData.help.helpUrls[role as keyof typeof formData.help.helpUrls]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      help: {
                        ...prev.help,
                        helpUrls: {
                          ...prev.help.helpUrls,
                          [role]: e.target.value
                        }
                      }
                    }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
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

export default GeneralSettings;