import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  Trophy, 
  Zap, 
  Star,
  Target,
  Users,
  Award,
  BarChart3,
  Activity,
  Crown,
  TrendingUpIcon,
  TrendingDownIcon,
  Shield,
  Flame
} from 'lucide-react';
import { 
  calculateEloRating, 
  getDynamicKFactor, 
  getExpectedScore, 
  predictMatchResult,
  getRankFromRating,
  getRatingFromRank,
  calculateRecentForm,
  calculateConsistencyScore,
  calculateEloEfficiency,
  getRankProgression,
  type EloMatch,
  type PlayerStats,
  type EloResult,
  type EloConfig,
  DEFAULT_ELO_CONFIG
} from '../utils/eloCalculator';

interface EloCalculatorProps {
  className?: string;
}

export const EloCalculator: React.FC<EloCalculatorProps> = ({ className }) => {
  const [player1, setPlayer1] = useState<PlayerStats>({
    user_id: '1',
    current_rating: 1500,
    matches_played: 50,
    current_streak: 3,
    highest_rating: 1600,
    lowest_rating: 1400,
    win_rate: 65,
    average_opponent_rating: 1480,
    rating_volatility: 45,
    recent_form: 25,
    consistency_score: 75
  });

  const [player2, setPlayer2] = useState<PlayerStats>({
    user_id: '2',
    current_rating: 1600,
    matches_played: 30,
    current_streak: 0,
    highest_rating: 1650,
    lowest_rating: 1550,
    win_rate: 55,
    average_opponent_rating: 1580,
    rating_volatility: 60,
    recent_form: -10,
    consistency_score: 60
  });

  const [match, setMatch] = useState<EloMatch>({
    player1_id: '1',
    player2_id: '2',
    player1_score: 0,
    player2_score: 0,
    winner_id: '',
    is_tournament: false,
    is_streak_bonus: true,
    is_quality_match: false,
    match_date: new Date(),
    match_type: 'regular',
    tournament_tier: 'local',
    challenge_bet: 0,
    quality_score: 5,
    upset_factor: 0
  });

  const [config, setConfig] = useState<EloConfig>(DEFAULT_ELO_CONFIG);
  const [result, setResult] = useState<EloResult | null>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const calculateResult = () => {
    if (!match.winner_id) return;

    const eloResult = calculateEloRating(player1, player2, match, config);
    setResult(eloResult);
  };

  const predictMatch = () => {
    const predictionResult = predictMatchResult(
      player1.current_rating, 
      player2.current_rating,
      player1,
      player2
    );
    setPrediction(predictionResult);
  };

  const getRankColor = (rating: number) => {
    if (rating >= 2800) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (rating >= 2600) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (rating >= 2400) return 'bg-red-100 text-red-800 border-red-200';
    if (rating >= 2200) return 'bg-red-100 text-red-800 border-red-200';
    if (rating >= 2000) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (rating >= 1800) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (rating >= 1600) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (rating >= 1400) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (rating >= 1200) return 'bg-green-100 text-green-800 border-green-200';
    if (rating >= 1000) return 'bg-green-100 text-green-800 border-green-200';
    if (rating >= 800) return 'bg-gray-100 text-gray-800 border-gray-200';
    if (rating >= 600) return 'bg-gray-100 text-gray-800 border-gray-200';
    if (rating >= 400) return 'bg-gray-100 text-gray-800 border-gray-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRankName = (rating: number) => {
    const rank = getRankFromRating(rating);
    const names: { [key: string]: string } = {
      'S+': 'Legendary',
      'S': 'Master',
      'G+': 'Elite',
      'G': 'Expert',
      'A+': 'Advanced',
      'A': 'Intermediate+',
      'B+': 'Intermediate',
      'B': 'Beginner+',
      'C+': 'Beginner',
      'C': 'Novice+',
      'D+': 'Novice',
      'D': 'Rookie+',
      'E+': 'Rookie',
      'E': 'Newcomer'
    };
    return `${rank} (${names[rank]})`;
  };

  const getFormColor = (form: number) => {
    if (form > 50) return 'text-green-600';
    if (form > 20) return 'text-blue-600';
    if (form > -20) return 'text-yellow-600';
    if (form > -50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getConsistencyColor = (score: number) => {
    if (score > 80) return 'text-green-600';
    if (score > 60) return 'text-blue-600';
    if (score > 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getVolatilityColor = (volatility: number) => {
    if (volatility < 30) return 'text-green-600';
    if (volatility < 60) return 'text-blue-600';
    if (volatility < 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Enhanced ELO Calculator v2.0
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Advanced Settings Toggle */}
          <div className="flex justify-between items-center">
            <Button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              variant="outline"
              size="sm"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {showAdvanced ? 'Hide Advanced Settings' : 'Advanced Settings'}
            </Button>
          </div>

          {/* Advanced Configuration */}
          {showAdvanced && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 text-lg">ELO Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Base K-Factor: {config.baseKFactor}</Label>
                    <Slider
                      value={[config.baseKFactor]}
                      onValueChange={([value]) => setConfig({...config, baseKFactor: value})}
                      max={50}
                      min={20}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Tournament Multiplier: {config.tournamentMultiplier}</Label>
                    <Slider
                      value={[config.tournamentMultiplier * 10]}
                      onValueChange={([value]) => setConfig({...config, tournamentMultiplier: value / 10})}
                      max={30}
                      min={10}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Upset Multiplier: {config.upsetMultiplier}</Label>
                    <Slider
                      value={[config.upsetMultiplier * 10]}
                      onValueChange={([value]) => setConfig({...config, upsetMultiplier: value / 10})}
                      max={20}
                      min={10}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Quality Match Bonus: {config.qualityMatchBonus * 100}%</Label>
                    <Slider
                      value={[config.qualityMatchBonus * 100]}
                      onValueChange={([value]) => setConfig({...config, qualityMatchBonus: value / 100})}
                      max={30}
                      min={5}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Player Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player 1 */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Player 1
              </h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="p1-rating">Current Rating</Label>
                  <Input
                    id="p1-rating"
                    type="number"
                    value={player1.current_rating}
                    onChange={(e) => setPlayer1({
                      ...player1,
                      current_rating: parseInt(e.target.value) || 1500
                    })}
                  />
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getRankColor(player1.current_rating)}>
                      {getRankName(player1.current_rating)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label htmlFor="p1-matches">Matches Played</Label>
                  <Input
                    id="p1-matches"
                    type="number"
                    value={player1.matches_played}
                    onChange={(e) => setPlayer1({
                      ...player1,
                      matches_played: parseInt(e.target.value) || 0
                    })}
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    K-factor: {getDynamicKFactor(player1, match, config)}
                  </div>
                </div>
                <div>
                  <Label htmlFor="p1-streak">Current Streak</Label>
                  <Input
                    id="p1-streak"
                    type="number"
                    value={player1.current_streak}
                    onChange={(e) => setPlayer1({
                      ...player1,
                      current_streak: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="p1-form">Recent Form (-100 to 100)</Label>
                  <Input
                    id="p1-form"
                    type="number"
                    value={player1.recent_form}
                    onChange={(e) => setPlayer1({
                      ...player1,
                      recent_form: parseInt(e.target.value) || 0
                    })}
                  />
                  <div className={`text-sm mt-1 ${getFormColor(player1.recent_form || 0)}`}>
                    {player1.recent_form > 0 ? '🔥 Hot' : player1.recent_form < 0 ? '❄️ Cold' : '➡️ Stable'}
                  </div>
                </div>
                <div>
                  <Label htmlFor="p1-consistency">Consistency Score (0-100)</Label>
                  <Input
                    id="p1-consistency"
                    type="number"
                    value={player1.consistency_score}
                    onChange={(e) => setPlayer1({
                      ...player1,
                      consistency_score: parseInt(e.target.value) || 50
                    })}
                  />
                  <div className={`text-sm mt-1 ${getConsistencyColor(player1.consistency_score || 50)}`}>
                    {player1.consistency_score > 80 ? '🛡️ Very Stable' : 
                     player1.consistency_score > 60 ? '📊 Stable' : 
                     player1.consistency_score > 40 ? '📈 Variable' : '📉 Volatile'}
                  </div>
                </div>
                <div>
                  <Label htmlFor="p1-volatility">Rating Volatility</Label>
                  <Input
                    id="p1-volatility"
                    type="number"
                    value={player1.rating_volatility}
                    onChange={(e) => setPlayer1({
                      ...player1,
                      rating_volatility: parseInt(e.target.value) || 0
                    })}
                  />
                  <div className={`text-sm mt-1 ${getVolatilityColor(player1.rating_volatility || 0)}`}>
                    {player1.rating_volatility < 30 ? '📊 Low Volatility' : 
                     player1.rating_volatility < 60 ? '📈 Medium Volatility' : '📉 High Volatility'}
                  </div>
                </div>
              </div>
            </div>

            {/* Player 2 */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Player 2
              </h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="p2-rating">Current Rating</Label>
                  <Input
                    id="p2-rating"
                    type="number"
                    value={player2.current_rating}
                    onChange={(e) => setPlayer2({
                      ...player2,
                      current_rating: parseInt(e.target.value) || 1600
                    })}
                  />
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getRankColor(player2.current_rating)}>
                      {getRankName(player2.current_rating)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label htmlFor="p2-matches">Matches Played</Label>
                  <Input
                    id="p2-matches"
                    type="number"
                    value={player2.matches_played}
                    onChange={(e) => setPlayer2({
                      ...player2,
                      matches_played: parseInt(e.target.value) || 0
                    })}
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    K-factor: {getDynamicKFactor(player2, match, config)}
                  </div>
                </div>
                <div>
                  <Label htmlFor="p2-streak">Current Streak</Label>
                  <Input
                    id="p2-streak"
                    type="number"
                    value={player2.current_streak}
                    onChange={(e) => setPlayer2({
                      ...player2,
                      current_streak: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="p2-form">Recent Form (-100 to 100)</Label>
                  <Input
                    id="p2-form"
                    type="number"
                    value={player2.recent_form}
                    onChange={(e) => setPlayer2({
                      ...player2,
                      recent_form: parseInt(e.target.value) || 0
                    })}
                  />
                  <div className={`text-sm mt-1 ${getFormColor(player2.recent_form || 0)}`}>
                    {player2.recent_form > 0 ? '🔥 Hot' : player2.recent_form < 0 ? '❄️ Cold' : '➡️ Stable'}
                  </div>
                </div>
                <div>
                  <Label htmlFor="p2-consistency">Consistency Score (0-100)</Label>
                  <Input
                    id="p2-consistency"
                    type="number"
                    value={player2.consistency_score}
                    onChange={(e) => setPlayer2({
                      ...player2,
                      consistency_score: parseInt(e.target.value) || 50
                    })}
                  />
                  <div className={`text-sm mt-1 ${getConsistencyColor(player2.consistency_score || 50)}`}>
                    {player2.consistency_score > 80 ? '🛡️ Very Stable' : 
                     player2.consistency_score > 60 ? '📊 Stable' : 
                     player2.consistency_score > 40 ? '📈 Variable' : '📉 Volatile'}
                  </div>
                </div>
                <div>
                  <Label htmlFor="p2-volatility">Rating Volatility</Label>
                  <Input
                    id="p2-volatility"
                    type="number"
                    value={player2.rating_volatility}
                    onChange={(e) => setPlayer2({
                      ...player2,
                      rating_volatility: parseInt(e.target.value) || 0
                    })}
                  />
                  <div className={`text-sm mt-1 ${getVolatilityColor(player2.rating_volatility || 0)}`}>
                    {player2.rating_volatility < 30 ? '📊 Low Volatility' : 
                     player2.rating_volatility < 60 ? '📈 Medium Volatility' : '📉 High Volatility'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Match Settings */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Match Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Winner</Label>
                  <Select
                    value={match.winner_id}
                    onValueChange={(value) => setMatch({...match, winner_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select winner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Player 1</SelectItem>
                      <SelectItem value="2">Player 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Match Type</Label>
                  <Select
                    value={match.match_type}
                    onValueChange={(value: any) => setMatch({...match, match_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular Match</SelectItem>
                      <SelectItem value="tournament">Tournament</SelectItem>
                      <SelectItem value="challenge">Challenge</SelectItem>
                      <SelectItem value="quick">Quick Match</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {match.match_type === 'tournament' && (
                  <div>
                    <Label>Tournament Tier</Label>
                    <Select
                      value={match.tournament_tier}
                      onValueChange={(value: any) => setMatch({...match, tournament_tier: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Local</SelectItem>
                        <SelectItem value="regional">Regional</SelectItem>
                        <SelectItem value="national">National</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {match.match_type === 'challenge' && (
                  <div>
                    <Label>Challenge Bet Amount</Label>
                    <Input
                      type="number"
                      value={match.challenge_bet}
                      onChange={(e) => setMatch({...match, challenge_bet: parseInt(e.target.value) || 0})}
                      placeholder="Enter bet amount"
                    />
                  </div>
                )}
                <div>
                  <Label>Quality Score (1-10)</Label>
                  <Input
                    type="number"
                    value={match.quality_score}
                    onChange={(e) => setMatch({...match, quality_score: parseInt(e.target.value) || 5})}
                    min="1"
                    max="10"
                  />
                </div>
                <div>
                  <Label>Upset Factor (0-5)</Label>
                  <Input
                    type="number"
                    value={match.upset_factor}
                    onChange={(e) => setMatch({...match, upset_factor: parseInt(e.target.value) || 0})}
                    min="0"
                    max="5"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="tournament"
                    checked={match.is_tournament}
                    onChange={(e) => setMatch({...match, is_tournament: e.target.checked})}
                  />
                  <Label htmlFor="tournament">Tournament Match</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="streak-bonus"
                    checked={match.is_streak_bonus}
                    onChange={(e) => setMatch({...match, is_streak_bonus: e.target.checked})}
                  />
                  <Label htmlFor="streak-bonus">Streak Bonus</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="quality-match"
                    checked={match.is_quality_match}
                    onChange={(e) => setMatch({...match, is_quality_match: e.target.checked})}
                  />
                  <Label htmlFor="quality-match">Quality Match</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button onClick={predictMatch} variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Predict Match
            </Button>
            <Button onClick={calculateResult} disabled={!match.winner_id}>
              <Calculator className="h-4 w-4 mr-2" />
              Calculate ELO
            </Button>
          </div>

          {/* Prediction Results */}
          {prediction && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Match Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {prediction.player1WinProbability}%
                    </div>
                    <div className="text-sm text-gray-600">Player 1 Win</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {prediction.expectedScore}
                    </div>
                    <div className="text-sm text-gray-600">Expected Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {prediction.player2WinProbability}%
                    </div>
                    <div className="text-sm text-gray-600">Player 2 Win</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-blue-600">
                      {prediction.confidence}%
                    </div>
                    <div className="text-sm text-gray-600">Confidence</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-blue-600">
                      {prediction.upsetPotential}%
                    </div>
                    <div className="text-sm text-gray-600">Upset Potential</div>
                  </div>
                  {prediction.recommendedBet && (
                    <div>
                      <div className="text-lg font-semibold text-blue-600">
                        {prediction.recommendedBet}
                      </div>
                      <div className="text-sm text-gray-600">Recommended Bet</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ELO Results */}
          {result && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  ELO Calculation Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Player 1 Results */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-green-800">Player 1 Results</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>New Rating:</span>
                        <span className="font-semibold">{result.player1_new_rating}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rating Change:</span>
                        <span className={`font-semibold ${result.player1_rating_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {result.player1_rating_change > 0 ? '+' : ''}{result.player1_rating_change}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>K-Factor:</span>
                        <span className="font-semibold">{result.k_factor_player1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bonus:</span>
                        <span className="font-semibold text-green-600">+{result.bonus_player1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Volatility:</span>
                        <span className="font-semibold">{result.volatility_player1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Score:</span>
                        <span className="font-semibold">{(result.player1_expected_score * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Player 2 Results */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-green-800">Player 2 Results</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>New Rating:</span>
                        <span className="font-semibold">{result.player2_new_rating}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rating Change:</span>
                        <span className={`font-semibold ${result.player2_rating_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {result.player2_rating_change > 0 ? '+' : ''}{result.player2_rating_change}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>K-Factor:</span>
                        <span className="font-semibold">{result.k_factor_player2}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bonus:</span>
                        <span className="font-semibold text-green-600">+{result.bonus_player2}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Volatility:</span>
                        <span className="font-semibold">{result.volatility_player2}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Score:</span>
                        <span className="font-semibold">{(result.player2_expected_score * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Quality and Confidence */}
                <div className="mt-6 pt-4 border-t border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-green-800">
                        <Star className="h-4 w-4" />
                        <span className="font-medium">Match Quality Score</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{result.match_quality_score}/10</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-green-800">
                        <Shield className="h-4 w-4" />
                        <span className="font-medium">Confidence Interval</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{(result.confidence_interval * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 