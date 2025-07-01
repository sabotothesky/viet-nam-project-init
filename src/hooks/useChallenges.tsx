
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Challenge, CreateChallengeData } from '@/types/common';
import { toast } from 'sonner';

export const useChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [receivedChallenges, setReceivedChallenges] = useState<Challenge[]>([]);
  const [sentChallenges, setSentChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingReceived, setLoadingReceived] = useState(false);
  const [loadingSent, setLoadingSent] = useState(false);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          challenger_profile:profiles!challenger_id(*),
          challenged_profile:profiles!challenged_id(*),
          club:clubs(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createChallenge = async (data: CreateChallengeData) => {
    try {
      const { error } = await supabase
        .from('challenges')
        .insert([data]);

      if (error) throw error;
      await fetchChallenges();
      toast.success('Thách đấu đã được gửi!');
    } catch (err) {
      toast.error('Lỗi khi tạo thách đấu');
      throw err;
    }
  };

  const respondToChallenge = useMutation({
    mutationFn: async ({ challengeId, status, message }: {
      challengeId: string;
      status: 'accepted' | 'declined';
      message?: string;
    }) => {
      const { error } = await supabase
        .from('challenges')
        .update({
          status,
          response_message: message,
          responded_at: new Date().toISOString(),
        })
        .eq('id', challengeId);

      if (error) throw error;
    },
    onSuccess: () => {
      fetchChallenges();
      toast.success('Đã phản hồi thách đấu');
    },
    onError: () => {
      toast.error('Lỗi khi phản hồi thách đấu');
    },
  });

  const acceptChallenge = async (challengeId: string) => {
    return respondToChallenge.mutateAsync({
      challengeId,
      status: 'accepted',
    });
  };

  const declineChallenge = async (challengeId: string) => {
    return respondToChallenge.mutateAsync({
      challengeId,
      status: 'declined',
    });
  };

  const cancelChallenge = async (challengeId: string) => {
    try {
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', challengeId);

      if (error) throw error;
      await fetchChallenges();
      toast.success('Đã hủy thách đấu');
    } catch (err) {
      toast.error('Lỗi khi hủy thách đấu');
      throw err;
    }
  };

  const getPendingChallenges = () => {
    return challenges.filter(c => c.status === 'pending');
  };

  const getAcceptedChallenges = () => {
    return challenges.filter(c => c.status === 'accepted');
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Separate received and sent challenges
        const received = challenges.filter(c => c.challenged_id === user.id);
        const sent = challenges.filter(c => c.challenger_id === user.id);
        
        setReceivedChallenges(received);
        setSentChallenges(sent);
      }
    };
    getCurrentUser();
  }, [challenges]);

  return {
    challenges,
    receivedChallenges,
    sentChallenges,
    loading,
    loadingReceived,
    loadingSent,
    error,
    fetchChallenges,
    createChallenge,
    respondToChallenge,
    acceptChallenge,
    declineChallenge,
    cancelChallenge,
    getPendingChallenges,
    getAcceptedChallenges,
  };
};
