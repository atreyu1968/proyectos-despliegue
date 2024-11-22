import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText, Download } from 'lucide-react';
import { Message } from '../../types/message';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showAvatar,
}) => {
  const getMessageContent = () => {
    switch (message.type) {
      case 'text':
        return <p className="whitespace-pre-wrap">{message.content}</p>;
      
      case 'emoji':
        return <p className="text-2xl">{message.content}</p>;
      
      case 'file':
        return (
          <div className="flex items-center space-x-2">
            <FileText size={24} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.fileName}</p>
              <p className="text-xs text-gray-500">
                {formatFileSize(message.fileSize || 0)}
              </p>
            </div>
            <a
              href={message.fileUrl}
              download
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <Download size={20} />
            </a>
          </div>
        );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div
      className={`flex items-end space-x-2 ${
        isOwn ? 'flex-row-reverse space-x-reverse' : ''
      }`}
    >
      {showAvatar && !isOwn && (
        <img
          src={`https://ui-avatars.com/api/?name=${message.senderId}`}
          alt="Avatar"
          className="w-8 h-8 rounded-full"
        />
      )}
      {!showAvatar && !isOwn && <div className="w-8" />}
      
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isOwn
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        {getMessageContent()}
        <div
          className={`text-xs mt-1 ${
            isOwn ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {format(new Date(message.createdAt), 'HH:mm', { locale: es })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;