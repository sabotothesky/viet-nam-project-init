
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthCallbackPage: Processing callback...');
    
    // Redirect to main page after a short delay
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">Đang xử lý...</h1>
        <p>Vui lòng chờ trong giây lát...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
