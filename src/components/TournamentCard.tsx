import React from 'react';
import { Calendar, MapPin, Users, Trophy, Coins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tournament, TOURNAMENT_TIERS } from '../types/tournament';
import { formatCurrency } from '../lib/utils';

interface TournamentCardProps {
  tournament: Tournament;
  onRegister?: (tournamentId: string) => void;
  onViewDetails?: (tournamentId: string) => void;
  isRegistered?: boolean;
  canRegister?: boolean;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onRegister,
  onViewDetails,
  isRegistered = false,
  canRegister = true
}) => {
  const tier = TOURNAMENT_TIERS.find(t => t.code === (tournament as any).tier_code);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'registration_open': return 'bg-green-100 text-green-800';
      case 'registration_closed': return 'bg-yellow-100 text-yellow-800';
      case 'ongoing': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (code: string) => {
    switch (code) {
      case 'G': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 'H': return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
      case 'I': return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
      case 'K': return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {tournament.name}
            </CardTitle>
            {tier && (
              <Badge className={`mt-2 ${getTierColor(tier.code)}`}>
                {tier.name}
              </Badge>
            )}
          </div>
          <Badge className={`ml-2 ${getStatusColor(tournament.status)}`}>
            {tournament.status === 'registration_open' && 'Đăng ký mở'}
            {tournament.status === 'registration_closed' && 'Đóng đăng ký'}
            {tournament.status === 'ongoing' && 'Đang diễn ra'}
            {tournament.status === 'completed' && 'Hoàn thành'}
            {tournament.status === 'cancelled' && 'Đã hủy'}
            {tournament.status === 'upcoming' && 'Sắp diễn ra'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tournament Info */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {formatDate(tournament.tournament_start)} - {formatTime(tournament.tournament_start)}
            </span>
          </div>
          
          {tournament.venue_address && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="line-clamp-1">{tournament.venue_address}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span>
              {tournament.current_participants}/{tournament.max_participants} người tham gia
            </span>
          </div>
        </div>

        {/* Prize Pool */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
              <span className="font-semibold text-yellow-800">Giải thưởng</span>
            </div>
            <span className="font-bold text-lg text-yellow-800">
              {formatCurrency(tournament.prize_pool)}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-yellow-700">🥇</div>
              <div className="text-yellow-600">{formatCurrency(tournament.first_prize)}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-600">🥈</div>
              <div className="text-gray-600">{formatCurrency(tournament.second_prize)}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-orange-600">🥉</div>
              <div className="text-orange-600">{formatCurrency(tournament.third_prize)}</div>
            </div>
          </div>
        </div>

        {/* ELO Points Info */}
        {tier && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Coins className="w-5 h-5 mr-2 text-blue-600" />
                <span className="font-semibold text-blue-800">Điểm ELO</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-semibold text-blue-700">🥇</div>
                <div className="text-blue-600">+{tier.elo_points.first}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-600">🥈</div>
                <div className="text-gray-600">+{tier.elo_points.second}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-orange-600">🥉</div>
                <div className="text-orange-600">+{tier.elo_points.third}</div>
              </div>
            </div>
            
            <div className="text-center mt-2 text-xs text-blue-600">
              Tham gia: +{tier.elo_points.participation} điểm
            </div>
          </div>
        )}

        {/* Entry Fee */}
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <span className="text-sm font-medium text-gray-700">Phí đăng ký:</span>
          <span className="font-bold text-lg text-gray-900">
            {formatCurrency(tournament.entry_fee)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onViewDetails && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onViewDetails(tournament.id)}
            >
              Chi tiết
            </Button>
          )}
          
          {canRegister && !isRegistered && tournament.status === 'registration_open' && onRegister && (
            <Button
              className="flex-1"
              onClick={() => onRegister(tournament.id)}
            >
              Đăng ký
            </Button>
          )}
          
          {isRegistered && (
            <Button
              variant="secondary"
              className="flex-1"
              disabled
            >
              Đã đăng ký
            </Button>
          )}
        </div>

        {/* Tournament Type Badge */}
        <div className="flex justify-center">
          <Badge variant="outline" className="text-xs">
            {tournament.tournament_type === 'single_elimination' && 'Loại trực tiếp'}
            {tournament.tournament_type === 'double_elimination' && 'Loại trực tiếp kép'}
            {tournament.tournament_type === 'round_robin' && 'Vòng tròn'}
            {tournament.tournament_type === 'swiss' && 'Hệ Thụy Sĩ'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentCard;
