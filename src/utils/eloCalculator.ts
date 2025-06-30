// Enhanced ELO System for SABO POOL ARENA
// Optimized with advanced algorithms and features

export interface EloMatch {
  player1_id: string;
  player2_id: string;
  player1_score: number;
  player2_score: number;
  winner_id: string;
  is_tournament?: boolean;
  is_streak_bonus?: boolean;
  is_quality_match?: boolean;
  match_date: Date;
  match_type?: 'regular' | 'tournament' | 'challenge' | 'quick';
  tournament_tier?: 'local' | 'regional' | 'national' | 'international';
  challenge_bet?: number;
  quality_score?: number; // 1-10 rating of match quality
  upset_factor?: number; // 1-5 rating of upset magnitude
}

export interface EloResult {
  player1_new_rating: number;
  player2_new_rating: number;
  player1_rating_change: number;
  player2_rating_change: number;
  player1_expected_score: number;
  player2_expected_score: number;
  k_factor_player1: number;
  k_factor_player2: number;
  bonus_player1: number;
  bonus_player2: number;
  volatility_player1: number;
  volatility_player2: number;
  confidence_interval: number;
  match_quality_score: number;
}

export interface PlayerStats {
  user_id: string;
  current_rating: number;
  matches_played: number;
  current_streak: number;
  last_match_date?: Date;
  highest_rating?: number;
  lowest_rating?: number;
  win_rate?: number;
  average_opponent_rating?: number;
  rating_volatility?: number;
  recent_form?: number; // -100 to 100, based on last 10 matches
  consistency_score?: number; // 0-100, based on rating stability
}

export interface EloConfig {
  baseKFactor: number;
  ratingFloor: number;
  ratingCeiling: number;
  volatilityDecay: number;
  streakMultiplier: number;
  tournamentMultiplier: number;
  upsetMultiplier: number;
  qualityMatchBonus: number;
  consistencyBonus: number;
  formBonus: number;
}

// Default ELO configuration
export const DEFAULT_ELO_CONFIG: EloConfig = {
  baseKFactor: 32,
  ratingFloor: 100,
  ratingCeiling: 3000,
  volatilityDecay: 0.95,
  streakMultiplier: 1.2,
  tournamentMultiplier: 1.5,
  upsetMultiplier: 1.3,
  qualityMatchBonus: 0.15,
  consistencyBonus: 0.1,
  formBonus: 0.05,
};

/**
 * Enhanced ELO calculation with advanced features
 */
export const calculateEloRating = (
  player1: PlayerStats,
  player2: PlayerStats,
  match: EloMatch,
  config: EloConfig = DEFAULT_ELO_CONFIG
): EloResult => {
  // 1. Calculate dynamic K-factors
  const k1 = getDynamicKFactor(player1, match, config);
  const k2 = getDynamicKFactor(player2, match, config);

  // 2. Calculate expected scores with rating adjustment
  const adjustedRating1 = adjustRatingForForm(player1);
  const adjustedRating2 = adjustRatingForForm(player2);
  const expected1 = getExpectedScore(adjustedRating1, adjustedRating2);
  const expected2 = 1 - expected1;

  // 3. Determine actual results
  const actual1 = match.winner_id === player1.user_id ? 1 : 0;
  const actual2 = match.winner_id === player2.user_id ? 1 : 0;

  // 4. Calculate base rating changes
  const baseChange1 = k1 * (actual1 - expected1);
  const baseChange2 = k2 * (actual2 - expected2);

  // 5. Calculate advanced bonus factors
  const bonus1 = calculateAdvancedBonus(
    player1,
    player2,
    match,
    actual1,
    config
  );
  const bonus2 = calculateAdvancedBonus(
    player2,
    player1,
    match,
    actual2,
    config
  );

  // 6. Calculate volatility adjustments
  const volatility1 = calculateVolatilityAdjustment(player1, baseChange1);
  const volatility2 = calculateVolatilityAdjustment(player2, baseChange2);

  // 7. Calculate final ratings with bounds
  const totalChange1 = baseChange1 + bonus1 + volatility1;
  const totalChange2 = baseChange2 + bonus2 + volatility2;

  const newRating1 = Math.max(
    config.ratingFloor,
    Math.min(
      config.ratingCeiling,
      Math.round(player1.current_rating + totalChange1)
    )
  );
  const newRating2 = Math.max(
    config.ratingFloor,
    Math.min(
      config.ratingCeiling,
      Math.round(player2.current_rating + totalChange2)
    )
  );

  // 8. Calculate match quality score
  const matchQuality = calculateMatchQuality(player1, player2, match, actual1);

  // 9. Calculate confidence interval
  const confidence = calculateConfidenceInterval(player1, player2, match);

  return {
    player1_new_rating: newRating1,
    player2_new_rating: newRating2,
    player1_rating_change: Math.round(totalChange1),
    player2_rating_change: Math.round(totalChange2),
    player1_expected_score: expected1,
    player2_expected_score: expected2,
    k_factor_player1: k1,
    k_factor_player2: k2,
    bonus_player1: Math.round(bonus1),
    bonus_player2: Math.round(bonus2),
    volatility_player1: Math.round(volatility1),
    volatility_player2: Math.round(volatility2),
    confidence_interval: confidence,
    match_quality_score: matchQuality,
  };
};

