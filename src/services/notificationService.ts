import { v4 as uuidv4 } from 'uuid';
import { Notification, NotificationPreference } from '../types/message';

const NOTIFICATIONS_STORAGE_KEY = 'notifications';
const NOTIFICATION_PREFERENCES_KEY = 'notification_preferences';

function getStoredData(key: string) {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : {};
}

function saveStoredData(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

export async function getNotifications(): Promise<Notification[]> {
  const notifications = getStoredData(NOTIFICATIONS_STORAGE_KEY);
  return Object.values(notifications).sort((a: Notification, b: Notification) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createNotification(
  userId: string,
  type: NotificationPreference['type'],
  title: string,
  message: string,
  link?: string
): Promise<Notification> {
  const notifications = getStoredData(NOTIFICATIONS_STORAGE_KEY);
  
  const notification: Notification = {
    id: uuidv4(),
    userId,
    type,
    title,
    message,
    link,
    read: false,
    createdAt: new Date().toISOString(),
  };

  notifications[notification.id] = notification;
  saveStoredData(NOTIFICATIONS_STORAGE_KEY, notifications);

  return notification;
}

export async function markAsRead(notificationId: string): Promise<void> {
  const notifications = getStoredData(NOTIFICATIONS_STORAGE_KEY);
  
  if (notifications[notificationId]) {
    notifications[notificationId].read = true;
    saveStoredData(NOTIFICATIONS_STORAGE_KEY, notifications);
  }
}

export async function getNotificationPreferences(userId: string): Promise<NotificationPreference[]> {
  const preferences = getStoredData(NOTIFICATION_PREFERENCES_KEY);
  return preferences[userId] || getDefaultPreferences();
}

export async function updateNotificationPreferences(
  userId: string,
  preferences: NotificationPreference[]
): Promise<void> {
  const allPreferences = getStoredData(NOTIFICATION_PREFERENCES_KEY);
  allPreferences[userId] = preferences;
  saveStoredData(NOTIFICATION_PREFERENCES_KEY, allPreferences);
}

function getDefaultPreferences(): NotificationPreference[] {
  return [
    {
      type: 'project_assigned',
      enabled: true,
      email: true,
      push: true,
      inApp: true,
    },
    {
      type: 'project_status',
      enabled: true,
      email: true,
      push: true,
      inApp: true,
    },
    {
      type: 'review_assigned',
      enabled: true,
      email: true,
      push: true,
      inApp: true,
    },
    {
      type: 'amendment_requested',
      enabled: true,
      email: true,
      push: true,
      inApp: true,
    },
    {
      type: 'message_received',
      enabled: true,
      email: false,
      push: true,
      inApp: true,
    },
  ];
}