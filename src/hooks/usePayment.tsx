import { useState } from 'react';
import { Wallet, Transaction, PaymentMethod } from '@/types/common';

export const usePayment = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWallet = async () => {
    setLoading(true);
    try {
      // Mock wallet data
      const mockWallet: Wallet = {
        id: '1',
        user_id: 'user-1',
        balance: 100000,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setWallet(mockWallet);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Mock transaction data
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          wallet_id: '1',
          transaction_type: 'deposit',
          amount: 50000,
          description: 'Nạp tiền qua VNPay',
          status: 'completed',
          created_at: new Date().toISOString(),
        },
      ];
      setTransactions(mockTransactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      // Mock payment methods
      const mockMethods: PaymentMethod[] = [
        { id: '1', name: 'VNPay', type: 'vnpay' },
        { id: '2', name: 'MoMo', type: 'momo' },
        { id: '3', name: 'ZaloPay', type: 'zalopay' },
      ];
      setPaymentMethods(mockMethods);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payment methods');
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (amount: number, method: string) => {
    setLoading(true);
    try {
      // Mock payment creation
      const paymentId = `payment_${Date.now()}`;
      
      // Create new transaction
      const newTransaction: Transaction = {
        id: paymentId,
        wallet_id: wallet?.id || '1',
        transaction_type: 'payment',
        amount: amount,
        description: `Thanh toán qua ${method}`,
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Update wallet balance if successful
      if (wallet) {
        setWallet({
          ...wallet,
          balance: wallet.balance - amount,
          updated_at: new Date().toISOString(),
        });
      }
      
      return { success: true, paymentId };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment creation failed');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (paymentId: string) => {
    setLoading(true);
    try {
      // Mock payment processing
      setTransactions(prev => 
        prev.map(t => 
          t.id === paymentId 
            ? { ...t, status: 'completed' }
            : t
        )
      );
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const refundPayment = async (paymentId: string) => {
    setLoading(true);
    try {
      // Mock refund processing
      const transaction = transactions.find(t => t.id === paymentId);
      if (transaction && wallet) {
        // Create refund transaction
        const refundTransaction: Transaction = {
          id: `refund_${Date.now()}`,
          wallet_id: wallet.id,
          transaction_type: 'refund',
          amount: transaction.amount,
          description: `Hoàn tiền cho giao dịch ${paymentId}`,
          status: 'completed',
          created_at: new Date().toISOString(),
        };
        
        setTransactions(prev => [refundTransaction, ...prev]);
        
        // Update wallet balance
        setWallet({
          ...wallet,
          balance: wallet.balance + transaction.amount,
          updated_at: new Date().toISOString(),
        });
      }
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refund failed');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatus = async (paymentId: string) => {
    try {
      const transaction = transactions.find(t => t.id === paymentId);
      return transaction?.status || 'not_found';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get payment status');
      return 'error';
    }
  };

  const validatePaymentData = (data: any) => {
    try {
      if (!data.amount || data.amount <= 0) {
        return { valid: false, error: 'Invalid amount' };
      }
      if (!data.method) {
        return { valid: false, error: 'Payment method required' };
      }
      return { valid: true };
    } catch (err) {
      return { valid: false, error: 'Validation failed' };
    }
  };

  const calculateFees = (amount: number, method: string) => {
    try {
      // Different fee structures for different methods
      const feeRates: { [key: string]: number } = {
        vnpay: 0.025,
        momo: 0.03,
        zalopay: 0.028,
        default: 0.03,
      };
      
      const rate = feeRates[method] || feeRates.default;
      return Math.round(amount * rate);
    } catch (err) {
      return 0;
    }
  };

  const checkAmountLimits = (amount: number, paymentMethodId: string) => {
    try {
      // Mock limit checking
      const limits: { [key: string]: { min: number; max: number } } = {
        '1': { min: 10000, max: 50000000 }, // VNPay
        '2': { min: 5000, max: 20000000 },  // MoMo
        '3': { min: 10000, max: 30000000 }, // ZaloPay
      };
      
      const limit = limits[paymentMethodId] || { min: 10000, max: 50000000 };
      return amount >= limit.min && amount <= limit.max;
    } catch (err) {
      return false;
    }
  };

  const isProcessing = loading;

  return {
    wallet,
    transactions,
    paymentMethods,
    loading,
    error,
    fetchWallet,
    fetchTransactions,
    fetchPaymentMethods,
    createPayment,
    processPayment,
    refundPayment,
    getPaymentStatus,
    validatePaymentData,
    calculateFees,
    checkAmountLimits,
    isProcessing,
  };
};