/**
 * Dynamic K-factor calculation based on multiple factors
 */
export const getDynamicKFactor = (
  player: PlayerStats,
  match: EloMatch,
  config: EloConfig
): number => {
  let kFactor = config.baseKFactor;

  // Base K-factor based on experience
  if (player.matches_played < 30) {
    kFactor = 40; // New players - rapid changes
  } else if (player.matches_played < 100) {
    kFactor = 32; // Intermediate players
  } else if (player.matches_played < 200) {
    kFactor = 28; // Experienced players
  } else if (player.matches_played < 500) {
    kFactor = 24; // Veteran players
  } else {
    kFactor = 20; // Elite players - stable
  }

  // Tournament multiplier
  if (match.is_tournament) {
    kFactor = Math.round(kFactor * config.tournamentMultiplier);
  }

  // Challenge multiplier based on bet amount
  if (match.match_type === 'challenge' && match.challenge_bet) {
    const betMultiplier = Math.min(1.5, 1 + match.challenge_bet / 1000);
    kFactor = Math.round(kFactor * betMultiplier);
  }

  // Streak multiplier
  if (player.current_streak > 3) {
    const streakMultiplier = Math.min(
      config.streakMultiplier,
      1 + player.current_streak * 0.1
    );
    kFactor = Math.round(kFactor * streakMultiplier);
  }

  // Volatility adjustment
  if (player.rating_volatility && player.rating_volatility > 100) {
    kFactor = Math.round(kFactor * 1.2); // Increase K for volatile players
  }

  return Math.max(16, Math.min(60, kFactor)); // Bounds: 16-60
};

/**
 * Rating adjustment based on recent form
 */
export const adjustRatingForForm = (player: PlayerStats): number => {
  if (!player.recent_form) return player.current_rating;

  // Adjust rating by up to ±50 points based on form
  const formAdjustment = (player.recent_form / 100) * 50;
  return player.current_rating + formAdjustment;
};

/**
 * Enhanced expected score calculation with rating adjustment
 */
export const getExpectedScore = (ratingA: number, ratingB: number): number => {
  const ratingDiff = ratingB - ratingA;
  return 1 / (1 + Math.pow(10, ratingDiff / 400));
};

/**
 * Advanced bonus calculation with multiple factors
 */
