
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Trophy, Building2, CreditCard, BarChart3, TrendingUp } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useAdminCheck } from '@/hooks/useAdminCheck';

const AdminDashboard = () => {
  const { data: isAdmin, isLoading: adminLoading } = useAdminCheck();

  if (adminLoading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>Access Denied</h2>
            <p className='text-gray-600'>You don't have permission to access this page.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const stats = [
    {
      title: 'Tổng người dùng',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Giải đấu đang diễn ra',
      value: '15',
      change: '+5%',
      icon: Trophy,
      color: 'text-yellow-600',
    },
    {
      title: 'Câu lạc bộ',
      value: '89',
      change: '+8%',
      icon: Building2,
      color: 'text-green-600',
    },
    {
      title: 'Doanh thu tháng',
      value: '125M VND',
      change: '+18%',
      icon: CreditCard,
      color: 'text-purple-600',
    },
  ];

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Admin Dashboard</h1>
          <p className='text-gray-600'>Tổng quan hệ thống SABO Pool Arena</p>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{stat.value}</div>
                  <div className='flex items-center text-xs text-green-600'>
                    <TrendingUp className='h-3 w-3 mr-1' />
                    {stat.change} so với tháng trước
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
              <CardDescription>Các sự kiện quan trọng trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center space-x-3'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                  <p className='text-sm'>Giải đấu mùa xuân 2024 được tạo</p>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  <p className='text-sm'>CLB Diamond Pool đã xác minh</p>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                  <p className='text-sm'>50 người dùng mới đăng ký hôm nay</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thống kê nhanh</CardTitle>
              <CardDescription>Dữ liệu quan trọng trong 30 ngày qua</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Tỷ lệ hoạt động</span>
                  <span className='text-sm font-medium'>85%</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Số trận đấu</span>
                  <span className='text-sm font-medium'>2,847</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-gray-600'>Tổng giải thưởng</span>
                  <span className='text-sm font-medium'>450M VND</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
