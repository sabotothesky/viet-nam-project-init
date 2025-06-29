
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { usePayment } from '@/hooks/usePayment';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface PaymentButtonProps {
  membershipType: 'premium';
  className?: string;
  amount?: number;
}

export const PaymentButton = ({ membershipType, className, amount = 99000 }: PaymentButtonProps) => {
  const { createPayment, isProcessing } = usePayment();

  const handlePayment = async () => {
    await createPayment({
      membershipType,
      amount
    });
  };

  return (
    <Button 
      onClick={handlePayment}
      disabled={isProcessing}
      className={className}
    >
      {isProcessing ? (
        <>
          <LoadingSpinner size="sm" />
          <span className="ml-2">Đang xử lý...</span>
        </>
      ) : (
        <>
          <Crown className="h-4 w-4 mr-2" />
          Nâng cấp Premium - {amount.toLocaleString('vi-VN')}đ
        </>
      )}
    </Button>
  );
};
