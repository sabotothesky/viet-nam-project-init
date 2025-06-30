import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

// Distance calculation helper
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Enhanced club priority calculation
const calculateClubPriority = (
  club: any,
  userLat?: number,
  userLng?: number
) => {
  let score = 0;

  // 1. SABO owned clubs get highest priority
  if (club.is_sabo_owned) {
    score += 1000;
  }

  // 2. Monthly payment amount (normalized to 0-500 points)
  score += Math.min(club.monthly_payment / 10, 500);

  // 3. Distance from user (closer = higher score)
  if (userLat && userLng && club.latitude && club.longitude) {
    const distance = calculateDistance(
      userLat,
      userLng,
      club.latitude,
      club.longitude
    );
    score += Math.max(0, 100 - distance); // Max 100 points for distance
  }

  // 4. Available tables
  score += (club.available_tables || 0) * 2;

  // 5. Rating/Reviews (if available)
  score += (club.average_rating || 0) * 20;

  return Math.round(score);
};

export const useEnhancedChallenges = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch received challenges
  const { data: receivedChallenges = [], isLoading: loadingReceived } =
    useQuery({
      queryKey: ['received-challenges', user?.id],
      queryFn: async () => {
        if (!user?.id) return [];

        const { data, error } = await supabase
          .from('challenges')
          .select(
            `
          *,
          challenger:profiles!challenges_challenger_id_fkey(
            user_id,
            full_name,
            avatar_url,
            current_rank
          )
        `
          )
          .eq('challenged_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      },
      enabled: !!user?.id,
    });

  // Fetch sent challenges
  const { data: sentChallenges = [], isLoading: loadingSent } = useQuery({
    queryKey: ['sent-challenges', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('challenges')
        .select(
          `
          *,
          challenged:profiles!challenges_challenged_id_fkey(
            user_id,
            full_name,
            avatar_url,
            current_rank
          )
        `
        )
        .eq('challenger_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Enhanced fetch suggested clubs with priority calculation
  const { data: suggestedClubs = [] } = useQuery({
    queryKey: ['suggested-clubs', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .order('is_sabo_owned', { ascending: false })
        .order('monthly_payment', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Get user location for distance calculation (you might want to get this from user profile)
      const userLat = 21.0285; // Default to Hanoi coordinates
      const userLng = 105.8542;

      // Calculate priority scores and sort
      const clubsWithPriority = (data || [])
        .map(club => ({
          ...club,
          priority_score: calculateClubPriority(club, userLat, userLng),
        }))
        .sort((a, b) => b.priority_score - a.priority_score);

      return clubsWithPriority.slice(0, 10); // Top 10 clubs
    },
  });

  // Send challenge function
  const sendChallenge = useMutation({
    mutationFn: async ({
      challengedId,
      betPoints,
      message,
    }: {
      challengedId: string;
      betPoints: number;
      message: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // 1. Create challenge record
      const { data: challenge, error: challengeError } = await supabase
        .from('challenges')
        .insert({
          challenger_id: user.id,
          challenged_id: challengedId,
          bet_points: betPoints,
          message: message,
          status: 'pending',
        })
        .select(
          '*, challenger:profiles!challenges_challenger_id_fkey(full_name)'
        )
        .single();

      if (challengeError) throw challengeError;

      // 2. Send notification to opponent
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: challengedId,
          type: 'challenge_received',
          title: 'Bạn có thách đấu mới! ⚡',
          message: `${challenge.challenger.full_name} muốn thách đấu với mức cược ${betPoints} điểm`,
          challenge_id: challenge.id,
        });

      if (notificationError) {
        console.error('Failed to send notification:', notificationError);
      }

      // 3. Send real-time notification
      try {
        await supabase.channel('notifications').send({
          type: 'broadcast',
          event: 'new_challenge',
          payload: {
            user_id: challengedId,
            challenge: challenge,
          },
        });
      } catch (realtimeError) {
        console.error('Failed to send real-time notification:', realtimeError);
      }

      return challenge;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sent-challenges'] });
      toast.success('Thách đấu đã được gửi!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi gửi thách đấu');
    },
  });

  // Respond to challenge
  const respondToChallenge = useMutation({
    mutationFn: async ({
      challengeId,
      status,
      proposalData,
    }: {
      challengeId: string;
      status: 'accepted' | 'declined';
      proposalData?: {
        clubId: string;
        datetime: string;
      };
    }) => {
      if (status === 'accepted' && proposalData) {
        // 1. Update challenge with proposal
        const { data: challenge, error: updateError } = await supabase
          .from('challenges')
          .update({
            status: 'accepted',
            proposed_club_id: proposalData.clubId,
            proposed_datetime: proposalData.datetime,
          })
          .eq('id', challengeId)
          .select(
            `
            *,
            challenger:profiles!challenges_challenger_id_fkey(user_id, full_name),
            challenged:profiles!challenges_challenged_id_fkey(user_id, full_name)
          `
          )
          .single();

        if (updateError) throw updateError;

        // 2. Send notification to challenger
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: challenge.challenger_id,
            type: 'challenge_accepted',
            title: 'Thách đấu được chấp nhận! 🎉',
            message: `${challenge.challenged.full_name} đã chấp nhận thách đấu và đề xuất lịch`,
            challenge_id: challengeId,
          });

        if (notificationError) {
          console.error('Failed to send notification:', notificationError);
        }

        return challenge;
      } else {
        // Decline challenge
        const { data, error } = await supabase
          .from('challenges')
          .update({ status: 'declined' })
          .eq('id', challengeId)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['received-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['sent-challenges'] });

      if (variables.status === 'accepted') {
        toast.success('Đã chấp nhận thách đấu và gửi đề xuất!');
      } else {
        toast.success('Đã từ chối thách đấu');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi phản hồi thách đấu');
    },
  });

  // Confirm match
  const confirmMatch = useMutation({
    mutationFn: async (challengeId: string) => {
      // 1. Get current challenge data
      const { data: currentChallenge, error: fetchError } = await supabase
        .from('challenges')
        .select(
          `
          *,
          club:clubs!challenges_proposed_club_id_fkey(*),
          challenger:profiles!challenges_challenger_id_fkey(user_id, full_name),
          challenged:profiles!challenges_challenged_id_fkey(user_id, full_name)
        `
        )
        .eq('id', challengeId)
        .single();

      if (fetchError) throw fetchError;

      // 2. Update challenge status
      const { data: challenge, error: challengeError } = await supabase
        .from('challenges')
        .update({
          status: 'confirmed',
          confirmed_club_id: currentChallenge.proposed_club_id,
          confirmed_datetime: currentChallenge.proposed_datetime,
        })
        .eq('id', challengeId)
        .select()
        .single();

      if (challengeError) throw challengeError;

      // 3. Create booking record
      const { data: booking, error: bookingError } = await supabase
        .from('club_bookings')
        .insert({
          club_id: currentChallenge.proposed_club_id,
          challenge_id: challengeId,
          booking_datetime: currentChallenge.proposed_datetime,
          duration_minutes: 120,
          status: 'pending',
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // 4. Send notifications to both players
      const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
      };

      await Promise.all([
        supabase.from('notifications').insert({
          user_id: currentChallenge.challenger_id,
          type: 'match_scheduled',
          title: 'Trận đấu đã được xác nhận! 📅',
          message: `Trận đấu tại ${currentChallenge.club.name} vào ${formatDateTime(currentChallenge.proposed_datetime)}`,
          challenge_id: challengeId,
        }),
        supabase.from('notifications').insert({
          user_id: currentChallenge.challenged_id,
          type: 'match_scheduled',
          title: 'Trận đấu đã được xác nhận! 📅',
          message: `Trận đấu tại ${currentChallenge.club.name} vào ${formatDateTime(currentChallenge.proposed_datetime)}`,
          challenge_id: challengeId,
        }),
      ]);

      // 5. Update booking as club notified
      await supabase
        .from('club_bookings')
        .update({
          club_notified: true,
          players_notified: true,
        })
        .eq('id', booking.id);

      return { challenge, booking };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['received-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['sent-challenges'] });
      toast.success('Đã xác nhận trận đấu và thông báo cho CLB!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi xác nhận trận đấu');
    },
  });

  return {
    receivedChallenges,
    sentChallenges,
    suggestedClubs,
    loadingReceived,
    loadingSent,
    sendChallenge,
    respondToChallenge,
    confirmMatch,
  };
};
