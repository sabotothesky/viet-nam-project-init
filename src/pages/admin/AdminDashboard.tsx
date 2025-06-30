import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Trophy, CreditCard, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Get user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get premium member count
      const { count: premiumCount } = await supabase
        .from('memberships')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .eq('membership_type', 'premium');

      // Get total revenue
      const { data: revenue } = await supabase
        .from('payment_transactions')
        .select('amount')
        .eq('status', 'success');

      const totalRevenue = revenue?.reduce((sum, t) => sum + t.amount, 0) || 0;

      // Get active tournaments
      const { count: tournamentCount } = await supabase
        .from('tournaments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ongoing');

      return {
        totalUsers: userCount || 0,
        activeMembers: premiumCount || 0,
        totalRevenue,
        activeTournaments: tournamentCount || 0,
      };
    },
  });

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>Đang tải...</div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Admin Dashboard</h1>
        <p className='text-gray-600'>Tổng quan hệ thống SABO POOL ARENA</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Tổng Users</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats?.totalUsers || 0}</div>
            <p className='text-xs text-muted-foreground'>
              Tổng số người dùng đăng ký
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Thành viên Premium
            </CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {stats?.activeMembers || 0}
            </div>
            <p className='text-xs text-muted-foreground'>
              Thành viên có gói premium
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Tổng Doanh Thu
            </CardTitle>
            <CreditCard className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {(stats?.totalRevenue || 0).toLocaleString('vi-VN')}đ
            </div>
            <p className='text-xs text-muted-foreground'>
              Tổng doanh thu từ thanh toán
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Giải Đấu Đang Diễn Ra
            </CardTitle>
            <Trophy className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {stats?.activeTournaments || 0}
            </div>
            <p className='text-xs text-muted-foreground'>
              Số giải đấu đang diễn ra
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span className='text-sm'>
                  User mới: Nguyễn Văn A đã đăng ký
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                <span className='text-sm'>Thanh toán thành công: 99,000đ</span>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                <span className='text-sm'>Giải đấu mới được tạo</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>
                  Tỷ lệ Premium/Free
                </span>
                <span className='text-sm font-medium'>
                  {stats?.totalUsers
                    ? Math.round((stats.activeMembers / stats.totalUsers) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>
                  Doanh thu trung bình/user
                </span>
                <span className='text-sm font-medium'>
                  {stats?.totalUsers
                    ? Math.round(
                        (stats?.totalRevenue || 0) / stats.totalUsers
                      ).toLocaleString('vi-VN')
                    : 0}
                  đ
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-600'>
                  Giải đấu hoạt động
                </span>
                <span className='text-sm font-medium'>
                  {stats?.activeTournaments || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
