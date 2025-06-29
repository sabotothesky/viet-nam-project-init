import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Users, 
  Target, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Crown,
  Zap,
  Activity,
  Award,
  Database,
  Settings
} from 'lucide-react';
import MobileLayout from '../components/MobileLayout';
import { runQuickCheck } from '@/utils/quickDatabaseCheck';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    matchesPlayed: 0,
    matchesWon: 0,
    winRate: 0,
    currentRank: 'K1',
    rankingPoints: 0,
    challengesSent: 0,
    challengesReceived: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (!loading && user) {
      fetchUserData();
    }
  }, [user, loading, navigate]);

  const fetchUserData = async () => {
    // Simulate fetching user data
    setUserProfile({
      full_name: 'Nguyễn Văn A',
      current_rank: 'K2',
      ranking_points: 1250,
      matches_played: 45,
      matches_won: 32,
      avatar_url: null
    });

    setStats({
      matchesPlayed: 45,
      matchesWon: 32,
      winRate: 71,
      currentRank: 'K2',
      rankingPoints: 1250,
      challengesSent: 12,
      challengesReceived: 8
    });
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Chào mừng trở lại, {userProfile?.full_name || 'Người chơi'}!</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Trận đấu</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.matchesPlayed}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tỷ lệ thắng</p>
                    <p className="text-2xl font-bold text-green-600">{stats.winRate}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Hạng hiện tại</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.currentRank}</p>
                  </div>
                  <Award className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Điểm ranking</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.rankingPoints}</p>
                  </div>
                  <Target className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="activity">Hoạt động</TabsTrigger>
              <TabsTrigger value="quick-actions">Thao tác nhanh</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      Thống kê gần đây
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Trận thắng gần nhất</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        3-1 vs Nguyễn Văn B
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Thách đấu đã gửi</span>
                      <Badge variant="secondary">{stats.challengesSent}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Thách đấu nhận được</span>
                      <Badge variant="secondary">{stats.challengesReceived}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Crown className="w-5 h-5 mr-2" />
                      Gói hội viên
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <Badge className="bg-yellow-100 text-yellow-800 mb-2">
                        Free Plan
                      </Badge>
                      <p className="text-sm text-gray-600 mb-3">
                        Nâng cấp để có thêm quyền lợi
                      </p>
                      <Button 
                        onClick={() => navigate('/membership')}
                        className="w-full"
                      >
                        Nâng cấp Premium
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hoạt động gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Trophy className="w-5 h-5 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Thắng trận đấu</p>
                        <p className="text-xs text-gray-500">vs Nguyễn Văn B • 2 giờ trước</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Zap className="w-5 h-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Gửi thách đấu</p>
                        <p className="text-xs text-gray-500">đến Trần Văn C • 1 ngày trước</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Award className="w-5 h-5 text-purple-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Lên hạng</p>
                        <p className="text-xs text-gray-500">từ K3 lên K2 • 3 ngày trước</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quick-actions" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => navigate('/challenges')}
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                  variant="outline"
                >
                  <Zap className="w-6 h-6" />
                  <span className="text-sm">Tạo thách đấu</span>
                </Button>

                <Button 
                  onClick={() => navigate('/tournaments')}
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                  variant="outline"
                >
                  <Trophy className="w-6 h-6" />
                  <span className="text-sm">Tham gia giải đấu</span>
                </Button>

                <Button 
                  onClick={() => navigate('/clubs')}
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                  variant="outline"
                >
                  <MapPin className="w-6 h-6" />
                  <span className="text-sm">Tìm CLB</span>
                </Button>

                <Button 
                  onClick={() => navigate('/profile')}
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                  variant="outline"
                >
                  <Users className="w-6 h-6" />
                  <span className="text-sm">Cập nhật hồ sơ</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Database Health Check */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Kiểm tra trạng thái database và kết nối
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      console.log('🔍 Mở Console (F12) để xem kết quả kiểm tra database');
                      runQuickCheck();
                    }}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Kiểm tra Database
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('/database-setup', '_blank')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Database Setup
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('/system-health', '_blank')}
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    System Health
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Dashboard;
