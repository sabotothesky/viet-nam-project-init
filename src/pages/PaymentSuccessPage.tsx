import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentInfo {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  description?: string;
}

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  const transactionRef = searchParams.get('ref');
  const paymentType = searchParams.get('type') || 'individual';
  const plan = searchParams.get('plan');

  useEffect(() => {
    if (transactionRef) {
      verifyPayment();
    } else {
      setStatus('error');
    }
  }, [transactionRef]);

  const verifyPayment = async () => {
    try {
      // In a real implementation, you would verify the payment with the payment provider
      // For now, we'll simulate success and update the membership
      
      const { data: transaction, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('transaction_ref', transactionRef)
        .single();

      if (error || !transaction) {
        throw new Error('Transaction not found');
      }

      // Update transaction status to success
      await supabase
        .from('payment_transactions')
        .update({ status: 'success' })
        .eq('id', transaction.id);

      // Upgrade membership
      const membershipType = plan === 'vip' ? 'vip' : 'premium';
      const { data: user } = await supabase.auth.getUser();
      
      if (user.user) {
        await supabase
          .from('memberships')
          .upsert({
            user_id: user.user.id,
            membership_type: membershipType,
            price: transaction.amount,
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            status: 'active'
          });
      }

      setPaymentInfo({
        id: transaction.id,
        amount: transaction.amount,
        status: transaction.status,
        payment_method: transaction.payment_method,
        created_at: transaction.created_at,
        description: transaction.description
      });
      setStatus('success');
      toast.success('Thanh toán thành công!');

    } catch (error) {
      console.error('Payment verification error:', error);
      setStatus('error');
      toast.error('Có lỗi xảy ra khi xác thực thanh toán');
    }
  };

  const handleContinue = () => {
    if (paymentType === 'club') {
      navigate('/membership');
    } else {
      navigate('/membership');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRetry = () => {
    navigate('/membership');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600 mb-4" />  
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Đang xác thực thanh toán</h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Thanh toán thất bại</h2>
          <p className="text-gray-600 mb-6">
            Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
            <button
              onClick={handleGoHome}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Thanh toán thành công!</h2>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã nâng cấp gói {paymentType === 'club' ? 'CLB' : 'cá nhân'}. 
          Tài khoản của bạn đã được kích hoạt.
        </p>
        
        {paymentInfo && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 text-left">
            <h3 className="font-medium text-gray-900 mb-2">Thông tin thanh toán</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Gói:</span>
                <span className="font-medium">{plan}</span>
              </div>
              <div className="flex justify-between">
                <span>Số tiền:</span>
                <span className="font-medium">{paymentInfo.amount?.toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className="flex justify-between">
                <span>Loại:</span>
                <span className="font-medium">{paymentType === 'club' ? 'CLB' : 'Cá nhân'}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleContinue}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Xem gói hội viên
          </button>
          <button
            onClick={handleGoHome}
            className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
