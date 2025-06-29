import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { ProfileFormData } from '@/types/common';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  cover_photo_url?: string;
  bio?: string;
  date_of_birth?: Date;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  location?: {
    city: string;
    province: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  rank: string;
  elo_rating: number;
  total_matches: number;
  wins: number;
  losses: number;
  win_rate: number;
  achievements: Achievement[];
  stats: PlayerStats;
  preferences: UserPreferences;
  social_links: SocialLinks;
  created_at: Date;
  updated_at: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  earned_at: Date;
  category: 'match' | 'tournament' | 'social' | 'special';
}

export interface PlayerStats {
  total_tournaments: number;
  tournament_wins: number;
  tournament_runner_ups: number;
  current_streak: number;
  longest_streak: number;
  average_score: number;
  best_score: number;
  total_play_time: number; // in minutes
  favorite_venue?: string;
  favorite_opponent?: string;
}

export interface UserPreferences {
  privacy_level: 'public' | 'friends' | 'private';
  notification_settings: {
    email: boolean;
    push: boolean;
    sms: boolean;
    challenges: boolean;
    tournaments: boolean;
    achievements: boolean;
    social: boolean;
  };
  match_preferences: {
    preferred_match_type: '8-ball' | '9-ball' | '10-ball' | 'straight-pool';
    preferred_stake_range: {
      min: number;
      max: number;
    };
    auto_accept_challenges: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
  language: 'vi' | 'en';
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  website?: string;
}

export interface UpdateProfileData {
  full_name?: string;
  bio?: string;
  date_of_birth?: Date;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  location?: {
    city: string;
    province: string;
    country: string;
  };
  preferences?: Partial<UserPreferences>;
  social_links?: Partial<SocialLinks>;
}

export const useProfile = (userId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile
  const fetchProfile = useCallback(async (targetUserId?: string) => {
    const id = targetUserId || userId || user?.id;
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          clubs (
            id,
            name,
            address,
            latitude,
            longitude,
            available_tables,
            is_sabo_owned,
            priority_score
          ),
          preferred_club:clubs!profiles_preferred_club_id_fkey(
            id,
            name,
            address
          )
        `)
        .eq('user_id', id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  }, [userId, user?.id]);

  // Update profile
  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    if (!profile) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('user_id', profile.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Cập nhật thông tin thành công!');
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể cập nhật hồ sơ');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [profile, queryClient]);

  // Upload avatar
  const uploadAvatar = useCallback(async (file: File) => {
    if (!profile) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ avatar_url: URL.createObjectURL(file) })
        .eq('user_id', profile.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Cập nhật ảnh đại diện thành công!');
      return data.avatar_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải lên ảnh đại diện');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [profile, queryClient]);

  // Upload cover photo
  const uploadCoverPhoto = useCallback(async (file: File) => {
    if (!profile) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ cover_photo_url: URL.createObjectURL(file) })
        .eq('user_id', profile.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Cập nhật ảnh bìa thành công!');
      return data.cover_photo_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải lên ảnh bìa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [profile, queryClient]);

  // Get profile statistics
  const getProfileStats = useCallback(() => {
    if (!profile) return null;
    
    return {
      total_matches: profile.total_matches,
      win_rate: profile.win_rate,
      current_rank: profile.rank,
      elo_rating: profile.elo_rating,
      achievements_count: profile.achievements.length,
      tournaments_played: profile.stats.total_tournaments,
      tournaments_won: profile.stats.tournament_wins,
      current_streak: profile.stats.current_streak,
      longest_streak: profile.stats.longest_streak
    };
  }, [profile]);

  // Get recent achievements
  const getRecentAchievements = useCallback((limit: number = 5) => {
    if (!profile) return [];
    
    return profile.achievements
      .sort((a, b) => b.earned_at.getTime() - a.earned_at.getTime())
      .slice(0, limit);
  }, [profile]);

  // Check if user can edit profile
  const canEditProfile = useCallback((targetUserId?: string) => {
    return userId === (targetUserId || userId);
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    uploadCoverPhoto,
    getProfileStats,
    getRecentAchievements,
    canEditProfile
  };
};