export const calculateAdvancedBonus = (
  player: PlayerStats,
  opponent: PlayerStats,
  match: EloMatch,
  actualResult: number,
  config: EloConfig
): number => {
  if (actualResult !== 1) return 0; // Only bonus for winners

  let bonus = 0;
  const baseRating = player.current_rating;

  // 1. Tournament bonus (scaled by tier)
  if (match.is_tournament) {
    const tierMultiplier = getTournamentTierMultiplier(match.tournament_tier);
    bonus += Math.round(baseRating * 0.2 * tierMultiplier);
  }

  // 2. Streak bonus (diminishing returns)
  if (match.is_streak_bonus && player.current_streak > 0) {
    const streakBonus = Math.min(player.current_streak * 0.03, 0.15);
    bonus += Math.round(baseRating * streakBonus);
  }

  // 3. Quality match bonus
  if (match.is_quality_match && match.quality_score) {
    const qualityMultiplier = match.quality_score / 10;
    bonus += Math.round(
      baseRating * config.qualityMatchBonus * qualityMultiplier
    );
  }

  // 4. Upset bonus (beating higher rated player)
  if (player.current_rating < opponent.current_rating) {
    const ratingDiff = opponent.current_rating - player.current_rating;
    if (ratingDiff > 100) {
      const upsetMultiplier = Math.min(0.2, ratingDiff / 1000);
      bonus += Math.round(
        ratingDiff * upsetMultiplier * config.upsetMultiplier
      );
    }
  }

  // 5. Consistency bonus
  if (player.consistency_score && player.consistency_score > 80) {
    bonus += Math.round(baseRating * config.consistencyBonus);
  }

  // 6. Form bonus
  if (player.recent_form && player.recent_form > 50) {
    bonus += Math.round(baseRating * config.formBonus);
  }

  // 7. Challenge bonus based on bet amount
  if (match.match_type === 'challenge' && match.challenge_bet) {
    const betBonus = Math.min(0.3, match.challenge_bet / 2000);
    bonus += Math.round(baseRating * betBonus);
  }

  return bonus;
};

/**
 * Volatility adjustment based on player history
 */
export const calculateVolatilityAdjustment = (
  player: PlayerStats,
  baseChange: number
): number => {
  if (!player.rating_volatility) return 0;

  // Higher volatility players get more extreme changes
  const volatilityFactor = Math.min(1.5, player.rating_volatility / 100);
  return Math.round(baseChange * (volatilityFactor - 1));
};

/**
 * Tournament tier multiplier
 */
export const getTournamentTierMultiplier = (tier?: string): number => {
  switch (tier) {
    case 'international':
      return 2.0;
    case 'national':
      return 1.5;
    case 'regional':
      return 1.3;
    case 'local':
      return 1.1;
    default:
      return 1.2;
  }
};

/**
 * Calculate match quality score
 */
export const calculateMatchQuality = (
  player1: PlayerStats,
  player2: PlayerStats,
  match: EloMatch,
  actualResult: number
): number => {
  let quality = 5; // Base quality

  // Rating difference factor
  const ratingDiff = Math.abs(player1.current_rating - player2.current_rating);
  if (ratingDiff < 100)
    quality += 2; // Close match
  else if (ratingDiff < 300) quality += 1; // Moderate difference

  // Upset factor
  if (match.upset_factor) {
    quality += match.upset_factor;
  }

  // Tournament factor
  if (match.is_tournament) quality += 1;

  // Challenge factor
  if (match.match_type === 'challenge') quality += 1;

  return Math.min(10, Math.max(1, quality));
};

/**
 * Calculate confidence interval for rating changes
 */
export const calculateConfidenceInterval = (
  player1: PlayerStats,
  player2: PlayerStats,
  match: EloMatch
): number => {
  let confidence = 0.8; // Base confidence

  // More matches = higher confidence
  const totalMatches = player1.matches_played + player2.matches_played;
  if (totalMatches > 200) confidence += 0.1;
  else if (totalMatches < 50) confidence -= 0.2;

  // Tournament matches have higher confidence
  if (match.is_tournament) confidence += 0.1;

  // Challenge matches have higher confidence
  if (match.match_type === 'challenge') confidence += 0.05;

  return Math.min(0.95, Math.max(0.5, confidence));
};

