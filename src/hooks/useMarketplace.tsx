import { useState, useEffect, useCallback } from 'react';

export interface MarketplaceItem {
  id: string;
  seller_id: string;
  seller: {
    id: string;
    username: string;
    avatar_url?: string;
    rating: number;
  };
  title: string;
  description: string;
  category: 'equipment' | 'accessories' | 'clothing' | 'books' | 'other';
  subcategory: string;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  price: number;
  original_price?: number;
  currency: 'VND' | 'USD';
  images: string[];
  location: {
    city: string;
    province: string;
  };
  shipping: {
    available: boolean;
    cost: number;
    methods: string[];
  };
  status: 'active' | 'sold' | 'expired' | 'removed';
  views: number;
  favorites: number;
  is_favorited: boolean;
  tags: string[];
  specifications?: {
    [key: string]: string;
  };
  created_at: Date;
  updated_at: Date;
}

export interface MarketplaceFilters {
  category?: MarketplaceItem['category'][];
  condition?: MarketplaceItem['condition'][];
  price_range?: {
    min: number;
    max: number;
  };
  location?: string;
  shipping_available?: boolean;
  sort_by?: 'price_low' | 'price_high' | 'newest' | 'popular' | 'rating';
}

export interface CreateItemData {
  title: string;
  description: string;
  category: MarketplaceItem['category'];
  subcategory: string;
  condition: MarketplaceItem['condition'];
  price: number;
  original_price?: number;
  currency: 'VND' | 'USD';
  images: File[];
  location: {
    city: string;
    province: string;
  };
  shipping: {
    available: boolean;
    cost: number;
    methods: string[];
  };
  tags: string[];
  specifications?: {
    [key: string]: string;
  };
}

