import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Edit,
  Settings,
  Trophy,
  Target,
  Users,
  Calendar,
  MapPin,
  Star,
  TrendingUp,
  Award,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
} from 'lucide-react';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { ProfileTimeline } from '@/components/profile/ProfileTimeline';
import { ProfileAchievements } from '@/components/profile/ProfileAchievements';
import { ProfileMatches } from '@/components/profile/ProfileMatches';
import { ProfileSettings } from '@/components/profile/ProfileSettings';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  cover_image_url?: string;
  bio?: string;
  location?: string;
  rank: string;
  rating: number;
  join_date: Date;
  is_verified: boolean;
  is_online: boolean;
  last_seen: Date;

  // Stats
  total_matches: number;
  wins: number;
  losses: number;
  win_rate: number;
  total_earnings: number;
  achievements_count: number;
  followers_count: number;
  following_count: number;

  // Social
  is_following: boolean;
  is_friend: boolean;

  // Preferences
  privacy_level: 'public' | 'friends' | 'private';
  notifications_enabled: boolean;
}

export interface ProfilePost {
  id: string;
  type: 'post' | 'achievement' | 'match_result' | 'event';
  content: string;
  created_at: Date;
  likes_count: number;
  comments_count: number;
  images?: string[];

  // Achievement specific
  achievement?: {
    title: string;
    description: string;
    icon: string;
    points: number;
  };

  // Match result specific
  match_result?: {
    opponent: string;
    result: 'win' | 'loss' | 'draw';
    score: string;
    rating_change: number;
  };

