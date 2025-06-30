import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Trophy,
  Target,
  BarChart3,
  Activity,
  Crown,
  Shield,
  Flame,
  Zap,
  Star,
  Users,
  Award,
  Calendar,
  Clock,
  Target as TargetIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from 'lucide-react';
import {
  getRankFromRating,
  getRankProgression,
  calculateEloEfficiency,
  calculateRecentForm,
  calculateConsistencyScore,
  type PlayerStats,
} from '../utils/eloCalculator';

interface EloStatisticsProps {
  player: PlayerStats;
  className?: string;
}

export const EloStatistics: React.FC<EloStatisticsProps> = ({
  player,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'progression' | 'performance' | 'comparison'
  >('overview');

  const getRankColor = (rating: number) => {
    if (rating >= 2800)
      return 'bg-purple-100 text-purple-800 border-purple-200';
    if (rating >= 2600)
      return 'bg-purple-100 text-purple-800 border-purple-200';
    if (rating >= 2400) return 'bg-red-100 text-red-800 border-red-200';
    if (rating >= 2200) return 'bg-red-100 text-red-800 border-red-200';
    if (rating >= 2000)
      return 'bg-orange-100 text-orange-800 border-orange-200';
    if (rating >= 1800)
      return 'bg-orange-100 text-orange-800 border-orange-200';
    if (rating >= 1600) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (rating >= 1400) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (rating >= 1200) return 'bg-green-100 text-green-800 border-green-200';
    if (rating >= 1000) return 'bg-green-100 text-green-800 border-green-200';
    if (rating >= 800) return 'bg-gray-100 text-gray-800 border-gray-200';
    if (rating >= 600) return 'bg-gray-100 text-gray-800 border-gray-200';
    if (rating >= 400) return 'bg-gray-100 text-gray-800 border-gray-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRankName = (rating: number) => {
    const rank = getRankFromRating(rating);
    const names: { [key: string]: string } = {
      'S+': 'Legendary',
      S: 'Master',
      'G+': 'Elite',
      G: 'Expert',
      'A+': 'Advanced',
      A: 'Intermediate+',
      'B+': 'Intermediate',
      B: 'Beginner+',
      'C+': 'Beginner',
      C: 'Novice+',
      'D+': 'Novice',
      D: 'Rookie+',
      'E+': 'Rookie',
      E: 'Newcomer',
    };
    return `${rank} (${names[rank]})`;
  };

  const getFormColor = (form: number) => {
    if (form > 50) return 'text-green-600';
    if (form > 20) return 'text-blue-600';
    if (form > -20) return 'text-yellow-600';
    if (form > -50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getConsistencyColor = (score: number) => {
    if (score > 80) return 'text-green-600';
    if (score > 60) return 'text-blue-600';
    if (score > 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getVolatilityColor = (volatility: number) => {
    if (volatility < 30) return 'text-green-600';
    if (volatility < 60) return 'text-blue-600';
    if (volatility < 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFormIcon = (form: number) => {
    if (form > 50) return <Flame className='h-4 w-4 text-red-500' />;
    if (form > 20) return <TrendingUpIcon className='h-4 w-4 text-green-500' />;
    if (form > -20) return <Activity className='h-4 w-4 text-yellow-500' />;
    if (form > -50)
      return <TrendingDownIcon className='h-4 w-4 text-orange-500' />;
    return <TrendingDown className='h-4 w-4 text-red-500' />;
  };

  const getConsistencyIcon = (score: number) => {
    if (score > 80) return <Shield className='h-4 w-4 text-green-500' />;
    if (score > 60) return <Shield className='h-4 w-4 text-blue-500' />;
    if (score > 40) return <BarChart3 className='h-4 w-4 text-yellow-500' />;
    return <BarChart3 className='h-4 w-4 text-red-500' />;
  };

  const getVolatilityIcon = (volatility: number) => {
    if (volatility < 30)
      return <TargetIcon className='h-4 w-4 text-green-500' />;
    if (volatility < 60) return <Activity className='h-4 w-4 text-blue-500' />;
    if (volatility < 100) return <Zap className='h-4 w-4 text-yellow-500' />;
    return <Zap className='h-4 w-4 text-red-500' />;
  };

  const progression = getRankProgression(player.current_rating);
  const efficiency = calculateEloEfficiency(
    player.current_rating,
    1000,
    player.matches_played
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BarChart3 className='h-5 w-5' />
            ELO Statistics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tab Navigation */}
          <div className='flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg'>
            <Button
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </Button>
            <Button
              variant={activeTab === 'progression' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => setActiveTab('progression')}
            >
              Progression
            </Button>
            <Button
              variant={activeTab === 'performance' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => setActiveTab('performance')}
            >
              Performance
            </Button>
            <Button
              variant={activeTab === 'comparison' ? 'default' : 'ghost'}
              size='sm'
              onClick={() => setActiveTab('comparison')}
            >
              Comparison
            </Button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className='space-y-6'>
              {/* Current Status */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Card className='border-blue-200 bg-blue-50'>
                  <CardContent className='p-4'>
                    <div className='flex items-center gap-2 mb-2'>
                      <Crown className='h-4 w-4 text-blue-600' />
                      <span className='font-medium text-blue-800'>
                        Current Rank
                      </span>
                    </div>
                    <Badge className={getRankColor(player.current_rating)}>
                      {getRankName(player.current_rating)}
                    </Badge>
                    <div className='text-sm text-blue-600 mt-1'>
                      Rating: {player.current_rating}
                    </div>
                  </CardContent>
                </Card>

                <Card className='border-green-200 bg-green-50'>
                  <CardContent className='p-4'>
                    <div className='flex items-center gap-2 mb-2'>
                      <Target className='h-4 w-4 text-green-600' />
                      <span className='font-medium text-green-800'>
                        Win Rate
                      </span>
                    </div>
                    <div className='text-2xl font-bold text-green-600'>
                      {player.win_rate?.toFixed(1)}%
                    </div>
                    <div className='text-sm text-green-600'>
                      {player.wins || 0} wins / {player.matches_played} matches
                    </div>
                  </CardContent>
                </Card>

                <Card className='border-purple-200 bg-purple-50'>
                  <CardContent className='p-4'>
                    <div className='flex items-center gap-2 mb-2'>
                      <Flame className='h-4 w-4 text-purple-600' />
                      <span className='font-medium text-purple-800'>
                        Current Streak
                      </span>
                    </div>
                    <div className='text-2xl font-bold text-purple-600'>
                      {player.current_streak}
                    </div>
                    <div className='text-sm text-purple-600'>
                      {player.current_streak > 0
                        ? 'Winning streak'
                        : 'No active streak'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Advanced Metrics */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        {getFormIcon(player.recent_form || 0)}
                        <span>Recent Form</span>
                      </div>
                      <div
                        className={`font-semibold ${getFormColor(player.recent_form || 0)}`}
                      >
                        {player.recent_form || 0}
                      </div>
                    </div>
                    <Progress
                      value={Math.abs(player.recent_form || 0)}
                      className='h-2'
                    />

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        {getConsistencyIcon(player.consistency_score || 50)}
                        <span>Consistency</span>
                      </div>
                      <div
                        className={`font-semibold ${getConsistencyColor(player.consistency_score || 50)}`}
                      >
                        {player.consistency_score || 50}%
                      </div>
                    </div>
                    <Progress
                      value={player.consistency_score || 50}
                      className='h-2'
                    />

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        {getVolatilityIcon(player.rating_volatility || 0)}
                        <span>Volatility</span>
                      </div>
                      <div
                        className={`font-semibold ${getVolatilityColor(player.rating_volatility || 0)}`}
                      >
                        {player.rating_volatility || 0}
                      </div>
                    </div>
                    <Progress
                      value={Math.min(100, (player.rating_volatility || 0) / 2)}
                      className='h-2'
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Rating History</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='flex justify-between'>
                      <span>Highest Rating:</span>
                      <span className='font-semibold text-green-600'>
                        {player.highest_rating || player.current_rating}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Lowest Rating:</span>
                      <span className='font-semibold text-red-600'>
                        {player.lowest_rating || player.current_rating}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Rating Range:</span>
                      <span className='font-semibold'>
                        {(player.highest_rating || player.current_rating) -
                          (player.lowest_rating || player.current_rating)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>ELO Efficiency:</span>
                      <span className='font-semibold text-blue-600'>
                        {efficiency > 0 ? '+' : ''}
                        {efficiency} pts/match
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Avg Opponent Rating:</span>
                      <span className='font-semibold'>
                        {player.average_opponent_rating || 'N/A'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Progression Tab */}
          {activeTab === 'progression' && (
            <div className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <TrendingUp className='h-5 w-5' />
                    Rank Progression
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='text-center p-4 bg-blue-50 rounded-lg'>
                      <div className='text-sm text-blue-600 mb-1'>
                        Current Rank
                      </div>
                      <Badge className={getRankColor(player.current_rating)}>
                        {progression.currentRank}
                      </Badge>
                      <div className='text-sm text-gray-600 mt-1'>
                        Rating: {player.current_rating}
                      </div>
                    </div>
                    <div className='text-center p-4 bg-green-50 rounded-lg'>
                      <div className='text-sm text-green-600 mb-1'>
                        Next Rank
                      </div>
                      <Badge
                        className={getRankColor(
                          getRatingFromRank(progression.nextRank)
                        )}
                      >
                        {progression.nextRank}
                      </Badge>
                      <div className='text-sm text-gray-600 mt-1'>
                        {progression.pointsToNext} points needed
                      </div>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <span>Progress to next rank:</span>
                      <span className='font-semibold'>
                        {Math.round(
                          ((player.current_rating -
                            getRatingFromRank(progression.currentRank)) /
                            200) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        ((player.current_rating -
                          getRatingFromRank(progression.currentRank)) /
                          200) *
                        100
                      }
                      className='h-3'
                    />
                    <div className='text-sm text-gray-600'>
                      Estimated {progression.estimatedMatches} matches to reach{' '}
                      {progression.nextRank}
                    </div>
                  </div>

                  {/* Rank Tiers */}
                  <div className='space-y-2'>
                    <h4 className='font-medium'>All Rank Tiers</h4>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                      {[
                        'E',
                        'E+',
                        'D',
                        'D+',
                        'C',
                        'C+',
                        'B',
                        'B+',
                        'A',
                        'A+',
                        'G',
                        'G+',
                        'S',
                        'S+',
                      ].map(rank => {
                        const rankRating = getRatingFromRank(rank);
                        const isCurrent = rank === progression.currentRank;
                        const isAchieved = player.current_rating >= rankRating;
                        return (
                          <div
                            key={rank}
                            className={`p-2 rounded text-center text-sm border ${
                              isCurrent
                                ? 'bg-blue-100 border-blue-300 text-blue-800'
                                : isAchieved
                                  ? 'bg-green-100 border-green-300 text-green-800'
                                  : 'bg-gray-100 border-gray-300 text-gray-600'
                            }`}
                          >
                            <div className='font-medium'>{rank}</div>
                            <div className='text-xs'>{rankRating}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Activity className='h-5 w-5' />
                      Match Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='flex justify-between'>
                      <span>Total Matches:</span>
                      <span className='font-semibold'>
                        {player.matches_played}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Wins:</span>
                      <span className='font-semibold text-green-600'>
                        {player.wins || 0}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Losses:</span>
                      <span className='font-semibold text-red-600'>
                        {player.matches_played - (player.wins || 0)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Win Rate:</span>
                      <span className='font-semibold text-blue-600'>
                        {player.win_rate?.toFixed(1)}%
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Current Streak:</span>
                      <span className='font-semibold'>
                        {player.current_streak > 0 ? '+' : ''}
                        {player.current_streak}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Star className='h-5 w-5' />
                      Quality Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                      <div className='flex justify-between'>
                        <span>Recent Form:</span>
                        <span
                          className={`font-semibold ${getFormColor(player.recent_form || 0)}`}
                        >
                          {player.recent_form || 0}
                        </span>
                      </div>
                      <div className='text-xs text-gray-600'>
                        {player.recent_form > 50
                          ? '🔥 Excellent form'
                          : player.recent_form > 20
                            ? '📈 Good form'
                            : player.recent_form > -20
                              ? '➡️ Stable form'
                              : player.recent_form > -50
                                ? '📉 Poor form'
                                : '❄️ Cold streak'}
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <div className='flex justify-between'>
                        <span>Consistency:</span>
                        <span
                          className={`font-semibold ${getConsistencyColor(player.consistency_score || 50)}`}
                        >
                          {player.consistency_score || 50}%
                        </span>
                      </div>
                      <div className='text-xs text-gray-600'>
                        {player.consistency_score > 80
                          ? '🛡️ Very stable performance'
                          : player.consistency_score > 60
                            ? '📊 Stable performance'
                            : player.consistency_score > 40
                              ? '📈 Variable performance'
                              : '📉 Volatile performance'}
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <div className='flex justify-between'>
                        <span>Rating Volatility:</span>
                        <span
                          className={`font-semibold ${getVolatilityColor(player.rating_volatility || 0)}`}
                        >
                          {player.rating_volatility || 0}
                        </span>
                      </div>
                      <div className='text-xs text-gray-600'>
                        {player.rating_volatility < 30
                          ? '🎯 Very predictable'
                          : player.rating_volatility < 60
                            ? '📊 Moderately predictable'
                            : player.rating_volatility < 100
                              ? '⚡ Somewhat unpredictable'
                              : '🎲 Highly unpredictable'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Comparison Tab */}
          {activeTab === 'comparison' && (
            <div className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Users className='h-5 w-5' />
                    Rating Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='text-center p-4 bg-green-50 rounded-lg'>
                      <div className='text-sm text-green-600 mb-1'>
                        Your Rating
                      </div>
                      <div className='text-2xl font-bold text-green-600'>
                        {player.current_rating}
                      </div>
                      <Badge className={getRankColor(player.current_rating)}>
                        {getRankName(player.current_rating)}
                      </Badge>
                    </div>
                    <div className='text-center p-4 bg-blue-50 rounded-lg'>
                      <div className='text-sm text-blue-600 mb-1'>
                        Average Opponent
                      </div>
                      <div className='text-2xl font-bold text-blue-600'>
                        {player.average_opponent_rating || 'N/A'}
                      </div>
                      <div className='text-sm text-gray-600'>
                        {player.average_opponent_rating
                          ? player.current_rating >
                            player.average_opponent_rating
                            ? 'You are stronger'
                            : 'You are weaker'
                          : 'No data'}
                      </div>
                    </div>
                    <div className='text-center p-4 bg-purple-50 rounded-lg'>
                      <div className='text-sm text-purple-600 mb-1'>
                        Rating Difference
                      </div>
                      <div className='text-2xl font-bold text-purple-600'>
                        {player.average_opponent_rating
                          ? (player.current_rating -
                              player.average_opponent_rating >
                            0
                              ? '+'
                              : '') +
                            (player.current_rating -
                              player.average_opponent_rating)
                          : 'N/A'}
                      </div>
                      <div className='text-sm text-gray-600'>
                        {player.average_opponent_rating
                          ? Math.abs(
                              player.current_rating -
                                player.average_opponent_rating
                            ) + ' points'
                          : 'No data'}
                      </div>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <h4 className='font-medium'>Performance Analysis</h4>
                    <div className='space-y-2'>
                      <div className='flex justify-between'>
                        <span>ELO Efficiency:</span>
                        <span
                          className={`font-semibold ${efficiency > 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {efficiency > 0 ? '+' : ''}
                          {efficiency} pts/match
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Rating Growth Rate:</span>
                        <span className='font-semibold'>
                          {player.matches_played > 0
                            ? (
                                (player.current_rating - 1000) /
                                player.matches_played
                              ).toFixed(1) + ' pts/match'
                            : 'N/A'}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Performance vs Expected:</span>
                        <span className='font-semibold'>
                          {player.win_rate && player.win_rate > 50
                            ? 'Above average'
                            : 'Below average'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
