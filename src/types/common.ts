export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    first_name?: string;
    last_name?: string;
  };
  email_confirmed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

export interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  current_rank?: string;
  club_id?: string;
  clbVerified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  post_type: 'general' | 'match_result' | 'achievement' | 'tournament_win';
  type?: 'general' | 'match_result' | 'achievement' | 'tournament_win';
  stats?: {
    score?: string;
    opponent?: string;
    achievement?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  transaction_type: string;
  amount: number;
  description?: string;
  status: string;
  created_at: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: string;
}

export interface TransactionMetadata {
  bank_account?: string;
  bank_name?: string;
  account_holder?: string;
  notes?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read_at?: string;
  created_at: string;
  priority?: 'low' | 'medium' | 'high';
  action_url?: string;
}

export interface Challenge {
  id: string;
  challenger_id: string;
  challenged_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  bet_points: number;
  message?: string;
  proposed_datetime?: string;
  club_id?: string;
  challenger_profile?: UserProfile;
  challenged_profile?: UserProfile;
  club?: {
    name: string;
  };
  challenger?: {
    user_id: string;
    full_name: string;
    avatar_url?: string;
    current_rank: string;
  };
  challenged?: {
    user_id: string;
    full_name: string;
    avatar_url?: string;
    current_rank: string;
  };
}

export interface CreateChallengeData {
  challenged_id: string;
  bet_points: number;
  message?: string;
  proposed_datetime?: string;
}

export interface ChallengeProposal {
  proposed_datetime?: string;
  club_id?: string;
  message?: string;
}

export interface PlayerStats {
  id: string;
  user_id: string;
  username: string;
  current_rating: number;
  wins: number;
  losses: number;
  draws: number;
  total_games: number;
  matches_played: number;
  win_rate: number;
  current_streak: number;
  best_streak: number;
  elo_rating: number;
  rank: string;
  recent_form?: number;
  consistency_score?: number;
  rating_volatility?: number;
  highest_rating?: number;
  lowest_rating?: number;
  average_opponent_rating?: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