  // Event specific
  event?: {
    title: string;
    date: Date;
    location: string;
  };
}

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  // ...existing code...

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setProfile({
          id: '1',
          username: username || 'player1',
          email: 'player1@example.com',
          avatar_url: '/avatars/player1.jpg',
          cover_image_url: '/covers/player1-cover.jpg',
          bio: 'Pool player passionate about the game. Always looking for new challenges and opportunities to improve my skills.',
          location: 'Hà Nội, Việt Nam',
          rank: 'A+',
          rating: 1850,
          join_date: new Date('2023-01-15'),
          is_verified: true,
          is_online: true,
          last_seen: new Date(),

          total_matches: 156,
          wins: 98,
          losses: 58,
          win_rate: 62.8,
          total_earnings: 2500000,
          achievements_count: 12,
          followers_count: 245,
          following_count: 89,

          is_following: false,
          is_friend: false,

          privacy_level: 'public',
          notifications_enabled: true,
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  const handleFollow = () => {
    if (profile) {
      setProfile(prev =>
        prev
          ? {
              ...prev,
              is_following: !prev.is_following,
              followers_count: prev.is_following
                ? prev.followers_count - 1
                : prev.followers_count + 1,
            }
          : null
      );
    }
  };

  const handleMessage = () => {
    // Navigate to chat with this user
    navigate(`/chat/${profile?.id}`);
  };

  const handleShare = () => {
    // Share profile
    navigator.clipboard.writeText(window.location.href);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Không tìm thấy người dùng
          </h2>
          <p className='text-gray-600 mb-4'>
            Người dùng này không tồn tại hoặc đã bị xóa.
          </p>
          <Button onClick={() => navigate('/')}>Về trang chủ</Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Cover Image */}
      <div className='relative h-48 md:h-64 bg-gradient-to-r from-blue-500 to-purple-600'>
        {profile.cover_image_url && (
          <img
            src={profile.cover_image_url}
            alt='Cover'
            className='w-full h-full object-cover'
          />
        )}
        <div className='absolute inset-0 bg-black bg-opacity-30'></div>

        {/* Back Button */}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => navigate(-1)}
          className='absolute top-4 left-4 text-white hover:bg-white hover:bg-opacity-20'
        >
          ← Quay lại
        </Button>
      </div>

      {/* Profile Header */}
      <div className='relative px-4 md:px-6 lg:px-8 -mt-16'>
        <div className='max-w-4xl mx-auto'>
          <Card className='mb-6'>
            <CardContent className='pt-6'>
              <div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
                {/* Avatar */}
                <div className='relative'>
                  <Avatar className='h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-lg'>
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className='text-2xl'>
                      {profile.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  {profile.is_online && (
                    <div className='absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full'></div>
                  )}
                </div>

                {/* Profile Info */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-3 mb-2'>
                    <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
                      {profile.username}
                    </h1>
                    {profile.is_verified && (
                      <Badge
                        variant='secondary'
                        className='bg-blue-100 text-blue-800'
                      >
                        <Star className='h-3 w-3 mr-1' />
                        Đã xác thực
                      </Badge>
                    )}
                    <Badge
                      variant='outline'
                      className='bg-yellow-100 text-yellow-800'
                    >
                      {profile.rank}
                    </Badge>
                  </div>

                  <div className='flex items-center gap-4 text-sm text-gray-600 mb-3'>
                    <div className='flex items-center gap-1'>
                      <MapPin className='h-4 w-4' />
                      <span>{profile.location}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Calendar className='h-4 w-4' />
                      <span>
                        Tham gia{' '}
                        {new Date(profile.join_date).toLocaleDateString(
                          'vi-VN'
                        )}
                      </span>
                    </div>
                  </div>

                  {profile.bio && (
                    <p className='text-gray-700 mb-4 max-w-2xl'>
                      {profile.bio}
                    </p>
                  )}

                  {/* Stats Section */}
                  <ProfileStats 
                    stats={{
                      current_rank: profile?.current_rank || 'K1',
                      ranking_points: profile?.ranking_points || 0,
                      total_matches: profile?.total_matches || 0,
                      wins: profile?.wins || 0,
                      losses: profile?.losses || 0,
                      win_rate: profile?.total_matches ? (profile.wins / profile.total_matches) * 100 : 0,
                      current_streak: profile?.current_streak || 0,
                    }} 
                  />

                  {/* Action Buttons */}
                  <div className='flex items-center gap-2'>
                    <Button
                      variant={profile.is_following ? 'outline' : 'default'}
                      onClick={handleFollow}
                      className='flex items-center gap-2'
                    >
                      <Users className='h-4 w-4' />
                      {profile.is_following ? 'Đang theo dõi' : 'Theo dõi'}
                    </Button>

                    <Button
                      variant='outline'
                      onClick={handleMessage}
                      className='flex items-center gap-2'
                    >
                      <MessageCircle className='h-4 w-4' />
                      Nhắn tin
                    </Button>

                    <Button
                      variant='outline'
                      onClick={handleShare}
                      className='flex items-center gap-2'
                    >
                      <Share2 className='h-4 w-4' />
                      Chia sẻ
                    </Button>

                    <Button variant='ghost' size='sm'>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='space-y-6'
          >
            <TabsList className='grid w-full grid-cols-5'>
              <TabsTrigger value='overview'>Tổng quan</TabsTrigger>
              <TabsTrigger value='timeline'>Dòng thời gian</TabsTrigger>
              <TabsTrigger value='achievements'>Thành tích</TabsTrigger>
              <TabsTrigger value='matches'>Trận đấu</TabsTrigger>
              <TabsTrigger value='settings'>Cài đặt</TabsTrigger>
            </TabsList>

            <TabsContent value='overview' className='space-y-6'>
              <ProfileStats profile={profile} />
            </TabsContent>

            <TabsContent value='timeline' className='space-y-6'>
              <ProfileTimeline userId={profile.id} />
            </TabsContent>

            <TabsContent value='achievements' className='space-y-6'>
              <ProfileAchievements userId={profile.id} />
            </TabsContent>

            <TabsContent value='matches' className='space-y-6'>
              <ProfileMatches userId={profile.id} />
            </TabsContent>

            <TabsContent value='settings' className='space-y-6'>
              <ProfileSettings profile={profile} onUpdate={setProfile} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