export const useMarketplace = (userId?: string) => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch marketplace items
  const fetchItems = useCallback(async (pageNum: number = 1, limit: number = 20) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock marketplace data
      const mockItems: MarketplaceItem[] = [
        {
          id: '1',
          seller_id: '1',
          seller: {
            id: '1',
            username: 'pool_equipment_seller',
            avatar_url: '/avatars/seller1.jpg',
            rating: 4.8
          },
          title: 'Cơ bida chuyên nghiệp Predator',
          description: 'Cơ bida Predator Ikon4-3, chất lượng cao, phù hợp cho người chơi chuyên nghiệp. Đã sử dụng 6 tháng, còn rất tốt.',
          category: 'equipment',
          subcategory: 'cues',
          condition: 'good',
          price: 2500000,
          original_price: 3500000,
          currency: 'VND',
          images: ['/marketplace/cue1.jpg', '/marketplace/cue1_2.jpg'],
          location: {
            city: 'TP.HCM',
            province: 'TP.HCM'
          },
          shipping: {
            available: true,
            cost: 50000,
            methods: ['Giao hàng nhanh', 'Giao hàng tiết kiệm']
          },
          status: 'active',
          views: 45,
          favorites: 12,
          is_favorited: false,
          tags: ['predator', 'chuyên nghiệp', 'giá tốt'],
          specifications: {
            'Thương hiệu': 'Predator',
            'Model': 'Ikon4-3',
            'Chất liệu': 'Gỗ maple',
            'Trọng lượng': '19oz'
          },
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          updated_at: new Date()
        },
        {
          id: '2',
          seller_id: '2',
          seller: {
            id: '2',
            username: 'bida_accessories',
            avatar_url: '/avatars/seller2.jpg',
            rating: 4.6
          },
          title: 'Bộ phấn bida chính hãng',
          description: 'Bộ phấn bida Master Chalk, 12 viên, màu xanh. Chất lượng cao, độ bám tốt.',
          category: 'accessories',
          subcategory: 'chalk',
          condition: 'new',
          price: 150000,
          currency: 'VND',
          images: ['/marketplace/chalk1.jpg'],
          location: {
            city: 'Hà Nội',
            province: 'Hà Nội'
          },
          shipping: {
            available: true,
            cost: 30000,
            methods: ['Giao hàng nhanh']
          },
          status: 'active',
          views: 23,
          favorites: 8,
          is_favorited: true,
          tags: ['phấn', 'master chalk', 'chính hãng'],
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
          updated_at: new Date()
        },
        {
          id: '3',
          seller_id: '3',
          seller: {
            id: '3',
            username: 'pool_books',
            avatar_url: '/avatars/seller3.jpg',
            rating: 4.9
          },
          title: 'Sách học bida cơ bản',
          description: 'Sách "Nghệ thuật chơi bida" - hướng dẫn từ cơ bản đến nâng cao. Sách mới, chưa sử dụng.',
          category: 'books',
          subcategory: 'instructional',
          condition: 'new',
          price: 200000,
          currency: 'VND',
          images: ['/marketplace/book1.jpg', '/marketplace/book1_2.jpg'],
          location: {
            city: 'TP.HCM',
            province: 'TP.HCM'
          },
          shipping: {
            available: true,
            cost: 25000,
            methods: ['Giao hàng tiết kiệm']
          },
          status: 'active',
          views: 18,
          favorites: 5,
          is_favorited: false,
          tags: ['sách', 'học bida', 'cơ bản'],
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 12),
          updated_at: new Date()
        },
        {
          id: '4',
          seller_id: '4',
          seller: {
            id: '4',
            username: 'pool_clothing',
            avatar_url: '/avatars/seller4.jpg',
            rating: 4.7
          },
          title: 'Áo thun bida thể thao',
          description: 'Áo thun bida chất liệu cotton cao cấp, thiết kế thoải mái. Size L, màu đen.',
          category: 'clothing',
          subcategory: 'shirts',
          condition: 'like_new',
          price: 180000,
          original_price: 250000,
          currency: 'VND',
          images: ['/marketplace/shirt1.jpg'],
          location: {
            city: 'Đà Nẵng',
            province: 'Đà Nẵng'
          },
          shipping: {
            available: true,
            cost: 35000,
            methods: ['Giao hàng nhanh', 'Giao hàng tiết kiệm']
          },
          status: 'active',
          views: 32,
          favorites: 15,
          is_favorited: false,
          tags: ['áo thun', 'thể thao', 'cotton'],
          specifications: {
            'Size': 'L',
            'Màu sắc': 'Đen',
            'Chất liệu': 'Cotton 100%'
          },
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 6),
          updated_at: new Date()
        }
      ];
      
      if (pageNum === 1) {
        setItems(mockItems);
      } else {
        setItems(prev => [...prev, ...mockItems]);
      }
      
      setHasMore(mockItems.length === limit);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new item
  const createItem = useCallback(async (data: CreateItemData) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newItem: MarketplaceItem = {
        id: Date.now().toString(),
        seller_id: userId,
        seller: {
          id: userId,
          username: 'current_user',
          avatar_url: '/avatars/current_user.jpg',
          rating: 4.5
        },
        title: data.title,
        description: data.description,
        category: data.category,
        subcategory: data.subcategory,
        condition: data.condition,
        price: data.price,
        original_price: data.original_price,
        currency: data.currency,
        images: data.images.map(file => URL.createObjectURL(file)),
        location: data.location,
        shipping: data.shipping,
        status: 'active',
        views: 0,
        favorites: 0,
        is_favorited: false,
        tags: data.tags,
        specifications: data.specifications,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      setItems(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tạo sản phẩm');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (itemId: string) => {
    try {
      setItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? {
                ...item,
                is_favorited: !item.is_favorited,
                favorites: item.is_favorited ? item.favorites - 1 : item.favorites + 1
              }
            : item
        )
      );
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  }, []);

  // Update item
  const updateItem = useCallback(async (itemId: string, data: Partial<MarketplaceItem>) => {
    try {
      setItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, ...data, updated_at: new Date() }
            : item
        )
      );
    } catch (err) {
      console.error('Failed to update item:', err);
    }
  }, []);

  // Delete item
  const deleteItem = useCallback(async (itemId: string) => {
    try {
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  }, []);

  // Apply filters
  const applyFilters = useCallback((newFilters: MarketplaceFilters) => {
    setFilters(newFilters);
    setPage(1);
    setHasMore(true);
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
    setHasMore(true);
  }, []);

  // Get filtered items
  const getFilteredItems = useCallback(() => {
    let filtered = [...items];

    // Filter by category
    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(item => 
        filters.category!.includes(item.category)
      );
    }

    // Filter by condition
    if (filters.condition && filters.condition.length > 0) {
      filtered = filtered.filter(item => 
        filters.condition!.includes(item.condition)
      );
    }

    // Filter by price range
    if (filters.price_range) {
      filtered = filtered.filter(item => 
        item.price >= filters.price_range!.min && 
        item.price <= filters.price_range!.max
      );
    }

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(item => 
        item.location.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
        item.location.province.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Filter by shipping availability
    if (filters.shipping_available !== undefined) {
      filtered = filtered.filter(item => 
        item.shipping.available === filters.shipping_available
      );
    }

    // Sort items
    if (filters.sort_by) {
      switch (filters.sort_by) {
        case 'price_low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filtered.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
          break;
        case 'popular':
          filtered.sort((a, b) => b.views - a.views);
          break;
        case 'rating':
          filtered.sort((a, b) => b.seller.rating - a.seller.rating);
          break;
      }
    }

    return filtered;
  }, [items, filters]);

  // Get items by seller
  const getItemsBySeller = useCallback((sellerId: string) => {
    return items.filter(item => item.seller_id === sellerId);
  }, [items]);

  // Get items by category
  const getItemsByCategory = useCallback((category: MarketplaceItem['category']) => {
    return items.filter(item => item.category === category);
  }, [items]);

  // Search items
  const searchItems = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return items.filter(item => 
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [items]);

  // Load more items
  const loadMoreItems = useCallback(() => {
    if (!loading && hasMore) {
      fetchItems(page + 1);
    }
  }, [loading, hasMore, page, fetchItems]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    filters,
    hasMore,
    fetchItems,
    createItem,
    toggleFavorite,
    updateItem,
    deleteItem,
    applyFilters,
    clearFilters,
    getFilteredItems,
    getItemsBySeller,
    getItemsByCategory,
    searchItems,
    loadMoreItems
  };
};

// Re-export the main hook for backward compatibility
export { useMarketplace } from './marketplace/useMarketplace';
export type { MarketplaceItem, MarketplaceTransaction } from './marketplace/useMarketplace';
