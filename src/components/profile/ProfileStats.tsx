
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, TrendingUp, Zap } from 'lucide-react';

interface ProfileStatsProps {
  profile: {
    current_rank: string;
    ranking_points: number;
    total_matches: number;
    wins: number;
    losses: number;
    win_rate: number;
    current_streak: number;
  };
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ profile }) => {
  const winRate = profile.total_matches > 0 
    ? Math.round((profile.wins / profile.total_matches) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Main Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Thành tích thi đấu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {profile.current_rank}
            </Badge>
            <p className="text-sm text-gray-500 mt-1">Hạng hiện tại</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {profile.ranking_points}
              </div>
              <div className="text-sm text-gray-500">Điểm ranking</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {winRate}%
              </div>
              <div className="text-sm text-gray-500">Tỷ lệ thắng</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-semibold">
                {profile.total_matches}
              </div>
              <div className="text-sm text-gray-500">Tổng trận</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-green-600">
                {profile.wins}
              </div>
              <div className="text-sm text-gray-500">Thắng</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-red-600">
                {profile.losses}
              </div>
              <div className="text-sm text-gray-500">Thua</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streak Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Streak hiện tại
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {profile.current_streak}
            </div>
            <div className="text-sm text-gray-500">
              {profile.current_streak > 0 ? 'Trận thắng liên tiếp' : 'Trận thua liên tiếp'}
            </div>
            {profile.current_streak > 0 && (
              <div className="mt-2">
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Hot streak!
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
