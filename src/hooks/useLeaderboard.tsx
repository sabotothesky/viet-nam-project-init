import { useState, useEffect, useCallback } from 'react';

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
    rank: string;
  };
  elo_rating: number;
  total_matches: number;
  wins: number;
  losses: number;
  win_rate: number;
  current_streak: number;
  longest_streak: number;
  total_earnings: number;
  tournament_wins: number;
  tournament_runner_ups: number;
  achievements_count: number;
  rank_position: number;
  previous_rank_position?: number;
  rank_change?: number;
  last_match_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface LeaderboardFilters {
  time_period?: 'all_time' | 'this_month' | 'this_week' | 'this_season';
  rank_tier?: string[];
  min_matches?: number;
  min_elo?: number;
  max_elo?: number;
  location?: string;
}

export interface LeaderboardStats {
  total_players: number;
  average_elo: number;
  top_elo: number;
  active_players_this_week: number;
  new_players_this_month: number;
}

export const useLeaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LeaderboardFilters>({});
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async (pageNum: number = 1, limit: number = 50) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock leaderboard data
      const mockEntries: LeaderboardEntry[] = [
        {
          id: '1',
          user_id: '1',
          user: {
            id: '1',
            username: 'pool_master',
            avatar_url: '/avatars/pool_master.jpg',
            rank: 'G'
          },
          elo_rating: 2100,
          total_matches: 250,
          wins: 200,
          losses: 50,
          win_rate: 0.8,
          current_streak: 8,
          longest_streak: 15,
          total_earnings: 5000000,
          tournament_wins: 12,
          tournament_runner_ups: 5,
          achievements_count: 25,
          rank_position: 1,
          previous_rank_position: 2,
          rank_change: 1,
          last_match_date: new Date(Date.now() - 1000 * 60 * 60 * 2),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '2',
          user_id: '2',
          user: {
            id: '2',
            username: 'champion',
            avatar_url: '/avatars/champion.jpg',
            rank: 'G'
          },
          elo_rating: 2050,
          total_matches: 180,
          wins: 150,
          losses: 30,
          win_rate: 0.833,
          current_streak: 5,
          longest_streak: 12,
          total_earnings: 4000000,
          tournament_wins: 8,
          tournament_runner_ups: 3,
          achievements_count: 20,
          rank_position: 2,
          previous_rank_position: 1,
          rank_change: -1,
          last_match_date: new Date(Date.now() - 1000 * 60 * 60 * 6),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '3',
          user_id: '3',
          user: {
            id: '3',
            username: 'veteran',
            avatar_url: '/avatars/veteran.jpg',
            rank: 'A+'
          },
          elo_rating: 1950,
          total_matches: 300,
          wins: 240,
          losses: 60,
          win_rate: 0.8,
          current_streak: 3,
          longest_streak: 10,
          total_earnings: 3500000,
          tournament_wins: 6,
          tournament_runner_ups: 8,
          achievements_count: 18,
          rank_position: 3,
          previous_rank_position: 3,
          rank_change: 0,
          last_match_date: new Date(Date.now() - 1000 * 60 * 60 * 12),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '4',
          user_id: '4',
          user: {
            id: '4',
            username: 'rising_star',
            avatar_url: '/avatars/rising_star.jpg',
            rank: 'A'
          },
          elo_rating: 1850,
          total_matches: 120,
          wins: 100,
          losses: 20,
          win_rate: 0.833,
          current_streak: 10,
          longest_streak: 10,
          total_earnings: 2000000,
          tournament_wins: 3,
          tournament_runner_ups: 2,
          achievements_count: 15,
          rank_position: 4,
          previous_rank_position: 6,
          rank_change: 2,
          last_match_date: new Date(Date.now() - 1000 * 60 * 60 * 1),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '5',
          user_id: '5',
          user: {
            id: '5',
            username: 'consistent_player',
            avatar_url: '/avatars/consistent_player.jpg',
            rank: 'A'
          },
          elo_rating: 1800,
          total_matches: 200,
          wins: 160,
          losses: 40,
          win_rate: 0.8,
          current_streak: 2,
          longest_streak: 8,
          total_earnings: 2500000,
          tournament_wins: 4,
          tournament_runner_ups: 4,
          achievements_count: 12,
          rank_position: 5,
          previous_rank_position: 4,
          rank_change: -1,
          last_match_date: new Date(Date.now() - 1000 * 60 * 60 * 24),
          created_at: new Date(),
          updated_at: new Date()
        }
      ];
      
      if (pageNum === 1) {
        setEntries(mockEntries);
      } else {
        setEntries(prev => [...prev, ...mockEntries]);
      }
      
      setHasMore(mockEntries.length === limit);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải bảng xếp hạng');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch leaderboard stats
  const fetchLeaderboardStats = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockStats: LeaderboardStats = {
        total_players: 1250,
        average_elo: 1500,
        top_elo: 2100,
        active_players_this_week: 450,
        new_players_this_month: 85
      };
      
      setStats(mockStats);
    } catch (err) {
      console.error('Failed to fetch leaderboard stats:', err);
    }
  }, []);

  // Apply filters
  const applyFilters = useCallback((newFilters: LeaderboardFilters) => {
    setFilters(newFilters);
    setPage(1);
    setHasMore(true);
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
    setHasMore(true);
  }, []);

  // Get filtered entries
  const getFilteredEntries = useCallback(() => {
    let filtered = [...entries];

    // Filter by rank tier
    if (filters.rank_tier && filters.rank_tier.length > 0) {
      filtered = filtered.filter(entry => 
        filters.rank_tier!.includes(entry.user.rank)
      );
    }

    // Filter by minimum matches
    if (filters.min_matches) {
      filtered = filtered.filter(entry => 
        entry.total_matches >= filters.min_matches!
      );
    }

    // Filter by ELO range
    if (filters.min_elo) {
      filtered = filtered.filter(entry => 
        entry.elo_rating >= filters.min_elo!
      );
    }

    if (filters.max_elo) {
      filtered = filtered.filter(entry => 
        entry.elo_rating <= filters.max_elo!
      );
    }

    return filtered;
  }, [entries, filters]);

  // Get user's position
  const getUserPosition = useCallback((userId: string) => {
    return entries.find(entry => entry.user_id === userId);
  }, [entries]);

  // Get top players
  const getTopPlayers = useCallback((limit: number = 10) => {
    return entries.slice(0, limit);
  }, [entries]);

  // Get players by rank
  const getPlayersByRank = useCallback((rank: string) => {
    return entries.filter(entry => entry.user.rank === rank);
  }, [entries]);

  // Get rising stars (players with positive rank change)
  const getRisingStars = useCallback((limit: number = 10) => {
    return entries
      .filter(entry => entry.rank_change && entry.rank_change > 0)
      .sort((a, b) => (b.rank_change || 0) - (a.rank_change || 0))
      .slice(0, limit);
  }, [entries]);

  // Get active players (played recently)
  const getActivePlayers = useCallback((days: number = 7) => {
    const cutoffDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * days);
    return entries.filter(entry => 
      entry.last_match_date && entry.last_match_date > cutoffDate
    );
  }, [entries]);

  // Load more entries
  const loadMoreEntries = useCallback(() => {
    if (!loading && hasMore) {
      fetchLeaderboard(page + 1);
    }
  }, [loading, hasMore, page, fetchLeaderboard]);

  // Search players
  const searchPlayers = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return entries.filter(entry => 
      entry.user.username.toLowerCase().includes(lowercaseQuery)
    );
  }, [entries]);

  useEffect(() => {
    fetchLeaderboard();
    fetchLeaderboardStats();
  }, [fetchLeaderboard, fetchLeaderboardStats]);

  return {
    entries,
    loading,
    error,
    filters,
    stats,
    hasMore,
    fetchLeaderboard,
    fetchLeaderboardStats,
    applyFilters,
    clearFilters,
    getFilteredEntries,
    getUserPosition,
    getTopPlayers,
    getPlayersByRank,
    getRisingStars,
    getActivePlayers,
    loadMoreEntries,
    searchPlayers
  };
};

export const useTopPlayers = () => {
  return useQuery({
    queryKey: ['top-players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, current_rank, ranking_points, wins, losses, total_matches, location')
        .order('ranking_points', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });
};
