
import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Match } from '../types/common';

export const useMatches = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createMatch = async (matchData: Partial<Match>): Promise<Match | null> => {
    setLoading(true);
    setError('');

    try {
      const { data, error: createError } = await supabase
        .from('matches')
        .insert({
          ...matchData,
          frames: matchData.frames || 1 // Provide default value for frames
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      return data;
    } catch (err) {
      console.error('Error creating match:', err);
      setError(err instanceof Error ? err.message : 'Failed to create match');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createMatch
  };
};
