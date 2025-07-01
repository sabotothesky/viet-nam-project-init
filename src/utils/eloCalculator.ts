
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
  if (rating >= 2400) return 'Grandmaster';
  if (rating >= 2200) return 'Master';
  if (rating >= 2000) return 'Expert';
  if (rating >= 1800) return 'Class A';
  if (rating >= 1600) return 'Class B';
  if (rating >= 1400) return 'Class C';
  if (rating >= 1200) return 'Class D';
  return 'Beginner';
};

export const getRatingFromRank = (rank: string): number => {
  switch (rank) {
    case 'Grandmaster': return 2400;
    case 'Master': return 2200;
    case 'Expert': return 2000;
    case 'Class A': return 1800;
    case 'Class B': return 1600;
    case 'Class C': return 1400;
    case 'Class D': return 1200;
    default: return 1000;
  }
};

export const getRankColor = (rank: string): string => {
  switch (rank) {
    case 'Grandmaster': return 'text-purple-600';
    case 'Master': return 'text-red-600';
    case 'Expert': return 'text-orange-600';
    case 'Class A': return 'text-yellow-600';
    case 'Class B': return 'text-green-600';
    case 'Class C': return 'text-blue-600';
    case 'Class D': return 'text-gray-600';
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
  
  // Performance rating calculation
  if (scorePercentage === 1) return averageOpponentRating + 400;
  if (scorePercentage === 0) return averageOpponentRating - 400;
  
  const logOdds = Math.log(scorePercentage / (1 - scorePercentage));
  return Math.round(averageOpponentRating + 400 * logOdds / Math.LN10);
};
