
export interface SeasonHistory {
  id: string;
  nickname: string;
  final_rank: number;
  ranking_points: number;
  season_name: string;
  season_year: number;
  created_at?: string;
}

export interface SeasonHistoryFilters {
  season_name: string;
  season_year: number;
  nickname?: string;
}

export interface CurrentSeason {
  season_name: string;
  season_year: number;
  start_date: string;
  end_date: string;
  status: 'ongoing' | 'completed' | 'upcoming';
  days_remaining?: number;
}

export interface SeasonProgress {
  current_rank: number;
  total_points: number;
  games_played: number;
  wins: number;
  losses: number;
  win_rate: number;
  progress_percentage: number;
  days_elapsed?: number;
  days_remaining?: number;
}

export interface PlayerChange {
  player_name: string;
  nickname?: string;
  rank_change: number;
  current_rank?: number;
  previous_rank?: number;
  current_points?: number;
  previous_points?: number;
  points_change?: number;
}

export interface SeasonComparison {
  current_season: {
    rank: number;
    points: number;
    games: number;
    season_name?: string;
    season_year?: number;
    total_players?: number;
    highest_points?: number;
    average_points?: number;
  };
  previous_season: {
    rank: number;
    points: number;
    games: number;
    season_name?: string;
    season_year?: number;
    total_players?: number;
    highest_points?: number;
    average_points?: number;
  };
  improvement: {
    rank_change: number;
    points_change: number;
    games_change: number;
  };
  top_players_change?: PlayerChange[];
}

export interface UserBestSeason {
  season_name: string;
  season_year: number;
  final_rank: number;
  ranking_points: number;
  achievement_level: string;
}
