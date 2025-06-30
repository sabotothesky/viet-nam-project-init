import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import {
  Challenge,
  ChallengeResult,
  ChallengeVerification,
  ChallengeFilters,
  ChallengeStats,
  CreateChallengeRequest,
  AcceptChallengeRequest,
  SubmitChallengeResultRequest,
  VerifyChallengeRequest,
  getChallengeConfig,
  isValidBetPoints,
} from '../types/challenge';

export interface Challenge {
  id: string;
  challenger_id: string;
  challenger: {
    id: string;
    username: string;
    avatar_url?: string;
    rank: string;
  };
  opponent_id: string;
  opponent: {
    id: string;
    username: string;
    avatar_url?: string;
    rank: string;
  };
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'expired';
  match_type: '8-ball' | '9-ball' | '10-ball' | 'straight-pool';
  stake_amount: number;
  venue?: string;
  scheduled_time?: Date;
  created_at: Date;
  expires_at: Date;
  notes?: string;
  result?: {
    winner_id: string;
    score: string;
    completed_at: Date;
  };
}

export interface CreateChallengeData {
  opponent_id: string;
  match_type: '8-ball' | '9-ball' | '10-ball' | 'straight-pool';
  stake_amount: number;
  venue?: string;
  scheduled_time?: Date;
  notes?: string;
}

export const useChallenges = (userId?: string) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch challenges
  const fetchChallenges = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock challenges data
      const mockChallenges: Challenge[] = [
        {
          id: '1',
          challenger_id: '1',
          challenger: {
            id: '1',
            username: 'pool_master',
            avatar_url: '/avatars/pool_master.jpg',
            rank: 'A',
          },
          opponent_id: '2',
          opponent: {
            id: '2',
            username: 'champion',
            avatar_url: '/avatars/champion.jpg',
            rank: 'G',
          },
          status: 'pending',
          match_type: '8-ball',
          stake_amount: 50000,
          venue: 'Club Bida ABC',
          scheduled_time: new Date(Date.now() + 1000 * 60 * 60 * 24),
          created_at: new Date(),
          expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
          notes: 'Thách đấu thân thiện',
        },
        {
          id: '2',
          challenger_id: '3',
          challenger: {
            id: '3',
            username: 'veteran',
            avatar_url: '/avatars/veteran.jpg',
            rank: 'A+',
          },
          opponent_id: '1',
          opponent: {
            id: '1',
            username: 'pool_master',
            avatar_url: '/avatars/pool_master.jpg',
            rank: 'A',
          },
          status: 'accepted',
          match_type: '9-ball',
          stake_amount: 100000,
          venue: 'Club Bida XYZ',
          scheduled_time: new Date(Date.now() + 1000 * 60 * 60 * 2),
          created_at: new Date(Date.now() - 1000 * 60 * 60),
          expires_at: new Date(Date.now() + 1000 * 60 * 60 * 3),
          notes: 'Trận đấu quan trọng',
        },
        {
          id: '3',
          challenger_id: '1',
          challenger: {
            id: '1',
            username: 'pool_master',
            avatar_url: '/avatars/pool_master.jpg',
            rank: 'A',
          },
          opponent_id: '4',
          opponent: {
            id: '4',
            username: 'newbie',
            avatar_url: '/avatars/newbie.jpg',
            rank: 'C',
          },
          status: 'completed',
          match_type: '8-ball',
          stake_amount: 25000,
          venue: 'Club Bida DEF',
          scheduled_time: new Date(Date.now() - 1000 * 60 * 60 * 2),
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 4),
          expires_at: new Date(Date.now() - 1000 * 60 * 60 * 1),
          result: {
            winner_id: '1',
            score: '7-3',
            completed_at: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
          },
        },
      ];

      setChallenges(mockChallenges);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải thách đấu');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Create new challenge
  const createChallenge = useCallback(
    async (data: CreateChallengeData) => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock opponent data
        const opponent = {
          id: data.opponent_id,
          username: 'opponent_user',
          avatar_url: '/avatars/opponent.jpg',
          rank: 'B',
        };

        const newChallenge: Challenge = {
          id: Date.now().toString(),
          challenger_id: userId!,
          challenger: {
            id: userId!,
            username: 'current_user',
            avatar_url: '/avatars/current_user.jpg',
            rank: 'A',
          },
          opponent_id: data.opponent_id,
          opponent,
          status: 'pending',
          match_type: data.match_type,
          stake_amount: data.stake_amount,
          venue: data.venue,
          scheduled_time: data.scheduled_time,
          created_at: new Date(),
          expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
          notes: data.notes,
        };

        setChallenges(prev => [newChallenge, ...prev]);
        return newChallenge;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Không thể tạo thách đấu'
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  // Accept challenge
  const acceptChallenge = useCallback(async (challengeId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setChallenges(prev =>
        prev.map(challenge =>
          challenge.id === challengeId
            ? { ...challenge, status: 'accepted' as const }
            : challenge
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Không thể chấp nhận thách đấu'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Decline challenge
  const declineChallenge = useCallback(async (challengeId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setChallenges(prev =>
        prev.map(challenge =>
          challenge.id === challengeId
            ? { ...challenge, status: 'declined' as const }
            : challenge
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Không thể từ chối thách đấu'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Complete challenge
  const completeChallenge = useCallback(
    async (
      challengeId: string,
      result: { winner_id: string; score: string }
    ) => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        setChallenges(prev =>
          prev.map(challenge =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  status: 'completed' as const,
                  result: {
                    ...result,
                    completed_at: new Date(),
                  },
                }
              : challenge
          )
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Không thể hoàn thành thách đấu'
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Cancel challenge
  const cancelChallenge = useCallback(async (challengeId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setChallenges(prev =>
        prev.filter(challenge => challenge.id !== challengeId)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể hủy thách đấu');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get challenges by status
  const getChallengesByStatus = useCallback(
    (status: Challenge['status']) => {
      return challenges.filter(challenge => challenge.status === status);
    },
    [challenges]
  );

  // Get challenges for current user
  const getMyChallenges = useCallback(() => {
    if (!userId) return [];
    return challenges.filter(
      challenge =>
        challenge.challenger_id === userId || challenge.opponent_id === userId
    );
  }, [challenges, userId]);

  // Get pending challenges
  const getPendingChallenges = useCallback(() => {
    if (!userId) return [];
    return challenges.filter(
      challenge =>
        challenge.status === 'pending' && challenge.opponent_id === userId
    );
  }, [challenges, userId]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  return {
    challenges,
    loading,
    error,
    fetchChallenges,
    createChallenge,
    acceptChallenge,
    declineChallenge,
    completeChallenge,
    cancelChallenge,
    getChallengesByStatus,
    getMyChallenges,
    getPendingChallenges,
  };
};

export const usePublicChallenges = () => {
  return useQuery({
    queryKey: ['public-challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select(
          `
          *,
          challenger:profiles!challenges_challenger_id_fkey(full_name, current_rank),
          challenged:profiles!challenges_challenged_id_fkey(full_name, current_rank),
          proposed_club:clubs!challenges_proposed_club_id_fkey(name, address)
        `
        )
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching public challenges:', error);
        return [];
      }
      return data || [];
    },
  });
};
