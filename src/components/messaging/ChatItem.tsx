import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface ChatItemProps {
  chat: {
    id: string;
    type: 'direct' | 'group';
    name?: string;
    avatar?: string;
    participants: string[];
    lastMessage?: {
      type: 'text' | 'file' | 'emoji';
      content: string;
      senderId: string;
      createdAt: string;
      readBy: string[];
      fileName?: string;
    };
  };
  selected: boolean;
  onClick: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, selected, onClick }) => {
  const { user } = useAuth();

  const getDisplayName = () => {
    if (chat.type === 'group') {
      return chat.name;
    }
    const otherParticipant = chat.participants.find(p => p !== user?.id);
    return otherParticipant || 'Chat';
  };

  const getLastMessagePreview = () => {
    if (!chat.lastMessage) return '';
    
    switch (chat.lastMessage.type) {
      case 'text':
        return chat.lastMessage.content;
      case 'file':
        return `📎 ${chat.lastMessage.fileName}`;
      case 'emoji':
        return chat.lastMessage.content;
      default:
        return '';
    }
  };

  const getLastMessageTime = () => {
    if (!chat.lastMessage) return '';
    
    const date = new Date(chat.lastMessage.createdAt);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
    
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const unreadMessages = chat.lastMessage && 
    !chat.lastMessage.readBy.includes(user?.id || '') &&
    chat.lastMessage.senderId !== user?.id;

  return (
    <div
      className={`p-4 cursor-pointer hover:bg-gray-50 ${
        selected ? 'bg-blue-50' : ''
      } ${unreadMessages ? 'bg-blue-50/50' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {chat.type === 'group' ? (
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {chat.name?.slice(0, 2).toUpperCase()}
              </span>
            </div>
          ) : (
            <img
              src={chat.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(getDisplayName())}`}
              alt={getDisplayName()}
              className="w-12 h-12 rounded-full"
            />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {getDisplayName()}
            </h3>
            {chat.lastMessage && (
              <span className="text-xs text-gray-500">
                {getLastMessageTime()}
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-500 truncate">
            {chat.lastMessage?.senderId === user?.id && '✓ '}
            {getLastMessagePreview()}
          </p>
        </div>

        {unreadMessages && (
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        )}
      </div>
    </div>
  );
};

export default ChatItem;