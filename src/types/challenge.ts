import { UserProfile, Club } from './tournament';

export interface Challenge {
  id: string;
  challenger_id: string;
  opponent_id: string;
  club_id: string;
  bet_points: number;
  race_to: number;
  handicap_1_rank: number;
  handicap_05_rank: number;
  status: 'pending' | 'accepted' | 'declined' | 'ongoing' | 'completed' | 'cancelled';
  scheduled_time?: string;
  actual_start_time?: string;
  actual_end_time?: string;
  challenger_score?: number;
  opponent_score?: number;
  winner_id?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verification_notes?: string;
  verification_images?: string[];
  verified_by?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
  challenger?: UserProfile;
  opponent?: UserProfile;
  club?: Club;
  verifier?: UserProfile;
}

export interface ChallengeResult {
  id: string;
  challenge_id: string;
  winner_id: string;
  loser_id: string;
  winner_score: number;
  loser_score: number;
  elo_points_exchanged: number;
  winner_elo_change: number;
  loser_elo_change: number;
  created_at: string;
  challenge?: Challenge;
  winner?: UserProfile;
  loser?: UserProfile;
}

export interface ChallengeVerification {
  id: string;
  challenge_id: string;
  verifier_id: string;
  verification_type: 'image' | 'receipt' | 'other';
  verification_data: {
    images?: string[];
    receipt_number?: string;
    description?: string;
    additional_notes?: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  challenge?: Challenge;
  verifier?: UserProfile;
}

// Challenge configuration based on bet points
export const CHALLENGE_CONFIGS = [
  {
    bet_range: { min: 600, max: 650 },
    race_to: 22,
    handicap_1_rank: 3.5,
    handicap_05_rank: 2.5,
    description: 'Thách đấu cao cấp - Race to 22'
  },
  {
    bet_range: { min: 500, max: 550 },
    race_to: 18,
    handicap_1_rank: 3,
    handicap_05_rank: 2,
    description: 'Thách đấu trung cao - Race to 18'
  },
  {
    bet_range: { min: 400, max: 450 },
    race_to: 16,
    handicap_1_rank: 2.5,
    handicap_05_rank: 1.5,
    description: 'Thách đấu trung cấp - Race to 16'
  },
  {
    bet_range: { min: 300, max: 350 },
    race_to: 14,
    handicap_1_rank: 2,
    handicap_05_rank: 1.5,
    description: 'Thách đấu trung bình - Race to 14'
  },
  {
    bet_range: { min: 200, max: 250 },
    race_to: 12,
    handicap_1_rank: 1.5,
    handicap_05_rank: 1,
    description: 'Thách đấu cơ bản - Race to 12'
  },
  {
    bet_range: { min: 100, max: 150 },
    race_to: 8,
    handicap_1_rank: 1,
    handicap_05_rank: 0.5,
    description: 'Thách đấu sơ cấp - Race to 8'
  }
];

export const getChallengeConfig = (betPoints: number) => {
  return CHALLENGE_CONFIGS.find(config => 
    betPoints >= config.bet_range.min && betPoints <= config.bet_range.max
  );
};

export const isValidBetPoints = (betPoints: number) => {
  return betPoints >= 100 && betPoints <= 650;
};

export interface ChallengeFilters {
  status?: string;
  club_id?: string;
  challenger_id?: string;
  opponent_id?: string;
  date_from?: string;
  date_to?: string;
  verification_status?: string;
}

export interface ChallengeStats {
  total_challenges: number;
  completed_challenges: number;
  total_elo_exchanged: number;
  average_elo_per_challenge: number;
  win_rate: number;
  total_bet_points: number;
}

export interface CreateChallengeRequest {
  opponent_id: string;
  club_id: string;
  bet_points: number;
  scheduled_time?: string;
  message?: string;
}

export interface AcceptChallengeRequest {
  challenge_id: string;
  message?: string;
}

export interface SubmitChallengeResultRequest {
  challenge_id: string;
  winner_score: number;
  loser_score: number;
  verification_images: string[];
  verification_notes?: string;
}

export interface VerifyChallengeRequest {
  challenge_id: string;
  verification_type: 'image' | 'receipt' | 'other';
  verification_data: {
    images?: string[];
    receipt_number?: string;
    description?: string;
    additional_notes?: string;
  };
} 