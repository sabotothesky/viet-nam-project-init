export interface EloConfig {
  k_factor: number;
  rating_floor: number;
  rating_ceiling: number;
  volatility_adjustment: boolean;
  streak_bonus: boolean;
  tournament_bonus: boolean;
  upset_bonus: boolean;
  quality_match_bonus: boolean;
}

export interface EloMatch {
  player1_rating: number;
  player2_rating: number;
  player1_matches: number;
  player2_matches: number;
  player1_streak: number;
  player2_streak: number;
  player1_volatility: number;
  player2_volatility: number;
}

export interface EloResult {
  player1_rating_change: number;
  player2_rating_change: number;
  expected_score_1: number;
  expected_score_2: number;
  k_factor_1: number;
  k_factor_2: number;
}

// Basic Elo calculation function
export const calculateElo = (
  player1Rating: number,
  player2Rating: number,
  player1Won: boolean,
  kFactor: number = 32
): { newRating1: number; newRating2: number; ratingChange: number } => {
  const expectedScore1 = 1 / (1 + Math.pow(10, (player2Rating - player1Rating) / 400));
  const actualScore1 = player1Won ? 1 : 0;
  
  const ratingChange = Math.round(kFactor * (actualScore1 - expectedScore1));
  
  return {
    newRating1: player1Rating + ratingChange,
    newRating2: player2Rating - ratingChange,
    ratingChange: Math.abs(ratingChange)
  };
};

// Enhanced Elo calculation with advanced features
export const calculateAdvancedElo = (
  config: EloConfig,
  match: EloMatch,
  winner: 1 | 2
): EloResult => {
  const { k_factor } = config;
  
  // Calculate expected scores
  const ratingDiff = match.player2_rating - match.player1_rating;
  const expectedScore1 = 1 / (1 + Math.pow(10, ratingDiff / 400));
  const expectedScore2 = 1 - expectedScore1;
  
  // Determine actual scores
  const actualScore1 = winner === 1 ? 1 : 0;
  const actualScore2 = winner === 2 ? 1 : 0;
  
  // Calculate base K-factors
  let kFactor1 = getKFactor(match.player1_rating, match.player1_matches);
  let kFactor2 = getKFactor(match.player2_rating, match.player2_matches);
  
  // Apply modifiers based on config
  if (config.volatility_adjustment) {
    kFactor1 *= (1 + match.player1_volatility * 0.1);
    kFactor2 *= (1 + match.player2_volatility * 0.1);
  }
  
  // Calculate rating changes
  const ratingChange1 = Math.round(kFactor1 * (actualScore1 - expectedScore1));
  const ratingChange2 = Math.round(kFactor2 * (actualScore2 - expectedScore2));
  
  return {
    player1_rating_change: ratingChange1,
    player2_rating_change: ratingChange2,
    expected_score_1: expectedScore1,
    expected_score_2: expectedScore2,
    k_factor_1: kFactor1,
    k_factor_2: kFactor2,
  };
};

// Get K-factor based on rating and experience
export const getKFactor = (rating: number, matchesPlayed: number): number => {
  // New players (< 30 matches) get higher K-factor
  if (matchesPlayed < 30) return 40;
  
  // High-rated players get lower K-factor for stability
  if (rating >= 2400) return 16;
  if (rating >= 2100) return 24;
  
  // Standard K-factor for most players
  return 32;
};

// Calculate rating from rank
export const getRatingFromRank = (rank: string): number => {
  const rankRatings: { [key: string]: number } = {
    'K1': 1000,
    'K2': 1100,
    'K3': 1200,
    'D1': 1300,
    'D2': 1400,
    'D3': 1500,
    'D4': 1600,
    'D5': 1700,
    'Dan1': 1800,
    'Dan2': 1900,
    'Dan3': 2000,
    'Dan4': 2100,
    'Dan5': 2200,
    'Dan6': 2300,
    'Dan7': 2400,
  };
  
  return rankRatings[rank] || 1000;
};

// Calculate rank from rating
export const getRankFromRating = (rating: number): string => {
  if (rating >= 2400) return 'Dan7';
  if (rating >= 2300) return 'Dan6';
  if (rating >= 2200) return 'Dan5';
  if (rating >= 2100) return 'Dan4';
  if (rating >= 2000) return 'Dan3';
  if (rating >= 1900) return 'Dan2';
  if (rating >= 1800) return 'Dan1';
  if (rating >= 1700) return 'D5';
  if (rating >= 1600) return 'D4';
  if (rating >= 1500) return 'D3';
  if (rating >= 1400) return 'D2';
  if (rating >= 1300) return 'D1';
  if (rating >= 1200) return 'K3';
  if (rating >= 1100) return 'K2';
  return 'K1';
};

// Calculate expected win probability
export const calculateWinProbability = (rating1: number, rating2: number): number => {
  return 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
};

// Calculate rating volatility
export const calculateVolatility = (recentResults: number[], timeframe: number = 10): number => {
  if (recentResults.length < 2) return 0;
  
  const recent = recentResults.slice(-timeframe);
  const mean = recent.reduce((sum, result) => sum + result, 0) / recent.length;
  const variance = recent.reduce((sum, result) => sum + Math.pow(result - mean, 2), 0) / recent.length;
  
  return Math.sqrt(variance);
};
