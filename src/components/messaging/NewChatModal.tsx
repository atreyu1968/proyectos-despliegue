import React, { useState } from 'react';
import { Search, Users, X } from 'lucide-react';
import { User } from '../../types/auth';
import { useAuth } from '../../hooks/useAuth';

interface NewChatModalProps {
  onClose: () => void;
  onCreateChat: (participants: string[], name?: string) => void;
  availableUsers: User[];
}

const NewChatModal: React.FC<NewChatModalProps> = ({
  onClose,
  onCreateChat,
  availableUsers,
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState('');

  const filteredUsers = availableUsers.filter(u => 
    u.id !== user?.id &&
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = () => {
    if (selectedUsers.length === 0) return;
    onCreateChat(selectedUsers, isGroup ? groupName : undefined);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              Nuevo chat
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isGroup}
                  onChange={(e) => setIsGroup(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Crear grupo
                </span>
              </label>
            </div>

            {isGroup && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre del grupo
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nombre del grupo"
                  required={isGroup}
                />
              </div>
            )}

            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
                {filteredUsers.map(u => (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                      selectedUsers.includes(u.id)
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50 border border-gray-200'
                    }`}
                    onClick={() => toggleUser(u.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}`}
                        alt={u.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{u.name}</p>
                        <p className="text-sm text-gray-500">{u.email}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(u.id)}
                      onChange={() => {}}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                ))}

                {filteredUsers.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No se encontraron usuarios
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={selectedUsers.length === 0 || (isGroup && !groupName)}
            className="w-full btn btn-primary"
          >
            {isGroup ? 'Crear grupo' : 'Iniciar chat'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;