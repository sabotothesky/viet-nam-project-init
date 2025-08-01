import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, Award } from 'lucide-react';

interface RankHistoryItem {
  id: string;
  old_rank: string;
  new_rank: string;
  old_points: number;
  new_points: number;
  reason: string;
  created_at: string;
}

const RankHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<RankHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRankHistory();
    }
  }, [user]);

  const fetchRankHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('ranking_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching rank history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: string) => {
    if (rank?.startsWith('G')) return 'bg-yellow-100 text-yellow-800';
    if (rank?.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (rank?.startsWith('A')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const isRankUp = (oldRank: string, newRank: string) => {
    const rankOrder = [
      'K1',
      'K2',
      'K3',
      'A1',
      'A2',
      'A3',
      'B1',
      'B2',
      'B3',
      'G1',
      'G2',
      'G+',
    ];
    return rankOrder.indexOf(newRank) > rankOrder.indexOf(oldRank);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TrendingUp className='h-5 w-5' />
            Lịch sử hạng mùa trước
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='animate-pulse space-y-3'>
            {[1, 2, 3].map(i => (
              <div key={i} className='h-16 bg-gray-200 rounded'></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <TrendingUp className='h-5 w-5' />
          Lịch sử hạng mùa trước
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <div className='space-y-4'>
            {history.map(item => (
              <div
                key={item.id}
                className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'
              >
                <div className='flex items-center space-x-4'>
                  <div className='flex items-center space-x-2'>
                    <Badge className={getRankColor(item.old_rank)}>
                      {item.old_rank}
                    </Badge>
                    <span className='text-gray-400'>→</span>
                    <Badge className={getRankColor(item.new_rank)}>
                      {item.new_rank}
                    </Badge>
                  </div>

                  <div className='flex items-center text-sm text-gray-600'>
                    {isRankUp(item.old_rank, item.new_rank) ? (
                      <TrendingUp className='w-4 h-4 text-green-500 mr-1' />
                    ) : (
                      <TrendingUp className='w-4 h-4 text-red-500 mr-1 rotate-180' />
                    )}
                    <span>
                      {item.old_points} → {item.new_points} điểm
                    </span>
                  </div>
                </div>

                <div className='text-right'>
                  <div className='flex items-center text-xs text-gray-500 mb-1'>
                    <Calendar className='w-3 h-3 mr-1' />
                    {new Date(item.created_at).toLocaleDateString('vi-VN')}
                  </div>
                  {item.reason && (
                    <p className='text-xs text-gray-600 max-w-xs truncate'>
                      {item.reason}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-8'>
            <Award className='h-12 w-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-500 font-medium'>
              Chưa có lịch sử thay đổi hạng
            </p>
            <p className='text-sm text-gray-400 mt-1'>
              Lịch sử thăng/hạ hạng sẽ được hiển thị tại đây
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RankHistory;
