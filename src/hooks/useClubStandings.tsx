import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { ClubStanding, ClubStandingFilters } from '../types/tournament';

export const useClubStandings = () => {
  const [clubStandings, setClubStandings] = useState<ClubStanding[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClubStandings = useCallback(async (clubId: string, filters?: ClubStandingFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('club_standings')
        .select(`
          *,
          user:user_profiles(*),
          club:clubs(*)
        `)
        .eq('club_id', clubId)
        .order('current_rank', { ascending: true });

      if (filters?.rank_range) {
        query = query
          .gte('current_rank', filters.rank_range.min)
          .lte('current_rank', filters.rank_range.max);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      setClubStandings(data || []);
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch club standings');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getPlayerClubStanding = useCallback(async (userId: string, clubId: string) => {
    try {
      const { data, error } = await supabase
        .from('club_standings')
        .select(`
          *,
          club:clubs(*)
        `)
        .eq('user_id', userId)
        .eq('club_id', clubId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch player club standing');
      return null;
    }
  }, []);

  const verifyPlayerAtClub = useCallback(async (userId: string, clubId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('club_standings')
        .upsert([{
          user_id: userId,
          club_id: clubId,
          verified_at: new Date().toISOString(),
          total_elo_points: 0,
          tournaments_played: 0,
          current_rank: 1
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh standings
      await fetchClubStandings(clubId);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify player at club');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchClubStandings]);

  const removePlayerFromClub = useCallback(async (userId: string, clubId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('club_standings')
        .delete()
        .eq('user_id', userId)
        .eq('club_id', clubId);
      
      if (error) throw error;
      
      // Refresh standings
      await fetchClubStandings(clubId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove player from club');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchClubStandings]);

  const getClubLeaderboard = useCallback(async (clubId: string, limit: number = 10) => {
    try {
      const { data, error } = await supabase
        .from('club_standings')
        .select(`
          *,
          user:user_profiles(*)
        `)
        .eq('club_id', clubId)
        .order('current_rank', { ascending: true })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch club leaderboard');
      return [];
    }
  }, []);

  const getClubStatistics = useCallback(async (clubId: string) => {
    try {
      const { data, error } = await supabase
        .from('club_standings')
        .select('*')
        .eq('club_id', clubId);
      
      if (error) throw error;
      
      const stats = {
        totalPlayers: data?.length || 0,
        totalEloPoints: data?.reduce((sum, standing) => sum + standing.total_elo_points, 0) || 0,
        averageEloPoints: data?.length ? 
          data.reduce((sum, standing) => sum + standing.total_elo_points, 0) / data.length : 0,
        totalTournaments: data?.reduce((sum, standing) => sum + standing.tournaments_played, 0) || 0,
        verifiedPlayers: data?.filter(s => s.verified_at).length || 0
      };
      
      return stats;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch club statistics');
      return null;
    }
  }, []);

  const getPlayerClubHistory = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('club_standings')
        .select(`
          *,
          club:clubs(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch player club history');
      return [];
    }
  }, []);

  const recalculateClubRankings = useCallback(async (clubId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.rpc('recalculate_rankings');
      
      if (error) throw error;
      
      // Refresh standings
      await fetchClubStandings(clubId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to recalculate club rankings');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchClubStandings]);

  const getTopPlayersByClub = useCallback(async (limit: number = 5) => {
    try {
      const { data, error } = await supabase
        .from('club_standings')
        .select(`
          *,
          user:user_profiles(*),
          club:clubs(*)
        `)
        .order('total_elo_points', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch top players by club');
      return [];
    }
  }, []);

  const getClubComparison = useCallback(async (clubIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('club_standings')
        .select(`
          *,
          club:clubs(*)
        `)
        .in('club_id', clubIds);
      
      if (error) throw error;
      
      // Group by club and calculate statistics
      const clubStats = clubIds.map(clubId => {
        const clubData = data?.filter(s => s.club_id === clubId) || [];
        return {
          club_id: clubId,
          club_name: clubData[0]?.club?.name || 'Unknown Club',
          total_players: clubData.length,
          total_elo_points: clubData.reduce((sum, s) => sum + s.total_elo_points, 0),
          average_elo_points: clubData.length ? 
            clubData.reduce((sum, s) => sum + s.total_elo_points, 0) / clubData.length : 0,
          top_player: clubData.sort((a, b) => b.total_elo_points - a.total_elo_points)[0]
        };
      });
      
      return clubStats;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch club comparison');
      return [];
    }
  }, []);

  return {
    clubStandings,
    loading,
    error,
    fetchClubStandings,
    getPlayerClubStanding,
    verifyPlayerAtClub,
    removePlayerFromClub,
    getClubLeaderboard,
    getClubStatistics,
    getPlayerClubHistory,
    recalculateClubRankings,
    getTopPlayersByClub,
    getClubComparison
  };
}; 