import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface Transaction {
  id: string;
  type:
    | 'deposit'
    | 'withdraw'
    | 'transfer'
    | 'match_win'
    | 'match_loss'
    | 'challenge'
    | 'refund'
    | 'bonus';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: Date;
  reference_id?: string;
  payment_method?: string;
  recipient?: string;
  sender?: string;
}

interface TransactionHistoryProps {
  userId: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  userId,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setTransactions([
          {
            id: '1',
            type: 'match_win',
            amount: 50000,
            description: 'Thắng trận đấu vs player2',
            status: 'completed',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            reference_id: 'MATCH_001',
          },
          {
            id: '2',
            type: 'challenge',
            amount: -100000,
            description: 'Thách đấu vs pool_master',
            status: 'completed',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            reference_id: 'CHALLENGE_001',
          },
          {
            id: '3',
            type: 'deposit',
            amount: 500000,
            description: 'Nạp điểm qua chuyển khoản ngân hàng',
            status: 'completed',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
            reference_id: 'DEP_001',
            payment_method: 'Bank Transfer',
          },
          {
            id: '4',
            type: 'withdraw',
            amount: -200000,
            description: 'Rút điểm về tài khoản ngân hàng',
            status: 'pending',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
            reference_id: 'WIT_001',
            payment_method: 'Bank Transfer',
          },
          {
            id: '5',
            type: 'transfer',
            amount: -50000,
            description: 'Chuyển điểm cho player3',
            status: 'completed',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
            reference_id: 'TRF_001',
            recipient: 'player3',
          },
          {
            id: '6',
            type: 'bonus',
            amount: 25000,
            description: 'Thưởng đăng ký thành viên mới',
            status: 'completed',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
            reference_id: 'BONUS_001',
          },
          {
            id: '7',
            type: 'refund',
            amount: 75000,
            description: 'Hoàn tiền thách đấu bị hủy',
            status: 'completed',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), // 6 days ago
            reference_id: 'REF_001',
          },
          {
            id: '8',
            type: 'deposit',
            amount: 300000,
            description: 'Nạp điểm qua Momo',
            status: 'failed',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
            reference_id: 'DEP_002',
            payment_method: 'Momo',
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  const filters = [
    { id: 'all', name: 'Tất cả', icon: <Filter className='h-4 w-4' /> },
    { id: 'deposit', name: 'Nạp điểm', icon: <Plus className='h-4 w-4' /> },
    { id: 'withdraw', name: 'Rút điểm', icon: <Minus className='h-4 w-4' /> },
    {
      id: 'transfer',
      name: 'Chuyển điểm',
      icon: <ArrowUpRight className='h-4 w-4' />,
    },
    {
      id: 'match_win',
      name: 'Thắng trận',
      icon: <ArrowUpRight className='h-4 w-4' />,
    },
    {
      id: 'challenge',
      name: 'Thách đấu',
      icon: <ArrowDownRight className='h-4 w-4' />,
    },
  ];

  const statusFilters = [
    { id: 'all', name: 'Tất cả trạng thái' },
    { id: 'completed', name: 'Hoàn thành' },
    { id: 'pending', name: 'Đang xử lý' },
    { id: 'failed', name: 'Thất bại' },
    { id: 'cancelled', name: 'Đã hủy' },
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <Plus className='h-4 w-4 text-green-600' />;
      case 'withdraw':
        return <Minus className='h-4 w-4 text-red-600' />;
      case 'transfer':
        return <ArrowUpRight className='h-4 w-4 text-blue-600' />;
      case 'match_win':
        return <ArrowUpRight className='h-4 w-4 text-green-600' />;
      case 'match_loss':
      case 'challenge':
        return <ArrowDownRight className='h-4 w-4 text-red-600' />;
      case 'refund':
      case 'bonus':
        return <Plus className='h-4 w-4 text-yellow-600' />;
      default:
        return <ArrowUpRight className='h-4 w-4 text-gray-600' />;
    }
  };

  const getTransactionTypeName = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Nạp điểm';
      case 'withdraw':
        return 'Rút điểm';
      case 'transfer':
        return 'Chuyển điểm';
      case 'match_win':
        return 'Thắng trận';
      case 'match_loss':
        return 'Thua trận';
      case 'challenge':
        return 'Thách đấu';
      case 'refund':
        return 'Hoàn tiền';
      case 'bonus':
        return 'Thưởng';
      default:
        return type;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className='h-4 w-4 text-green-600' />;
      case 'pending':
        return <Clock className='h-4 w-4 text-yellow-600' />;
      case 'failed':
        return <XCircle className='h-4 w-4 text-red-600' />;
      case 'cancelled':
        return <XCircle className='h-4 w-4 text-gray-600' />;
      default:
        return <AlertCircle className='h-4 w-4 text-gray-600' />;
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Đang xử lý';
      case 'failed':
        return 'Thất bại';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(Math.abs(amount));
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch =
        transaction.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.reference_id
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesTypeFilter =
        selectedFilter === 'all' || transaction.type === selectedFilter;
      const matchesStatusFilter =
        selectedStatus === 'all' || transaction.status === selectedStatus;

      return matchesSearch && matchesTypeFilter && matchesStatusFilter;
    })
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

  const exportTransactions = () => {
    // Export functionality
    // ...removed console.log('Exporting transactions...')
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Filters and Search */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Tìm kiếm giao dịch...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>

            <Button variant='outline' onClick={exportTransactions}>
              <Download className='h-4 w-4 mr-2' />
              Xuất báo cáo
            </Button>
          </div>

          <div className='flex flex-wrap gap-2 mt-4'>
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.icon}
                {filter.name}
              </button>
            ))}
          </div>

          <div className='flex flex-wrap gap-2 mt-2'>
            {statusFilters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setSelectedStatus(filter.id)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === filter.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lịch sử giao dịch ({filteredTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {filteredTransactions.map(transaction => (
              <div
                key={transaction.id}
                className='flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow'
              >
                {/* Transaction Icon */}
                <div className='p-2 bg-gray-100 rounded-full'>
                  {getTransactionIcon(transaction.type)}
                </div>

                {/* Transaction Details */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='font-medium'>
                      {getTransactionTypeName(transaction.type)}
                    </span>
                    <Badge
                      className={`text-xs ${getStatusColor(transaction.status)}`}
                    >
                      {getStatusName(transaction.status)}
                    </Badge>
                  </div>

                  <p className='text-sm text-gray-600 mb-1'>
                    {transaction.description}
                  </p>

                  <div className='flex items-center gap-4 text-xs text-gray-500'>
                    <div className='flex items-center gap-1'>
                      <Calendar className='h-3 w-3' />
                      <span>
                        {transaction.created_at.toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    {transaction.reference_id && (
                      <span>ID: {transaction.reference_id}</span>
                    )}
                    {transaction.payment_method && (
                      <span>PT: {transaction.payment_method}</span>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div className='text-right'>
                  <div
                    className={`text-lg font-bold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.amount > 0 ? '+' : ''}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              </div>
            ))}

            {filteredTransactions.length === 0 && (
              <div className='text-center py-8 text-gray-500'>
                Không tìm thấy giao dịch nào
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
