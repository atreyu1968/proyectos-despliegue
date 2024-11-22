import React, { createContext, useContext, useState, useEffect } from 'react';
import { Settings } from '../types/settings';
import { settingsService } from '../services/settingsService';
import { useToast } from '../hooks/useToast';

interface SettingsContextType {
  settings: Settings | null;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<Settings>) => Promise<boolean>;
  applySettings: (settings: Settings) => void;
}

const defaultSettings: Settings = {
  general: {
    timezone: 'Europe/Madrid',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    defaultLanguage: 'es',
    emailNotifications: true,
    pushNotifications: true,
    systemEmails: {
      from: 'noreply@fpinnova.es',
      replyTo: 'support@fpinnova.es',
    },
  },
  appearance: {
    branding: {
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Logotipo_del_Gobierno_de_Canarias.svg/2560px-Logotipo_del_Gobierno_de_Canarias.svg.png',
      appName: 'FP Innova',
      favicon: 'https://www3.gobiernodecanarias.org/medusa/mediateca/ecoescuela/wp-content/uploads/sites/2/2013/11/favicon-Gobierno-de-Canarias.png',
    },
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#3b82f6',
      headerBg: '#1e3a8a',
      sidebarBg: '#f0f9ff',
      textPrimary: '#111827',
      textSecondary: '#4b5563',
    },
  },
  views: {
    defaultViews: {
      projects: 'grid',
      users: 'grid',
      convocatorias: 'grid',
    },
    displayOptions: {
      showDescription: true,
      showMetadata: true,
      showThumbnails: true,
      itemsPerPage: 12,
    },
    dashboardLayout: {
      showStats: true,
      showRecentActivity: true,
      showUpcomingDeadlines: true,
      showQuickActions: true,
    },
  },
  reviews: {
    allowAdminReview: false,
    allowCoordinatorReview: false,
  },
  integrations: {
    googleAuth: {
      enabled: false,
      clientId: '',
      clientSecret: '',
    },
    microsoftAuth: {
      enabled: false,
      clientId: '',
      clientSecret: '',
    },
    storage: {
      provider: 'local',
    },
    analytics: {
      enabled: false,
      trackingId: '',
    },
  },
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  isLoading: true,
  updateSettings: async () => false,
  applySettings: () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
      applySettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      showToast('Error al cargar la configuración', 'error');
      // Use default settings if loading fails
      setSettings(defaultSettings);
      applySettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>): Promise<boolean> => {
    try {
      const updatedSettings = await settingsService.updateSettings({
        ...settings,
        ...newSettings,
      });
      setSettings(updatedSettings);
      applySettings(updatedSettings);
      showToast('Configuración actualizada correctamente', 'success');
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      showToast('Error al actualizar la configuración', 'error');
      return false;
    }
  };

  const applySettings = (settings: Settings) => {
    const root = document.documentElement;
    const colors = settings.appearance.colors;
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    document.title = settings.appearance.branding.appName;
    
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon && settings.appearance.branding.favicon) {
      favicon.href = settings.appearance.branding.favicon;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, isLoading, updateSettings, applySettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};