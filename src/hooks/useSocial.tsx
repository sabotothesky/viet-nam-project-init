
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useSocial = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: following = [], isLoading: loadingFollowing } = useQuery({
    queryKey: ['following', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_follows')
        .select(`
          *,
          following_profile:profiles!user_follows_following_id_fkey(full_name, current_rank, avatar_url)
        `)
        .eq('follower_id', user?.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: followers = [], isLoading: loadingFollowers } = useQuery({
    queryKey: ['followers', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_follows')
        .select(`
          *,
          follower_profile:profiles!user_follows_follower_id_fkey(full_name, current_rank, avatar_url)
        `)
        .eq('following_id', user?.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const followUser = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase
        .from('user_follows')
        .insert({
          follower_id: user?.id,
          following_id: userId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Đã theo dõi người chơi!');
      queryClient.invalidateQueries({ queryKey: ['following'] });
    },
    onError: (error) => {
      console.error('Error following user:', error);
      toast.error('Có lỗi xảy ra');
    },
  });

  const unfollowUser = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', user?.id)
        .eq('following_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Đã bỏ theo dõi!');
      queryClient.invalidateQueries({ queryKey: ['following'] });
    },
    onError: (error) => {
      console.error('Error unfollowing user:', error);
      toast.error('Có lỗi xảy ra');
    },
  });

  const isFollowing = (userId: string) => {
    return following.some(f => f.following_id === userId);
  };

  return {
    following,
    followers,
    loadingFollowing,
    loadingFollowers,
    followUser,
    unfollowUser,
    isFollowing,
  };
};
