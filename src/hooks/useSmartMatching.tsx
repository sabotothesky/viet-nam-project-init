import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/common';
import { useProfile } from '@/hooks/useProfile';

interface MatchingCriteria {
  skillLevel: string;
  location: string;
  playtime: string;
  interests: string[];
}

interface MatchingSuggestion {
  id: string;
  name: string;
  avatar: string;
  rank: string;
  age: number;
  location: string;
  bio: string;
  stats: {
    matches_played: number;
    matches_won: number;
    win_rate: number;
    longest_run: number;
  };
  distance?: string;
  last_active: string;
  preferred_stakes?: number[];
  matchScore: number;
  matchReasons: string[];
}

export const useSmartMatching = () => {
  const { user } = useAuth();
  const { getProfile } = useProfile();
  const [suggestions, setSuggestions] = useState<MatchingSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [criteria, setCriteria] = useState<MatchingCriteria>({
    skillLevel: 'Tìm đối thủ cùng trình độ',
    location: 'Người chơi gần bạn',
    playtime: 'Cùng thời gian chơi',
    interests: ['Sở thích tương tự'],
  });

  const getMatchingSuggestions = async (currentUser: UserProfile) => {
    if (!currentUser) return [];

    setLoading(true);

    try {
      // Get current user profile
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (!userProfile) return [];

      // Get potential matches
      const { data: potentialMatches } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', currentUser.id)
        .limit(50);

      if (!potentialMatches) return [];

      // Calculate match scores
      const scoredMatches = potentialMatches.map(match => {
        const matchScore = calculateMatchScore(userProfile, match);
        const matchReasons = getMatchReasons(userProfile, match);

        return {
          id: match.user_id,
          name: match.full_name || 'Unknown Player',
          avatar: match.avatar_url || '/placeholder.svg',
          rank: match.current_rank || 'K1',
          age: match.date_of_birth
            ? new Date().getFullYear() -
              new Date(match.date_of_birth).getFullYear()
            : 25,
          location: match.address || 'Hà Nội',
          bio: match.bio || 'Yêu thích bida và muốn tìm đối thủ xứng tầm!',
          stats: {
            matches_played: match.matches_played || 0,
            matches_won: match.matches_won || 0,
            win_rate:
              match.matches_played > 0
                ? Math.round((match.matches_won / match.matches_played) * 100)
                : 0,
            longest_run: Math.floor(Math.random() * 15) + 5,
          },
          distance: `${Math.floor(Math.random() * 10) + 1}km`,
          last_active: getRandomLastActive(),
          preferred_stakes: [50000, 100000, 200000],
          matchScore,
          matchReasons,
        };
      });

      // Sort by match score and return top matches
      const topMatches = scoredMatches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 20);

      return topMatches;
    } catch (error) {
      console.error('Error getting matching suggestions:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const calculateMatchScore = (
    userProfile: UserProfile,
    matchProfile: UserProfile
  ) => {
    let score = 0;

    // Skill level matching (40 points max)
    const userRankValue = getRankValue(userProfile.current_rank);
    const matchRankValue = getRankValue(matchProfile.current_rank);
    const rankDifference = Math.abs(userRankValue - matchRankValue);
    score += Math.max(0, 40 - rankDifference * 5);

    // Experience matching (30 points max)
    const userExperience = userProfile.experience_years || 0;
    const matchExperience = matchProfile.experience_years || 0;
    const expDifference = Math.abs(userExperience - matchExperience);
    score += Math.max(0, 30 - expDifference * 3);

    // Activity level (30 points max)
    const userMatches = userProfile.matches_played || 0;
    const matchMatches = matchProfile.matches_played || 0;
    if (userMatches > 0 && matchMatches > 0) {
      const activityDifference = Math.abs(userMatches - matchMatches);
      score += Math.max(0, 30 - activityDifference / 10);
    }

    return Math.min(100, Math.max(0, score));
  };

  const getMatchReasons = (
    userProfile: UserProfile,
    matchProfile: UserProfile
  ) => {
    const reasons = [];

    const userRankValue = getRankValue(userProfile.current_rank);
    const matchRankValue = getRankValue(matchProfile.current_rank);
    if (Math.abs(userRankValue - matchRankValue) <= 2) {
      reasons.push('Cùng trình độ');
    }

    if (Math.random() > 0.5) {
      reasons.push('Gần bạn');
    }

    if (Math.random() > 0.6) {
      reasons.push('Hoạt động thường xuyên');
    }

    if (reasons.length === 0) {
      reasons.push('Đối thủ tiềm năng');
    }

    return reasons;
  };

  const getRankValue = (rank: string) => {
    const rankMap: { [key: string]: number } = {
      K1: 1,
      K2: 2,
      K3: 3,
      C1: 4,
      C2: 5,
      C3: 6,
      B1: 7,
      B2: 8,
      B3: 9,
      A1: 10,
      A2: 11,
      A3: 12,
      G: 13,
      'G+': 14,
    };
    return rankMap[rank] || 1;
  };

  const getRandomLastActive = () => {
    const options = [
      'Vừa xong',
      '5 phút trước',
      '15 phút trước',
      '1 giờ trước',
      '2 giờ trước',
      'Hôm qua',
    ];
    return options[Math.floor(Math.random() * options.length)];
  };

  const loadSuggestions = async () => {
    if (user) {
      try {
        const userProfile = await getProfile();
        if (userProfile) {
          const matches = await getMatchingSuggestions(userProfile);
          setSuggestions(matches);
        }
      } catch (error) {
        console.error('Error loading suggestions:', error);
      }
    }
  };

  const removeFromSuggestions = (opponentId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== opponentId));
  };

  useEffect(() => {
    loadSuggestions();
  }, [user]);

  return {
    suggestions,
    loading,
    criteria,
    setCriteria,
    loadSuggestions,
    removeFromSuggestions,
  };
};
