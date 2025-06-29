import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Season, SeasonStanding, SeasonFilters } from '../types/tournament';

export interface Season {
  id: string;
  name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  type: 'regular' | 'championship' | 'special';
  rules: string;
  prize_pool: number;
  entry_fee: number;
  max_participants: number;
  current_participants: number;
  registration_deadline: Date;
  created_at: Date;
  updated_at: Date;
}

export interface SeasonParticipant {
  id: string;
  season_id: string;
  user_id: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
    rank: string;
  };
  registration_date: Date;
  status: 'registered' | 'active' | 'eliminated' | 'winner' | 'runner_up';
  current_rank: number;
  final_rank?: number;
  total_matches: number;
  wins: number;
  losses: number;
  win_rate: number;
  elo_rating: number;
  points: number;
  achievements: SeasonAchievement[];
}

export interface SeasonAchievement {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  points: number;
  earned_at: Date;
}

export interface SeasonMatch {
  id: string;
  season_id: string;
  player1_id: string;
  player1: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  player2_id: string;
  player2: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  round: number;
  match_number: number;
  winner_id?: string;
  score?: string;
  scheduled_time?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  venue?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SeasonStanding {
  rank: number;
  user_id: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
    rank: string;
  };
  points: number;
  matches_played: number;
  wins: number;
  losses: number;
  win_rate: number;
  elo_rating: number;
  streak: number;
}

export interface CreateSeasonData {
  name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  type: Season['type'];
  rules: string;
  prize_pool: number;
  entry_fee: number;
  max_participants: number;
  registration_deadline: Date;
}

