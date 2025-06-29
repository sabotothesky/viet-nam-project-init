
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MarketplaceItem } from './types';

interface ItemFilters {
  category?: string;
  search?: string;
  priceRange?: [number, number];
  province_id?: string;
  condition?: string;
  seller_type?: string;
  trusted_seller?: boolean;
}

export const useMarketplaceItems = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async (filters?: ItemFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('marketplace_items')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,brand.ilike.%${filters.search}%`);
      }

      if (filters?.priceRange) {
        query = query
          .gte('price', filters.priceRange[0])
          .lte('price', filters.priceRange[1]);
      }

      if (filters?.condition) {
        query = query.eq('condition', filters.condition);
      }

      const { data: itemsData, error } = await query;

      if (error) throw error;

      // Fetch seller information separately for each item
      const enhancedItems: MarketplaceItem[] = [];
      
      for (const item of itemsData || []) {
        // Fetch seller profile information
        const { data: sellerData } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            nickname,
            avatar_url,
            club_id,
            province_id,
            provinces:province_id(name, region)
          `)
          .eq('user_id', item.seller_id)
          .single();

        const enhancedItem: MarketplaceItem = {
          ...item,
          shipping_available: Math.random() > 0.7, // Mock shipping availability
          seller: sellerData ? {
            id: sellerData.id,
            full_name: sellerData.full_name,
            nickname: sellerData.nickname,
            avatar_url: sellerData.avatar_url,
            club_id: sellerData.club_id,
            province_id: sellerData.province_id,
            provinces: sellerData.provinces || null,
            total_items: Math.floor(Math.random() * 20) + 1,
            avg_response_time: Math.floor(Math.random() * 5) + 1
          } : null,
          marketplace_reviews: [],
          images: item.images || [],
          views_count: item.views_count || 0,
          favorites_count: item.favorites_count || 0
        };

        enhancedItems.push(enhancedItem);
      }

      setItems(enhancedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async (itemId: string) => {
    try {
      // Get current view count first
      const { data: currentItem, error: fetchError } = await supabase
        .from('marketplace_items')
        .select('views_count')
        .eq('id', itemId)
        .single();

      if (fetchError) throw fetchError;

      // Update with incremented count
      const { error } = await supabase
        .from('marketplace_items')
        .update({ 
          views_count: (currentItem.views_count || 0) + 1
        })
        .eq('id', itemId);

      if (error) throw error;
    } catch (err) {
      console.error('Failed to increment views:', err);
    }
  };

  return {
    items,
    loading,
    error,
    fetchItems,
    incrementViews
  };
};
