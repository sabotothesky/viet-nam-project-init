
import { useState } from 'react';
import { SeasonHistory, SeasonHistoryFilters, CurrentSeason, SeasonProgress, SeasonComparison } from '@/types/seasonHistory';

export const useSeasonHistory = () => {
  const [history, setHistory] = useState<SeasonHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<SeasonHistoryFilters>({
    season_name: 'S2',
    season_year: 2024,
  });

  const fetchSeasonHistory = async () => {
    setLoading(true);
    try {
      // Mock data for now
      const mockHistory: SeasonHistory[] = [
        {
          id: '1',
          nickname: 'Player1',
          final_rank: 1,
          ranking_points: 2500,
          season_name: 'S2',
          season_year: 2024,
        },
      ];
      setHistory(mockHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getSeasonHistory = async (filters: SeasonHistoryFilters, page: number, limit: number) => {
    return {
      data: history,
      count: history.length,
      stats: {
        total_players: 100,
        highest_points: 3000,
        average_points: 1500,
        lowest_points: 500,
      },
    };
  };

  const getSeasonStats = async (seasonName: string, seasonYear: number) => {
    return {
      total_players: 100,
      highest_points: 3000,
      average_points: 1500,
      lowest_points: 500,
    };
  };

  const getAvailableSeasons = async () => {
    return [
      { season_name: 'S1', season_year: 2024 },
      { season_name: 'S2', season_year: 2024 },
    ];
  };

  const getCurrentSeason = async (): Promise<CurrentSeason | null> => {
    return {
      season_name: 'S2',
      season_year: 2024,
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      status: 'ongoing',
    };
  };

  const getSeasonProgress = async (seasonName: string, seasonYear: number): Promise<SeasonProgress | null> => {
    return {
      current_rank: 15,
      total_points: 1800,
      games_played: 25,
      wins: 18,
      losses: 7,
      win_rate: 72,
      progress_percentage: 60,
    };
  };

  const getSeasonComparison = async (): Promise<SeasonComparison | null> => {
    return {
      current_season: {
        rank: 15,
        points: 1800,
        games: 25,
      },
      previous_season: {
        rank: 22,
        points: 1650,
        games: 30,
      },
      improvement: {
        rank_change: 7,
        points_change: 150,
        games_change: -5,
      },
    };
  };

  const searchPlayerHistory = async (nickname: string) => {
    return history.filter(h => h.nickname.toLowerCase().includes(nickname.toLowerCase()));
  };

  const getUserBestSeason = async (userId: string) => {
    return history[0] || null;
  };

  const applyFilters = (newFilters: SeasonHistoryFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      season_name: 'S2',
      season_year: 2024,
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'season_history.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getPlayerStats = () => {
    return {
      total_games: 25,
      wins: 18,
      losses: 7,
      win_percentage: 72,
      average_points: 1800,
    };
  };

  const getTopPerformers = () => {
    return history.slice(0, 10);
  };

  const getRankDistribution = () => {
    return [
      { rank_range: '1-10', count: 10 },
      { rank_range: '11-50', count: 40 },
      { rank_range: '51-100', count: 50 },
    ];
  };

  const getAchievementsSummary = () => {
    return {
      tournaments_won: 3,
      top_3_finishes: 8,
      perfect_games: 5,
      comeback_victories: 12,
    };
  };

  return {
    history,
    loading,
    error,
    filters,
    fetchSeasonHistory,
    getSeasonHistory,
    getSeasonStats,
    getAvailableSeasons,
    getCurrentSeason,
    getSeasonProgress,
    getSeasonComparison,
    searchPlayerHistory,
    getUserBestSeason,
    applyFilters,
    clearFilters,
    exportData,
    getPlayerStats,
    getTopPerformers,
    getRankDistribution,
    getAchievementsSummary,
  };
};
