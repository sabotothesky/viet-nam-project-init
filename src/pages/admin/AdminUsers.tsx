import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface UserProfile {
  user_id: string;
  full_name: string;
  nickname: string;
  email?: string;
  phone?: string;
  address: string | null;
  avatar_url: string | null;
  bio: string | null;
  date_of_birth: string | null;
  gender: string | null;
  current_rank: string | null;
  ranking_points: number | null;
  experience_years: number | null;
  club_id: string | null;
  created_at: string;
  updated_at: string;
  membership_type: string;
  membership_status: string;
  clubs?: { name: string };
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      user =>
        (user.nickname &&
          user.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.full_name &&
          user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email &&
          user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const loadUsers = async () => {
    try {
      // Get profiles with club information
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(
          `
          user_id,
          full_name,
          nickname,
          phone,
          address,
          avatar_url,
          bio,
          date_of_birth,
          gender,
          current_rank,
          ranking_points,
          experience_years,
          club_id,
          created_at,
          updated_at,
          clubs!profiles_club_id_fkey(name, phone)
        `
        )
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get memberships data
      const { data: membershipsData, error: membershipsError } = await supabase
        .from('memberships')
        .select('user_id, membership_type, status');

      // Transform and merge the data
      const transformedUsers =
        profilesData?.map(profile => {
          const membership = membershipsData?.find(
            m => m.user_id === profile.user_id
          );

          return {
            user_id: profile.user_id,
            full_name: profile.full_name || 'Unknown',
            nickname: profile.nickname || profile.full_name || 'Unknown',
            email: undefined, // Email not available through profiles table
            phone: profile.phone || undefined,
            address: profile.address,
            avatar_url: profile.avatar_url,
            bio: profile.bio,
            date_of_birth: profile.date_of_birth,
            gender: profile.gender,
            current_rank: profile.current_rank,
            ranking_points: profile.ranking_points,
            experience_years: profile.experience_years,
            club_id: profile.club_id,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
            membership_type: membership?.membership_type || 'free',
            membership_status: membership?.status || 'inactive',
            clubs:
              profile.clubs &&
              typeof profile.clubs === 'object' &&
              'name' in profile.clubs
                ? { name: profile.clubs.name }
                : undefined,
          };
        }) || [];

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <div className='mb-4'>
        <Input
          type='text'
          placeholder='Tìm kiếm người dùng...'
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <p>Đang tải người dùng...</p>
      ) : (
        <Table>
          <TableCaption>Danh sách người dùng</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nickname</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>SĐT</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Hạng</TableHead>
              <TableHead>Câu lạc bộ</TableHead>
              <TableHead>Loại thành viên</TableHead>
              <TableHead>Trạng thái thành viên</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.user_id}>
                <TableCell className='font-medium'>{user.nickname}</TableCell>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.phone || 'Không có'}</TableCell>
                <TableCell>{user.address || 'Không có'}</TableCell>
                <TableCell>{user.current_rank || 'Chưa có'}</TableCell>
                <TableCell>{user.clubs?.name || 'Chưa có'}</TableCell>
                <TableCell>
                  <Badge>{user.membership_type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge>{user.membership_status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminUsers;
