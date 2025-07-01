
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Challenge, CreateChallengeData, ChallengeProposal } from '@/types/common';
import { toast } from 'sonner';

export const useEnhancedChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [receivedChallenges, setReceivedChallenges] = useState<Challenge[]>([]);
  const [sentChallenges, setSentChallenges] = useState<Challenge[]>([]);
  const [suggestedClubs, setSuggestedClubs] = useState<any[]>([]);
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

  const respondToChallenge = useMutation({
    mutationFn: async ({ challengeId, status, proposalData }: {
      challengeId: string;
      status: 'accepted' | 'declined';
      proposalData?: ChallengeProposal;
    }) => {
      const { error } = await supabase
        .from('challenges')
        .update({
          status,
          response_message: proposalData?.message,
          responded_at: new Date().toISOString(),
          proposed_datetime: proposalData?.proposed_datetime,
          club_id: proposalData?.club_id,
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

  const confirmMatch = useMutation({
    mutationFn: async (challengeId: string) => {
      const { error } = await supabase
        .from('challenges')
        .update({
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
        })
        .eq('id', challengeId);

      if (error) throw error;
    },
    onSuccess: () => {
      fetchChallenges();
      toast.success('Đã xác nhận trận đấu');
    },
    onError: () => {
      toast.error('Lỗi khi xác nhận trận đấu');
    },
  });

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
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
    suggestedClubs,
    loading,
    loadingReceived,
    loadingSent,
    error,
    fetchChallenges,
    respondToChallenge,
    confirmMatch,
  };
};
