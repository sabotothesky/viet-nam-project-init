
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Club as CommonClub } from '@/types/common';

export interface MembershipType {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in months
  benefits: string[];
  max_members: number;
  current_members: number;
}

export interface ClubMember {
  id: string;
  club_id: string;
  user_id: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
    rank: string;
  };
  membership_type_id: string;
  membership_type: MembershipType;
  role: 'owner' | 'admin' | 'member';
  joined_at: Date;
  expires_at: Date;
  status: 'active' | 'expired' | 'cancelled';
}

export interface CreateClubData {
  name: string;
  description: string;
  address: string;
  phone?: string;
  email?: string;
  available_tables?: number;
  hourly_rate?: number;
  membership_types: Omit<MembershipType, 'id' | 'current_members'>[];
}

export const useClubs = (userId?: string) => {
  const [clubs, setClubs] = useState<CommonClub[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch clubs
  const fetchClubs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock clubs data using CommonClub interface
      const mockClubs: CommonClub[] = [
        {
          id: '1',
          name: 'Club Bida ABC',
          address: '123 Đường ABC, Quận 1, TP.HCM',
          phone: '+84 28 1234 5678',
          description: 'Club bida cao cấp với 20 bàn chơi và dịch vụ đầy đủ. Môi trường chuyên nghiệp cho các tay cơ.',
          email: 'info@clubabc.com',
          logo_url: '/logos/club-abc.png',
          table_count: 20,
          latitude: 10.7769,
          longitude: 106.7009,
          available_tables: 18,
          hourly_rate: 50000,
          is_sabo_owned: true,
          priority_score: 95,
          owner_id: '1',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Club Bida XYZ',
          address: '456 Đường XYZ, Quận 3, TP.HCM',
          phone: '+84 28 9876 5432',
          description: 'Club bida hiện đại với thiết kế độc đáo và dịch vụ cao cấp.',
          email: 'info@clubxyz.com',
          logo_url: '/logos/club-xyz.png',
          table_count: 15,
          latitude: 10.7829,
          longitude: 106.7009,
          available_tables: 12,
          hourly_rate: 45000,
          is_sabo_owned: false,
          priority_score: 88,
          owner_id: '2',
          created_at: '2023-03-15T00:00:00Z',
          updated_at: new Date().toISOString(),
        },
      ];

      setClubs(mockClubs);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Không thể tải danh sách club'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new club
  const createClub = useCallback(
    async (data: CreateClubData) => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newClub: CommonClub = {
          id: Date.now().toString(),
          name: data.name,
          description: data.description,
          address: data.address,
          phone: data.phone,
          email: data.email,
          available_tables: data.available_tables || 10,
          hourly_rate: data.hourly_rate || 30000,
          is_sabo_owned: false,
          priority_score: 50,
          owner_id: userId,
          logo_url: undefined,
          table_count: data.available_tables || 10,
          latitude: undefined,
          longitude: undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setClubs(prev => [newClub, ...prev]);
        return newClub;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tạo club');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  // Get club by ID
  const getClubById = useCallback(
    (clubId: string) => {
      return clubs.find(club => club.id === clubId);
    },
    [clubs]
  );

  // Get clubs by owner
  const getClubsByOwner = useCallback(
    (ownerId: string) => {
      return clubs.filter(club => club.owner_id === ownerId);
    },
    [clubs]
  );

  // Search clubs
  const searchClubs = useCallback(
    (query: string) => {
      const lowercaseQuery = query.toLowerCase();
      return clubs.filter(
        club =>
          club.name.toLowerCase().includes(lowercaseQuery) ||
          club.description?.toLowerCase().includes(lowercaseQuery) ||
          club.address.toLowerCase().includes(lowercaseQuery)
      );
    },
    [clubs]
  );

  // Get top rated clubs
  const getTopRatedClubs = useCallback(
    (limit: number = 10) => {
      return clubs
        .sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0))
        .slice(0, limit);
    },
    [clubs]
  );

  // Get nearby clubs
  const getNearbyClubs = useCallback(
    (lat: number, lng: number, radius: number = 10) => {
      return clubs.filter(
        club => club.latitude && club.longitude
      );
    },
    [clubs]
  );

  // Update club
  const updateClub = useCallback(
    async (clubId: string, data: Partial<CommonClub>) => {
      try {
        setClubs(prev =>
          prev.map(club =>
            club.id === clubId
              ? { ...club, ...data, updated_at: new Date().toISOString() }
              : club
          )
        );
      } catch (err) {
        console.error('Failed to update club:', err);
      }
    },
    []
  );

  // Delete club
  const deleteClub = useCallback(async (clubId: string) => {
    try {
      setClubs(prev => prev.filter(club => club.id !== clubId));
    } catch (err) {
      console.error('Failed to delete club:', err);
    }
  }, []);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  return {
    clubs,
    loading,
    error,
    fetchClubs,
    createClub,
    getClubById,
    getClubsByOwner,
    searchClubs,
    getTopRatedClubs,
    getNearbyClubs,
    updateClub,
    deleteClub,
  };
};

export const useClubById = (id: string) => {
  return useQuery({
    queryKey: ['club', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