/**
 * Enhanced rank calculation with sub-ranks
 */
export const getRankFromRating = (rating: number): string => {
  if (rating >= 2800) return 'S+'; // Legendary
  if (rating >= 2600) return 'S'; // Master
  if (rating >= 2400) return 'G+'; // Elite
  if (rating >= 2200) return 'G'; // Expert
  if (rating >= 2000) return 'A+'; // Advanced
  if (rating >= 1800) return 'A'; // Intermediate+
  if (rating >= 1600) return 'B+'; // Intermediate
  if (rating >= 1400) return 'B'; // Beginner+
  if (rating >= 1200) return 'C+'; // Beginner
  if (rating >= 1000) return 'C'; // Novice+
  if (rating >= 800) return 'D+'; // Novice
  if (rating >= 600) return 'D'; // Rookie+
  if (rating >= 400) return 'E+'; // Rookie
  return 'E'; // Newcomer
};

/**
 * Enhanced rating from rank
 */
export const getRatingFromRank = (rank: string): number => {
  switch (rank) {
    case 'S+':
      return 2800;
    case 'S':
      return 2600;
    case 'G+':
      return 2400;
    case 'G':
      return 2200;
    case 'A+':
      return 2000;
    case 'A':
      return 1800;
    case 'B+':
      return 1600;
    case 'B':
      return 1400;
    case 'C+':
      return 1200;
    case 'C':
      return 1000;
    case 'D+':
      return 800;
    case 'D':
      return 600;
    case 'E+':
      return 400;
    case 'E':
      return 200;
    default:
      return 1000;
  }
};

/**
 * Calculate win rate with decimal precision
 */
export const calculateWinRate = (wins: number, total: number): number => {
  return total > 0 ? (wins / total) * 100 : 0;
};

/**
 * Enhanced performance rating calculation
 */
export const calculatePerformanceRating = (
  wins: number,
  losses: number,
  averageOpponentRating: number,
  recentMatches: number = 20
): number => {
  const total = wins + losses;
  if (total === 0) return 1000;

  const winRate = wins / total;
  const performanceRating = averageOpponentRating + 400 * (winRate - 0.5);

  // Adjust for recent form
  const recentWeight = Math.min(1, total / recentMatches);
  return Math.round(
    performanceRating * recentWeight + 1000 * (1 - recentWeight)
  );
};

/**
 * Enhanced upset detection
 */
export const isUpset = (winnerRating: number, loserRating: number): boolean => {
  return winnerRating < loserRating && loserRating - winnerRating > 150;
};

/**
 * Calculate rating volatility from history
 */
export const calculateVolatility = (ratingHistory: number[]): number => {
  if (ratingHistory.length < 3) return 0;

  const changes = [];
  for (let i = 1; i < ratingHistory.length; i++) {
    changes.push(Math.abs(ratingHistory[i] - ratingHistory[i - 1]));
  }

  const mean = changes.reduce((a, b) => a + b, 0) / changes.length;
  const variance =
    changes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / changes.length;

  return Math.round(Math.sqrt(variance));
};

/**
 * Calculate recent form based on last N matches
 */
export const calculateRecentForm = (
  recentResults: Array<{ won: boolean; ratingChange: number }>,
  maxMatches: number = 10
): number => {
  if (recentResults.length === 0) return 0;

  const recent = recentResults.slice(-maxMatches);
  let form = 0;

  recent.forEach(result => {
    if (result.won) {
      form += 10 + Math.max(0, result.ratingChange / 10);
    } else {
      form -= 10 + Math.max(0, -result.ratingChange / 10);
    }
  });

  return Math.max(-100, Math.min(100, form / recent.length));
};

/**
 * Calculate consistency score
 */
export const calculateConsistencyScore = (ratingHistory: number[]): number => {
  if (ratingHistory.length < 5) return 50;

  const volatility = calculateVolatility(ratingHistory);
  const consistency = Math.max(0, 100 - volatility / 2);

  return Math.round(consistency);
};

