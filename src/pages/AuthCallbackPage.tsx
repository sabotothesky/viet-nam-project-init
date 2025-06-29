import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/types/common';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Đang xử lý xác thực...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          setError(`Lỗi xác thực: ${errorMessage}`);
          toast.error(`Lỗi xác thực: ${errorMessage}`);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (data.session) {
          setStatus('success');
          setMessage('Đăng nhập thành công! Đang chuyển hướng...');
          toast.success('Đăng nhập thành công!');
          setTimeout(() => navigate('/dashboard'), 2000);
        } else {
          // Handle email verification
          const type = searchParams.get('type');
          if (type === 'signup') {
            setStatus('success');
            setMessage('Email đã được xác thực! Bạn có thể đăng nhập ngay bây giờ.');
            toast.success('Email đã được xác thực thành công!');
            setTimeout(() => navigate('/login'), 3000);
          } else {
            setStatus('error');
            setMessage('Không tìm thấy phiên đăng nhập.');
            setTimeout(() => navigate('/login'), 3000);
          }
        }
      } catch (error) {
        console.error('Auth callback exception:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Lỗi xác thực: ${errorMessage}`);
        setStatus('error');
        setMessage('Có lỗi xảy ra trong quá trình xác thực.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center space-y-6 p-8">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-900">Đang xử lý...</h2>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-900">Thành công!</h2>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-600 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-900">Có lỗi xảy ra</h2>
          </>
        )}
        
        {error && (
          <p className="text-red-600">{error}</p>
        )}
        
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
