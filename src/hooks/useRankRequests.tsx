import { useState, useEffect, useCallback } from 'react';

export interface RankRequest {
  id: string;
  user_id: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
    current_rank: string;
  };
  requested_rank: string;
  current_elo_rating: number;
  evidence: RankRequestEvidence[];
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  reviewer_id?: string;
  reviewer?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  review_notes?: string;
  review_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface RankRequestEvidence {
  id: string;
  type: 'match_result' | 'tournament_result' | 'video' | 'screenshot' | 'witness' | 'other';
  title: string;
  description: string;
  file_url?: string;
  metadata?: {
    [key: string]: any;
  };
  created_at: Date;
}

export interface CreateRankRequestData {
  requested_rank: string;
  evidence: Omit<RankRequestEvidence, 'id' | 'created_at'>[];
  notes?: string;
}

export interface RankRequestFilters {
  status?: RankRequest['status'][];
  requested_rank?: string[];
  reviewer_id?: string;
  date_range?: {
    from: Date;
    to: Date;
  };
}

export const useRankRequests = (userId?: string) => {
  const [requests, setRequests] = useState<RankRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RankRequestFilters>({});

  // Fetch rank requests
  const fetchRankRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock rank requests data
      const mockRequests: RankRequest[] = [
        {
          id: '1',
          user_id: '1',
          user: {
            id: '1',
            username: 'pool_master',
            avatar_url: '/avatars/pool_master.jpg',
            current_rank: 'A'
          },
          requested_rank: 'A+',
          current_elo_rating: 1850,
          evidence: [
            {
              id: '1',
              type: 'match_result',
              title: 'Chiến thắng liên tiếp 5 trận',
              description: 'Thắng 5 trận liên tiếp với các đối thủ hạng A+',
              metadata: {
                matches: [
                  { opponent: 'player1', score: '7-5', date: '2024-01-15' },
                  { opponent: 'player2', score: '7-3', date: '2024-01-16' },
                  { opponent: 'player3', score: '7-6', date: '2024-01-17' },
                  { opponent: 'player4', score: '7-4', date: '2024-01-18' },
                  { opponent: 'player5', score: '7-2', date: '2024-01-19' }
                ]
              },
              created_at: new Date('2024-01-20')
            },
            {
              id: '2',
              type: 'tournament_result',
              title: 'Top 3 giải đấu cấp thành phố',
              description: 'Đạt vị trí thứ 3 trong giải đấu cấp thành phố',
              metadata: {
                tournament_name: 'Giải đấu mùa xuân 2024',
                position: 3,
                total_participants: 64,
                date: '2024-01-10'
              },
              created_at: new Date('2024-01-20')
            }
          ],
          status: 'pending',
          created_at: new Date('2024-01-20'),
          updated_at: new Date('2024-01-20')
        },
        {
          id: '2',
          user_id: '2',
          user: {
            id: '2',
            username: 'champion',
            avatar_url: '/avatars/champion.jpg',
            current_rank: 'B+'
          },
          requested_rank: 'A',
          current_elo_rating: 1650,
          evidence: [
            {
              id: '3',
              type: 'video',
              title: 'Video trận đấu với đối thủ hạng A',
              description: 'Video trận đấu thắng đối thủ hạng A với tỷ số 7-4',
              file_url: '/videos/match_video.mp4',
              metadata: {
                opponent: 'player_a',
                score: '7-4',
                date: '2024-01-18',
                duration: '15:30'
              },
              created_at: new Date('2024-01-19')
            }
          ],
          status: 'under_review',
          reviewer_id: 'admin1',
          reviewer: {
            id: 'admin1',
            username: 'admin_reviewer',
            avatar_url: '/avatars/admin.jpg'
          },
          review_notes: 'Đang xem xét video trận đấu',
          created_at: new Date('2024-01-19'),
          updated_at: new Date('2024-01-21')
        },
        {
          id: '3',
          user_id: '3',
          user: {
            id: '3',
            username: 'veteran',
            avatar_url: '/avatars/veteran.jpg',
            current_rank: 'A'
          },
          requested_rank: 'A+',
          current_elo_rating: 1800,
          evidence: [
            {
              id: '4',
              type: 'screenshot',
              title: 'Screenshot ELO rating',
              description: 'Screenshot hiển thị ELO rating đạt 1800+',
              file_url: '/screenshots/elo_rating.png',
              metadata: {
                elo_rating: 1805,
                date: '2024-01-15'
              },
              created_at: new Date('2024-01-15')
            }
          ],
          status: 'approved',
          reviewer_id: 'admin1',
          reviewer: {
            id: 'admin1',
            username: 'admin_reviewer',
            avatar_url: '/avatars/admin.jpg'
          },
          review_notes: 'Đủ điều kiện thăng hạng dựa trên ELO rating',
          review_date: new Date('2024-01-16'),
          created_at: new Date('2024-01-15'),
          updated_at: new Date('2024-01-16')
        },
        {
          id: '4',
          user_id: '4',
          user: {
            id: '4',
            username: 'newbie',
            avatar_url: '/avatars/newbie.jpg',
            current_rank: 'C'
          },
          requested_rank: 'B',
          current_elo_rating: 1400,
          evidence: [
            {
              id: '5',
              type: 'witness',
              title: 'Xác nhận từ người chơi có kinh nghiệm',
              description: 'Xác nhận từ 3 người chơi hạng B+ về khả năng chơi',
              metadata: {
                witnesses: [
                  { name: 'witness1', rank: 'B+', date: '2024-01-14' },
                  { name: 'witness2', rank: 'B+', date: '2024-01-14' },
                  { name: 'witness3', rank: 'A', date: '2024-01-14' }
                ]
              },
              created_at: new Date('2024-01-14')
            }
          ],
          status: 'rejected',
          reviewer_id: 'admin2',
          reviewer: {
            id: 'admin2',
            username: 'admin_reviewer2',
            avatar_url: '/avatars/admin2.jpg'
          },
          review_notes: 'Chưa đủ bằng chứng thuyết phục. Cần thêm trận đấu thực tế.',
          review_date: new Date('2024-01-15'),
          created_at: new Date('2024-01-14'),
          updated_at: new Date('2024-01-15')
        }
      ];
      
      setRequests(mockRequests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải yêu cầu thăng hạng');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create rank request
  const createRankRequest = useCallback(async (data: CreateRankRequestData) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRequest: RankRequest = {
        id: Date.now().toString(),
        user_id: userId,
        user: {
          id: userId,
          username: 'current_user',
          avatar_url: '/avatars/current_user.jpg',
          current_rank: 'B'
        },
        requested_rank: data.requested_rank,
        current_elo_rating: 1600,
        evidence: data.evidence.map((evidence, index) => ({
          ...evidence,
          id: (Date.now() + index).toString(),
          created_at: new Date()
        })),
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date()
      };
      
      setRequests(prev => [newRequest, ...prev]);
      return newRequest;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tạo yêu cầu thăng hạng');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Review rank request
  const reviewRankRequest = useCallback(async (
    requestId: string, 
    status: 'approved' | 'rejected', 
    notes?: string
  ) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? {
                ...request,
                status,
                reviewer_id: userId,
                reviewer: {
                  id: userId,
                  username: 'admin_reviewer',
                  avatar_url: '/avatars/admin.jpg'
                },
                review_notes: notes,
                review_date: new Date(),
                updated_at: new Date()
              }
            : request
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể đánh giá yêu cầu');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Update rank request status
  const updateRequestStatus = useCallback(async (requestId: string, status: RankRequest['status']) => {
    try {
      setRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status, updated_at: new Date() }
            : request
        )
      );
    } catch (err) {
      console.error('Failed to update request status:', err);
    }
  }, []);

  // Delete rank request
  const deleteRankRequest = useCallback(async (requestId: string) => {
    try {
      setRequests(prev => prev.filter(request => request.id !== requestId));
    } catch (err) {
      console.error('Failed to delete rank request:', err);
    }
  }, []);

  // Apply filters
  const applyFilters = useCallback((newFilters: RankRequestFilters) => {
    setFilters(newFilters);
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Get filtered requests
  const getFilteredRequests = useCallback(() => {
    let filtered = [...requests];

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(request => 
        filters.status!.includes(request.status)
      );
    }

    // Filter by requested rank
    if (filters.requested_rank && filters.requested_rank.length > 0) {
      filtered = filtered.filter(request => 
        filters.requested_rank!.includes(request.requested_rank)
      );
    }

    // Filter by reviewer
    if (filters.reviewer_id) {
      filtered = filtered.filter(request => 
        request.reviewer_id === filters.reviewer_id
      );
    }

    // Filter by date range
    if (filters.date_range) {
      filtered = filtered.filter(request => 
        request.created_at >= filters.date_range!.from && 
        request.created_at <= filters.date_range!.to
      );
    }

    return filtered;
  }, [requests, filters]);

  // Get request by ID
  const getRequestById = useCallback((requestId: string) => {
    return requests.find(request => request.id === requestId);
  }, [requests]);

  // Get user's requests
  const getUserRequests = useCallback((targetUserId?: string) => {
    const id = targetUserId || userId;
    if (!id) return [];
    return requests.filter(request => request.user_id === id);
  }, [requests, userId]);

  // Get pending requests
  const getPendingRequests = useCallback(() => {
    return requests.filter(request => request.status === 'pending');
  }, [requests]);

  // Get requests by status
  const getRequestsByStatus = useCallback((status: RankRequest['status']) => {
    return requests.filter(request => request.status === status);
  }, [requests]);

  // Get requests by reviewer
  const getRequestsByReviewer = useCallback((reviewerId: string) => {
    return requests.filter(request => request.reviewer_id === reviewerId);
  }, [requests]);

  // Get request statistics
  const getRequestStats = useCallback(() => {
    const totalRequests = requests.length;
    const pendingRequests = requests.filter(r => r.status === 'pending').length;
    const approvedRequests = requests.filter(r => r.status === 'approved').length;
    const rejectedRequests = requests.filter(r => r.status === 'rejected').length;
    const underReviewRequests = requests.filter(r => r.status === 'under_review').length;
    
    return {
      total: totalRequests,
      pending: pendingRequests,
      approved: approvedRequests,
      rejected: rejectedRequests,
      under_review: underReviewRequests,
      approval_rate: totalRequests > 0 ? (approvedRequests / totalRequests) * 100 : 0
    };
  }, [requests]);

  // Check if user can request rank
  const canRequestRank = useCallback((currentRank: string, requestedRank: string) => {
    const rankOrder = ['C', 'C+', 'B', 'B+', 'A', 'A+', 'G', 'H+', 'H', 'I+', 'I', 'K+', 'K'];
    const currentIndex = rankOrder.indexOf(currentRank);
    const requestedIndex = rankOrder.indexOf(requestedRank);
    
    // Can only request one rank higher
    return requestedIndex === currentIndex + 1;
  }, []);

  // Get eligible ranks for request
  const getEligibleRanks = useCallback((currentRank: string) => {
    const rankOrder = ['C', 'C+', 'B', 'B+', 'A', 'A+', 'G', 'H+', 'H', 'I+', 'I', 'K+', 'K'];
    const currentIndex = rankOrder.indexOf(currentRank);
    
    if (currentIndex === -1 || currentIndex === rankOrder.length - 1) {
      return [];
    }
    
    return [rankOrder[currentIndex + 1]];
  }, []);

  useEffect(() => {
    fetchRankRequests();
  }, [fetchRankRequests]);

  return {
    requests,
    loading,
    error,
    filters,
    fetchRankRequests,
    createRankRequest,
    reviewRankRequest,
    updateRequestStatus,
    deleteRankRequest,
    applyFilters,
    clearFilters,
    getFilteredRequests,
    getRequestById,
    getUserRequests,
    getPendingRequests,
    getRequestsByStatus,
    getRequestsByReviewer,
    getRequestStats,
    canRequestRank,
    getEligibleRanks
  };
}; 