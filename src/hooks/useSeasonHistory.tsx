
import { useState } from 'react';
import { 
  SeasonHistory, 
  CurrentSeason, 
  SeasonProgress, 
  SeasonComparison, 
  UserBestSeason 
} from '../types/seasonHistory';

export const useSeasonHistory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getCurrentSeason = async (): Promise<CurrentSeason | null> => {
    setLoading(true);
    try {
      // Mock current season data
      return {
        season_name: 'Spring',
        season_year: 2024,
        start_date: '2024-01-01',
        end_date: '2024-03-31',
        status: 'ongoing' as const,
        days_remaining: 45
      };
    } catch (err) {
      setError('Failed to fetch current season');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getSeasonProgress = async (seasonName: string, seasonYear: number): Promise<SeasonProgress | null> => {
    setLoading(true);
    try {
      // Mock progress data
      return {
        current_rank: 15,
        total_points: 1250,
        games_played: 45,
        wins: 32,
        losses: 13,
        win_rate: 71.1,
        progress_percentage: 65,
        days_elapsed: 45,
        days_remaining: 45
      };
    } catch (err) {
      setError('Failed to fetch season progress');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getSeasonComparison = async (): Promise<SeasonComparison | null> => {
    setLoading(true);
    try {
      // Mock comparison data
      return {
        current_season: {
          rank: 15,
          points: 1250,
          games: 45,
          season_name: 'Spring',
          season_year: 2024,
          total_players: 500,
          highest_points: 2500,
          average_points: 800
        },
        previous_season: {
          rank: 20,
          points: 1100,
          games: 40,
          season_name: 'Winter',
          season_year: 2023,
          total_players: 450,
          highest_points: 2300,
          average_points: 750
        },
        improvement: {
          rank_change: 5,
          points_change: 150,
          games_change: 5
        },
        top_players_change: [
          {
            player_name: 'Player1',
            nickname: 'Pro1',
            rank_change: 2,
            current_rank: 1,
            previous_rank: 3,
            current_points: 2500,
            previous_points: 2300,
            points_change: 200
          }
        ]
      };
    } catch (err) {
      setError('Failed to fetch season comparison');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const searchPlayerHistory = async (nickname: string): Promise<SeasonHistory[]> => {
    setLoading(true);
    try {
      // Mock player history data
      return [
        {
          id: '1',
          nickname: nickname,
          final_rank: 12,
          ranking_points: 1350,
          season_name: 'Spring',
          season_year: 2024,
          created_at: '2024-03-15T10:00:00Z'
        },
        {
          id: '2',
          nickname: nickname,
          final_rank: 18,
          ranking_points: 1150,
          season_name: 'Winter',
          season_year: 2023,
          created_at: '2023-12-15T10:00:00Z'
        }
      ];
    } catch (err) {
      setError('Failed to search player history');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getUserBestSeason = async (nickname: string): Promise<UserBestSeason | null> => {
    setLoading(true);
    try {
      // Mock best season data
      return {
        season_name: 'Spring',
        season_year: 2024,
        final_rank: 12,
        ranking_points: 1350,
        achievement_level: 'Advanced'
      };
    } catch (err) {
      setError('Failed to fetch user best season');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getCurrentSeason,
    getSeasonProgress,
    getSeasonComparison,
    searchPlayerHistory,
    getUserBestSeason
  };
};
