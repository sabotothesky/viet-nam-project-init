import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { ApiError } from '@/types/common';

interface PaymentOptions {
  membershipType: string;
  amount?: number;
  clubId?: string;
  paymentMethod?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'bank_transfer' | 'e_wallet' | 'credit_card' | 'qr_code' | 'crypto';
  name: string;
  description: string;
  icon_url: string;
  is_enabled: boolean;
  fees: {
    percentage: number;
    fixed: number;
  };
  processing_time: string;
  limits: {
    min: number;
    max: number;
  };
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'refund';
  amount: number;
  currency: 'VND' | 'USD';
  payment_method_id: string;
  payment_method: PaymentMethod;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  description: string;
  reference_id?: string;
  fees: number;
  net_amount: number;
  metadata?: {
    [key: string]: any;
  };
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: 'VND' | 'USD';
  total_deposits: number;
  total_withdrawals: number;
  total_transfers: number;
  last_updated: Date;
}

export interface CreateTransactionData {
  type: Transaction['type'];
  amount: number;
  currency: 'VND' | 'USD';
  payment_method_id: string;
  description: string;
  metadata?: {
    [key: string]: any;
  };
}

export const usePayment = (userId?: string) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch wallet
  const fetchWallet = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockWallet: Wallet = {
        id: '1',
        user_id: userId,
        balance: 2500000,
        currency: 'VND',
        total_deposits: 5000000,
        total_withdrawals: 1500000,
        total_transfers: 1000000,
        last_updated: new Date()
      };
      
      setWallet(mockWallet);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải thông tin ví');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock payment methods
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: '1',
          type: 'bank_transfer',
          name: 'Chuyển khoản ngân hàng',
          description: 'Chuyển khoản qua ngân hàng nội địa',
          icon_url: '/payment/bank-transfer.png',
          is_enabled: true,
          fees: {
            percentage: 0,
            fixed: 0
          },
          processing_time: '1-2 giờ',
          limits: {
            min: 50000,
            max: 100000000
          }
        },
        {
          id: '2',
          type: 'e_wallet',
          name: 'Ví điện tử',
          description: 'Momo, ZaloPay, VNPay',
          icon_url: '/payment/e-wallet.png',
          is_enabled: true,
          fees: {
            percentage: 0.5,
            fixed: 0
          },
          processing_time: '5-10 phút',
          limits: {
            min: 10000,
            max: 50000000
          }
        },
        {
          id: '3',
          type: 'qr_code',
          name: 'QR Code',
          description: 'Quét mã QR để thanh toán',
          icon_url: '/payment/qr-code.png',
          is_enabled: true,
          fees: {
            percentage: 0,
            fixed: 0
          },
          processing_time: 'Tức thì',
          limits: {
            min: 1000,
            max: 10000000
          }
        },
        {
          id: '4',
          type: 'credit_card',
          name: 'Thẻ tín dụng',
          description: 'Visa, Mastercard',
          icon_url: '/payment/credit-card.png',
          is_enabled: false,
          fees: {
            percentage: 2.5,
            fixed: 0
          },
          processing_time: '1-3 ngày',
          limits: {
            min: 100000,
            max: 50000000
          }
        }
      ];
      
      setPaymentMethods(mockPaymentMethods);
      
      // Mock transactions
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          user_id: userId,
          type: 'deposit',
          amount: 1000000,
          currency: 'VND',
          payment_method_id: '1',
          payment_method: mockPaymentMethods[0],
          status: 'completed',
          description: 'Nạp tiền vào ví',
          reference_id: 'DEP001',
          fees: 0,
          net_amount: 1000000,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
        },
        {
          id: '2',
          user_id: userId,
          type: 'withdrawal',
          amount: 500000,
          currency: 'VND',
          payment_method_id: '1',
          payment_method: mockPaymentMethods[0],
          status: 'completed',
          description: 'Rút tiền về ngân hàng',
          reference_id: 'WIT001',
          fees: 0,
          net_amount: 500000,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
        },
        {
          id: '3',
          user_id: userId,
          type: 'payment',
          amount: 100000,
          currency: 'VND',
          payment_method_id: '2',
          payment_method: mockPaymentMethods[1],
          status: 'completed',
          description: 'Thanh toán phí tham gia giải đấu',
          reference_id: 'PAY001',
          fees: 500,
          net_amount: 100500,
          metadata: {
            tournament_id: '1',
            tournament_name: 'Giải đấu mùa xuân 2024'
          },
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
          updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
          completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
        },
        {
          id: '4',
          user_id: userId,
          type: 'transfer',
          amount: 200000,
          currency: 'VND',
          payment_method_id: '3',
          payment_method: mockPaymentMethods[2],
          status: 'pending',
          description: 'Chuyển tiền cho @player2',
          reference_id: 'TRA001',
          fees: 0,
          net_amount: 200000,
          metadata: {
            recipient_id: '2',
            recipient_username: 'player2'
          },
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2),
          updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2)
        }
      ];
      
      setTransactions(mockTransactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải lịch sử giao dịch');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Create transaction
  const createTransaction = useCallback(async (data: CreateTransactionData) => {
    if (!userId || !wallet) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const paymentMethod = paymentMethods.find(pm => pm.id === data.payment_method_id);
      if (!paymentMethod) {
        throw new Error('Phương thức thanh toán không hợp lệ');
      }
      
      const fees = (data.amount * paymentMethod.fees.percentage / 100) + paymentMethod.fees.fixed;
      const netAmount = data.amount + fees;
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        user_id: userId,
        type: data.type,
        amount: data.amount,
        currency: data.currency,
        payment_method_id: data.payment_method_id,
        payment_method: paymentMethod,
        status: 'pending',
        description: data.description,
        reference_id: `${data.type.toUpperCase()}${Date.now()}`,
        fees,
        net_amount: netAmount,
        metadata: data.metadata,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Update wallet balance for certain transaction types
      if (data.type === 'deposit') {
        setWallet(prev => prev ? {
          ...prev,
          balance: prev.balance + data.amount,
          total_deposits: prev.total_deposits + data.amount,
          last_updated: new Date()
        } : null);
      } else if (data.type === 'withdrawal') {
        if (wallet.balance < data.amount) {
          throw new Error('Số dư không đủ');
        }
        setWallet(prev => prev ? {
          ...prev,
          balance: prev.balance - data.amount,
          total_withdrawals: prev.total_withdrawals + data.amount,
          last_updated: new Date()
        } : null);
      }
      
      return newTransaction;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tạo giao dịch');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, wallet, paymentMethods]);

  // Get transaction by ID
  const getTransactionById = useCallback((transactionId: string) => {
    return transactions.find(transaction => transaction.id === transactionId);
  }, [transactions]);

  // Get transactions by type
  const getTransactionsByType = useCallback((type: Transaction['type']) => {
    return transactions.filter(transaction => transaction.type === type);
  }, [transactions]);

  // Get transactions by status
  const getTransactionsByStatus = useCallback((status: Transaction['status']) => {
    return transactions.filter(transaction => transaction.status === status);
  }, [transactions]);

  // Get recent transactions
  const getRecentTransactions = useCallback((limit: number = 10) => {
    return transactions
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, limit);
  }, [transactions]);

  // Get transaction statistics
  const getTransactionStats = useCallback(() => {
    if (!transactions.length) return null;
    
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    const totalDeposits = completedTransactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = completedTransactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalFees = completedTransactions
      .reduce((sum, t) => sum + t.fees, 0);
    
    return {
      total_transactions: transactions.length,
      completed_transactions: completedTransactions.length,
      total_deposits,
      total_withdrawals,
      total_fees: totalFees,
      success_rate: completedTransactions.length / transactions.length
    };
  }, [transactions]);

  // Get available payment methods
  const getAvailablePaymentMethods = useCallback(() => {
    return paymentMethods.filter(pm => pm.is_enabled);
  }, [paymentMethods]);

  // Calculate fees for a transaction
  const calculateFees = useCallback((amount: number, paymentMethodId: string) => {
    const paymentMethod = paymentMethods.find(pm => pm.id === paymentMethodId);
    if (!paymentMethod) return 0;
    
    return (amount * paymentMethod.fees.percentage / 100) + paymentMethod.fees.fixed;
  }, [paymentMethods]);

  // Check if amount is within limits
  const checkAmountLimits = useCallback((amount: number, paymentMethodId: string) => {
    const paymentMethod = paymentMethods.find(pm => pm.id === paymentMethodId);
    if (!paymentMethod) return false;
    
    return amount >= paymentMethod.limits.min && amount <= paymentMethod.limits.max;
  }, [paymentMethods]);

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, [fetchWallet, fetchTransactions]);

  return {
    wallet,
    transactions,
    paymentMethods,
    loading,
    error,
    fetchWallet,
    fetchTransactions,
    createTransaction,
    getTransactionById,
    getTransactionsByType,
    getTransactionsByStatus,
    getRecentTransactions,
    getTransactionStats,
    getAvailablePaymentMethods,
    calculateFees,
    checkAmountLimits
  };
};
