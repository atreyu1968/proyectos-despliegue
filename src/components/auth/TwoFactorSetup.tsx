import React, { useState } from 'react';
import { AlertCircle, Copy, Check } from 'lucide-react';
import { verifyTwoFactorSetup } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

interface TwoFactorSetupProps {
  onClose: () => void;
  onComplete: () => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onClose, onComplete }) => {
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setIsVerifying(true);

    try {
      await verifyTwoFactorSetup(user.id, code);
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar el código');
    } finally {
      setIsVerifying(false);
    }
  };

  const copyRecoveryCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Configurar autenticación en dos pasos
        </h2>
        <p className="text-sm text-gray-600">
          Escanea el código QR con tu aplicación de autenticación (Google Authenticator, Authy, etc.)
        </p>
      </div>

      <div className="flex justify-center">
        <img
          src={user?.twoFactorQr}
          alt="QR Code"
          className="w-48 h-48 border border-gray-200 rounded-lg"
        />
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          O ingresa esta clave manualmente:
        </p>
        <code className="block mt-2 p-2 bg-gray-100 rounded font-mono text-sm">
          {user?.twoFactorSecret}
        </code>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="text-yellow-500 mt-0.5" size={20} />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Guarda tu código de recuperación
            </h3>
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <code className="flex-1 bg-white px-3 py-1 rounded border border-yellow-300 font-mono text-sm">
                  {user?.recoveryCode}
                </code>
                <button
                  onClick={() => user?.recoveryCode && copyRecoveryCode(user.recoveryCode)}
                  className="p-2 text-yellow-700 hover:text-yellow-900 rounded-lg hover:bg-yellow-100"
                >
                  {hasCopied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
              <p className="mt-1 text-sm text-yellow-700">
                Guarda este código en un lugar seguro. Lo necesitarás si pierdes acceso a tu aplicación de autenticación.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Código de verificación
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="000000"
            maxLength={6}
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
            onClick={onClose}
            className="btn btn-secondary"
            disabled={isVerifying}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={code.length !== 6 || isVerifying}
          >
            {isVerifying ? 'Verificando...' : 'Activar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TwoFactorSetup;