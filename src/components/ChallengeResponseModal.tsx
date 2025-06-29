
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import UserAvatar from './UserAvatar';
import { supabase } from '@/integrations/supabase/client';

interface ChallengeResponseModalProps {
  challenge: {
    id: string;
    bet_points: number;
    message?: string;
    challenger: {
      user_id: string;
      full_name: string;
      avatar_url?: string;
      current_rank: string;
    };
  } | null;
  suggestedClubs?: Array<{
    id: string;
    name: string;
    address: string;
    phone?: string;
    available_tables: number;
    is_sabo_owned: boolean;
    monthly_payment: number;
  }>;
  isOpen: boolean;
  onClose: () => void;
  onRespond: (status: 'accepted' | 'declined', proposalData?: {
    clubId: string;
    datetime: string;
  }) => void;
}

const ChallengeResponseModal = ({ 
  challenge, 
  suggestedClubs: propSuggestedClubs, 
  isOpen, 
  onClose, 
  onRespond 
}: ChallengeResponseModalProps) => {
  const [selectedClub, setSelectedClub] = useState<string>('');
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [suggestedClubs, setSuggestedClubs] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (propSuggestedClubs?.length) {
        setSuggestedClubs(propSuggestedClubs);
        setSelectedClub(propSuggestedClubs[0].id);
      } else {
        loadSuggestedClubs();
      }
    }
  }, [isOpen, propSuggestedClubs]);

  const loadSuggestedClubs = async () => {
    try {
      const { data: clubs } = await supabase
        .from('clubs')
        .select('*')
        .order('is_sabo_owned', { ascending: false })
        .order('monthly_payment', { ascending: false })
        .order('priority_score', { ascending: false })
        .limit(5);
      
      setSuggestedClubs(clubs || []);
      if (clubs?.length > 0) {
        setSelectedClub(clubs[0].id);
      }
    } catch (error) {
      console.error('Error loading suggested clubs:', error);
    }
  };

  if (!challenge) return null;

  const getAvailableTimeSlots = () => {
    const slots = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      ['14:00', '16:00', '18:00', '20:00'].forEach(time => {
        const datetime = new Date(date);
        const [hours, minutes] = time.split(':');
        datetime.setHours(parseInt(hours), parseInt(minutes));
        
        slots.push({
          value: datetime.toISOString().slice(0, 16),
          label: date.toLocaleDateString('vi-VN', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          }),
          time: time
        });
      });
    }
    
    return slots.slice(0, 8);
  };

  const handleAccept = () => {
    if (selectedClub && selectedDateTime) {
      onRespond('accepted', {
        clubId: selectedClub,
        datetime: selectedDateTime
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Phản hồi thách đấu</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Challenge Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <UserAvatar 
                user={{
                  name: challenge.challenger.full_name,
                  avatar: challenge.challenger.avatar_url || '/placeholder.svg',
                  rank: challenge.challenger.current_rank
                }} 
                size="md"
              />
              <div>
                <h3 className="font-semibold">{challenge.challenger.full_name}</h3>
                <p className="text-sm text-gray-600">{challenge.challenger.current_rank}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Mức cược:</span>
                <span className="font-bold text-blue-600">{challenge.bet_points} điểm</span>
              </div>
              {challenge.message && (
                <div>
                  <span className="text-sm text-gray-600">Lời nhắn:</span>
                  <p className="text-sm mt-1 italic">"{challenge.message}"</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Club Selection */}
          <div>
            <h3 className="font-semibold mb-3">Chọn CLB diễn ra trận đấu</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {suggestedClubs.map(club => (
                <div
                  key={club.id}
                  onClick={() => setSelectedClub(club.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedClub === club.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{club.name}</h4>
                    <div className="flex items-center space-x-2">
                      {club.is_sabo_owned && (
                        <Badge className="bg-yellow-500 text-yellow-900 text-xs font-bold">
                          SABO
                        </Badge>
                      )}
                      {club.monthly_payment > 0 && (
                        <Badge className="bg-green-500 text-green-900 text-xs">
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{club.address}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {club.phone && <span>📞 {club.phone}</span>}
                    <span>🎱 {club.available_tables} bàn</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* DateTime Selection */}
          <div>
            <h3 className="font-semibold mb-3">Đề xuất thời gian</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {getAvailableTimeSlots().map(slot => (
                <Button
                  key={slot.value}
                  variant={selectedDateTime === slot.value ? "default" : "outline"}
                  onClick={() => setSelectedDateTime(slot.value)}
                  className="p-3 h-auto text-left"
                >
                  <div>
                    <div className="font-semibold text-sm">{slot.label}</div>
                    <div className="text-xs opacity-80">{slot.time}</div>
                  </div>
                </Button>
              ))}
            </div>
            <Input
              type="datetime-local"
              value={selectedDateTime}
              onChange={(e) => setSelectedDateTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={() => onRespond('declined')}
              variant="destructive"
              className="flex-1"
            >
              Từ chối ❌
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!selectedClub || !selectedDateTime}
              className="flex-1 bg-green-500 hover:bg-green-600"
            >
              Chấp nhận ✅
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeResponseModal;
