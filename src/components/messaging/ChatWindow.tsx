import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Chat, Message } from '../../types/message';
import { useAuth } from '../../hooks/useAuth';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  onSendMessage: (content: string, type: 'text' | 'emoji') => void;
  onSendFile: (file: File) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  messages,
  onSendMessage,
  onSendFile,
}) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message, 'text');
      setMessage('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendFile(file);
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    onSendMessage(emoji.native, 'emoji');
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {chat.type === 'group' ? (
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {chat.name?.slice(0, 2).toUpperCase()}
              </span>
            </div>
          ) : (
            <img
              src={chat.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name || '')}`}
              alt={chat.name}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{chat.name}</h2>
            {chat.type === 'group' && (
              <p className="text-sm text-gray-500">
                {chat.participants.length} participantes
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === user?.id}
            showAvatar={
              index === 0 ||
              messages[index - 1].senderId !== msg.senderId
            }
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-24 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Escribe un mensaje..."
            />
            <div className="absolute right-2 bottom-2 flex items-center space-x-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <Paperclip size={20} />
              </button>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <Smile size={20} />
              </button>
            </div>
            {showEmojiPicker && (
              <div className="absolute bottom-12 right-0">
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  theme="light"
                  locale="es"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!message.trim()}
            className="btn btn-primary p-2 rounded-full"
          >
            <Send size={20} />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
        />
      </form>
    </div>
  );
};

export default ChatWindow;