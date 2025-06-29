
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id?: string;
  referral_code: string;
  status: string;
  reward_type?: string;
  reward_amount: number;
  completed_at?: string;
  rewarded_at?: string;
  created_at: string;
}

export interface ReferralReward {
  id: string;
  user_id: string;
  referral_id: string;
  reward_type: string;
  reward_value: number;
  description: string;
  claimed_at?: string;
  expires_at?: string;
  created_at: string;
}

export const useReferrals = () => {
  const [myReferralCode, setMyReferralCode] = useState<string>('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [rewards, setRewards] = useState<ReferralReward[]>([]);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    successfulReferrals: 0,
    pendingRewards: 0,
    totalEarned: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const generateReferralCode = (userId: string) => {
    return `SABO${userId.slice(-6).toUpperCase()}`;
  };

  const fetchOrCreateReferralCode = async () => {
    if (!user) return;

    try {
      // Check if user already has a referral code
      const { data: existing, error: fetchError } = await supabase
        .from('referrals')
        .select('referral_code')
        .eq('referrer_id', user.id)
        .limit(1)
        .single();

      if (existing) {
        setMyReferralCode(existing.referral_code);
        return;
      }

      // Create new referral code
      const newCode = generateReferralCode(user.id);
      const { error: createError } = await supabase
        .from('referrals')
        .insert([{
          referrer_id: user.id,
          referral_code: newCode,
          status: 'active'
        }]);

      if (createError) throw createError;
      setMyReferralCode(newCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch referral code');
    }
  };

  const fetchReferrals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferrals(data || []);

      // Calculate stats
      const totalReferrals = data?.length || 0;
      const successfulReferrals = data?.filter(r => r.status === 'completed').length || 0;
      const pendingRewards = data?.filter(r => r.status === 'completed' && !r.rewarded_at).length || 0;

      setStats(prev => ({
        ...prev,
        totalReferrals,
        successfulReferrals,
        pendingRewards
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch referrals');
    }
  };

  const fetchRewards = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('referral_rewards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRewards(data || []);

      // Calculate total earned
      const totalEarned = data?.reduce((sum, reward) => sum + reward.reward_value, 0) || 0;
      setStats(prev => ({ ...prev, totalEarned }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rewards');
    }
  };

  const processReferral = async (referralCode: string, newUserId: string) => {
    try {
      // Find the referral record
      const { data: referral, error: findError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referral_code', referralCode)
        .single();

      if (findError || !referral) {
        throw new Error('Invalid referral code');
      }

      // Update referral with new user
      const { error: updateError } = await supabase
        .from('referrals')
        .update({
          referred_id: newUserId,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', referral.id);

      if (updateError) throw updateError;

      // Create rewards for both users
      const rewards = [
        {
          user_id: referral.referrer_id,
          referral_id: referral.id,
          reward_type: 'free_month',
          reward_value: 99000,
          description: 'Tặng 1 tháng Premium miễn phí',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          user_id: newUserId,
          referral_id: referral.id,
          reward_type: 'discount',
          reward_value: 49500,
          description: 'Giảm 50% tháng đầu Premium',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      const { error: rewardError } = await supabase
        .from('referral_rewards')
        .insert(rewards);

      if (rewardError) throw rewardError;

      return { success: true };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to process referral');
    }
  };

  const claimReward = async (rewardId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('referral_rewards')
        .update({ claimed_at: new Date().toISOString() })
        .eq('id', rewardId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh rewards
      await fetchRewards();
      return { success: true };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to claim reward');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchOrCreateReferralCode(),
        fetchReferrals(),
        fetchRewards()
      ]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    myReferralCode,
    referrals,
    rewards,
    stats,
    loading,
    error,
    processReferral,
    claimReward,
    refreshData: () => Promise.all([fetchReferrals(), fetchRewards()])
  };
};
