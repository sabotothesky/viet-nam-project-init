import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Swords, 
  Clock, 
  MapPin, 
  Trophy, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Users,
  Target
} from 'lucide-react';
import { Challenge, getChallengeConfig } from '../types/challenge';
import { formatCurrency } from '../lib/utils';

interface ChallengeCardProps {
  challenge: Challenge;
  currentUserId?: string;
  onAccept?: (challengeId: string) => void;
  onDecline?: (challengeId: string) => void;
  onStart?: (challengeId: string) => void;
  onViewDetails?: (challengeId: string) => void;
  onVerify?: (challengeId: string) => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  currentUserId,
  onAccept,
  onDecline,
  onStart,
  onViewDetails,
  onVerify
}) => {
  const config = getChallengeConfig(challenge.bet_points);
  const isChallenger = currentUserId === challenge.challenger_id;
  const isOpponent = currentUserId === challenge.opponent_id;
  const canManage = isChallenger || isOpponent;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'ongoing': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ phản hồi';
      case 'accepted': return 'Đã chấp nhận';
      case 'declined': return 'Đã từ chối';
      case 'ongoing': return 'Đang diễn ra';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getVerificationText = (status: string) => {
    switch (status) {
      case 'verified': return 'Đã xác minh';
      case 'rejected': return 'Bị từ chối';
      default: return 'Chờ xác minh';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBetPointsColor = (betPoints: number) => {
    if (betPoints >= 600) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (betPoints >= 500) return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
    if (betPoints >= 400) return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
    if (betPoints >= 300) return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white';
    if (betPoints >= 200) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
    return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Swords className="w-5 h-5 text-red-600" />
              Thách Đấu
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(challenge.status)}>
                {getStatusText(challenge.status)}
              </Badge>
              <Badge className={getVerificationColor(challenge.verification_status)}>
                {getVerificationText(challenge.verification_status)}
              </Badge>
            </div>
          </div>
          <Badge className={getBetPointsColor(challenge.bet_points)}>
            {challenge.bet_points} điểm
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Players */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={challenge.challenger?.avatar_url} />
              <AvatarFallback>
                {challenge.challenger?.full_name?.charAt(0) || 'C'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-sm">
                {challenge.challenger?.full_name || 'Unknown'}
              </div>
              <div className="text-xs text-gray-600">
                {challenge.challenger?.current_rank || 'N/A'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">VS</span>
            <Swords className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-semibold text-sm">
                {challenge.opponent?.full_name || 'Unknown'}
              </div>
              <div className="text-xs text-gray-600">
                {challenge.opponent?.current_rank || 'N/A'}
              </div>
            </div>
            <Avatar className="w-10 h-10">
              <AvatarImage src={challenge.opponent?.avatar_url} />
              <AvatarFallback>
                {challenge.opponent?.full_name?.charAt(0) || 'O'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Challenge Configuration */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Target className="w-4 h-4 mr-2 text-blue-600" />
              <span className="font-semibold text-blue-800">Cấu hình thách đấu</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-blue-700 font-medium">Race to:</div>
              <div className="text-blue-600 font-bold">{challenge.race_to}</div>
            </div>
            <div>
              <div className="text-blue-700 font-medium">Chấp 1 hạng:</div>
              <div className="text-blue-600 font-bold">{challenge.handicap_1_rank}</div>
            </div>
            <div>
              <div className="text-blue-700 font-medium">Chấp 0.5 hạng:</div>
              <div className="text-blue-600 font-bold">{challenge.handicap_05_rank}</div>
            </div>
            <div>
              <div className="text-blue-700 font-medium">Điểm cược:</div>
              <div className="text-blue-600 font-bold">{challenge.bet_points}</div>
            </div>
          </div>
        </div>

        {/* Location and Time */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{challenge.club?.name || 'Unknown Club'}</span>
          </div>
          
          {challenge.scheduled_time && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>{formatDate(challenge.scheduled_time)}</span>
            </div>
          )}
        </div>

        {/* Result (if completed) */}
        {challenge.status === 'completed' && challenge.winner_id && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-green-600" />
                <span className="font-semibold text-green-800">Kết quả</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-green-800">
                  {challenge.challenger_score} - {challenge.opponent_score}
                </div>
                <div className="text-sm text-green-600">
                  Người thắng: {challenge.winner_id === challenge.challenger_id ? 
                    challenge.challenger?.full_name : challenge.opponent?.full_name}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {onViewDetails && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onViewDetails(challenge.id)}
            >
              Chi tiết
            </Button>
          )}
          
          {isOpponent && challenge.status === 'pending' && (
            <>
              {onAccept && (
                <Button
                  className="flex-1"
                  onClick={() => onAccept(challenge.id)}
                >
                  Chấp nhận
                </Button>
              )}
              {onDecline && (
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => onDecline(challenge.id)}
                >
                  Từ chối
                </Button>
              )}
            </>
          )}
          
          {canManage && challenge.status === 'accepted' && onStart && (
            <Button
              className="flex-1"
              onClick={() => onStart(challenge.id)}
            >
              Bắt đầu
            </Button>
          )}
          
          {challenge.status === 'completed' && challenge.verification_status === 'pending' && onVerify && (
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => onVerify(challenge.id)}
            >
              Xác minh
            </Button>
          )}
        </div>

        {/* Verification Status */}
        {challenge.verification_status === 'verified' && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Đã được xác minh bởi {challenge.verifier?.full_name}</span>
          </div>
        )}
        
        {challenge.verification_status === 'rejected' && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <XCircle className="w-4 h-4" />
            <span>Xác minh bị từ chối</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 