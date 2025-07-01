import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define Season and SeasonStanding locally to avoid conflicts
interface LocalSeason {
  id: string;
  name: string;
  year: number;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  description?: string;
  total_prize_pool: number;
  total_tournaments: number;
  total_participants: number;
  type?: string;
  created_at: string;
  updated_at: string;
}

interface LocalSeasonStanding {
  id: string;
  season_id: string;
  user_id: string;
  total_elo_points: number;
  tournaments_played: number;
  best_finish: number;
  total_prize_money: number;
  current_rank: number;
  previous_rank?: number;
  rank_change?: number;
  created_at: string;
  updated_at: string;
  season?: LocalSeason;
}

export const useSeasons = () => {
  const [seasons, setSeasons] = useState<LocalSeason[]>([]);
  const [currentSeason, setCurrentSeason] = useState<LocalSeason | null>(null);
  const [standings, setStandings] = useState<LocalSeasonStanding[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSeasons = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;

      setSeasons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch seasons');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCurrentSeason = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .eq('status', 'ongoing')
        .single();

      if (error) {
        if (error.message.includes('No rows found')) {
          setCurrentSeason(null);
        } else {
          throw error;
        }
      } else {
        setCurrentSeason(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch current season');
      setCurrentSeason(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSeasonStandings = useCallback(async (seasonId: string) => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('season_standings')
        .select('*')
        .eq('season_id', seasonId)
        .order('total_elo_points', { ascending: false });

      if (error) throw error;

      setStandings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch season standings');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSeason = useCallback(async (seasonData: Partial<LocalSeason>) => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('seasons')
        .insert([{
          ...seasonData,
          start_date: seasonData.start_date,
          end_date: seasonData.end_date,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
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

  const updateSeason = useCallback(async (id: string, updates: Partial<LocalSeason>) => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('seasons')
        .update({
          ...updates,
          start_date: updates.start_date,
          end_date: updates.end_date,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSeasons(prev => prev.map(s => s.id === id ? data : s));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update season');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSeason = useCallback(async (id: string) => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('seasons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSeasons(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete season');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSeasonStanding = useCallback(async (standingData: Partial<LocalSeasonStanding>) => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('season_standings')
        .insert([standingData])
        .select()
        .single();

      if (error) throw error;

      setStandings(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create season standing');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSeasonStanding = useCallback(async (id: string, updates: Partial<LocalSeasonStanding>) => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('season_standings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setStandings(prev => prev.map(s => s.id === id ? data : s));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update season standing');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSeasonById = useCallback((id: string) => {
    return seasons.find(season => season.id === id);
  }, [seasons]);

  const getCurrentSeasonStandings = useCallback(() => {
    if (!currentSeason) return [];
    return standings.filter(standing => standing.season_id === currentSeason.id);
  }, [currentSeason, standings]);

  const calculateTotalPrizePool = useCallback(() => {
    return seasons.reduce((total, season) => total + season.total_prize_pool, 0);
  }, [seasons]);

  const calculateTotalParticipants = useCallback(() => {
    return seasons.reduce((total, season) => total + (season.total_participants || 0), 0);
  }, [seasons]);

  const calculateAveragePrizePool = useCallback(() => {
    if (seasons.length === 0) return 0;
    const totalPrizePool = calculateTotalPrizePool();
    return totalPrizePool / seasons.length;
  }, [seasons, calculateTotalPrizePool]);

  const getUpcomingSeasons = useCallback(() => {
    return seasons.filter(season => season.status === 'upcoming');
  }, [seasons]);

  const getOngoingSeasons = useCallback(() => {
    return seasons.filter(season => season.status === 'ongoing');
  }, [seasons]);

  const getCompletedSeasons = useCallback(() => {
    return seasons.filter(season => season.status === 'completed');
  }, [seasons]);

  useEffect(() => {
    fetchSeasons();
    fetchCurrentSeason();
  }, [fetchSeasons, fetchCurrentSeason]);

  return {
    seasons,
    currentSeason,
    standings,
    loading,
    error,
    fetchSeasons,
    createSeason,
    updateSeason,
    deleteSeason,
    fetchSeasonStandings,
    createSeasonStanding,
    updateSeasonStanding,
    getSeasonById,
    getCurrentSeasonStandings,
    calculateTotalPrizePool,
    calculateTotalParticipants,
    calculateAveragePrizePool,
    getUpcomingSeasons,
    getOngoingSeasons,
    getCompletedSeasons,
  };
};
