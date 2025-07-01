
import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, UserCheck, UserX, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

const AdminUsers = () => {
  const { data: isAdmin, isLoading: adminLoading } = useAdminCheck();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock users data
  const users = [
    {
      id: '1',
      full_name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0901234567',
      current_rank: 'A+',
      ranking_points: 2500,
      status: 'active',
      role: 'user',
      created_at: '2024-01-15T00:00:00Z',
      last_active: '2024-01-20T10:30:00Z',
    },
    {
      id: '2',
      full_name: 'Trần Thị B',
      email: 'tranthib@email.com',
      phone: '0987654321',
      current_rank: 'B+',
      ranking_points: 1800,
      status: 'active',
      role: 'premium',
      created_at: '2024-01-10T00:00:00Z',
      last_active: '2024-01-20T09:15:00Z',
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
      case 'banned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    return role === 'premium' ? <Crown className='w-4 h-4' /> : null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Quản Lý Người Dùng</h1>
            <p className='text-gray-600'>Quản lý thông tin và trạng thái người dùng</p>
          </div>
        </div>

        <div className='flex gap-4'>
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <Input
              placeholder='Tìm kiếm người dùng...'
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
              <SelectItem value='inactive'>Không hoạt động</SelectItem>
              <SelectItem value='banned'>Đã khóa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách người dùng</CardTitle>
            <CardDescription>Tổng cộng {users.length} người dùng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {users.map((user) => (
                <div
                  key={user.id}
                  className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50'
                >
                  <div className='flex items-center space-x-4'>
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.full_name}`} />
                      <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className='flex items-center space-x-2'>
                        <h3 className='font-medium'>{user.full_name}</h3>
                        {getRoleIcon(user.role)}
                      </div>
                      <p className='text-sm text-gray-500'>{user.email}</p>
                      <p className='text-sm text-gray-500'>{user.phone}</p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-4'>
                    <div className='text-right'>
                      <Badge className='mb-1'>{user.current_rank}</Badge>
                      <p className='text-sm text-gray-500'>{user.ranking_points} điểm</p>
                    </div>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status === 'active' ? 'Hoạt động' : 
                       user.status === 'inactive' ? 'Không hoạt động' : 'Đã khóa'}
                    </Badge>
                    <div className='text-right text-sm text-gray-500'>
                      <p>Tham gia: {formatDate(user.created_at)}</p>
                      <p>Hoạt động: {formatDate(user.last_active)}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='sm'>
                          <MoreHorizontal className='w-4 h-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <UserCheck className='w-4 h-4 mr-2' />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserX className='w-4 h-4 mr-2' />
                          Khóa tài khoản
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
