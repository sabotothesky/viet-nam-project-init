
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
import { MarketplaceItem } from './types';

export const useMyMarketplaceItems = () => {
  const [myItems, setMyItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchMyItems = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const enhancedMyItems: MarketplaceItem[] = (data || []).map(item => ({
        ...item,
        seller: null,
        marketplace_reviews: [],
        shipping_available: false,
        images: item.images || [],
        views_count: item.views_count || 0,
        favorites_count: item.favorites_count || 0
      }));
      
      setMyItems(enhancedMyItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch my items');
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData: Omit<MarketplaceItem, 'id' | 'seller_id' | 'created_at' | 'updated_at' | 'views_count' | 'favorites_count' | 'seller' | 'marketplace_reviews' | 'shipping_available'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .insert({
          ...itemData,
          seller_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh items
      await fetchMyItems();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create item');
    }
  };

  const updateItem = async (itemId: string, updates: Partial<Omit<MarketplaceItem, 'id' | 'seller_id' | 'created_at' | 'seller' | 'marketplace_reviews' | 'shipping_available'>>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', itemId)
        .eq('seller_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      // Refresh items
      await fetchMyItems();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update item');
    }
  };

  return {
    myItems,
    loading,
    error,
    fetchMyItems,
    createItem,
    updateItem
  };
};
