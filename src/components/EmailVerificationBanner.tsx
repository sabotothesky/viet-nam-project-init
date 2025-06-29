
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const EmailVerificationBanner = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (user && !user.email_confirmed_at) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [user]);

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`
        }
      });

      if (error) {
        toast.error(`Lỗi gửi email: ${error.message}`);
      } else {
        toast.success('Email xác thực đã được gửi lại!');
      }
    } catch (error: any) {
      toast.error('Có lỗi xảy ra khi gửi email');
    } finally {
      setIsResending(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Mail className="h-5 w-5 text-yellow-400 mr-3" />
          <div>
            <p className="text-sm text-yellow-800">
              <strong>Xác thực email:</strong> Vui lòng kiểm tra email và nhấp vào link xác thực để kích hoạt tài khoản.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResendVerification}
            disabled={isResending}
            className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
          >
            {isResending ? 'Đang gửi...' : 'Gửi lại'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-yellow-800 hover:bg-yellow-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
