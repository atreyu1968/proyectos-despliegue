import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

type ViewMode = 'grid' | 'list';
type ViewSection = 'projects' | 'users' | 'convocatorias';

export const useViewMode = (section: ViewSection) => {
  const { settings } = useSettings();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  useEffect(() => {
    // Solo aplicar la vista por defecto si no hay una preferencia guardada
    const savedView = localStorage.getItem(`viewMode_${section}`);
    if (!savedView && settings?.views?.defaultViews?.[section]) {
      setViewMode(settings.views.defaultViews[section]);
    } else if (savedView) {
      setViewMode(savedView as ViewMode);
    }
  }, [settings, section]);

  const changeViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(`viewMode_${section}`, mode);
  };

  return { viewMode, changeViewMode };
};