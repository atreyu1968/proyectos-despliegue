export interface NotificationPreference {
  type: 'project_assigned' | 'project_status' | 'review_assigned' | 'amendment_requested' | 'message_received';
  enabled: boolean;
  email: boolean;
  inApp: boolean;
}

export interface NotificationSettings {
  userId: string;
  preferences: NotificationPreference[];
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationPreference['type'];
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}