export const useSeasons = (userId?: string) => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);
  const [participants, setParticipants] = useState<SeasonParticipant[]>([]);
  const [matches, setMatches] = useState<SeasonMatch[]>([]);
  const [standings, setStandings] = useState<SeasonStanding[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSeasons = useCallback(async (filters?: SeasonFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('seasons')
        .select('*')
        .order('year', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.year) {
        query = query.eq('year', filters.year);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      setSeasons(data || []);
      
      // Set current season (ongoing)
      const ongoing = data?.find(s => s.status === 'ongoing');
      if (ongoing) {
        setCurrentSeason(ongoing);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch seasons');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSeason = useCallback(async (seasonData: Partial<Season>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('seasons')
        .insert([seasonData])
        .select()
        .single();
      
      if (error) throw error;
      
      setSeasons(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create season');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSeason = useCallback(async (id: string, updates: Partial<Season>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('seasons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setSeasons(prev => prev.map(s => s.id === id ? data : s));
      
      // Update current season if this is the ongoing one
      if (data.status === 'ongoing') {
        setCurrentSeason(data);
      } else if (currentSeason?.id === id) {
        setCurrentSeason(null);
      }
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update season');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentSeason]);

  const fetchSeasonStandings = useCallback(async (seasonId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('season_standings')
        .select(`
          *,
          user:user_profiles(*)
        `)
        .eq('season_id', seasonId)
        .order('current_rank', { ascending: true });
      
      if (error) throw error;
      
      setStandings(data || []);
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch season standings');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentSeasonStandings = useCallback(async () => {
    if (!currentSeason) return [];
    
    return await fetchSeasonStandings(currentSeason.id);
  }, [currentSeason, fetchSeasonStandings]);

  const getSeasonStatistics = useCallback(async (seasonId: string) => {
    try {
      const { data, error } = await supabase
        .from('season_standings')
        .select('*')
        .eq('season_id', seasonId);
      
      if (error) throw error;
      
      const stats = {
        totalParticipants: data?.length || 0,
        totalEloPoints: data?.reduce((sum, standing) => sum + standing.total_elo_points, 0) || 0,
        averageEloPoints: data?.length ? 
          data.reduce((sum, standing) => sum + standing.total_elo_points, 0) / data.length : 0,
        totalTournaments: data?.reduce((sum, standing) => sum + standing.tournaments_played, 0) || 0,
        totalPrizeMoney: data?.reduce((sum, standing) => sum + (standing.total_prize_money || 0), 0) || 0
      };
      
      return stats;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch season statistics');
      return null;
    }
  }, []);

  const getPlayerSeasonHistory = useCallback(async (userId: string, seasonId?: string) => {
    try {
      let query = supabase
        .from('season_standings')
        .select(`
          *,
          season:seasons(*)
        `)
        .eq('user_id', userId);

      if (seasonId) {
        query = query.eq('season_id', seasonId);
      }

      const { data, error } = await query.order('season.year', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch player season history');
      return [];
    }
  }, []);

  const recalculateSeasonRankings = useCallback(async (seasonId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.rpc('recalculate_rankings');
      
      if (error) throw error;
      
      // Refresh standings
      await fetchSeasonStandings(seasonId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to recalculate rankings');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchSeasonStandings]);

  const endSeason = useCallback(async (seasonId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Update season status to completed
      const { error } = await supabase
        .from('seasons')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', seasonId);
      
      if (error) throw error;
      
      // Recalculate final rankings
      await recalculateSeasonRankings(seasonId);
      
      // Update seasons list
      await fetchSeasons();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end season');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchSeasons, recalculateSeasonRankings]);

  const getSeasonLeaderboard = useCallback(async (seasonId: string, limit: number = 10) => {
    try {
      const { data, error } = await supabase
        .from('season_standings')
        .select(`
          *,
          user:user_profiles(*)
        `)
        .eq('season_id', seasonId)
        .order('current_rank', { ascending: true })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
      return [];
    }
  }, []);

  const getSeasonProgress = useCallback(async (seasonId: string) => {
    try {
      // Get season info
      const { data: season } = await supabase
        .from('seasons')
        .select('*')
        .eq('id', seasonId)
        .single();
      
      if (!season) return null;
      
      // Get tournaments in this season
      const { data: tournaments } = await supabase
        .from('tournaments')
        .select('id, status')
        .eq('season_id', seasonId);
      
      const totalTournaments = tournaments?.length || 0;
      const completedTournaments = tournaments?.filter(t => t.status === 'completed').length || 0;
      const ongoingTournaments = tournaments?.filter(t => t.status === 'ongoing').length || 0;
      
      // Calculate progress
      const startDate = new Date(season.start_date);
      const endDate = new Date(season.end_date);
      const currentDate = new Date();
      
      const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      const elapsedDays = Math.max(0, (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const progressPercentage = Math.min(100, (elapsedDays / totalDays) * 100);
      
      return {
        season,
        totalTournaments,
        completedTournaments,
        ongoingTournaments,
        progressPercentage,
        daysRemaining: Math.max(0, totalDays - elapsedDays)
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch season progress');
      return null;
    }
  }, []);

  // Fetch season participants
  const fetchSeasonParticipants = useCallback(async (seasonId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock participants data
      const mockParticipants: SeasonParticipant[] = [
        {
          id: '1',
          season_id: seasonId,
          user_id: '1',
          user: {
            id: '1',
            username: 'pool_master',
            avatar_url: '/avatars/pool_master.jpg',
            rank: 'A+'
          },
          registration_date: new Date('2024-02-20'),
          status: 'active',
          current_rank: 1,
          total_matches: 15,
          wins: 13,
          losses: 2,
          win_rate: 0.867,
          elo_rating: 1950,
          points: 85,
          achievements: [
            {
              id: '1',
              name: 'Chiến thắng liên tiếp',
              description: 'Thắng 5 trận liên tiếp',
              icon_url: '/achievements/winning_streak.png',
              points: 10,
              earned_at: new Date('2024-03-15')
            }
          ]
        },
        {
          id: '2',
          season_id: seasonId,
          user_id: '2',
          user: {
            id: '2',
            username: 'champion',
            avatar_url: '/avatars/champion.jpg',
            rank: 'G'
          },
          registration_date: new Date('2024-02-18'),
          status: 'active',
          current_rank: 2,
          total_matches: 14,
          wins: 12,
          losses: 2,
          win_rate: 0.857,
          elo_rating: 1900,
          points: 80,
          achievements: []
        }
      ];
      
      setParticipants(mockParticipants);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách tham gia');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch season matches
  const fetchSeasonMatches = useCallback(async (seasonId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock matches data
      const mockMatches: SeasonMatch[] = [
        {
          id: '1',
          season_id: seasonId,
          player1_id: '1',
          player1: {
            id: '1',
            username: 'pool_master',
            avatar_url: '/avatars/pool_master.jpg'
          },
          player2_id: '2',
          player2: {
            id: '2',
            username: 'champion',
            avatar_url: '/avatars/champion.jpg'
          },
          round: 1,
          match_number: 1,
          winner_id: '1',
          score: '7-5',
          scheduled_time: new Date('2024-03-10'),
          status: 'completed',
          venue: 'Club Bida ABC',
          created_at: new Date('2024-03-10'),
          updated_at: new Date()
        },
        {
          id: '2',
          season_id: seasonId,
          player1_id: '3',
          player1: {
            id: '3',
            username: 'veteran',
            avatar_url: '/avatars/veteran.jpg'
          },
          player2_id: '4',
          player2: {
            id: '4',
            username: 'newbie',
            avatar_url: '/avatars/newbie.jpg'
          },
          round: 1,
          match_number: 2,
          winner_id: '3',
          score: '7-3',
          scheduled_time: new Date('2024-03-12'),
          status: 'completed',
          venue: 'Club Bida XYZ',
          created_at: new Date('2024-03-12'),
          updated_at: new Date()
        }
      ];
      
      setMatches(mockMatches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải trận đấu mùa giải');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new season
  const createSeasonData = useCallback(async (data: CreateSeasonData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSeason: Season = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        start_date: data.start_date,
        end_date: data.end_date,
        status: 'upcoming',
        type: data.type,
        rules: data.rules,
        prize_pool: data.prize_pool,
        entry_fee: data.entry_fee,
        max_participants: data.max_participants,
        current_participants: 0,
        registration_deadline: data.registration_deadline,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      setSeasons(prev => [newSeason, ...prev]);
      return newSeason;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tạo mùa giải');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register for season
  const registerForSeason = useCallback(async (seasonId: string) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update season participants count
      setSeasons(prev => 
        prev.map(season => 
          season.id === seasonId 
            ? { ...season, current_participants: season.current_participants + 1 }
            : season
        )
      );
      
      // Add participant
      const newParticipant: SeasonParticipant = {
        id: Date.now().toString(),
        season_id: seasonId,
        user_id: userId,
        user: {
          id: userId,
          username: 'current_user',
          avatar_url: '/avatars/current_user.jpg',
          rank: 'A'
        },
        registration_date: new Date(),
        status: 'registered',
        current_rank: 0,
        total_matches: 0,
        wins: 0,
        losses: 0,
        win_rate: 0,
        elo_rating: 1500,
        points: 0,
        achievements: []
      };
      
      setParticipants(prev => [...prev, newParticipant]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể đăng ký mùa giải');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Get season by ID
  const getSeasonById = useCallback((seasonId: string) => {
    return seasons.find(season => season.id === seasonId);
  }, [seasons]);

  // Get seasons by status
  const getSeasonsByStatus = useCallback((status: Season['status']) => {
    return seasons.filter(season => season.status === status);
  }, [seasons]);

  // Get user's seasons
  const getUserSeasons = useCallback((targetUserId: string) => {
    return participants.filter(participant => participant.user_id === targetUserId);
  }, [participants]);

  // Get season statistics
  const getSeasonStats = useCallback((seasonId: string) => {
    const season = getSeasonById(seasonId);
    const seasonParticipants = participants.filter(p => p.season_id === seasonId);
    const seasonMatches = matches.filter(m => m.season_id === seasonId);
    
    if (!season) return null;
    
    return {
      total_participants: seasonParticipants.length,
      total_matches: seasonMatches.length,
      completed_matches: seasonMatches.filter(m => m.status === 'completed').length,
      average_elo: seasonParticipants.length > 0 
        ? seasonParticipants.reduce((sum, p) => sum + p.elo_rating, 0) / seasonParticipants.length 
        : 0,
      registration_progress: (season.current_participants / season.max_participants) * 100
    };
  }, [seasons, participants, matches, getSeasonById]);

  useEffect(() => {
    fetchSeasons();
  }, [fetchSeasons]);

  return {
    seasons,
    currentSeason,
    participants,
    matches,
    standings,
    loading,
    error,
    fetchSeasons,
    fetchSeasonParticipants,
    fetchSeasonMatches,
    fetchSeasonStandings,
    createSeason,
    registerForSeason,
    getSeasonById,
    getSeasonsByStatus,
    getUserSeasons,
    getSeasonStats
  };
}; 