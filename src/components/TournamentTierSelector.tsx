import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, Coins, Users } from 'lucide-react';
import { TournamentTier, TOURNAMENT_TIERS } from '../types/tournament';

interface TournamentTierSelectorProps {
  selectedTier?: string;
  onTierSelect: (tierCode: string) => void;
  disabled?: boolean;
}

export const TournamentTierSelector: React.FC<TournamentTierSelectorProps> = ({
  selectedTier,
  onTierSelect,
  disabled = false,
}) => {
  const getTierColor = (code: string) => {
    switch (code) {
      case 'G':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 'H':
        return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
      case 'I':
        return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
      case 'K':
        return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getTierBorderColor = (code: string) => {
    switch (code) {
      case 'G':
        return 'border-yellow-400';
      case 'H':
        return 'border-blue-400';
      case 'I':
        return 'border-green-400';
      case 'K':
        return 'border-purple-400';
      default:
        return 'border-gray-400';
    }
  };

  return (
    <div className='space-y-4'>
      <div className='text-center'>
        <h3 className='text-lg font-semibold mb-2'>Chọn hạng giải đấu</h3>
        <p className='text-sm text-gray-600'>
          Mỗi hạng có mức điểm ELO và phí đăng ký khác nhau
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {TOURNAMENT_TIERS.map(tier => (
          <Card
            key={tier.code}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTier === tier.code
                ? `ring-2 ring-blue-500 ${getTierBorderColor(tier.code)}`
                : 'hover:border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !disabled && onTierSelect(tier.code)}
          >
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <Trophy className='w-5 h-5' />
                  {tier.name}
                </CardTitle>
                <Badge className={getTierColor(tier.code)}>
                  Hạng {tier.code}
                </Badge>
              </div>
              <p className='text-sm text-gray-600'>{tier.description}</p>
            </CardHeader>

            <CardContent className='space-y-4'>
              {/* ELO Points */}
              <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg'>
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center'>
                    <Coins className='w-4 h-4 mr-2 text-blue-600' />
                    <span className='font-semibold text-blue-800'>
                      Điểm ELO
                    </span>
                  </div>
                </div>

                <div className='grid grid-cols-3 gap-2 text-xs'>
                  <div className='text-center'>
                    <div className='font-semibold text-blue-700'>🥇</div>
                    <div className='text-blue-600'>
                      +{tier.elo_points.first}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='font-semibold text-gray-600'>🥈</div>
                    <div className='text-gray-600'>
                      +{tier.elo_points.second}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='font-semibold text-orange-600'>🥉</div>
                    <div className='text-orange-600'>
                      +{tier.elo_points.third}
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-2 mt-2 text-xs'>
                  <div className='text-center'>
                    <div className='font-semibold text-gray-600'>4th</div>
                    <div className='text-gray-600'>
                      +{tier.elo_points.fourth}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='font-semibold text-gray-600'>Top 8</div>
                    <div className='text-gray-600'>+{tier.elo_points.top8}</div>
                  </div>
                </div>

                <div className='text-center mt-2 text-xs text-blue-600 font-medium'>
                  Tham gia: +{tier.elo_points.participation} điểm
                </div>
              </div>

              {/* Entry Fee Range */}
              <div className='bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <Users className='w-4 h-4 mr-2 text-green-600' />
                    <span className='font-semibold text-green-800'>
                      Phí đăng ký
                    </span>
                  </div>
                </div>
                <div className='text-center mt-2'>
                  <div className='text-sm text-green-700'>
                    {tier.entry_fee_range.min.toLocaleString()} -{' '}
                    {tier.entry_fee_range.max.toLocaleString()} VNĐ
                  </div>
                </div>
              </div>

              {/* Requirements */}
              {(tier.min_rank_requirement || tier.max_rank_requirement) && (
                <div className='bg-gray-50 p-3 rounded-lg'>
                  <div className='text-sm font-medium text-gray-700 mb-1'>
                    Yêu cầu hạng:
                  </div>
                  <div className='text-xs text-gray-600'>
                    {tier.min_rank_requirement &&
                      `Từ: ${tier.min_rank_requirement}`}
                    {tier.min_rank_requirement &&
                      tier.max_rank_requirement &&
                      ' - '}
                    {tier.max_rank_requirement &&
                      `Đến: ${tier.max_rank_requirement}`}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTier && (
        <div className='mt-4 p-4 bg-blue-50 rounded-lg'>
          <div className='flex items-center gap-2'>
            <Trophy className='w-5 h-5 text-blue-600' />
            <span className='font-semibold text-blue-800'>
              Đã chọn:{' '}
              {TOURNAMENT_TIERS.find(t => t.code === selectedTier)?.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
