import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Season2Info, Season2Prize } from '../types/qr';

export interface Season2 {
  id: string;
  name: string;
  description: string;
  version: '2.0';
  start_date: Date;
  end_date: Date;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  features: Season2Feature[];
  rules: Season2Rules;
  rewards: Season2Rewards;
  leaderboard: Season2Leaderboard;
  created_at: Date;
  updated_at: Date;
}

export interface Season2Feature {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  is_enabled: boolean;
  category: 'matchmaking' | 'ranking' | 'rewards' | 'social' | 'analytics';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface Season2Rules {
  match_types: {
    '8-ball': boolean;
    '9-ball': boolean;
    '10-ball': boolean;
    'straight-pool': boolean;
  };
  ranking_system: {
    algorithm: 'elo' | 'glicko' | 'trueskill';
    k_factor: number;
    volatility: number;
    confidence: number;
  };
  matchmaking: {
    algorithm: 'skill_based' | 'rank_based' | 'hybrid';
    max_skill_difference: number;
    max_wait_time: number;
    queue_size: number;
  };
  penalties: {
    no_show: number;
    late_arrival: number;
    unsportsmanlike: number;
    cheating: number;
  };
}

export interface Season2Rewards {
  tiers: Season2RewardTier[];
  achievements: Season2Achievement[];
  seasonal_rewards: Season2SeasonalReward[];
}

export interface Season2RewardTier {
  id: string;
  name: string;
  rank_range: {
    min: number;
    max: number;
  };
  rewards: {
    coins: number;
    experience: number;
    items: string[];
    badges: string[];
  };
  requirements: {
    min_matches: number;
    min_win_rate: number;
    min_elo: number;
  };
}

export interface Season2Achievement {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  category: 'match' | 'streak' | 'tournament' | 'social' | 'special';
  points: number;
  requirements: {
    [key: string]: number;
  };
  is_hidden: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Season2SeasonalReward {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  type: 'title' | 'avatar_frame' | 'emote' | 'banner' | 'currency';
  value: string | number;
  unlock_condition: string;
  season_exclusive: boolean;
}

export interface Season2Leaderboard {
  id: string;
  season_id: string;
  type: 'global' | 'regional' | 'club' | 'friends';
  entries: Season2LeaderboardEntry[];
  last_updated: Date;
}

export interface Season2LeaderboardEntry {
  id: string;
  user_id: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
    rank: string;
  };
  rank: number;
  previous_rank: number;
  rank_change: number;
  elo_rating: number;
  elo_change: number;
  total_matches: number;
  wins: number;
  losses: number;
  win_rate: number;
  current_streak: number;
  longest_streak: number;
  total_points: number;
  achievements_count: number;
  last_match_date?: Date;
  performance_metrics: {
    consistency: number;
    volatility: number;
    form: number;
    potential: number;
  };
}

export interface Season2Stats {
  total_players: number;
  active_players: number;
  total_matches: number;
  average_elo: number;
  top_elo: number;
  average_win_rate: number;
  most_popular_match_type: string;
  average_matches_per_player: number;
  seasonal_achievements_unlocked: number;
}

export const useSeason2 = (userId?: string) => {
  const [season2, setSeason2] = useState<Season2 | null>(null);
  const [leaderboard, setLeaderboard] = useState<Season2Leaderboard | null>(
    null
  );
  const [stats, setStats] = useState<Season2Stats | null>(null);
  const [userProgress, setUserProgress] =
    useState<Season2LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Season 2 data
  const fetchSeason2 = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock Season 2 data
      const mockSeason2: Season2 = {
        id: 'season2_2024',
        name: 'Season 2 - The Evolution',
        description:
          'Mùa giải mới với hệ thống ranking cải tiến, matchmaking thông minh và nhiều tính năng mới',
        version: '2.0',
        start_date: new Date('2024-04-01'),
        end_date: new Date('2024-06-30'),
        status: 'active',
        features: [
          {
            id: '1',
            name: 'Smart Matchmaking',
            description: 'Hệ thống ghép đôi thông minh dựa trên skill và rank',
            icon_url: '/features/smart-matchmaking.png',
            is_enabled: true,
            category: 'matchmaking',
            priority: 'high',
          },
          {
            id: '2',
            name: 'Enhanced ELO System',
            description: 'Hệ thống ELO cải tiến với volatility và confidence',
            icon_url: '/features/enhanced-elo.png',
            is_enabled: true,
            category: 'ranking',
            priority: 'critical',
          },
          {
            id: '3',
            name: 'Seasonal Rewards',
            description: 'Hệ thống phần thưởng theo mùa giải',
            icon_url: '/features/seasonal-rewards.png',
            is_enabled: true,
            category: 'rewards',
            priority: 'high',
          },
          {
            id: '4',
            name: 'Social Features',
            description: 'Tính năng xã hội nâng cao',
            icon_url: '/features/social-features.png',
            is_enabled: true,
            category: 'social',
            priority: 'medium',
          },
          {
            id: '5',
            name: 'Advanced Analytics',
            description: 'Phân tích chi tiết về hiệu suất',
            icon_url: '/features/advanced-analytics.png',
            is_enabled: true,
            category: 'analytics',
            priority: 'medium',
          },
        ],
        rules: {
          match_types: {
            '8-ball': true,
            '9-ball': true,
            '10-ball': true,
            'straight-pool': false,
          },
          ranking_system: {
            algorithm: 'elo',
            k_factor: 32,
            volatility: 0.06,
            confidence: 0.95,
          },
          matchmaking: {
            algorithm: 'hybrid',
            max_skill_difference: 200,
            max_wait_time: 300,
            queue_size: 50,
          },
          penalties: {
            no_show: 50,
            late_arrival: 25,
            unsportsmanlike: 100,
            cheating: 500,
          },
        },
        rewards: {
          tiers: [
            {
              id: 'tier1',
              name: 'Bronze',
              rank_range: { min: 1, max: 100 },
              rewards: {
                coins: 1000,
                experience: 500,
                items: ['bronze_badge'],
                badges: ['bronze_medal'],
              },
              requirements: {
                min_matches: 10,
                min_win_rate: 0.3,
                min_elo: 1200,
              },
            },
            {
              id: 'tier2',
              name: 'Silver',
              rank_range: { min: 101, max: 500 },
              rewards: {
                coins: 2500,
                experience: 1000,
                items: ['silver_badge', 'silver_frame'],
                badges: ['silver_medal'],
              },
              requirements: {
                min_matches: 25,
                min_win_rate: 0.4,
                min_elo: 1400,
              },
            },
            {
              id: 'tier3',
              name: 'Gold',
              rank_range: { min: 501, max: 1000 },
              rewards: {
                coins: 5000,
                experience: 2000,
                items: ['gold_badge', 'gold_frame', 'gold_emote'],
                badges: ['gold_medal'],
              },
              requirements: {
                min_matches: 50,
                min_win_rate: 0.5,
                min_elo: 1600,
              },
            },
          ],
          achievements: [
            {
              id: 'ach1',
              name: 'Season 2 Pioneer',
              description: 'Tham gia Season 2 từ ngày đầu tiên',
              icon_url: '/achievements/pioneer.png',
              category: 'special',
              points: 50,
              requirements: { join_date: 1 },
              is_hidden: false,
              rarity: 'rare',
            },
            {
              id: 'ach2',
              name: 'ELO Climber',
              description: 'Tăng ELO rating 200 điểm trong một mùa giải',
              icon_url: '/achievements/elo_climber.png',
              category: 'match',
              points: 30,
              requirements: { elo_gain: 200 },
              is_hidden: false,
              rarity: 'epic',
            },
          ],
          seasonal_rewards: [
            {
              id: 'sr1',
              name: 'Season 2 Champion Title',
              description: 'Danh hiệu dành cho nhà vô địch Season 2',
              icon_url: '/rewards/champion_title.png',
              type: 'title',
              value: 'Season 2 Champion',
              unlock_condition: 'Top 1 global leaderboard',
              season_exclusive: true,
            },
          ],
        },
        leaderboard: {
          id: 'lb1',
          season_id: 'season2_2024',
          type: 'global',
          entries: [],
          last_updated: new Date(),
        },
        created_at: new Date('2024-03-15'),
        updated_at: new Date(),
      };

      setSeason2(mockSeason2);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Không thể tải thông tin Season 2'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock leaderboard data
      const mockLeaderboard: Season2Leaderboard = {
        id: 'lb1',
        season_id: 'season2_2024',
        type: 'global',
        entries: [
          {
            id: '1',
            user_id: '1',
            user: {
              id: '1',
              username: 'pool_master',
              avatar_url: '/avatars/pool_master.jpg',
              rank: 'G',
            },
            rank: 1,
            previous_rank: 2,
            rank_change: 1,
            elo_rating: 2100,
            elo_change: 50,
            total_matches: 45,
            wins: 38,
            losses: 7,
            win_rate: 0.844,
            current_streak: 8,
            longest_streak: 12,
            total_points: 125,
            achievements_count: 8,
            last_match_date: new Date(Date.now() - 1000 * 60 * 60 * 2),
            performance_metrics: {
              consistency: 0.85,
              volatility: 0.12,
              form: 0.92,
              potential: 0.88,
            },
          },
          {
            id: '2',
            user_id: '2',
            user: {
              id: '2',
              username: 'champion',
              avatar_url: '/avatars/champion.jpg',
              rank: 'G',
            },
            rank: 2,
            previous_rank: 1,
            rank_change: -1,
            elo_rating: 2050,
            elo_change: -25,
            total_matches: 42,
            wins: 35,
            losses: 7,
            win_rate: 0.833,
            current_streak: 3,
            longest_streak: 10,
            total_points: 115,
            achievements_count: 6,
            last_match_date: new Date(Date.now() - 1000 * 60 * 60 * 6),
            performance_metrics: {
              consistency: 0.82,
              volatility: 0.15,
              form: 0.78,
              potential: 0.85,
            },
          },
        ],
        last_updated: new Date(),
      };

      setLeaderboard(mockLeaderboard);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Không thể tải bảng xếp hạng'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockStats: Season2Stats = {
        total_players: 2500,
        active_players: 1800,
        total_matches: 15000,
        average_elo: 1550,
        top_elo: 2100,
        average_win_rate: 0.52,
        most_popular_match_type: '8-ball',
        average_matches_per_player: 6,
        seasonal_achievements_unlocked: 4500,
      };

