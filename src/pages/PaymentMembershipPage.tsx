
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check, CreditCard, Loader2 } from 'lucide-react';
import { usePayment } from '@/hooks/usePayment';
import { toast } from 'sonner';

const PaymentMembershipPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const plan = searchParams.get('plan') || '';
  const price = searchParams.get('price') || '';
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const { createPayment } = usePayment();

  const planDetails = {
    premium: {
      name: 'Premium Member',
      price: 99000,
      duration: '1 tháng',
      features: ['Tham gia giải đấu', 'Giảm 20% giờ chơi', 'Ưu tiên đặt bàn']
    },
    vip: {
      name: 'VIP Member',
      price: 299000,
      duration: '1 tháng',
      features: ['Tất cả tính năng Premium', 'Giảm 30% giờ chơi', 'Huấn luyện cá nhân']
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      await createPayment({
        membershipType: plan,
        amount: parseInt(price)
      });
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Có lỗi xảy ra khi tạo thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const currentPlan = planDetails[plan as keyof typeof planDetails];

  if (!currentPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Gói không hợp lệ</h2>
          <button
            onClick={() => navigate('/membership')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Quay lại chọn gói
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán gói hội viên</h1>
          <p className="mt-2 text-gray-600">Hoàn tất thanh toán để kích hoạt gói {currentPlan.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đơn hàng</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gói:</span>
                  <span className="font-medium">{currentPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời hạn:</span>
                  <span className="font-medium">{currentPlan.duration}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">{currentPlan.price.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2">Quyền lợi bao gồm:</h3>
                <ul className="space-y-1">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Phương thức thanh toán</h2>
              
              <div className="space-y-4 mb-6">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vnpay"
                    checked={paymentMethod === 'vnpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <div className="ml-3 flex items-center">
                    <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">VNP</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">VNPay</p>
                      <p className="text-sm text-gray-500">Thanh toán qua VNPay</p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="momo"
                    checked={paymentMethod === 'momo'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <div className="ml-3 flex items-center">
                    <div className="w-12 h-8 bg-pink-600 rounded flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">MM</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">MoMo</p>
                      <p className="text-sm text-gray-500">Ví điện tử MoMo</p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <div className="ml-3 flex items-center">
                    <CreditCard className="h-8 w-8 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Chuyển khoản ngân hàng</p>
                      <p className="text-sm text-gray-500">Chuyển khoản trực tiếp</p>
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Quay lại
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Thanh toán ngay
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMembershipPage;
