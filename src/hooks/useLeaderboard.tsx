import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar_url: string;
  elo: number;
  wins: number;
  losses: number;
  matches_played: number;
  win_rate: number;
  rank: number;
  last_played: string;
  streak: number;
  country: string;
  city: string;
  bio: string;
  user_id: string;
}

export interface LeaderboardFilters {
  sortBy: 'elo' | 'wins' | 'win_rate' | 'matches_played';
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
  country?: string;
  city?: string;
  rankRange?: [number, number];
  eloRange?: [number, number];
  winRateRange?: [number, number];
  searchTerm?: string;
}

export interface LeaderboardStats {
  totalPlayers: number;
  averageElo: number;
  highestElo: number;
  lowestElo: number;
  activePlayers: number;
}

const defaultFilters: LeaderboardFilters = {
  sortBy: 'elo',
  sortOrder: 'desc',
  page: 1,
  pageSize: 20,
};

const initialStats: LeaderboardStats = {
  totalPlayers: 0,
  averageElo: 1500,
  highestElo: 2800,
  lowestElo: 800,
  activePlayers: 0,
};

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<LeaderboardFilters>(defaultFilters);
  const [stats, setStats] = useState<LeaderboardStats>(initialStats);
  const [totalCount, setTotalCount] = useState(0);

  const fetchLeaderboard = async (
    currentFilters: LeaderboardFilters = filters
  ) => {
    setLoading(true);
    setError('');

    try {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order(currentFilters.sortBy, { ascending: currentFilters.sortOrder === 'asc' })
        .range(
          (currentFilters.page - 1) * currentFilters.pageSize,
          currentFilters.page * currentFilters.pageSize - 1
        );

      if (currentFilters.country) {
        query = query.eq('country', currentFilters.country);
      }

      if (currentFilters.city) {
        query = query.eq('city', currentFilters.city);
      }

      if (currentFilters.searchTerm) {
        query = query.ilike('username', `%${currentFilters.searchTerm}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      setLeaderboard(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
      setLeaderboard([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboardStats = async () => {
    try {
      // Mock implementation
      const mockStats: LeaderboardStats = {
        totalPlayers: 1500,
        averageElo: 1450,
        highestElo: 2500,
        lowestElo: 800,
        activePlayers: 875,
      };
      setStats(mockStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard stats');
      setStats(initialStats);
    }
  };

  useEffect(() => {
    fetchLeaderboard(filters);
    fetchLeaderboardStats();
  }, [filters]);

  const updateFilters = (newFilters: Partial<LeaderboardFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const goToPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const sortBy = (sortBy: LeaderboardFilters['sortBy']) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'desc' ? 'asc' : 'desc',
    }));
  };

  const search = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm, page: 1 }));
  };

  return {
    leaderboard,
    loading,
    error,
    filters,
    stats,
    totalCount,
    updateFilters,
    goToPage,
    sortBy,
    search,
  };
};

// Fix the useQuery usage at line 381
export const useLeaderboardQuery = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('elo', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
};
