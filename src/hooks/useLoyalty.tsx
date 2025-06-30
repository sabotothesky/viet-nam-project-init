import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface LoyaltyPoint {
  id: string;
  user_id: string;
  points: number;
  transaction_type: string;
  source: string;
  description: string;
  expires_at?: string;
  created_at: string;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  points_required: number;
  reward_type: string;
  reward_value?: number;
  stock_quantity: number;
  active: boolean;
  image_url?: string;
  created_at: string;
}

export const useLoyalty = () => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [pointsHistory, setPointsHistory] = useState<LoyaltyPoint[]>([]);
  const [availableRewards, setAvailableRewards] = useState<LoyaltyReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPointsBalance = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('loyalty_points')
        .select('points, transaction_type')
        .eq('user_id', user.id);

      if (error) throw error;

      // Calculate total points
      const total = data.reduce((sum, record) => {
        return record.transaction_type === 'earned'
          ? sum + record.points
          : sum - record.points;
      }, 0);

      setTotalPoints(Math.max(0, total));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch points balance'
      );
    }
  };

  const fetchPointsHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPointsHistory(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch points history'
      );
    }
  };

  const fetchAvailableRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('loyalty_rewards')
        .select('*')
        .eq('active', true)
        .order('points_required', { ascending: true });

      if (error) throw error;
      setAvailableRewards(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rewards');
    }
  };

  const awardPoints = async (
    points: number,
    source: string,
    description: string
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase.from('loyalty_points').insert([
        {
          user_id: user.id,
          points,
          transaction_type: 'earned',
          source,
          description,
          expires_at: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000
          ).toISOString(), // 1 year
        },
      ]);

      if (error) throw error;

      // Refresh data
      await Promise.all([fetchPointsBalance(), fetchPointsHistory()]);
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : 'Failed to award points'
      );
    }
  };

  const redeemReward = async (rewardId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const reward = availableRewards.find(r => r.id === rewardId);
      if (!reward) throw new Error('Reward not found');

      if (totalPoints < reward.points_required) {
        throw new Error('Insufficient points');
      }

      // Deduct points
      const { error: deductError } = await supabase
        .from('loyalty_points')
        .insert([
          {
            user_id: user.id,
            points: reward.points_required,
            transaction_type: 'spent',
            source: 'reward_redemption',
            description: `Redeemed: ${reward.name}`,
          },
        ]);

      if (deductError) throw deductError;

      // Update stock if applicable
      if (reward.stock_quantity > 0) {
        const { error: stockError } = await supabase
          .from('loyalty_rewards')
          .update({ stock_quantity: reward.stock_quantity - 1 })
          .eq('id', rewardId);

        if (stockError) throw stockError;
      }

      // Refresh data
      await Promise.all([
        fetchPointsBalance(),
        fetchPointsHistory(),
        fetchAvailableRewards(),
      ]);

      return { success: true };
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : 'Failed to redeem reward'
      );
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchPointsBalance(),
        fetchPointsHistory(),
        fetchAvailableRewards(),
      ]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    totalPoints,
    pointsHistory,
    availableRewards,
    loading,
    error,
    awardPoints,
    redeemReward,
    refreshData: () =>
      Promise.all([
        fetchPointsBalance(),
        fetchPointsHistory(),
        fetchAvailableRewards(),
      ]),
  };
};
