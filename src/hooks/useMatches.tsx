import { useState, useEffect, useCallback } from 'react';

export interface Match {
  id: string;
  player1_id: string;
  player1: {
    id: string;
    username: string;
    avatar_url?: string;
    rank: string;
    elo_rating: number;
  };
  player2_id: string;
  player2: {
    id: string;
    username: string;
    avatar_url?: string;
    rank: string;
    elo_rating: number;
  };
  match_type: '8-ball' | '9-ball' | '10-ball' | 'straight-pool';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  venue: string;
  scheduled_time: Date;
  started_time?: Date;
  completed_time?: Date;
  score: {
    player1_score: number;
    player2_score: number;
  };
  winner_id?: string;
  loser_id?: string;
  frames: Frame[];
  stake_amount: number;
  tournament_id?: string;
  challenge_id?: string;
  referee_id?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Frame {
  id: string;
  match_id: string;
  frame_number: number;
  winner_id: string;
  duration: number; // in seconds
  break_shot?: {
    player_id: string;
    balls_potted: number;
  };
  created_at: Date;
}

export interface CreateMatchData {
  player2_id: string;
  match_type: '8-ball' | '9-ball' | '10-ball' | 'straight-pool';
  venue: string;
  scheduled_time: Date;
  stake_amount: number;
  tournament_id?: string;
  challenge_id?: string;
  notes?: string;
}

export const useMatches = (userId?: string) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch matches
  const fetchMatches = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock matches data
      const mockMatches: Match[] = [
        {
          id: '1',
          player1_id: '1',
          player1: {
            id: '1',
            username: 'pool_master',
            avatar_url: '/avatars/pool_master.jpg',
            rank: 'A+',
            elo_rating: 1850
          },
          player2_id: '2',
          player2: {
            id: '2',
            username: 'champion',
            avatar_url: '/avatars/champion.jpg',
            rank: 'G',
            elo_rating: 2100
          },
          match_type: '8-ball',
          status: 'completed',
          venue: 'Club Bida ABC',
          scheduled_time: new Date(Date.now() - 1000 * 60 * 60 * 2),
          started_time: new Date(Date.now() - 1000 * 60 * 60 * 2),
          completed_time: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
          score: {
            player1_score: 7,
            player2_score: 5
          },
          winner_id: '1',
          loser_id: '2',
          frames: [
            {
              id: '1',
              match_id: '1',
              frame_number: 1,
              winner_id: '1',
              duration: 180,
              break_shot: {
                player_id: '1',
                balls_potted: 2
              },
              created_at: new Date()
            },
            {
              id: '2',
              match_id: '1',
              frame_number: 2,
              winner_id: '2',
              duration: 210,
              break_shot: {
                player_id: '2',
                balls_potted: 1
              },
              created_at: new Date()
            }
          ],
          stake_amount: 100000,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 3),
          updated_at: new Date()
        },
        {
          id: '2',
          player1_id: '1',
          player1: {
            id: '1',
            username: 'pool_master',
            avatar_url: '/avatars/pool_master.jpg',
            rank: 'A+',
            elo_rating: 1850
          },
          player2_id: '3',
          player2: {
            id: '3',
            username: 'veteran',
            avatar_url: '/avatars/veteran.jpg',
            rank: 'A+',
            elo_rating: 1900
          },
          match_type: '9-ball',
          status: 'scheduled',
          venue: 'Club Bida XYZ',
          scheduled_time: new Date(Date.now() + 1000 * 60 * 60 * 24),
          score: {
            player1_score: 0,
            player2_score: 0
          },
          stake_amount: 150000,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: '3',
          player1_id: '4',
          player1: {
            id: '4',
            username: 'newbie',
            avatar_url: '/avatars/newbie.jpg',
            rank: 'C',
            elo_rating: 1200
          },
          player2_id: '1',
          player2: {
            id: '1',
            username: 'pool_master',
            avatar_url: '/avatars/pool_master.jpg',
            rank: 'A+',
            elo_rating: 1850
          },
          match_type: '8-ball',
          status: 'in_progress',
          venue: 'Club Bida DEF',
          scheduled_time: new Date(Date.now() - 1000 * 60 * 30),
          started_time: new Date(Date.now() - 1000 * 60 * 20),
          score: {
            player1_score: 2,
            player2_score: 4
          },
          frames: [
            {
              id: '3',
              match_id: '3',
              frame_number: 1,
              winner_id: '1',
              duration: 150,
              created_at: new Date()
            },
            {
              id: '4',
              match_id: '3',
              frame_number: 2,
              winner_id: '1',
              duration: 180,
              created_at: new Date()
            }
          ],
          stake_amount: 50000,
          created_at: new Date(Date.now() - 1000 * 60 * 60),
          updated_at: new Date()
        }
      ];
      
      setMatches(mockMatches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải trận đấu');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Create new match
  const createMatch = useCallback(async (data: CreateMatchData) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock player data
      const player1 = {
        id: userId,
        username: 'current_user',
        avatar_url: '/avatars/current_user.jpg',
        rank: 'A',
        elo_rating: 1800
      };
      
      const player2 = {
        id: data.player2_id,
        username: 'opponent_user',
        avatar_url: '/avatars/opponent.jpg',
        rank: 'B',
        elo_rating: 1600
      };
      
      const newMatch: Match = {
        id: Date.now().toString(),
        player1_id: userId,
        player1,
        player2_id: data.player2_id,
        player2,
        match_type: data.match_type,
        status: 'scheduled',
        venue: data.venue,
        scheduled_time: data.scheduled_time,
        score: {
          player1_score: 0,
          player2_score: 0
        },
        frames: [],
        stake_amount: data.stake_amount,
        tournament_id: data.tournament_id,
        challenge_id: data.challenge_id,
        notes: data.notes,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      setMatches(prev => [newMatch, ...prev]);
      return newMatch;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tạo trận đấu');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Start match
  const startMatch = useCallback(async (matchId: string) => {
    try {
      setMatches(prev => 
        prev.map(match => 
          match.id === matchId 
            ? {
                ...match,
                status: 'in_progress' as const,
                started_time: new Date(),
                updated_at: new Date()
              }
            : match
        )
      );
    } catch (err) {
      console.error('Failed to start match:', err);
    }
  }, []);

  // Update match score
  const updateMatchScore = useCallback(async (matchId: string, player1Score: number, player2Score: number) => {
    try {
      setMatches(prev => 
        prev.map(match => 
          match.id === matchId 
            ? {
                ...match,
                score: {
                  player1_score: player1Score,
                  player2_score: player2Score
                },
                updated_at: new Date()
              }
            : match
        )
      );
    } catch (err) {
      console.error('Failed to update match score:', err);
    }
  }, []);

  // Complete match
  const completeMatch = useCallback(async (matchId: string, winnerId: string, finalScore: { player1_score: number; player2_score: number }) => {
    try {
      setMatches(prev => 
        prev.map(match => 
          match.id === matchId 
            ? {
                ...match,
                status: 'completed' as const,
                completed_time: new Date(),
                score: finalScore,
                winner_id: winnerId,
                loser_id: winnerId === match.player1_id ? match.player2_id : match.player1_id,
                updated_at: new Date()
              }
            : match
        )
      );
    } catch (err) {
      console.error('Failed to complete match:', err);
    }
  }, []);

  // Cancel match
  const cancelMatch = useCallback(async (matchId: string) => {
    try {
      setMatches(prev => 
        prev.map(match => 
          match.id === matchId 
            ? {
                ...match,
                status: 'cancelled' as const,
                updated_at: new Date()
              }
            : match
        )
      );
    } catch (err) {
      console.error('Failed to cancel match:', err);
    }
  }, []);

  // Get match by ID
  const getMatchById = useCallback((matchId: string) => {
    return matches.find(match => match.id === matchId);
  }, [matches]);

  // Get matches by status
  const getMatchesByStatus = useCallback((status: Match['status']) => {
    return matches.filter(match => match.status === status);
  }, [matches]);

  // Get matches for current user
  const getMyMatches = useCallback(() => {
    if (!userId) return [];
    return matches.filter(match => 
      match.player1_id === userId || match.player2_id === userId
    );
  }, [matches, userId]);

  // Get upcoming matches
  const getUpcomingMatches = useCallback(() => {
    const now = new Date();
    return matches.filter(match => 
      match.status === 'scheduled' && match.scheduled_time > now
    );
  }, [matches]);

  // Get recent matches
  const getRecentMatches = useCallback((limit: number = 10) => {
    return matches
      .filter(match => match.status === 'completed')
      .sort((a, b) => b.completed_time!.getTime() - a.completed_time!.getTime())
      .slice(0, limit);
  }, [matches]);

  // Get match statistics
  const getMatchStats = useCallback(() => {
    if (!userId) return null;
    
    const myMatches = getMyMatches();
    const completedMatches = myMatches.filter(match => match.status === 'completed');
    
    const wins = completedMatches.filter(match => match.winner_id === userId).length;
    const losses = completedMatches.filter(match => match.loser_id === userId).length;
    const winRate = completedMatches.length > 0 ? wins / completedMatches.length : 0;
    
    return {
      total_matches: completedMatches.length,
      wins,
      losses,
      win_rate: winRate,
      total_earnings: completedMatches
        .filter(match => match.winner_id === userId)
        .reduce((sum, match) => sum + match.stake_amount, 0)
    };
  }, [matches, userId, getMyMatches]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return {
    matches,
    loading,
    error,
    fetchMatches,
    createMatch,
    startMatch,
    updateMatchScore,
    completeMatch,
    cancelMatch,
    getMatchById,
    getMatchesByStatus,
    getMyMatches,
    getUpcomingMatches,
    getRecentMatches,
    getMatchStats
  };
};
