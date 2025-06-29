
import React from 'react';
import { ArrowRight, Trophy, Users, Star, MapPin, Calendar, Sword } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import StatsSection from '@/components/StatsSection';
import { useTournaments } from '@/hooks/useTournaments';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { usePublicChallenges } from '@/hooks/useChallenges';
import { usePosts } from '@/hooks/usePosts';
import { Link } from 'react-router-dom';

const Index = () => {
  const { tournaments } = useTournaments();
  const { data: topPlayers } = useLeaderboard();
  const { data: recentChallenges } = usePublicChallenges();
  const { data: latestPosts } = usePosts();

  const upcomingTournaments = tournaments?.filter(t => t.status === 'registration_open').slice(0, 3) || [];
  const topRankedPlayers = topPlayers?.slice(0, 5) || [];
  const publicChallenges = recentChallenges?.slice(0, 3) || [];
  const featuredPosts = latestPosts?.slice(0, 3) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrize = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Stats Section */}
      <StatsSection />

      {/* Tournaments Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Giải Đấu Sắp Tới</h2>
              <p className="text-gray-600">Tham gia các giải đấu hấp dẫn và thể hiện kỹ năng</p>
            </div>
            <Link to="/tournaments">
              <Button variant="outline" className="gap-2">
                Xem Tất Cả <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingTournaments.map((tournament) => (
              <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{tournament.name}</CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      Đang mở đăng ký
                    </Badge>
                  </div>
                  <CardDescription>{tournament.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(tournament.start_date)}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Trophy className="w-4 h-4 mr-2" />
                    {formatPrize(tournament.prize_pool)}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {tournament.current_participants}/{tournament.max_participants} người tham gia
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold">
                    Đăng Ký Ngay
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Bảng Xếp Hạng</h2>
              <p className="text-gray-600">Top cao thủ bida hàng đầu Việt Nam</p>
            </div>
            <Link to="/leaderboard">
              <Button variant="outline" className="gap-2">
                Xem Bảng Xếp Hạng <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="divide-y">
              {topRankedPlayers.map((player, index) => (
                <div key={index} className="p-6 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{player.full_name}</h3>
                      <p className="text-sm text-gray-600">{player.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{player.current_rank}</Badge>
                      <span className="font-bold text-yellow-600">{player.ranking_points} điểm</span>
                    </div>
                    <p className="text-sm text-gray-600">{player.wins}W - {player.losses}L</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Challenges Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Thách Đấu Gần Đây</h2>
              <p className="text-gray-600">Những trận thách đấu hấp dẫn đang diễn ra</p>
            </div>
            <Link to="/challenges">
              <Button variant="outline" className="gap-2">
                Xem Tất Cả <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publicChallenges.map((challenge) => (
              <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center">
                      <Sword className="w-4 h-4 mr-2 text-red-500" />
                      Thách Đấu
                    </CardTitle>
                    <Badge variant="outline">Chờ phản hồi</Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{challenge.challenger?.full_name}</span>
                    <Badge variant="secondary">{challenge.challenger?.current_rank}</Badge>
                  </div>
                  
                  <div className="text-center py-2">
                    <span className="text-2xl">⚔️</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{challenge.challenged?.full_name}</span>
                    <Badge variant="secondary">{challenge.challenged?.current_rank}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center text-yellow-600 font-bold">
                      <Star className="w-4 h-4 mr-1" />
                      {challenge.bet_points} điểm
                    </div>
                    
                    {challenge.proposed_club && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {challenge.proposed_club.name}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Tin Tức & Bài Viết</h2>
              <p className="text-gray-600">Cập nhật thông tin mới nhất về thế giới bida</p>
            </div>
            <Link to="/blog">
              <Button variant="outline" className="gap-2">
                Xem Tất Cả <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                {post.featured_image && (
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${post.featured_image})` }} />
                )}
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <span className="text-sm text-gray-500">
                      {formatDate(post.published_at || post.created_at)}
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Bởi {post.author?.full_name || 'SABO'}
                    </span>
                    <Button variant="ghost" size="sm">
                      Đọc thêm <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
