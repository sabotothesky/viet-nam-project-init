
import React, { useState } from 'react';
import { Plus, Search, MapPin, Phone, Clock, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/components/AdminLayout';
import { useAdminCheck } from '@/hooks/useAdminCheck';

const AdminClubs = () => {
  const { data: isAdmin, isLoading: adminLoading } = useAdminCheck();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock clubs data
  const clubs = [
    {
      id: '1',
      name: 'Diamond Pool Club',
      address: '123 Nguyễn Huệ, Q.1, TP.HCM',
      phone: '028-1234-5678',
      email: 'info@diamondpool.com',
      table_count: 12,
      available_tables: 8,
      hourly_rate: 50000,
      status: 'active',
      is_sabo_owned: true,
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Golden Cue Billiards',
      address: '456 Lê Lợi, Q.3, TP.HCM',
      phone: '028-9876-5432',
      email: 'contact@goldencue.com',
      table_count: 8,
      available_tables: 5,
      hourly_rate: 40000,
      status: 'active',
      is_sabo_owned: false,
      created_at: '2024-01-05T00:00:00Z',
    },
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Quản Lý Câu Lạc Bộ</h1>
            <p className='text-gray-600'>Quản lý thông tin các câu lạc bộ bida</p>
          </div>
          <Button className='gap-2'>
            <Plus className='w-4 h-4' />
            Thêm CLB Mới
          </Button>
        </div>

        <div className='flex gap-4'>
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <Input
              placeholder='Tìm kiếm câu lạc bộ...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10'
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-48'>
              <SelectValue placeholder='Trạng thái' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tất cả</SelectItem>
              <SelectItem value='active'>Hoạt động</SelectItem>
              <SelectItem value='inactive'>Tạm dừng</SelectItem>
              <SelectItem value='pending'>Chờ duyệt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {clubs.map((club) => (
            <Card key={club.id} className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <div className='flex justify-between items-start mb-2'>
                  <CardTitle className='text-xl'>{club.name}</CardTitle>
                  <div className='flex gap-2'>
                    <Badge className={getStatusColor(club.status)}>
                      {club.status === 'active' ? 'Hoạt động' : 
                       club.status === 'inactive' ? 'Tạm dừng' : 'Chờ duyệt'}
                    </Badge>
                    {club.is_sabo_owned && (
                      <Badge variant='outline'>SABO</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className='space-y-4'>
                <div className='space-y-2 text-sm'>
                  <div className='flex items-center text-gray-600'>
                    <MapPin className='w-4 h-4 mr-2' />
                    <span>{club.address}</span>
                  </div>
                  <div className='flex items-center text-gray-600'>
                    <Phone className='w-4 h-4 mr-2' />
                    <span>{club.phone}</span>
                  </div>
                  <div className='flex items-center text-gray-600'>
                    <Clock className='w-4 h-4 mr-2' />
                    <span>{formatPrice(club.hourly_rate)}/giờ</span>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-gray-600'>Tổng bàn:</span>
                    <span className='font-medium ml-2'>{club.table_count}</span>
                  </div>
                  <div>
                    <span className='text-gray-600'>Bàn trống:</span>
                    <span className='font-medium ml-2 text-green-600'>{club.available_tables}</span>
                  </div>
                </div>

                <div className='flex gap-2'>
                  <Button variant='outline' size='sm' className='flex-1'>
                    Xem chi tiết
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline' size='sm'>
                        <MoreHorizontal className='w-4 h-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                      <DropdownMenuItem>Xem thống kê</DropdownMenuItem>
                      <DropdownMenuItem className='text-red-600'>
                        Tạm dừng hoạt động
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminClubs;
