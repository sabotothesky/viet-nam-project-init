
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShouldRedirect(true);
    }
  }, [loading, user]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-slate-800 to-green-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-400 mx-auto mb-4" />
          <p className="text-gray-300">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (shouldRedirect) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render children
  return <>{children}</>;
};

export default AuthWrapper;
