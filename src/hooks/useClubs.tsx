import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Club {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  cover_photo_url?: string;
  owner_id: string;
  owner: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  location: {
    address: string;
    city: string;
    province: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  facilities: {
    table_count: number;
    table_types: string[];
    amenities: string[];
    opening_hours: {
      [key: string]: {
        open: string;
        close: string;
      };
    };
  };
  membership: {
    total_members: number;
    max_members: number;
    membership_fee: number;
    membership_types: MembershipType[];
  };
  stats: {
    total_matches: number;
    total_tournaments: number;
    average_rating: number;
    review_count: number;
  };
  status: 'active' | 'inactive' | 'pending';
  created_at: Date;
  updated_at: Date;
}

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
  location: {
    address: string;
    city: string;
    province: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  facilities: {
    table_count: number;
    table_types: string[];
    amenities: string[];
    opening_hours: {
      [key: string]: {
        open: string;
        close: string;
      };
    };
  };
  membership_types: Omit<MembershipType, 'id' | 'current_members'>[];
}

export const useClubs = (userId?: string) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch clubs
  const fetchClubs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock clubs data
      const mockClubs: Club[] = [
        {
          id: '1',
          name: 'Club Bida ABC',
          description: 'Club bida cao cấp với 20 bàn chơi và dịch vụ đầy đủ. Môi trường chuyên nghiệp cho các tay cơ.',
          logo_url: '/logos/club-abc.png',
          cover_photo_url: '/covers/club-abc-cover.jpg',
          owner_id: '1',
          owner: {
            id: '1',
            username: 'club_owner_1',
            avatar_url: '/avatars/owner1.jpg'
          },
          location: {
            address: '123 Đường ABC, Quận 1',
            city: 'TP.HCM',
            province: 'TP.HCM',
            coordinates: { lat: 10.7769, lng: 106.7009 }
          },
          contact: {
            phone: '+84 28 1234 5678',
            email: 'info@clubabc.com',
            website: 'https://clubabc.com'
          },
          facilities: {
            table_count: 20,
            table_types: ['8-ball', '9-ball', '10-ball', 'straight-pool'],
            amenities: ['wifi', 'parking', 'food', 'drinks', 'locker_room', 'pro_shop'],
            opening_hours: {
              monday: { open: '08:00', close: '23:00' },
              tuesday: { open: '08:00', close: '23:00' },
              wednesday: { open: '08:00', close: '23:00' },
              thursday: { open: '08:00', close: '23:00' },
              friday: { open: '08:00', close: '00:00' },
              saturday: { open: '08:00', close: '00:00' },
              sunday: { open: '08:00', close: '22:00' }
            }
          },
          membership: {
            total_members: 150,
            max_members: 200,
            membership_fee: 500000,
            membership_types: [
              {
                id: '1',
                name: 'Thành viên cơ bản',
                description: 'Quyền truy cập cơ bản',
                price: 200000,
                duration: 1,
                benefits: ['Giảm giá 10%', 'Đặt bàn ưu tiên'],
                max_members: 100,
                current_members: 80
              },
              {
                id: '2',
                name: 'Thành viên VIP',
                description: 'Quyền truy cập đầy đủ',
                price: 500000,
                duration: 3,
                benefits: ['Giảm giá 20%', 'Đặt bàn ưu tiên', 'Tham gia giải đấu nội bộ'],
                max_members: 50,
                current_members: 45
              }
            ]
          },
          stats: {
            total_matches: 1250,
            total_tournaments: 25,
            average_rating: 4.5,
            review_count: 89
          },
          status: 'active',
          created_at: new Date('2023-01-01'),
          updated_at: new Date()
        },
        {
          id: '2',
          name: 'Club Bida XYZ',
          description: 'Club bida hiện đại với thiết kế độc đáo và dịch vụ cao cấp.',
          logo_url: '/logos/club-xyz.png',
          cover_photo_url: '/covers/club-xyz-cover.jpg',
          owner_id: '2',
          owner: {
            id: '2',
            username: 'club_owner_2',
            avatar_url: '/avatars/owner2.jpg'
          },
          location: {
            address: '456 Đường XYZ, Quận 3',
            city: 'TP.HCM',
            province: 'TP.HCM',
            coordinates: { lat: 10.7829, lng: 106.7009 }
          },
          contact: {
            phone: '+84 28 9876 5432',
            email: 'info@clubxyz.com',
            website: 'https://clubxyz.com'
          },
          facilities: {
            table_count: 15,
            table_types: ['8-ball', '9-ball'],
            amenities: ['wifi', 'parking', 'food', 'drinks', 'locker_room'],
            opening_hours: {
              monday: { open: '09:00', close: '22:00' },
              tuesday: { open: '09:00', close: '22:00' },
              wednesday: { open: '09:00', close: '22:00' },
              thursday: { open: '09:00', close: '22:00' },
              friday: { open: '09:00', close: '23:00' },
              saturday: { open: '09:00', close: '23:00' },
              sunday: { open: '09:00', close: '21:00' }
            }
          },
          membership: {
            total_members: 80,
            max_members: 120,
            membership_fee: 300000,
            membership_types: [
              {
                id: '3',
                name: 'Thành viên thường',
                description: 'Quyền truy cập cơ bản',
                price: 150000,
                duration: 1,
                benefits: ['Giảm giá 5%'],
                max_members: 80,
                current_members: 60
              }
            ]
          },
          stats: {
            total_matches: 800,
            total_tournaments: 15,
            average_rating: 4.3,
            review_count: 56
          },
          status: 'active',
          created_at: new Date('2023-03-15'),
          updated_at: new Date()
        }
      ];
      
      setClubs(mockClubs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách club');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new club
  const createClub = useCallback(async (data: CreateClubData) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newClub: Club = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        owner_id: userId,
        owner: {
          id: userId,
          username: 'current_user',
          avatar_url: '/avatars/current_user.jpg'
        },
        location: data.location,
        contact: data.contact,
        facilities: data.facilities,
        membership: {
          total_members: 0,
          max_members: 100,
          membership_fee: 0,
          membership_types: data.membership_types.map((type, index) => ({
            ...type,
            id: (index + 1).toString(),
            current_members: 0
          }))
        },
        stats: {
          total_matches: 0,
          total_tournaments: 0,
          average_rating: 0,
          review_count: 0
        },
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date()
      };
      
      setClubs(prev => [newClub, ...prev]);
      return newClub;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tạo club');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Get club by ID
  const getClubById = useCallback((clubId: string) => {
    return clubs.find(club => club.id === clubId);
  }, [clubs]);

  // Get clubs by owner
  const getClubsByOwner = useCallback((ownerId: string) => {
    return clubs.filter(club => club.owner_id === ownerId);
  }, [clubs]);

  // Get clubs by location
  const getClubsByLocation = useCallback((city: string) => {
    return clubs.filter(club => club.location.city === city);
  }, [clubs]);

  // Search clubs
  const searchClubs = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return clubs.filter(club => 
      club.name.toLowerCase().includes(lowercaseQuery) ||
      club.description.toLowerCase().includes(lowercaseQuery) ||
      club.location.address.toLowerCase().includes(lowercaseQuery)
    );
  }, [clubs]);

  // Get top rated clubs
  const getTopRatedClubs = useCallback((limit: number = 10) => {
    return clubs
      .filter(club => club.status === 'active')
      .sort((a, b) => b.stats.average_rating - a.stats.average_rating)
      .slice(0, limit);
  }, [clubs]);

  // Get nearby clubs
  const getNearbyClubs = useCallback((lat: number, lng: number, radius: number = 10) => {
    // This would implement actual distance calculation
    return clubs.filter(club => 
      club.location.coordinates && 
      club.status === 'active'
    );
  }, [clubs]);

  // Update club
  const updateClub = useCallback(async (clubId: string, data: Partial<Club>) => {
    try {
      setClubs(prev => 
        prev.map(club => 
          club.id === clubId 
            ? { ...club, ...data, updated_at: new Date() }
            : club
        )
      );
    } catch (err) {
      console.error('Failed to update club:', err);
    }
  }, []);

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
    getClubsByLocation,
    searchClubs,
    getTopRatedClubs,
    getNearbyClubs,
    updateClub,
    deleteClub
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
