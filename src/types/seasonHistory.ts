
export interface SeasonHistory {
  id: string;
  user_id: string;
  season_name: string;
  season_year: number;
  final_rank: number;
  final_points: number;
  matches_played: number;
  wins: number;
  losses: number;
  peak_rank?: number;
  created_at: string;
  updated_at: string;
  
  // Joined data
  profiles?: {
    nickname?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export interface SeasonHistoryFilters {
  season_name?: string;
  season_year?: number;
  user_id?: string;
  min_rank?: number;
  max_rank?: number;
  club_id?: string;
}

export interface CurrentSeason {
  season_name: string;
  season_year: number;
  start_date: string;
  end_date: string;
  status: 'ongoing' | 'completed' | 'upcoming';
  total_participants: number;
}

export interface SeasonProgress {
  user_rank: number;
  total_participants: number;
  matches_played: number;
  wins: number;
  losses: number;
  points: number;
  rating_change: number;
}

export interface SeasonComparison {
  current_season: {
    season_name: string;
    season_year: number;
    rank: number;
    points: number;
    matches_played: number;
  };
  previous_season: {
    season_name: string;
    season_year: number;
    rank: number;
    points: number;
    matches_played: number;
  };
  improvement: {
    rank_change: number;
    points_change: number;
    matches_change: number;
  };
}

export interface PlayerHistoryResponse {
  player_history: SeasonHistory[];
  total_seasons: number;
}

export interface BestSeasonData {
  season_name: string;
  season_year: number;
  best_rank: number;
  points: number;
  matches_played: number;
  win_rate: number;
}
