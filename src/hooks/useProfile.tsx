import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { UserProfile } from '../types/common';

interface ProfileFormData {
  full_name: string;
  nickname?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  club_id?: string;
}

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getProfile = async (): Promise<UserProfile | null> => {
    setLoading(true);
    setError('');

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('No authenticated user');
      }

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: ProfileFormData): Promise<UserProfile | null> => {
    setLoading(true);
    setError('');

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('No authenticated user');
      }

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userData.user.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      return data;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getProfile,
    updateProfile
  };
};
