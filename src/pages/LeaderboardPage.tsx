
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, MapPin, Target, TrendingUp } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const LeaderboardPage = () => {
  const { data: players, isLoading } = useLeaderboard();

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">{position}</span>;
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'G+':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'G':
        return 'bg-gradient-to-r from-red-500 to-orange-500 text-white';
      case 'A+':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      case 'A':
        return 'bg-gradient-to-r from-green-500 to-teal-500 text-white';
      case 'B+':
        return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black';
      case 'B':
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Bảng Xếp Hạng</h1>
          <p className="text-xl text-gray-600">Xếp hạng các cao thủ bida hàng đầu Việt Nam</p>
        </div>

        {/* Top 3 Players */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {players?.slice(0, 3).map((player, index) => (
            <Card key={player.full_name} className={`relative overflow-hidden ${index === 0 ? 'md:order-2 transform md:scale-110' : index === 1 ? 'md:order-1' : 'md:order-3'}`}>
              <div className={`absolute top-0 left-0 right-0 h-2 ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'}`}></div>
              
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  {getRankIcon(index + 1)}
                </div>
                <CardTitle className="text-xl">{player.full_name}</CardTitle>
                <div className="flex justify-center">
                  <Badge className={getRankColor(player.current_rank)}>
                    {player.current_rank}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="text-center space-y-2">
                <div className="flex items-center justify-center text-2xl font-bold text-yellow-600">
                  <Target className="w-5 h-5 mr-1" />
                  {player.ranking_points}
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Thắng: {player.wins} | Thua: {player.losses}</div>
                  <div>Tỷ lệ thắng: {((player.wins / Math.max(player.total_matches, 1)) * 100).toFixed(1)}%</div>
                  <div className="flex items-center justify-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {player.location}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <TrendingUp className="w-6 h-6 mr-2" />
              Bảng Xếp Hạng Đầy Đủ
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-2">
              {players?.map((player, index) => (
                <div key={player.full_name} className={`flex items-center justify-between p-4 rounded-lg transition-colors ${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(index + 1)}
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold">{player.full_name}</h3>
                        <Badge className={getRankColor(player.current_rank)}>
                          {player.current_rank}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center space-x-4">
                        <span>Thắng: {player.wins}</span>
                        <span>Thua: {player.losses}</span>
                        <span>Tỷ lệ: {((player.wins / Math.max(player.total_matches, 1)) * 100).toFixed(1)}%</span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {player.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold text-yellow-600 flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      {player.ranking_points}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default LeaderboardPage;