      setStats(mockStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải thống kê');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user progress
  const fetchUserProgress = useCallback(
    async (targetUserId?: string) => {
      const id = targetUserId || userId;
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 600));

        const mockUserProgress: Season2LeaderboardEntry = {
          id: 'user_progress',
          user_id: id,
          user: {
            id: id,
            username: 'current_user',
            avatar_url: '/avatars/current_user.jpg',
            rank: 'A',
          },
          rank: 15,
          previous_rank: 18,
          rank_change: 3,
          elo_rating: 1750,
          elo_change: 75,
          total_matches: 28,
          wins: 20,
          losses: 8,
          win_rate: 0.714,
          current_streak: 4,
          longest_streak: 6,
          total_points: 85,
          achievements_count: 4,
          last_match_date: new Date(Date.now() - 1000 * 60 * 60 * 1),
          performance_metrics: {
            consistency: 0.78,
            volatility: 0.18,
            form: 0.85,
            potential: 0.82,
          },
        };

        setUserProgress(mockUserProgress);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Không thể tải tiến độ người dùng'
        );
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  // Get enabled features
  const getEnabledFeatures = useCallback(() => {
    if (!season2) return [];
    return season2.features.filter(feature => feature.is_enabled);
  }, [season2]);

  // Get features by category
  const getFeaturesByCategory = useCallback(
    (category: Season2Feature['category']) => {
      if (!season2) return [];
      return season2.features.filter(feature => feature.category === category);
    },
    [season2]
  );

