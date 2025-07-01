
export interface SeasonHistory {
  id: string;
  nickname: string;
  final_rank: number;
  ranking_points: number;
  season_name: string;
  season_year: number;
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
  top_players_change?: Array<{
    player_name: string;
    rank_change: number;
  }>;
}
