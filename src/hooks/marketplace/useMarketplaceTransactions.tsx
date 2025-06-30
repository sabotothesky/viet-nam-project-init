import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';

export interface MarketplaceTransaction {
  id: string;
  item_id: string;
  buyer_id: string;
  seller_id: string;
  transaction_amount: number;
  commission_amount: number;
  payment_method: string;
  delivery_method: string;
  delivery_address?: string;
  status: string;
  tracking_number?: string;
  completed_at?: string;
  created_at: string;
}

export const useMarketplaceTransactions = () => {
  const [myTransactions, setMyTransactions] = useState<
    MarketplaceTransaction[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchMyTransactions = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('marketplace_transactions')
        .select('*, marketplace_items(*)')
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyTransactions(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch transactions'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    myTransactions,
    loading,
    error,
    fetchMyTransactions,
  };
};