  // Get current tier
  const getCurrentTier = useCallback(
    (eloRating: number) => {
      if (!season2) return null;

      return season2.rewards.tiers.find(
        tier => eloRating >= tier.requirements.min_elo
      );
    },
    [season2]
  );

  // Get next tier
  const getNextTier = useCallback(
    (eloRating: number) => {
      if (!season2) return null;

      const currentTier = getCurrentTier(eloRating);
      if (!currentTier) return season2.rewards.tiers[0];

      const currentIndex = season2.rewards.tiers.findIndex(
        tier => tier.id === currentTier.id
      );
      return season2.rewards.tiers[currentIndex + 1] || null;
    },
    [season2, getCurrentTier]
  );

  // Calculate progress to next tier
  const getProgressToNextTier = useCallback(
    (eloRating: number) => {
      const currentTier = getCurrentTier(eloRating);
      const nextTier = getNextTier(eloRating);

      if (!currentTier || !nextTier) return 0;

      const currentElo = currentTier.requirements.min_elo;
      const nextElo = nextTier.requirements.min_elo;
      const userElo = eloRating;

      return Math.min(
        100,
        Math.max(0, ((userElo - currentElo) / (nextElo - currentElo)) * 100)
      );
    },
    [getCurrentTier, getNextTier]
  );

  // Get leaderboard by type
  const getLeaderboardByType = useCallback(
    (type: Season2Leaderboard['type']) => {
      if (!leaderboard) return null;
      return leaderboard.type === type ? leaderboard : null;
    },
    [leaderboard]
  );

  // Get top players
  const getTopPlayers = useCallback(
    (limit: number = 10) => {
      if (!leaderboard) return [];
      return leaderboard.entries.slice(0, limit);
    },
    [leaderboard]
  );

  // Get user's rank
  const getUserRank = useCallback(
    (targetUserId?: string) => {
      const id = targetUserId || userId;
      if (!leaderboard || !id) return null;

      return leaderboard.entries.find(entry => entry.user_id === id);
    },
    [leaderboard, userId]
  );

  useEffect(() => {
    fetchSeason2();
    fetchLeaderboard();
    fetchStats();
    fetchUserProgress();
  }, [fetchSeason2, fetchLeaderboard, fetchStats, fetchUserProgress]);

  return {
    season2,
    leaderboard,
    stats,
    userProgress,
    loading,
    error,
    fetchSeason2,
    fetchLeaderboard,
    fetchStats,
    fetchUserProgress,
    getEnabledFeatures,
    getFeaturesByCategory,
    getCurrentTier,
    getNextTier,
    getProgressToNextTier,
    getLeaderboardByType,
    getTopPlayers,
    getUserRank,
  };
};
