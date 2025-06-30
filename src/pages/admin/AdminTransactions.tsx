import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';

const AdminTransactions = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      const { data: transactionsData, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user profiles separately to avoid relation issues
      const userIds = transactionsData?.map(t => t.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);

      // Combine the data
      const transactionsWithUsers = (transactionsData || []).map(
        transaction => {
          const profile = profilesData?.find(
            p => p.user_id === transaction.user_id
          );
          return {
            ...transaction,
            user_name: profile?.full_name || 'Unknown User',
          };
        }
      );

      return transactionsWithUsers;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Thành công';
      case 'pending':
        return 'Đang xử lý';
      case 'failed':
        return 'Thất bại';
      default:
        return 'Không xác định';
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>Đang tải...</div>
    );
  }

  const totalRevenue =
    transactions
      ?.filter(t => t.status === 'success')
      .reduce((sum, t) => sum + t.amount, 0) || 0;

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Quản lý Giao dịch
          </h1>
          <p className='text-gray-600'>Theo dõi tất cả giao dịch thanh toán</p>
        </div>
        <Button className='gap-2'>
          <Download className='h-4 w-4' />
          Xuất báo cáo
        </Button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='p-4'>
          <div className='text-2xl font-bold text-green-600'>
            {totalRevenue.toLocaleString('vi-VN')}đ
          </div>
          <div className='text-sm text-gray-600'>Tổng doanh thu</div>
        </Card>
        <Card className='p-4'>
          <div className='text-2xl font-bold'>
            {transactions?.filter(t => t.status === 'success').length || 0}
          </div>
          <div className='text-sm text-gray-600'>Giao dịch thành công</div>
        </Card>
        <Card className='p-4'>
          <div className='text-2xl font-bold text-yellow-600'>
            {transactions?.filter(t => t.status === 'pending').length || 0}
          </div>
          <div className='text-sm text-gray-600'>Đang xử lý</div>
        </Card>
        <Card className='p-4'>
          <div className='text-2xl font-bold text-red-600'>
            {transactions?.filter(t => t.status === 'failed').length || 0}
          </div>
          <div className='text-sm text-gray-600'>Thất bại</div>
        </Card>
      </div>

      {/* Transactions List */}
      <Card>
        <div className='p-4 border-b'>
          <h3 className='font-medium'>Danh sách giao dịch</h3>
        </div>
        <div className='divide-y'>
          {transactions?.map(transaction => (
            <div
              key={transaction.id}
              className='p-4 flex items-center justify-between'
            >
              <div className='flex items-center gap-4'>
                <div>
                  <p className='font-medium'>{transaction.transaction_ref}</p>
                  <p className='text-sm text-gray-600'>
                    {transaction.user_name}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {new Date(transaction.created_at).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-4'>
                <div className='text-right'>
                  <div className='font-medium'>
                    {transaction.amount.toLocaleString('vi-VN')}{' '}
                    {transaction.currency}
                  </div>
                  <div className='text-sm text-gray-600 capitalize'>
                    {transaction.payment_method}
                  </div>
                </div>

                <Badge className={getStatusColor(transaction.status)}>
                  {getStatusText(transaction.status)}
                </Badge>

                <Button variant='outline' size='sm'>
                  <Eye className='h-4 w-4' />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {transactions?.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-gray-500'>Chưa có giao dịch nào</p>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;
