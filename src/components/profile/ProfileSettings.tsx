import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Settings,
  User,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Camera,
  Save,
  X,
  Edit,
} from 'lucide-react';
import type { UserProfile } from '@/pages/ProfilePage';

interface ProfileSettingsProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profile,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: profile.username,
    bio: profile.bio || '',
    location: profile.location || '',
    privacy_level: profile.privacy_level,
    notifications_enabled: profile.notifications_enabled,
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedProfile = {
        ...profile,
        ...formData,
      };

      onUpdate(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: profile.username,
      bio: profile.bio || '',
      location: profile.location || '',
      privacy_level: profile.privacy_level,
      notifications_enabled: profile.notifications_enabled,
    });
    setIsEditing(false);
  };

  const privacyOptions = [
    {
      value: 'public',
      label: 'Công khai',
      description: 'Tất cả mọi người có thể xem hồ sơ của bạn',
      icon: <Eye className='h-4 w-4' />,
    },
    {
      value: 'friends',
      label: 'Bạn bè',
      description: 'Chỉ bạn bè có thể xem hồ sơ của bạn',
      icon: <User className='h-4 w-4' />,
    },
    {
      value: 'private',
      label: 'Riêng tư',
      description: 'Chỉ bạn có thể xem hồ sơ của bạn',
      icon: <EyeOff className='h-4 w-4' />,
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <User className='h-5 w-5' />
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Avatar Section */}
          <div className='flex items-center gap-4'>
            <div className='relative'>
              <Avatar className='h-20 w-20'>
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className='text-xl'>
                  {profile.username[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                size='sm'
                variant='outline'
                className='absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0'
              >
                <Camera className='h-4 w-4' />
              </Button>
            </div>
            <div>
              <h3 className='font-medium'>Ảnh đại diện</h3>
              <p className='text-sm text-gray-600'>
                Thay đổi ảnh đại diện của bạn
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Tên người dùng
              </label>
              {isEditing ? (
                <Input
                  value={formData.username}
                  onChange={e =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder='Nhập tên người dùng'
                />
              ) : (
                <div className='flex items-center gap-2'>
                  <span className='text-gray-900'>{profile.username}</span>
                  <Badge
                    variant='outline'
                    className='bg-blue-100 text-blue-800'
                  >
                    Đã xác thực
                  </Badge>
                </div>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Địa điểm
              </label>
              {isEditing ? (
                <Input
                  value={formData.location}
                  onChange={e =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder='Nhập địa điểm'
                />
              ) : (
                <span className='text-gray-900'>
                  {profile.location || 'Chưa cập nhật'}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Giới thiệu
            </label>
            {isEditing ? (
              <Textarea
                value={formData.bio}
                onChange={e =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder='Viết giới thiệu về bản thân...'
                rows={3}
              />
            ) : (
              <p className='text-gray-900'>
                {profile.bio || 'Chưa có giới thiệu'}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing ? (
            <div className='flex gap-2'>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                  <div className='flex items-center gap-2'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                    Đang lưu...
                  </div>
                ) : (
                  <>
                    <Save className='h-4 w-4 mr-2' />
                    Lưu thay đổi
                  </>
                )}
              </Button>
              <Button variant='outline' onClick={handleCancel}>
                <X className='h-4 w-4 mr-2' />
                Hủy
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className='h-4 w-4 mr-2' />
              Chỉnh sửa
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Shield className='h-5 w-5' />
            Cài đặt quyền riêng tư
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {privacyOptions.map(option => (
              <div
                key={option.value}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  formData.privacy_level === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() =>
                  setFormData({
                    ...formData,
                    privacy_level: option.value as any,
                  })
                }
              >
                <div
                  className={`p-2 rounded-full ${
                    formData.privacy_level === option.value
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {option.icon}
                </div>
                <div className='flex-1'>
                  <div className='font-medium'>{option.label}</div>
                  <div className='text-sm text-gray-600'>
                    {option.description}
                  </div>
                </div>
                {formData.privacy_level === option.value && (
                  <div className='w-4 h-4 bg-blue-500 rounded-full'></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Bell className='h-5 w-5' />
            Cài đặt thông báo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='font-medium'>Thông báo đẩy</div>
                <div className='text-sm text-gray-600'>
                  Nhận thông báo về thách đấu, tin nhắn và hoạt động
                </div>
              </div>
              <Switch
                checked={formData.notifications_enabled}
                onCheckedChange={checked =>
                  setFormData({ ...formData, notifications_enabled: checked })
                }
              />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <div className='font-medium'>Thông báo email</div>
                <div className='text-sm text-gray-600'>
                  Nhận thông báo qua email
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <div className='font-medium'>Thông báo SMS</div>
                <div className='text-sm text-gray-600'>
                  Nhận thông báo qua tin nhắn SMS
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Settings className='h-5 w-5' />
            Thông tin tài khoản
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <div>
                <div className='font-medium'>Email</div>
                <div className='text-sm text-gray-600'>{profile.email}</div>
              </div>
              <Badge variant='outline' className='bg-green-100 text-green-800'>
                Đã xác thực
              </Badge>
            </div>

            <div className='flex justify-between items-center'>
              <div>
                <div className='font-medium'>Ngày tham gia</div>
                <div className='text-sm text-gray-600'>
                  {profile.join_date.toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>

            <div className='flex justify-between items-center'>
              <div>
                <div className='font-medium'>Hạng hiện tại</div>
                <div className='text-sm text-gray-600'>{profile.rank}</div>
              </div>
              <Badge
                variant='outline'
                className='bg-yellow-100 text-yellow-800'
              >
                {profile.rating} điểm
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className='border-red-200'>
        <CardHeader>
          <CardTitle className='text-red-600'>Khu vực nguy hiểm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <div>
                <div className='font-medium text-red-600'>Xóa tài khoản</div>
                <div className='text-sm text-gray-600'>
                  Xóa vĩnh viễn tài khoản và tất cả dữ liệu
                </div>
              </div>
              <Button variant='destructive' size='sm'>
                Xóa tài khoản
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
