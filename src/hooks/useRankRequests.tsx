
import { useState, useEffect } from 'react';
import { RankRequest, CreateRankRequestData, RankRequestFilters } from '@/types/rankRequests';

export const useRankRequests = () => {
  const [requests, setRequests] = useState<RankRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<RankRequestFilters>({
    status: undefined,
    club_id: undefined,
    dateRange: undefined
  });

  const fetchRankRequests = async (filterOptions?: RankRequestFilters) => {
    setLoading(true);
    try {
      // Mock data
      const mockRequests: RankRequest[] = [
        {
          id: '1',
          user_id: 'user1',
          requested_rank: 1500,
          club_id: 'club1',
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setRequests(mockRequests);
    } catch (err) {
      setError('Failed to fetch rank requests');
    } finally {
      setLoading(false);
    }
  };

  const createRankRequest = async (data: CreateRankRequestData) => {
    try {
      const newRequest: RankRequest = {
        id: Date.now().toString(),
        user_id: data.user_id || 'current_user',
        requested_rank: data.requested_rank,
        club_id: data.club_id,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setRequests(prev => [newRequest, ...prev]);
    } catch (err) {
      throw new Error('Failed to create rank request');
    }
  };

  const updateRankRequest = async (id: string, updateData: any) => {
    try {
      setRequests(prev => 
        prev.map(req => 
          req.id === id 
            ? { ...req, ...updateData, updated_at: new Date().toISOString() }
            : req
        )
      );
    } catch (err) {
      throw new Error('Failed to update rank request');
    }
  };

  const deleteRankRequest = async (id: string) => {
    try {
      setRequests(prev => prev.filter(req => req.id !== id));
    } catch (err) {
      throw new Error('Failed to delete rank request');
    }
  };

  const approveRankRequest = async (id: string) => {
    return updateRankRequest(id, { status: 'approved' });
  };

  const rejectRankRequest = async (id: string) => {
    return updateRankRequest(id, { status: 'rejected' });
  };

  const getUserRankRequests = (userId: string) => {
    return requests.filter(req => req.user_id === userId);
  };

  const getPendingRequests = () => {
    return requests.filter(req => req.status === 'pending');
  };

  const getApprovedRequests = () => {
    return requests.filter(req => req.status === 'approved');
  };

  const getRejectedRequests = () => {
    return requests.filter(req => req.status === 'rejected');
  };

  const getEligibleRanks = (currentRank: string): string[] => {
    const ranks = ['K1', 'K2', 'K3', 'D1', 'D2', 'D3'];
    const currentIndex = ranks.indexOf(currentRank);
    return ranks.slice(currentIndex + 1);
  };

  const rankRequests = requests;
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Đang chờ';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      case 'on_site_test': return 'Kiểm tra tại chỗ';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'on_site_test': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const stats = {
    total: requests.length,
    pending: getPendingRequests().length,
    approved: getApprovedRequests().length,
    rejected: getRejectedRequests().length,
    on_site_test: requests.filter(req => req.status === 'on_site_test').length
  };

  useEffect(() => {
    fetchRankRequests();
  }, []);

  return {
    requests,
    loading,
    error,
    filters,
    fetchRankRequests,
    createRankRequest,
    updateRankRequest,
    deleteRankRequest,
    approveRankRequest,
    rejectRankRequest,
    getUserRankRequests,
    getPendingRequests,
    getApprovedRequests,
    getRejectedRequests,
    getEligibleRanks,
    rankRequests,
    getStatusText,
    getStatusColor,
    stats,
  };
};
