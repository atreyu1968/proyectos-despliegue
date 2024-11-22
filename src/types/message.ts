export type MessageType = 'text' | 'file' | 'emoji';
export type ChatType = 'direct' | 'group';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: MessageType;
  content: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  createdAt: string;
  readBy: string[];
}

export interface Chat {
  id: string;
  type: ChatType;
  participants: string[];
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
  name?: string; // For group chats
  avatar?: string; // For group chats
}

export interface MessagePermission {
  fromRole: string;
  toRole: string;
  allowed: boolean;
}

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