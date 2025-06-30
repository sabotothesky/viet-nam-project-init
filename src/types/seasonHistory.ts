export interface SeasonHistory {
  id: string;
  season_name: string;
  season_year: number;
  user_id?: string;
  nickname: string;
  ranking_points: number;
  final_rank: number;
  created_at: string;
}

export interface SeasonStats {
  season_name: string;
  season_year: number;
  total_players: number;
  highest_points: number;
  lowest_points: number;
  average_points: number;
  total_ranks: number;
}

export interface UserBestSeason {
  season_name: string;
  season_year: number;
  ranking_points: number;
  final_rank: number;
}

export interface SeasonHistoryFilters {
  season_name?: string;
  season_year?: number;
  nickname?: string;
  min_rank?: number;
  max_rank?: number;
  min_points?: number;
  max_points?: number;
}

export interface SeasonHistoryResponse {
  data: SeasonHistory[];
  count: number;
  stats?: SeasonStats;
}

export interface CurrentSeason {
  season_name: string;
  season_year: number;
  start_date: string;
  end_date: string;
  status: 'ongoing' | 'completed' | 'upcoming';
  days_remaining: number;
}

export interface SeasonProgress {
  total_days: number;
  days_elapsed: number;
  days_remaining: number;
  progress_percentage: number;
}

export interface SeasonComparison {
  current_season: SeasonStats;
  previous_season: SeasonStats;
  top_players_change: Array<{
    nickname: string;
    current_rank: number;
    previous_rank: number;
    rank_change: number;
    current_points: number;
    previous_points: number;
    points_change: number;
  }>;
}
