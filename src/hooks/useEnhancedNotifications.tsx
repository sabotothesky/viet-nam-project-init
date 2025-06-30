import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface EnhancedNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  data?: any;
  read_at?: string;
  action_url?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  expires_at?: string;
  created_at: string;
  challenge?: {
    id: string;
    bet_points: number;
    message?: string;
    status: string;
    challenger: {
      user_id: string;
      full_name: string;
      avatar_url?: string;
      current_rank: string;
    };
    challenged: {
      user_id: string;
      full_name: string;
      avatar_url?: string;
      current_rank: string;
    };
  };
}

export const useEnhancedNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  // Fetch notifications with improved error handling
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['enhanced-notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      try {
        // First get notifications
        const { data: notificationsData, error: notificationsError } =
          await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50);

        if (notificationsError) throw notificationsError;

        // Then get challenge data separately for notifications that have challenge_id
        const notificationsWithChallenges = await Promise.all(
          (notificationsData || []).map(async notification => {
            if (notification.challenge_id) {
              try {
                const { data: challengeData, error: challengeError } =
                  await supabase
                    .from('challenges')
                    .select(
                      `
                    *,
                    challenger:profiles!challenges_challenger_id_fkey(
                      user_id,
                      full_name,
                      avatar_url,
                      current_rank
                    ),
                    challenged:profiles!challenges_challenged_id_fkey(
                      user_id,
                      full_name,
                      avatar_url,
                      current_rank
                    )
                  `
                    )
                    .eq('id', notification.challenge_id)
                    .single();

                if (!challengeError && challengeData) {
                  return {
                    ...notification,
                    challenge: challengeData,
                  };
                }
              } catch (error) {
                console.error('Error fetching challenge data:', error);
              }
            }
            return notification;
          })
        );

        return notificationsWithChallenges;
      } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds as backup
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  const unreadCount = notifications.filter(n => !n.read_at).length;

  // Simplified real-time subscription (the main one is in useRealtimeSubscriptions)
  useEffect(() => {
    if (!user?.id) return;

    // Simple connection status check
    const channel = supabase.channel('notification-status-check');

    channel.subscribe(status => {
      setIsConnected(status === 'SUBSCRIBED');
    });

    return () => {
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [user]);

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-notifications'] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', user?.id)
        .is('read_at', null);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-notifications'] });
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    isConnected,
    markAsRead,
    markAllAsRead,
  };
};
