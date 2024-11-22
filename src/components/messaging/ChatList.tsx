import React from 'react';
import { Search } from 'lucide-react';
import { Chat } from '../../types/message';
import ChatItem from './ChatItem';

interface ChatListProps {
  chats: Chat[];
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChatId,
  onChatSelect,
  onNewChat,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredChats = chats.filter(chat => 
    chat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={onNewChat}
          className="mt-4 w-full btn btn-primary"
        >
          Nuevo chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.map(chat => (
          <ChatItem
            key={chat.id}
            chat={chat}
            selected={chat.id === selectedChatId}
            onClick={() => onChatSelect(chat.id)}
          />
        ))}

        {filteredChats.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No se encontraron chats
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;