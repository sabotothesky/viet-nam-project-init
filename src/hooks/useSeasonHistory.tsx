import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { 
  SeasonHistory, 
  SeasonStats, 
  UserBestSeason, 
  SeasonHistoryFilters,
  SeasonHistoryResponse,
  CurrentSeason,
  SeasonProgress,
  SeasonComparison
} from '../types/seasonHistory';

export interface SeasonHistory {
  id: string;
  season_id: string;
  season: {
    id: string;
    name: string;
    start_date: Date;
    end_date: Date;
    type: 'regular' | 'championship' | 'special';
    prize_pool: number;
  };
  user_id: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
    rank: string;
  };
  final_rank: number;
  total_matches: number;
  wins: number;
  losses: number;
  win_rate: number;
  final_elo_rating: number;
  elo_change: number;
  total_points: number;
  achievements: SeasonHistoryAchievement[];
  matches: SeasonHistoryMatch[];
  performance_highlights: PerformanceHighlight[];
  created_at: Date;
  updated_at: Date;
}

export interface SeasonHistoryAchievement {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  points: number;
  earned_at: Date;
  category: 'match' | 'tournament' | 'streak' | 'special';
}

export interface SeasonHistoryMatch {
  id: string;
  opponent_id: string;
  opponent: {
    id: string;
    username: string;
    avatar_url?: string;
    rank: string;
  };
  result: 'win' | 'loss' | 'draw';
  score: string;
  match_date: Date;
  venue: string;
  round: number;
  importance: 'regular' | 'playoff' | 'final';
  elo_change: number;
  points_earned: number;
}

export interface PerformanceHighlight {
  id: string;
  type: 'longest_streak' | 'highest_elo' | 'best_win' | 'tournament_win' | 'achievement';
  title: string;
  description: string;
  value: number | string;
  date: Date;
}

export interface SeasonHistoryFilters {
  season_type?: 'regular' | 'championship' | 'special';
  year?: number;
  min_rank?: number;
  max_rank?: number;
  min_matches?: number;
}

