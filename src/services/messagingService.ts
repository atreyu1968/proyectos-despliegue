import { v4 as uuidv4 } from 'uuid';
import { Chat, Message } from '../types/message';

const CHATS_STORAGE_KEY = 'chats';
const MESSAGES_STORAGE_KEY = 'messages';

function getStoredData(key: string) {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : {};
}

function saveStoredData(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

export async function getChats(): Promise<Chat[]> {
  const chats = getStoredData(CHATS_STORAGE_KEY);
  return Object.values(chats);
}

export async function getMessages(chatId: string): Promise<Message[]> {
  const messages = getStoredData(MESSAGES_STORAGE_KEY);
  return messages[chatId] || [];
}

export async function sendMessage(chatId: string, messageData: Partial<Message>): Promise<Message> {
  const messages = getStoredData(MESSAGES_STORAGE_KEY);
  const chats = getStoredData(CHATS_STORAGE_KEY);

  const message: Message = {
    id: uuidv4(),
    chatId,
    type: messageData.type || 'text',
    content: messageData.content || '',
    senderId: messageData.senderId || '',
    createdAt: new Date().toISOString(),
    readBy: [messageData.senderId || ''],
  };

  if (!messages[chatId]) {
    messages[chatId] = [];
  }
  messages[chatId].push(message);

  if (chats[chatId]) {
    chats[chatId].lastMessage = message;
    chats[chatId].updatedAt = message.createdAt;
  }

  saveStoredData(MESSAGES_STORAGE_KEY, messages);
  saveStoredData(CHATS_STORAGE_KEY, chats);

  return message;
}

export async function sendFile(chatId: string, file: File): Promise<Message> {
  // In a real app, we would upload the file to a storage service
  // For now, we'll create a fake URL
  const fileUrl = URL.createObjectURL(file);

  const message: Message = {
    id: uuidv4(),
    chatId,
    type: 'file',
    content: '',
    fileUrl,
    fileName: file.name,
    fileSize: file.size,
    senderId: '', // Set by the caller
    createdAt: new Date().toISOString(),
    readBy: [],
  };

  const messages = getStoredData(MESSAGES_STORAGE_KEY);
  const chats = getStoredData(CHATS_STORAGE_KEY);

  if (!messages[chatId]) {
    messages[chatId] = [];
  }
  messages[chatId].push(message);

  if (chats[chatId]) {
    chats[chatId].lastMessage = message;
    chats[chatId].updatedAt = message.createdAt;
  }

  saveStoredData(MESSAGES_STORAGE_KEY, messages);
  saveStoredData(CHATS_STORAGE_KEY, chats);

  return message;
}

export async function createChat(participants: string[], name?: string): Promise<Chat> {
  const chats = getStoredData(CHATS_STORAGE_KEY);

  const chat: Chat = {
    id: uuidv4(),
    type: name ? 'group' : 'direct',
    participants,
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  chats[chat.id] = chat;
  saveStoredData(CHATS_STORAGE_KEY, chats);

  return chat;
}

export async function markMessagesAsRead(chatId: string, userId: string): Promise<void> {
  const messages = getStoredData(MESSAGES_STORAGE_KEY);
  
  if (messages[chatId]) {
    messages[chatId] = messages[chatId].map((message: Message) => ({
      ...message,
      readBy: message.readBy.includes(userId) ? message.readBy : [...message.readBy, userId]
    }));
    
    saveStoredData(MESSAGES_STORAGE_KEY, messages);
  }
}