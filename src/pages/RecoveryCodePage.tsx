import React from 'react';
import { useNavigate } from 'react-router-dom';
import RecoveryCodeForm from '../components/auth/RecoveryCodeForm';
import { useAuth } from '../hooks/useAuth';

const RecoveryCodePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <RecoveryCodeForm
        userId={user.id}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default RecoveryCodePage;