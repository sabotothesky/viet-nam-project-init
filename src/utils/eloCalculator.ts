
export const calculateEloRating = (
  playerRating: number,
  opponentRating: number,
  result: 'win' | 'loss' | 'draw',
  kFactor: number = 32
): number => {
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  
  let actualScore: number;
  switch (result) {
    case 'win':
      actualScore = 1;
      break;
    case 'loss':
      actualScore = 0;
      break;
    case 'draw':
      actualScore = 0.5;
      break;
  }
  
  return Math.round(playerRating + kFactor * (actualScore - expectedScore));
};

export const getRankFromRating = (rating: number): string => {
  if (rating >= 2800) return 'S+';
  if (rating >= 2600) return 'S';
  if (rating >= 2400) return 'G+';
  if (rating >= 2200) return 'G';
  if (rating >= 2000) return 'A+';
  if (rating >= 1800) return 'A';
  if (rating >= 1600) return 'B+';
  if (rating >= 1400) return 'B';
  if (rating >= 1200) return 'C+';
  if (rating >= 1000) return 'C';
  if (rating >= 800) return 'D+';
  if (rating >= 600) return 'D';
  if (rating >= 400) return 'E+';
  return 'E';
};

export const getRatingFromRank = (rank: string): number => {
  switch (rank) {
    case 'S+': return 2800;
    case 'S': return 2600;
    case 'G+': return 2400;
    case 'G': return 2200;
    case 'A+': return 2000;
    case 'A': return 1800;
    case 'B+': return 1600;
    case 'B': return 1400;
    case 'C+': return 1200;
    case 'C': return 1000;
    case 'D+': return 800;
    case 'D': return 600;
    case 'E+': return 400;
    default: return 200;
  }
};

export const getRankColor = (rank: string): string => {
  switch (rank) {
    case 'S+': return 'text-purple-600';
    case 'S': return 'text-purple-600';
    case 'G+': return 'text-red-600';
    case 'G': return 'text-red-600';
    case 'A+': return 'text-orange-600';
    case 'A': return 'text-orange-600';
    case 'B+': return 'text-blue-600';
    case 'B': return 'text-blue-600';
    case 'C+': return 'text-green-600';
    case 'C': return 'text-green-600';
    case 'D+': return 'text-gray-600';
    case 'D': return 'text-gray-600';
    case 'E+': return 'text-gray-400';
    default: return 'text-gray-400';
  }
};

export const getExpectedScore = (playerRating: number, opponentRating: number): number => {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
};

export const getPerformanceRating = (results: Array<{ opponentRating: number; result: 'win' | 'loss' | 'draw' }>): number => {
  if (results.length === 0) return 0;
  
  const totalScore = results.reduce((sum, game) => {
    switch (game.result) {
      case 'win': return sum + 1;
      case 'draw': return sum + 0.5;
      case 'loss': return sum + 0;
    }
  }, 0);
  
  const averageOpponentRating = results.reduce((sum, game) => sum + game.opponentRating, 0) / results.length;
  const scorePercentage = totalScore / results.length;
  
  if (scorePercentage === 1) return averageOpponentRating + 400;
  if (scorePercentage === 0) return averageOpponentRating - 400;
  
  const logOdds = Math.log(scorePercentage / (1 - scorePercentage));
  return Math.round(averageOpponentRating + 400 * logOdds / Math.LN10);
};

export interface EloMatch {
  playerRating: number;
  opponentRating: number;
  result: 'win' | 'loss' | 'draw';
  kFactor?: number;
  winner_id?: string;
  match_type?: string;
  tournament_tier?: string;
  challenge_bet?: number;
  quality_score?: number;
  upset_factor?: number;
  is_tournament?: boolean;
  is_streak_bonus?: boolean;
  is_quality_match?: boolean;
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

export interface EloResult {
  newRating: number;
  ratingChange: number;
  expectedScore: number;
  player1_new_rating?: number;
  player2_new_rating?: number;
  player1_rating_change?: number;
  player2_rating_change?: number;
  k_factor_player1?: number;
  k_factor_player2?: number;
  bonus_player1?: number;
  bonus_player2?: number;
  volatility_player1?: number;
  volatility_player2?: number;
  player1_expected_score?: number;
  player2_expected_score?: number;
  match_quality_score?: number;
  confidence_interval?: number;
}

export interface EloConfig {
  defaultRating: number;
  kFactor: number;
  provisionalGames: number;
  baseKFactor?: number;
  tournamentMultiplier?: number;
  upsetMultiplier?: number;
  qualityMatchBonus?: number;
}

export const DEFAULT_ELO_CONFIG: EloConfig = {
  defaultRating: 1000,
  kFactor: 32,
  provisionalGames: 10,
  baseKFactor: 32,
  tournamentMultiplier: 1.2,
  upsetMultiplier: 1.5,
  qualityMatchBonus: 1.1,
};

export const getDynamicKFactor = (rating: number, gamesPlayed: number): number => {
  if (gamesPlayed < DEFAULT_ELO_CONFIG.provisionalGames) return 40;
  if (rating < 2100) return 32;
  if (rating < 2400) return 24;
  return 16;
};

export const predictMatchResult = (playerRating: number, opponentRating: number, additionalData?: any): {
  winProbability: number;
  drawProbability: number;
  lossProbability: number;
} => {
  const expectedScore = getExpectedScore(playerRating, opponentRating);
  return {
    winProbability: expectedScore,
    drawProbability: 0.1,
    lossProbability: 1 - expectedScore,
  };
};

export const calculateRecentForm = (recentResults: Array<'win' | 'loss' | 'draw'>): number => {
  if (recentResults.length === 0) return 0;
  
  const weights = recentResults.map((_, index) => Math.pow(0.9, recentResults.length - 1 - index));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  
  const weightedScore = recentResults.reduce((sum, result, index) => {
    const score = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0;
    return sum + score * weights[index];
  }, 0);
  
  return Math.round(((weightedScore / totalWeight) - 0.5) * 200);
};

export const calculateConsistencyScore = (ratingHistory: number[]): number => {
  if (ratingHistory.length < 2) return 50;
  
  const mean = ratingHistory.reduce((sum, rating) => sum + rating, 0) / ratingHistory.length;
  const variance = ratingHistory.reduce((sum, rating) => sum + Math.pow(rating - mean, 2), 0) / ratingHistory.length;
  const standardDeviation = Math.sqrt(variance);
  
  const consistencyScore = Math.max(0, Math.min(100, 100 - (standardDeviation / 10)));
  return Math.round(consistencyScore);
};

export const calculateEloEfficiency = (currentRating: number, startRating: number, gamesPlayed: number): number => {
  if (gamesPlayed === 0) return 0;
  return Math.round((currentRating - startRating) / gamesPlayed);
};

export const getRankProgression = (currentRating: number) => {
  const currentRank = getRankFromRating(currentRating);
  const currentRankRating = getRatingFromRank(currentRank);
  const nextRankRating = currentRankRating + 200;
  const nextRank = getRankFromRating(nextRankRating);
  
  return {
    currentRank,
    nextRank,
    pointsToNext: nextRankRating - currentRating,
    estimatedMatches: Math.ceil((nextRankRating - currentRating) / 16),
  };
};
