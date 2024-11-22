import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../hooks/useSettings';

const HelpButton: React.FC = () => {
  const { user } = useAuth();
  const { settings } = useSettings();

  if (!settings?.help?.enabled || !user) {
    return null;
  }

  const helpUrl = settings.help.helpUrls[user.role];
  if (!helpUrl) return null;

  const handleClick = () => {
    window.open(helpUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors z-50"
      aria-label="Ayuda"
    >
      <HelpCircle size={24} />
    </button>
  );
};

export default HelpButton;