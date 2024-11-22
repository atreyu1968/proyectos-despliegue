import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Loader2 } from 'lucide-react';
import { verifyRecoveryCode } from '../../services/authService';

interface RecoveryCodeFormProps {
  userId: string;
  onSuccess: () => void;
}

const RecoveryCodeForm: React.FC<RecoveryCodeFormProps> = ({
  userId,
  onSuccess,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsVerifying(true);

    try {
      const isValid = await verifyRecoveryCode(userId, code);
      if (isValid) {
        onSuccess();
      } else {
        setError('Código inválido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar el código');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-blue-100 p-3 rounded-full">
          <Key className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
        Usar código de recuperación
      </h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Ingresa el código de recuperación que guardaste al activar la autenticación en dos pasos
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Código de recuperación
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="XXXX-XXXX-XXXX-XXXX"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="btn btn-secondary"
            disabled={isVerifying}
          >
            Volver al inicio
          </button>
          <button
            type="submit"
            disabled={!code || isVerifying}
            className="btn btn-primary flex items-center space-x-2"
          >
            {isVerifying && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isVerifying ? 'Verificando...' : 'Verificar'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecoveryCodeForm;