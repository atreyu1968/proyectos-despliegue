import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Bell, MessageSquare, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Notification } from '../../types/message';
import { useNavigate } from 'react-router-dom';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClose: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onClose,
}) => {
  const navigate = useNavigate();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message_received':
        return <MessageSquare className="text-blue-500" size={20} />;
      case 'project_assigned':
        return <FileText className="text-green-500" size={20} />;
      case 'project_status':
        return <CheckCircle className="text-purple-500" size={20} />;
      case 'amendment_requested':
        return <AlertCircle className="text-orange-500" size={20} />;
      default:
        return <Bell className="text-gray-500" size={20} />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    onMarkAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No hay notificaciones
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      notification.read ? 'text-gray-900' : 'text-blue-900'
                    }`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(notification.createdAt), 'PPp', { locale: es })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => navigate('/notifications')}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-700"
          >
            Ver todas las notificaciones
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationList;