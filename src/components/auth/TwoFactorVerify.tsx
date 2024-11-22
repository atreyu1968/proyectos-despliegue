import React, { useState } from 'react';
import { KeyRound, Loader2 } from 'lucide-react';

interface TwoFactorVerifyProps {
  onVerify: (code: string) => Promise<void>;
  onCancel: () => void;
}

const TwoFactorVerify: React.FC<TwoFactorVerifyProps> = ({
  onVerify,
  onCancel,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsVerifying(true);

    try {
      await onVerify(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar el código');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-blue-100 p-3 rounded-full">
          <KeyRound className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
        Verificación en dos pasos
      </h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Ingresa el código de tu aplicación de autenticación
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex justify-center space-x-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={code[i] || ''}
                onChange={(e) => {
                  const newCode = code.split('');
                  newCode[i] = e.target.value.replace(/\D/g, '');
                  setCode(newCode.join(''));
                  
                  if (e.target.value && e.target.nextElementSibling) {
                    (e.target.nextElementSibling as HTMLInputElement).focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !code[i] && e.target.previousElementSibling) {
                    (e.target.previousElementSibling as HTMLInputElement).focus();
                  }
                }}
                className="w-12 h-12 text-center border border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-blue-500"
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isVerifying}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={code.length !== 6 || isVerifying}
            className="btn btn-primary flex items-center space-x-2"
          >
            {isVerifying && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isVerifying ? 'Verificando...' : 'Verificar'}</span>
          </button>
        </div>

        <div className="text-center">
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ¿Perdiste acceso? Usa tu código de recuperación
          </button>
        </div>
      </form>
    </div>
  );
};

export default TwoFactorVerify;