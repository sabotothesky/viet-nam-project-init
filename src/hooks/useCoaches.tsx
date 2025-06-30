import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Coach {
  id: string;
  user_id: string;
  certification_level: string;
  specializations: string[];
  experience_years: number;
  hourly_rate: number;
  bio: string;
  achievements: string[];
  rating: number;
  total_students: number;
  available_times: CoachAvailability;
  status: string;
  verified: boolean;
  created_at: string;
}

interface CoachAvailability {
  days: string[];
  hours: string[];
  [key: string]: any;
}

export interface CoachingSession {
  id: string;
  coach_id: string;
  student_id: string;
  session_type: string;
  club_id?: string;
  session_date: string;
  duration_hours: number;
  hourly_rate: number;
  total_cost: number;
  focus_areas: string[];
  session_notes?: string;
  homework?: string;
  status: string;
  payment_status: string;
  created_at: string;
}

export const useCoaches = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [mySessions, setMySessions] = useState<CoachingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCoaches = async () => {
    try {
      const { data, error } = await supabase
        .from('coaches')
        .select('*')
        .eq('status', 'active')
        .order('rating', { ascending: false });

      if (error) throw error;
      setCoaches(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch coaches');
    }
  };

  const fetchMySessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('coaching_sessions')
        .select('*')
        .eq('student_id', user.id)
        .order('session_date', { ascending: true });

      if (error) throw error;
      setMySessions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
    }
  };

  const bookSession = async (
    sessionData: Omit<CoachingSession, 'id' | 'student_id' | 'created_at'>
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('coaching_sessions')
        .insert({
          ...sessionData,
          student_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh sessions
      await fetchMySessions();
      return data;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : 'Failed to book session'
      );
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCoaches(), fetchMySessions()]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    coaches,
    mySessions,
    loading,
    error,
    bookSession,
    refreshCoaches: fetchCoaches,
    refreshSessions: fetchMySessions,
  };
};
