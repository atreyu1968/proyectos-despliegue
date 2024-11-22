import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';

interface PasswordResetProps {
  token: string;
  onReset: (token: string, password: string) => Promise<void>;
}

const PasswordReset: React.FC<PasswordResetProps> = ({
  token,
  onReset,
}) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsResetting(true);
    try {
      await onReset(token, password);
      navigate('/login', { state: { message: 'Contraseña restablecida correctamente' } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al restablecer la contraseña');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-blue-100 p-3 rounded-full">
          <Lock className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
        Restablecer contraseña
      </h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Ingresa tu nueva contraseña
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Nueva contraseña
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmar contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isResetting}
          className="w-full btn btn-primary flex items-center justify-center space-x-2"
        >
          {isResetting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{isResetting ? 'Restableciendo...' : 'Restablecer contraseña'}</span>
        </button>
      </form>
    </div>
  );
};

export default PasswordReset;