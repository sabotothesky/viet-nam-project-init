import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Trophy,
  Zap,
  Star,
  Calculator,
  Target,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { EloCalculator } from './EloCalculator';
import {
  getKFactor,
  getExpectedScore,
  predictMatchResult,
  getRankFromRating,
  getRatingFromRank,
} from '../utils/eloCalculator';

export const RankingCalculator = () => {
  const [showCalculator, setShowCalculator] = useState(false);

  const kFactorExamples = [
    { matches: 10, k: 40, description: 'Người chơi mới - thay đổi nhanh' },
    { matches: 50, k: 30, description: 'Người chơi trung bình' },
    { matches: 150, k: 25, description: 'Người chơi kinh nghiệm' },
    { matches: 300, k: 20, description: 'Người chơi chuyên nghiệp - ổn định' },
  ];

  const rankExamples = [
    {
      rating: 2500,
      rank: 'G+',
      name: 'Cao thủ',
      color: 'bg-purple-100 text-purple-800',
    },
    {
      rating: 2000,
      rank: 'G',
      name: 'Hạng A',
      color: 'bg-red-100 text-red-800',
    },
    {
      rating: 1500,
      rank: 'A+',
      name: 'Hạng B',
      color: 'bg-orange-100 text-orange-800',
    },
    {
      rating: 1000,
      rank: 'A',
      name: 'Hạng C',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      rating: 500,
      rank: 'B+',
      name: 'Hạng D',
      color: 'bg-green-100 text-green-800',
    },
    {
      rating: 100,
      rank: 'B',
      name: 'Hạng E',
      color: 'bg-gray-100 text-gray-800',
    },
  ];

  const matchExamples = [
    {
      title: 'Trận đấu cân bằng',
      p1: 1500,
      p2: 1500,
      winner: 1,
      description: 'Hai người chơi cùng trình độ',
    },
    {
      title: 'Upset (người yếu thắng)',
      p1: 1300,
      p2: 1700,
      winner: 1,
      description: 'Người chơi có rating thấp hơn thắng',
    },
    {
      title: 'Thắng như dự kiến',
      p1: 1800,
      p2: 1400,
      winner: 1,
      description: 'Người chơi mạnh hơn thắng',
    },
  ];

  const calculateExample = (
    p1Rating: number,
    p2Rating: number,
    winner: number
  ) => {
    const k1 = getKFactor(50); // Giả sử 50 trận
    const k2 = getKFactor(30); // Giả sử 30 trận
    const expected1 = getExpectedScore(p1Rating, p2Rating);
    const expected2 = 1 - expected1;
    const actual1 = winner === 1 ? 1 : 0;
    const actual2 = winner === 2 ? 1 : 0;

    const change1 = Math.round(k1 * (actual1 - expected1));
    const change2 = Math.round(k2 * (actual2 - expected2));

    return {
      p1Change: change1,
      p2Change: change2,
      p1Expected: expected1,
      p2Expected: expected2,
    };
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl flex items-center justify-between'>
            <span>Cách tính điểm Ranking</span>
            <Button
              onClick={() => setShowCalculator(!showCalculator)}
              variant='outline'
              size='sm'
            >
              <Calculator className='h-4 w-4 mr-2' />
              {showCalculator ? 'Ẩn máy tính' : 'Máy tính ELO'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* ELO System Explanation */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-3'>
              Hệ thống ELO cải tiến
            </h3>
            <p className='text-gray-600 mb-4'>
              SABO POOL ARENA sử dụng hệ thống tính điểm dựa trên ELO với các
              điều chỉnh phù hợp với bida.
            </p>

            <div className='bg-blue-50 p-4 rounded-lg'>
              <h4 className='font-medium text-blue-900 mb-2'>
                Công thức cơ bản:
              </h4>
              <code className='text-sm text-blue-800'>
                Điểm mới = Điểm cũ + K × (Kết quả - Xác suất thắng dự kiến) +
                Bonus
              </code>
            </div>
          </div>

          {/* K-Factor */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-3'>
              Hệ số K (K-Factor)
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              {kFactorExamples.map((example, index) => (
                <div key={index} className='border rounded-lg p-4'>
                  <h4 className='font-medium text-gray-900 mb-2'>
                    {example.matches} trận
                  </h4>
                  <p className='text-2xl font-bold text-blue-600'>
                    K = {example.k}
                  </p>
                  <p className='text-sm text-gray-600'>{example.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rank System */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-3'>
              Hệ thống hạng
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {rankExamples.map((rank, index) => (
                <div key={index} className='border rounded-lg p-4'>
                  <div className='flex items-center justify-between mb-2'>
                    <Badge className={rank.color}>{rank.rank}</Badge>
                    <span className='text-sm text-gray-500'>
                      {rank.rating}+ điểm
                    </span>
                  </div>
                  <h4 className='font-medium text-gray-900'>{rank.name}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Win Probability */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-3'>
              Xác suất thắng dự kiến
            </h3>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <p className='text-sm text-gray-700 mb-2'>
                Dựa trên chênh lệch điểm giữa hai người chơi:
              </p>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>• Chênh lệch 0 điểm: 50% vs 50%</li>
                <li>• Chênh lệch 100 điểm: 64% vs 36%</li>
                <li>• Chênh lệch 200 điểm: 76% vs 24%</li>
                <li>• Chênh lệch 400 điểm: 91% vs 9%</li>
              </ul>
            </div>
          </div>

          {/* Examples */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-3'>
              Ví dụ tính điểm
            </h3>
            <div className='space-y-4'>
              {matchExamples.map((example, index) => {
                const result = calculateExample(
                  example.p1,
                  example.p2,
                  example.winner
                );
                return (
                  <div key={index} className='border rounded-lg p-4'>
                    <h4 className='font-medium text-gray-900 mb-2'>
                      {example.title}
                    </h4>
                    <p className='text-sm text-gray-600 mb-3'>
                      {example.description}
                    </p>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div>
                        <p>
                          <strong>Người chơi A:</strong> {example.p1} điểm
                        </p>
                        <p>
                          <strong>Người chơi B:</strong> {example.p2} điểm
                        </p>
                        <p>
                          <strong>Kết quả:</strong> A thắng
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Xác suất thắng A:</strong>{' '}
                          {(result.p1Expected * 100).toFixed(1)}%
                        </p>
                        <p>
                          <strong>Điểm A nhận:</strong>
                          <span
                            className={
                              result.p1Change >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }
                          >
                            {result.p1Change >= 0 ? '+' : ''}
                            {result.p1Change}
                          </span>
                        </p>
                        <p>
                          <strong>Điểm B mất:</strong>
                          <span
                            className={
                              result.p2Change >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }
                          >
                            {result.p2Change >= 0 ? '+' : ''}
                            {result.p2Change}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bonus Factors */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-3'>
              Yếu tố thưởng
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='border rounded-lg p-4 text-center'>
                <Trophy className='w-8 h-8 text-yellow-600 mx-auto mb-2' />
                <h4 className='font-medium text-gray-900'>Giải đấu</h4>
                <p className='text-sm text-gray-600'>+20% điểm thưởng</p>
              </div>
              <div className='border rounded-lg p-4 text-center'>
                <Zap className='w-8 h-8 text-blue-600 mx-auto mb-2' />
                <h4 className='font-medium text-gray-900'>Chuỗi thắng</h4>
                <p className='text-sm text-gray-600'>
                  +5% mỗi trận (tối đa 25%)
                </p>
              </div>
              <div className='border rounded-lg p-4 text-center'>
                <Star className='w-8 h-8 text-purple-600 mx-auto mb-2' />
                <h4 className='font-medium text-gray-900'>Trận hay</h4>
                <p className='text-sm text-gray-600'>+10% nếu được vote</p>
              </div>
            </div>
          </div>

          {/* Upset Bonus */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-3'>
              Bonus Upset
            </h3>
            <div className='bg-orange-50 p-4 rounded-lg border border-orange-200'>
              <div className='flex items-center gap-2 mb-2'>
                <TrendingUp className='h-5 w-5 text-orange-600' />
                <h4 className='font-medium text-orange-800'>
                  Thắng người mạnh hơn
                </h4>
              </div>
              <p className='text-sm text-orange-700'>
                Khi người chơi có rating thấp hơn thắng người có rating cao hơn
                200+ điểm, sẽ nhận thêm bonus 10% chênh lệch rating.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ELO Calculator */}
      {showCalculator && <EloCalculator />}
    </div>
  );
};