/**
 * Enhanced match prediction with confidence
 */
export const predictMatchResult = (
  player1Rating: number,
  player2Rating: number,
  player1Stats?: PlayerStats,
  player2Stats?: PlayerStats
): {
  player1WinProbability: number;
  player2WinProbability: number;
  expectedScore: string;
  confidence: number;
  upsetPotential: number;
  recommendedBet?: number;
} => {
  // Adjust ratings for form
  const adjustedRating1 = player1Stats
    ? adjustRatingForForm(player1Stats)
    : player1Rating;
  const adjustedRating2 = player2Stats
    ? adjustRatingForForm(player2Stats)
    : player2Rating;

  const p1Expected = getExpectedScore(adjustedRating1, adjustedRating2);
  const p2Expected = 1 - p1Expected;

  // Calculate confidence based on experience
  const totalMatches =
    (player1Stats?.matches_played || 0) + (player2Stats?.matches_played || 0);
  const confidence = Math.min(0.95, 0.7 + totalMatches / 1000);

  // Calculate upset potential
  const ratingDiff = Math.abs(adjustedRating1 - adjustedRating2);
  const upsetPotential = Math.max(0, (ratingDiff - 200) / 100);

  // Calculate recommended bet for challenges
  const recommendedBet = calculateRecommendedBet(
    adjustedRating1,
    adjustedRating2,
    p1Expected
  );

  return {
    player1WinProbability: Math.round(p1Expected * 100),
    player2WinProbability: Math.round(p2Expected * 100),
    expectedScore: `${Math.round(p1Expected * 10)}-${Math.round(p2Expected * 10)}`,
    confidence: Math.round(confidence * 100),
    upsetPotential: Math.round(upsetPotential * 100),
    recommendedBet,
  };
};

/**
 * Calculate recommended bet amount for challenges
 */
export const calculateRecommendedBet = (
  rating1: number,
  rating2: number,
  expectedWinRate: number
): number => {
  const ratingDiff = Math.abs(rating1 - rating2);
  const baseBet = Math.max(100, Math.min(1000, ratingDiff * 2));

  // Adjust based on expected win rate
  const winRateAdjustment =
    expectedWinRate > 0.6 ? 1.2 : expectedWinRate < 0.4 ? 0.8 : 1;

  return Math.round(baseBet * winRateAdjustment);
};

/**
 * Update player stats after match
 */
export const updatePlayerStats = (
  player: PlayerStats,
  match: EloMatch,
  isWinner: boolean,
  ratingChange: number
): PlayerStats => {
  const newStreak = isWinner ? player.current_streak + 1 : 0;
  const newRating = player.current_rating + ratingChange;

  return {
    ...player,
    current_rating: newRating,
    matches_played: player.matches_played + 1,
    current_streak: newStreak,
    last_match_date: match.match_date,
    highest_rating: Math.max(player.highest_rating || newRating, newRating),
    lowest_rating: Math.min(player.lowest_rating || newRating, newRating),
  };
};

/**
 * Calculate ELO efficiency (rating gained per match)
 */
export const calculateEloEfficiency = (
  currentRating: number,
  initialRating: number,
  matchesPlayed: number
): number => {
  if (matchesPlayed === 0) return 0;
  return Math.round((currentRating - initialRating) / matchesPlayed);
};

/**
 * Get rank progression path
 */
export const getRankProgression = (
  currentRating: number
): {
  currentRank: string;
  nextRank: string;
  pointsToNext: number;
  estimatedMatches: number;
} => {
  const currentRank = getRankFromRating(currentRating);
  const nextRankRating = getRatingFromRank(currentRank) + 200;
  const pointsToNext = nextRankRating - currentRating;

  // Estimate matches needed (assuming average 15 points per match)
  const estimatedMatches = Math.ceil(pointsToNext / 15);

  return {
    currentRank,
    nextRank: getRankFromRating(nextRankRating),
    pointsToNext,
    estimatedMatches,
  };
};
