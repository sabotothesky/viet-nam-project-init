import React from 'react';

// Common types to replace 'any' usage throughout the application

export interface UserProfile {
  user_id: string;
  full_name: string;
  nickname: string;
  phone: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  club_id?: string;
  current_rank?: string;
  ranking_points?: number;
  experience_years?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Club {
  id: string;
  name: string;
  address: string;
  description?: string;
  email?: string;
  phone?: string;
  hourly_rate?: number;
  monthly_payment?: number;
  table_count?: number;
  available_tables?: number;
  latitude?: number;
  longitude?: number;
  logo_url?: string;
  is_sabo_owned?: boolean;
  status?: string;
  created_at: string;
  updated_at: string;
  facilities?: ClubFacilities;
}

export interface ClubFacilities {
  parking?: boolean;
  wifi?: boolean;
  food?: boolean;
  drinks?: boolean;
  coaching?: boolean;
  tournaments?: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  entry_fee?: number;
  max_participants?: number;
  current_participants?: number;
  prize_pool?: number;
  status?: string;
  club_id?: string;
  created_by?: string;
  banner_image?: string;
  tournament_type?: string;
  game_format?: string;
  rules?: string;
  contact_info?: TournamentContactInfo;
}

export interface TournamentContactInfo {
  phone?: string;
  email?: string;
  contact_person?: string;
}

export interface Challenge {
  id: string;
  challenger_id: string;
  challenged_id: string;
  bet_points: number;
  message?: string;
  status?: string;
  proposed_datetime?: string;
  proposed_club_id?: string;
  confirmed_datetime?: string;
  confirmed_club_id?: string;
  challenger_score?: number;
  challenged_score?: number;
  winner_id?: string;
  created_at?: string;
  updated_at?: string;
  challenger_profile?: UserProfile;
  challenged_profile?: UserProfile;
}

export interface ChallengeProposal {
  clubId: string;
  datetime: string;
  message?: string;
  [key: string]: any;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: NotificationData;
  read_at?: string;
  created_at: string;
}

export interface NotificationData {
  challenge?: Challenge;
  tournament?: Tournament;
  club?: Club;
  [key: string]: any;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  post_type: string;
  media_urls?: string[];
  likes_count?: number;
  comments_count?: number;
  created_at: string;
  updated_at: string;
  author_profile?: UserProfile;
}

export interface Match {
  id: string;
  player1_id: string;
  player2_id: string;
  player1_score?: number;
  player2_score?: number;
  winner_id?: string;
  match_date?: string;
  club_id?: string;
  tournament_id?: string;
  status?: string;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  amount: number;
  transaction_type: string;
  description?: string;
  status?: string;
  balance_before: number;
  balance_after: number;
  payment_method?: string;
  reference_id?: string;
  metadata?: TransactionMetadata;
  created_at?: string;
}

export interface TransactionMetadata {
  payment_id?: string;
  order_id?: string;
  [key: string]: any;
}

export interface MarketplaceItem {
  id: string;
  seller_id: string;
  title: string;
  description?: string;
  price: number;
  original_price?: number;
  category?: string;
  condition?: string;
  brand?: string;
  model?: string;
  images?: string[];
  location?: string;
  specifications?: ItemSpecifications;
  status?: string;
  views_count?: number;
  favorites_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ItemSpecifications {
  material?: string;
  size?: string;
  weight?: string;
  color?: string;
  [key: string]: any;
}

export interface UserLocation {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface ApiResponse<T> {
  data: T;
  error: ApiError | null;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface FilterParams {
  search?: string;
  category?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  [key: string]: any;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface QueryParams extends PaginationParams, FilterParams {
  sort?: SortParams;
}

// Form data types
export interface ProfileFormData {
  full_name: string;
  nickname: string;
  phone: string;
  email?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  club_id?: string;
  bio?: string;
}

export interface LoginFormData {
  emailOrPhone: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  clubId?: string;
}

export interface ChallengeFormData {
  challenged_id: string;
  bet_points: number;
  message?: string;
  proposed_datetime?: string;
  proposed_club_id?: string;
}

export interface TournamentFormData {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  entry_fee?: number;
  max_participants?: number;
  prize_pool?: number;
  tournament_type?: string;
  game_format?: string;
  rules?: string;
  club_id?: string;
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  children?: any;
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  image?: string;
  onClick?: () => void;
}

export interface ButtonProps extends BaseComponentProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

// Hook return types
export interface UseAuthReturn {
  user: UserProfile | null;
  session: any | null;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    clubId?: string
  ) => Promise<{ error: ApiError | null }>;
  signIn: (
    emailOrPhone: string,
    password: string
  ) => Promise<{ error: ApiError | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

export interface UseQueryReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseMutationReturn<T, V> {
  mutate: (variables: V) => void;
  data: T | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
}
