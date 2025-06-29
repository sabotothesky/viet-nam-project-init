import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { TournamentFormData } from '@/types/common';
import { 
  Tournament, 
  TournamentRegistration, 
  TournamentMatch, 
  TournamentResult,
  TournamentFilters,
  TournamentTier,
  TOURNAMENT_TIERS
} from '../types/tournament';

export interface Tournament {
  id: string;
  name: string;
  description: string;
  organizer_id: string;
  organizer: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  status: 'upcoming' | 'registration' | 'active' | 'completed' | 'cancelled';
  tournament_type: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
  match_type: '8-ball' | '9-ball' | '10-ball' | 'straight-pool';
  entry_fee: number;
  prize_pool: number;
  max_participants: number;
  current_participants: number;
  venue: string;
  start_date: Date;
  end_date: Date;
  registration_deadline: Date;
  rules: string;
  created_at: Date;
  updated_at: Date;
  participants?: TournamentParticipant[];
  brackets?: TournamentBracket[];
}

export interface TournamentParticipant {
  id: string;
  tournament_id: string;
  user_id: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
    rank: string;
  };
  registration_date: Date;
  status: 'registered' | 'confirmed' | 'eliminated' | 'winner';
  seed?: number;
  final_rank?: number;
}

export interface TournamentBracket {
  id: string;
  tournament_id: string;
  round: number;
  match_number: number;
  player1_id?: string;
  player2_id?: string;
  winner_id?: string;
  score?: string;
  scheduled_time?: Date;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface CreateTournamentData {
  name: string;
  description: string;
  tournament_type: Tournament['tournament_type'];
  match_type: Tournament['match_type'];
  entry_fee: number;
  prize_pool: number;
  max_participants: number;
  venue: string;
  start_date: Date;
  end_date: Date;
  registration_deadline: Date;
  rules: string;
}

export const useTournaments = (userId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('tournaments')
        .select(`
          *,
          club:clubs(*),
          tier:tournament_tiers(*)
        `)
        .order('tournament_start', { ascending: true });

      if (userId) {
        query = query.eq('organizer_id', userId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setTournaments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tournaments');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createTournament = useCallback(async (data: CreateTournamentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: newTournamentData, error } = await supabase
        .from('tournaments')
        .insert([{
          ...data,
          organizer_id: user.id,
          status: 'upcoming',
          current_participants: 0,
          created_at: new Date(),
          updated_at: new Date()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setTournaments(prev => [newTournamentData, ...prev]);
      return newTournamentData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tournament');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  const updateTournament = useCallback(async (id: string, updates: Partial<Tournament>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setTournaments(prev => prev.map(t => t.id === id ? data : t));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tournament');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTournament = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('tournaments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTournaments(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tournament');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerForTournament = useCallback(async (tournamentId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('tournament_registrations')
        .insert([{
          tournament_id: tournamentId,
          user_id: user.id,
          status: 'registered'
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update tournament participant count
      await supabase.rpc('increment_tournament_participants', { tournament_id: tournamentId });
      
      setTournaments(prev => 
        prev.map(tournament => 
          tournament.id === tournamentId 
            ? { ...tournament, current_participants: tournament.current_participants + 1 }
            : tournament
        )
      );
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register for tournament');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  const cancelRegistration = useCallback(async (tournamentId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('tournament_registrations')
        .update({ status: 'cancelled' })
        .eq('tournament_id', tournamentId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Decrease tournament participant count
      await supabase.rpc('decrement_tournament_participants', { tournament_id: tournamentId });
      
      setTournaments(prev => 
        prev.map(tournament => 
          tournament.id === tournamentId 
            ? { ...tournament, current_participants: Math.max(0, tournament.current_participants - 1) }
            : tournament
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel registration');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  const getTournamentRegistrations = useCallback(async (tournamentId: string) => {
    try {
      const { data, error } = await supabase
        .from('tournament_registrations')
        .select(`
          *,
          user:user_profiles(*)
        `)
        .eq('tournament_id', tournamentId);
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch registrations');
      return [];
    }
  }, []);

  const createTournamentMatch = useCallback(async (matchData: Partial<TournamentMatch>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('tournament_matches')
        .insert([matchData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create match');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMatchResult = useCallback(async (matchId: string, result: Partial<TournamentMatch>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('tournament_matches')
        .update(result)
        .eq('id', matchId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update match result');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTournamentResult = useCallback(async (resultData: Partial<TournamentResult>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('tournament_results')
        .insert([resultData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tournament result');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateEloPoints = useCallback((tierCode: string, position: number): number => {
    const tier = TOURNAMENT_TIERS.find(t => t.code === tierCode);
    if (!tier) return 0;

    if (position === 1) return tier.elo_points.first;
    if (position === 2) return tier.elo_points.second;
    if (position === 3) return tier.elo_points.third;
    if (position === 4) return tier.elo_points.fourth;
    if (position <= 8) return tier.elo_points.top8;
    return tier.elo_points.participation;
  }, []);

  const getTournamentTiers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tournament_tiers')
        .select('*')
        .order('code');
      
      if (error) throw error;
      return data || TOURNAMENT_TIERS;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tournament tiers');
      return TOURNAMENT_TIERS;
    }
  }, []);

  const getTournamentResults = useCallback(async (tournamentId: string) => {
    try {
      const { data, error } = await supabase
        .from('tournament_results')
        .select(`
          *,
          user:user_profiles(*)
        `)
        .eq('tournament_id', tournamentId)
        .order('final_position');
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tournament results');
      return [];
    }
  }, []);

  const finalizeTournament = useCallback(async (tournamentId: string, results: Array<{
    user_id: string;
    final_position: number;
    prize_money?: number;
    matches_played: number;
    matches_won: number;
    matches_lost: number;
  }>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get tournament info for tier code
      const { data: tournament } = await supabase
        .from('tournaments')
        .select('tier_code')
        .eq('id', tournamentId)
        .single();
      
      if (!tournament?.tier_code) {
        throw new Error('Tournament tier not found');
      }

      // Create results with calculated ELO points
      const resultsWithElo = results.map(result => ({
        ...result,
        tournament_id: tournamentId,
        elo_points_earned: calculateEloPoints(tournament.tier_code, result.final_position)
      }));

      const { error } = await supabase
        .from('tournament_results')
        .insert(resultsWithElo);
      
      if (error) throw error;

      // Update tournament status to completed
      await supabase
        .from('tournaments')
        .update({ status: 'completed' })
        .eq('id', tournamentId);

      // Recalculate rankings
      await supabase.rpc('recalculate_rankings');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to finalize tournament');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [calculateEloPoints]);

  const getTournamentById = useCallback((tournamentId: string) => {
    return tournaments.find(tournament => tournament.id === tournamentId);
  }, [tournaments]);

  const getTournamentsByStatus = useCallback((status: Tournament['status']) => {
    return tournaments.filter(tournament => tournament.status === status);
  }, [tournaments]);

  const getMyTournaments = useCallback(() => {
    if (!user.id) return [];
    return tournaments.filter(tournament => 
      tournament.organizer_id === user.id
    );
  }, [tournaments, user.id]);

  const searchTournaments = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return tournaments.filter(tournament => 
      tournament.name.toLowerCase().includes(lowercaseQuery) ||
      tournament.description.toLowerCase().includes(lowercaseQuery) ||
      tournament.venue.toLowerCase().includes(lowercaseQuery)
    );
  }, [tournaments]);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  return {
    tournaments,
    loading,
    error,
    fetchTournaments,
    createTournament,
    updateTournament,
    deleteTournament,
    registerForTournament,
    cancelRegistration,
    getTournamentRegistrations,
    createTournamentMatch,
    updateMatchResult,
    createTournamentResult,
    calculateEloPoints,
    getTournamentTiers,
    getTournamentResults,
    finalizeTournament,
    getTournamentById,
    getTournamentsByStatus,
    getMyTournaments,
    searchTournaments
  };
};

export const useTournamentById = (id: string) => {
  return useQuery({
    queryKey: ['tournament', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          *,
          clubs(name, address, phone, email)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
