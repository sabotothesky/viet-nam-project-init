import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Tournament, UserLocation } from '@/types/common';

interface TournamentRecommendation {
  id: string;
  title: string;
  description: string;
  tournament_type: string;
  game_format: string;
  max_participants: number;
  current_participants: number;
  registration_start: string;
  registration_end: string;
  tournament_start: string;
  tournament_end: string;
  club_id: string;
  venue_address: string;
  entry_fee_points: number;
  total_prize_pool: number;
  first_prize: number;
  second_prize: number;
  third_prize: number;
  status: string;
  banner_image: string;
  rules: string;
  contact_info: any;
  club: {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone: string;
    available_tables: number;
    is_sabo_owned: boolean;
  };
  recommendation_score: number;
  distance_km?: number;
}

export const useTournamentRecommendations = () => {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<TournamentRecommendation[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  useEffect(() => {
    if (user) {
      loadUserLocation();
      loadTournamentRecommendations();
    }
  }, [user]);

  const loadUserLocation = async () => {
    try {
      const { data } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      setUserLocation(data);
    } catch (error) {
      // ...removed console.log('No user location found')
    }
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateTournamentScore = (
    tournament: Tournament,
    userLocation: UserLocation,
    userInteractions: any[]
  ) => {
    let score = 0;

    // 1. Distance Score (40% weight) - Gần hơn = điểm cao hơn
    if (userLocation && tournament.club.latitude && tournament.club.longitude) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        tournament.club.latitude,
        tournament.club.longitude
      );
      const maxDistance = userLocation.max_distance_km || 20;
      score += Math.max(0, ((maxDistance - distance) / maxDistance) * 400);
      tournament.distance_km = Math.round(distance * 10) / 10;
    }

    // 2. User-Club Interaction Score (35% weight)
    const userInteraction = userInteractions.find(
      interaction => interaction.club_id === tournament.club_id
    );
    if (userInteraction) {
      score += Math.min(userInteraction.interaction_score, 350);

      // Bonus cho tương tác gần đây
      const daysSinceLastInteraction = Math.floor(
        (Date.now() - new Date(userInteraction.last_interaction).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (daysSinceLastInteraction < 30) {
        score += 50; // Bonus cho tương tác trong 30 ngày qua
      }
    }

    // 3. Prize Pool Score (20% weight)
    const normalizedPrizePool = Math.min(tournament.total_prize_pool / 10, 200);
    score += normalizedPrizePool;

    // 4. Tournament Attractiveness (5% weight)
    const participationRatio =
      tournament.current_participants / tournament.max_participants;
    if (participationRatio >= 0.3 && participationRatio <= 0.8) {
      score += 50; // Sweet spot participation
    }

    // Bonus cho tournament sắp bắt đầu đăng ký
    const daysUntilStart = Math.floor(
      (new Date(tournament.registration_start).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    );
    if (daysUntilStart >= 0 && daysUntilStart <= 7) {
      score += 30; // Bonus cho tournament sắp mở đăng ký
    }

    // Bonus cho CLB SABO
    if (tournament.club.is_sabo_owned) {
      score += 100;
    }

    return Math.round(score);
  };

  const loadTournamentRecommendations = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Load user interactions
      const { data: userInteractions } = await supabase
        .from('user_club_interactions')
        .select('*')
        .eq('user_id', user.id);

      // Load tournaments
      const { data: tournamentsData } = await supabase
        .from('tournaments')
        .select(
          `
          *,
          clubs!inner(
            id,
            name,
            address,
            latitude,
            longitude,
            phone,
            available_tables,
            is_sabo_owned
          )
        `
        )
        .in('status', ['upcoming', 'registration_open'])
        .gte('registration_end', new Date().toISOString())
        .order('start_date', { ascending: true });

      if (tournamentsData) {
        // Calculate recommendation scores and map to proper format
        const scoredTournaments = tournamentsData.map(tournament => {
          const score = calculateTournamentScore(
            tournament,
            userLocation,
            userInteractions || []
          );
          return {
            id: tournament.id,
            title: tournament.name || 'Tournament',
            description: tournament.description || '',
            tournament_type: tournament.tournament_type || 'single_elimination',
            game_format: tournament.game_format || '8_ball',
            max_participants: tournament.max_participants || 32,
            current_participants: tournament.current_participants || 0,
            registration_start:
              tournament.registration_start || tournament.start_date,
            registration_end:
              tournament.registration_deadline || tournament.end_date,
            tournament_start: tournament.start_date,
            tournament_end: tournament.end_date,
            club_id: tournament.club_id,
            venue_address: tournament.venue_address || '',
            entry_fee_points: tournament.entry_fee || 0,
            total_prize_pool: tournament.prize_pool || 0,
            first_prize: tournament.first_prize || 0,
            second_prize: tournament.second_prize || 0,
            third_prize: tournament.third_prize || 0,
            status: tournament.status,
            banner_image: tournament.banner_image || '',
            rules: tournament.rules || '',
            contact_info: tournament.contact_info || {},
            club: tournament.clubs,
            recommendation_score: score,
          } as TournamentRecommendation;
        });

        // Sort by recommendation score
        const sortedTournaments = scoredTournaments
          .sort((a, b) => b.recommendation_score - a.recommendation_score)
          .slice(0, 20);

        setTournaments(sortedTournaments);
      }
    } catch (error) {
      console.error('Error loading tournament recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackUserClubInteraction = async (
    clubId: string,
    interactionType: string,
    metadata = {}
  ) => {
    if (!user?.id) return;

    try {
      const interactionScores = {
        tournament_join: 50,
        match_played: 30,
        check_in: 10,
        review: 20,
        favorite: 40,
        visit: 5,
      };

      const scoreToAdd =
        interactionScores[interactionType as keyof typeof interactionScores] ||
        5;

      // Try to upsert the interaction
      const { error } = await supabase.from('user_club_interactions').upsert({
        user_id: user.id,
        club_id: clubId,
        interaction_type: interactionType,
        interaction_count: 1,
        interaction_score: scoreToAdd,
        last_interaction: new Date().toISOString(),
        metadata: metadata,
      });

      if (error) {
        // If upsert failed due to unique constraint, increment existing record
        await supabase.rpc('increment_interaction', {
          p_user_id: user.id,
          p_club_id: clubId,
          p_interaction_type: interactionType,
          p_score_increment: scoreToAdd,
        });
      }

      // Reload recommendations to reflect new interaction
      loadTournamentRecommendations();
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  const getTournamentsByFilter = async (filter: string) => {
    if (!user?.id) return [];

    try {
      let query = supabase
        .from('tournaments')
        .select(
          `
          *,
          clubs!inner(
            id,
            name,
            address,
            latitude,
            longitude,
            phone,
            available_tables,
            is_sabo_owned
          )
        `
        )
        .in('status', ['upcoming', 'registration_open'])
        .gte('registration_end', new Date().toISOString());

      switch (filter) {
        case 'nearby':
          if (userLocation) {
            // Filter by distance (this is a simplified approach)
            query = query.not('clubs.latitude', 'is', null);
          }
          break;
        case 'high_prize':
          query = query.order('prize_pool', { ascending: false });
          break;
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('start_date', { ascending: true });
      }

      const { data } = await query.limit(20);

      if (data) {
        return data.map(
          tournament =>
            ({
              id: tournament.id,
              title: tournament.name || 'Tournament',
              description: tournament.description || '',
              tournament_type:
                tournament.tournament_type || 'single_elimination',
              game_format: tournament.game_format || '8_ball',
              max_participants: tournament.max_participants || 32,
              current_participants: tournament.current_participants || 0,
              registration_start:
                tournament.registration_start || tournament.start_date,
              registration_end:
                tournament.registration_deadline || tournament.end_date,
              tournament_start: tournament.start_date,
              tournament_end: tournament.end_date,
              club_id: tournament.club_id,
              venue_address: tournament.venue_address || '',
              entry_fee_points: tournament.entry_fee || 0,
              total_prize_pool: tournament.prize_pool || 0,
              first_prize: tournament.first_prize || 0,
              second_prize: tournament.second_prize || 0,
              third_prize: tournament.third_prize || 0,
              status: tournament.status,
              banner_image: tournament.banner_image || '',
              rules: tournament.rules || '',
              contact_info: tournament.contact_info || {},
              club: tournament.clubs,
              recommendation_score: 0,
            }) as TournamentRecommendation
        );
      }
    } catch (error) {
      console.error('Error loading tournaments by filter:', error);
    }

    return [];
  };

  return {
    tournaments,
    loading,
    userLocation,
    loadTournamentRecommendations,
    trackUserClubInteraction,
    getTournamentsByFilter,
  };
};