export const useSeasonHistory = (userId?: string) => {
  const [history, setHistory] = useState<SeasonHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SeasonHistoryFilters>({});

  // Fetch season history
  const fetchSeasonHistory = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock season history data
      const mockHistory: SeasonHistory[] = [
        {
          id: '1',
          season_id: '1',
          season: {
            id: '1',
            name: 'Mùa giải 2023 - Mùa đông',
            start_date: new Date('2023-12-01'),
            end_date: new Date('2024-02-29'),
            type: 'regular',
            prize_pool: 8000000
          },
          user_id: userId,
          user: {
            id: userId,
            username: 'pool_master',
            avatar_url: '/avatars/pool_master.jpg',
            rank: 'A+'
          },
          final_rank: 3,
          total_matches: 25,
          wins: 20,
          losses: 5,
          win_rate: 0.8,
          final_elo_rating: 1850,
          elo_change: 150,
          total_points: 85,
          achievements: [
            {
              id: '1',
              name: 'Top 5 mùa giải',
              description: 'Kết thúc mùa giải trong top 5',
              icon_url: '/achievements/top5.png',
              points: 20,
              earned_at: new Date('2024-02-28'),
              category: 'tournament'
            },
            {
              id: '2',
              name: 'Chuỗi thắng 8 trận',
              description: 'Thắng liên tiếp 8 trận đấu',
              icon_url: '/achievements/winning_streak.png',
              points: 15,
              earned_at: new Date('2024-01-15'),
              category: 'streak'
            },
            {
              id: '3',
              name: 'Chiến thắng quan trọng',
              description: 'Thắng trận đấu với đối thủ mạnh hơn',
              icon_url: '/achievements/important_win.png',
              points: 10,
              earned_at: new Date('2024-01-20'),
              category: 'match'
            }
          ],
          matches: [
            {
              id: '1',
              opponent_id: '2',
              opponent: {
                id: '2',
                username: 'champion',
                avatar_url: '/avatars/champion.jpg',
                rank: 'G'
              },
              result: 'win',
              score: '7-5',
              match_date: new Date('2024-01-10'),
              venue: 'Club Bida ABC',
              round: 1,
              importance: 'regular',
              elo_change: 25,
              points_earned: 3
            },
            {
              id: '2',
              opponent_id: '3',
              opponent: {
                id: '3',
                username: 'veteran',
                avatar_url: '/avatars/veteran.jpg',
                rank: 'A+'
              },
              result: 'loss',
              score: '5-7',
              match_date: new Date('2024-01-15'),
              venue: 'Club Bida XYZ',
              round: 2,
              importance: 'playoff',
              elo_change: -15,
              points_earned: 1
            },
            {
              id: '3',
              opponent_id: '4',
              opponent: {
                id: '4',
                username: 'rising_star',
                avatar_url: '/avatars/rising_star.jpg',
                rank: 'A'
              },
              result: 'win',
              score: '7-3',
              match_date: new Date('2024-02-05'),
              venue: 'Club Bida DEF',
              round: 3,
              importance: 'regular',
              elo_change: 20,
              points_earned: 3
            }
          ],
          performance_highlights: [
            {
              id: '1',
              type: 'longest_streak',
              title: 'Chuỗi thắng dài nhất',
              description: 'Thắng liên tiếp 8 trận đấu',
              value: 8,
              date: new Date('2024-01-15')
            },
            {
              id: '2',
              type: 'highest_elo',
              title: 'ELO cao nhất',
              description: 'Đạt được ELO rating cao nhất trong mùa giải',
              value: 1870,
              date: new Date('2024-02-10')
            },
            {
              id: '3',
              type: 'best_win',
              title: 'Chiến thắng ấn tượng nhất',
              description: 'Thắng trận đấu với tỷ số 7-2',
              value: '7-2',
              date: new Date('2024-01-25')
            }
          ],
          created_at: new Date('2024-03-01'),
          updated_at: new Date()
        },
        {
          id: '2',
          season_id: '2',
          season: {
            id: '2',
            name: 'Mùa giải 2023 - Mùa hè',
            start_date: new Date('2023-06-01'),
            end_date: new Date('2023-08-31'),
            type: 'championship',
            prize_pool: 15000000
          },
          user_id: userId,
          user: {
            id: userId,
            username: 'pool_master',
            avatar_url: '/avatars/pool_master.jpg',
            rank: 'A+'
          },
          final_rank: 1,
          total_matches: 30,
          wins: 26,
          losses: 4,
          win_rate: 0.867,
          final_elo_rating: 1900,
          elo_change: 200,
          total_points: 95,
          achievements: [
            {
              id: '4',
              name: 'Vô địch mùa giải',
              description: 'Vô địch mùa giải championship',
              icon_url: '/achievements/champion.png',
              points: 50,
              earned_at: new Date('2023-08-30'),
              category: 'tournament'
            },
            {
              id: '5',
              name: 'Chuỗi thắng 10 trận',
              description: 'Thắng liên tiếp 10 trận đấu',
              icon_url: '/achievements/winning_streak.png',
              points: 20,
              earned_at: new Date('2023-07-20'),
              category: 'streak'
            }
          ],
          matches: [
            {
              id: '4',
              opponent_id: '5',
              opponent: {
                id: '5',
                username: 'consistent_player',
                avatar_url: '/avatars/consistent_player.jpg',
                rank: 'A'
              },
              result: 'win',
              score: '7-4',
              match_date: new Date('2023-07-10'),
              venue: 'Club Bida ABC',
              round: 1,
              importance: 'regular',
              elo_change: 30,
              points_earned: 3
            },
            {
              id: '5',
              opponent_id: '6',
              opponent: {
                id: '6',
                username: 'tournament_winner',
                avatar_url: '/avatars/tournament_winner.jpg',
                rank: 'G'
              },
              result: 'win',
              score: '7-6',
              match_date: new Date('2023-08-25'),
              venue: 'Club Bida XYZ',
              round: 5,
              importance: 'final',
              elo_change: 50,
              points_earned: 5
            }
          ],
          performance_highlights: [
            {
              id: '4',
              type: 'tournament_win',
              title: 'Vô địch mùa giải',
              description: 'Trở thành nhà vô địch mùa giải championship',
              value: 1,
              date: new Date('2023-08-30')
            },
            {
              id: '5',
              type: 'highest_elo',
              title: 'ELO cao nhất',
              description: 'Đạt được ELO rating cao nhất trong sự nghiệp',
              value: 1900,
              date: new Date('2023-08-30')
            }
          ],
          created_at: new Date('2023-09-01'),
          updated_at: new Date()
        }
      ];
      
      setHistory(mockHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải lịch sử mùa giải');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Apply filters
  const applyFilters = useCallback((newFilters: SeasonHistoryFilters) => {
    setFilters(newFilters);
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Get filtered history
  const getFilteredHistory = useCallback(() => {
    let filtered = [...history];

    // Filter by season type
    if (filters.season_type) {
      filtered = filtered.filter(item => 
        item.season.type === filters.season_type
      );
    }

    // Filter by year
    if (filters.year) {
      filtered = filtered.filter(item => 
        item.season.start_date.getFullYear() === filters.year
      );
    }

    // Filter by rank range
    if (filters.min_rank) {
      filtered = filtered.filter(item => 
        item.final_rank >= filters.min_rank!
      );
    }

    if (filters.max_rank) {
      filtered = filtered.filter(item => 
        item.final_rank <= filters.max_rank!
      );
    }

    // Filter by minimum matches
    if (filters.min_matches) {
      filtered = filtered.filter(item => 
        item.total_matches >= filters.min_matches!
      );
    }

    return filtered;
  }, [history, filters]);

  // Get season by ID
  const getSeasonById = useCallback((seasonId: string) => {
    return history.find(item => item.season_id === seasonId);
  }, [history]);

  // Get best season
  const getBestSeason = useCallback(() => {
    if (history.length === 0) return null;
    
    return history.reduce((best, current) => 
      current.final_rank < best.final_rank ? current : best
    );
  }, [history]);

  // Get worst season
  const getWorstSeason = useCallback(() => {
    if (history.length === 0) return null;
    
    return history.reduce((worst, current) => 
      current.final_rank > worst.final_rank ? current : worst
    );
  }, [history]);

  // Get career statistics
  const getCareerStats = useCallback(() => {
    if (history.length === 0) return null;
    
    const totalSeasons = history.length;
    const totalMatches = history.reduce((sum, item) => sum + item.total_matches, 0);
    const totalWins = history.reduce((sum, item) => sum + item.wins, 0);
    const totalLosses = history.reduce((sum, item) => sum + item.losses, 0);
    const totalWinRate = totalMatches > 0 ? totalWins / totalMatches : 0;
    const averageRank = history.reduce((sum, item) => sum + item.final_rank, 0) / totalSeasons;
    const bestRank = Math.min(...history.map(item => item.final_rank));
    const totalAchievements = history.reduce((sum, item) => sum + item.achievements.length, 0);
    const totalPoints = history.reduce((sum, item) => sum + item.total_points, 0);
    
    return {
      total_seasons: totalSeasons,
      total_matches: totalMatches,
      total_wins: totalWins,
      total_losses: totalLosses,
      total_win_rate: totalWinRate,
      average_rank: averageRank,
      best_rank: bestRank,
      total_achievements: totalAchievements,
      total_points: totalPoints,
      average_points_per_season: totalPoints / totalSeasons
    };
  }, [history]);

  // Get performance trends
  const getPerformanceTrends = useCallback(() => {
    if (history.length < 2) return null;
    
    const sortedHistory = [...history].sort((a, b) => 
      a.season.start_date.getTime() - b.season.start_date.getTime()
    );
    
    return {
      rank_trend: sortedHistory.map(item => ({
        season: item.season.name,
        rank: item.final_rank,
        date: item.season.start_date
      })),
      elo_trend: sortedHistory.map(item => ({
        season: item.season.name,
        elo: item.final_elo_rating,
        change: item.elo_change,
        date: item.season.start_date
      })),
      win_rate_trend: sortedHistory.map(item => ({
        season: item.season.name,
        win_rate: item.win_rate,
        date: item.season.start_date
      }))
    };
  }, [history]);

  // Get achievements summary
  const getAchievementsSummary = useCallback(() => {
    const allAchievements = history.flatMap(item => item.achievements);
    const achievementCounts = allAchievements.reduce((acc, achievement) => {
      acc[achievement.category] = (acc[achievement.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total_achievements: allAchievements.length,
      by_category: achievementCounts,
      recent_achievements: allAchievements
        .sort((a, b) => b.earned_at.getTime() - a.earned_at.getTime())
        .slice(0, 5)
    };
  }, [history]);

  useEffect(() => {
    fetchSeasonHistory();
  }, [fetchSeasonHistory]);

  return {
    history,
    loading,
    error,
    filters,
    fetchSeasonHistory,
    applyFilters,
    clearFilters,
    getFilteredHistory,
    getSeasonById,
    getBestSeason,
    getWorstSeason,
    getCareerStats,
    getPerformanceTrends,
    getAchievementsSummary
  };
}; 