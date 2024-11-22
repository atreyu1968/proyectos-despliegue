import React, { useState, useEffect } from 'react';
import { Chat, Message } from '../types/message';
import { User } from '../types/auth';
import { useAuth } from '../hooks/useAuth';
import ChatList from '../components/messaging/ChatList';
import ChatWindow from '../components/messaging/ChatWindow';
import NewChatModal from '../components/messaging/NewChatModal';
import { 
  getChats,
  getMessages,
  sendMessage,
  sendFile,
  createChat
} from '../services/messagingService';

const MessagingPage: React.FC = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  useEffect(() => {
    loadChats();
    loadAvailableUsers();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
    }
  }, [selectedChat]);

  const loadChats = async () => {
    try {
      const userChats = await getChats();
      setChats(userChats);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const chatMessages = await getMessages(chatId);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadAvailableUsers = async () => {
    // TODO: Implement API call to get available users based on messaging permissions
    setAvailableUsers([]);
  };

  const handleSendMessage = async (content: string, type: 'text' | 'emoji') => {
    if (!selectedChat || !user) return;

    try {
      const message = await sendMessage(selectedChat.id, {
        type,
        content,
        senderId: user.id,
      });

      setMessages(prev => [...prev, message]);
      setChats(prev =>
        prev.map(chat =>
          chat.id === selectedChat.id
            ? { ...chat, lastMessage: message }
            : chat
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSendFile = async (file: File) => {
    if (!selectedChat || !user) return;

    try {
      const message = await sendFile(selectedChat.id, file);
      setMessages(prev => [...prev, message]);
      setChats(prev =>
        prev.map(chat =>
          chat.id === selectedChat.id
            ? { ...chat, lastMessage: message }
            : chat
        )
      );
    } catch (error) {
      console.error('Error sending file:', error);
    }
  };

  const handleCreateChat = async (participants: string[], name?: string) => {
    try {
      const newChat = await createChat(participants, name);
      setChats(prev => [...prev, newChat]);
      setSelectedChat(newChat);
      setShowNewChat(false);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <div className="h-full flex">
      <div className="w-80 flex-shrink-0">
        <ChatList
          chats={chats}
          selectedChatId={selectedChat?.id}
          onChatSelect={(chatId) => {
            const chat = chats.find(c => c.id === chatId);
            if (chat) setSelectedChat(chat);
          }}
          onNewChat={() => setShowNewChat(true)}
        />
      </div>

      <div className="flex-1">
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            messages={messages}
            onSendMessage={handleSendMessage}
            onSendFile={handleSendFile}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">
              Selecciona un chat para comenzar
            </p>
          </div>
        )}
      </div>

      {showNewChat && (
        <NewChatModal
          onClose={() => setShowNewChat(false)}
          onCreateChat={handleCreateChat}
          availableUsers={availableUsers}
        />
      )}
    </div>
  );
};

export default MessagingPage;