import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  Phone,
  Mail,
  Loader2,
} from 'lucide-react';

interface TournamentDetailsModalProps {
  tournament: any;
  isOpen: boolean;
  onClose: () => void;
  onJoin: (tournament: any) => void;
  isJoining?: boolean;
}

export const TournamentDetailsModal: React.FC<TournamentDetailsModalProps> = ({
  tournament,
  isOpen,
  onClose,
  onJoin,
  isJoining = false,
}) => {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTournamentTypeLabel = (type: string) => {
    const labels = {
      single_elimination: 'Loại trực tiếp',
      double_elimination: 'Loại kép',
      round_robin: 'Vòng tròn',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getGameFormatLabel = (format: string) => {
    const labels = {
      '8_ball': 'Bi-da 8 bi',
      '9_ball': 'Bi-da 9 bi',
      '10_ball': 'Bi-da 10 bi',
      straight_pool: 'Straight Pool',
    };
    return labels[format as keyof typeof labels] || format;
  };

  const isRegistrationOpen = tournament.status === 'registration_open';
  const isFull = tournament.current_participants >= tournament.max_participants;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-lg max-h-[90vh] overflow-hidden'>
        <DialogHeader>
          <DialogTitle>{tournament.title || tournament.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue='info' className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='info'>Thông tin</TabsTrigger>
            <TabsTrigger value='rules'>Luật chơi</TabsTrigger>
            <TabsTrigger value='participants'>Người tham gia</TabsTrigger>
          </TabsList>

          <div className='max-h-96 overflow-y-auto'>
            <TabsContent value='info' className='space-y-4 mt-4'>
              {/* Basic Info */}
              <div>
                <h3 className='font-semibold mb-2'>📋 Thông tin cơ bản</h3>
                <div className='bg-gray-50 rounded-lg p-3 space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Loại giải:</span>
                    <span className='font-semibold'>
                      {getTournamentTypeLabel(
                        tournament.tournament_type || 'single_elimination'
                      )}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Thể thức:</span>
                    <span className='font-semibold'>
                      {getGameFormatLabel(tournament.game_format || '8_ball')}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Số người tối đa:</span>
                    <span className='font-semibold'>
                      {tournament.max_participants} người
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Đã đăng ký:</span>
                    <span className='font-semibold text-blue-600'>
                      {tournament.current_participants || 0} người
                    </span>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <h3 className='font-semibold mb-2'>📅 Lịch trình</h3>
                <div className='bg-gray-50 rounded-lg p-3 space-y-2 text-sm'>
                  {tournament.registration_start && (
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Mở đăng ký:</span>
                      <span className='font-semibold'>
                        {formatDateTime(tournament.registration_start)}
                      </span>
                    </div>
                  )}
                  {tournament.registration_end && (
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Đóng đăng ký:</span>
                      <span className='font-semibold'>
                        {formatDateTime(tournament.registration_end)}
                      </span>
                    </div>
                  )}
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Bắt đầu thi đấu:</span>
                    <span className='font-semibold text-green-600'>
                      {formatDateTime(
                        tournament.tournament_start || tournament.start_date
                      )}
                    </span>
                  </div>
                  {tournament.tournament_end && (
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Kết thúc dự kiến:</span>
                      <span className='font-semibold'>
                        {formatDateTime(tournament.tournament_end)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className='font-semibold mb-2'>📍 Địa điểm</h3>
                <div className='bg-gray-50 rounded-lg p-3'>
                  <div className='flex items-start space-x-3'>
                    <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center'>
                      <span className='text-white font-bold text-sm'>
                        {tournament.club?.name?.charAt(0) || 'C'}
                      </span>
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-semibold'>
                        {tournament.club?.name || 'Unknown Club'}
                      </h4>
                      <p className='text-sm text-gray-600 mt-1'>
                        {tournament.venue_address || tournament.club?.address}
                      </p>
                      <div className='flex items-center space-x-2 mt-2'>
                        {tournament.club?.phone && (
                          <span className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
                            📞 {tournament.club.phone}
                          </span>
                        )}
                        {tournament.club?.available_tables && (
                          <span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full'>
                            🎱 {tournament.club.available_tables} bàn
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prize Structure */}
              <div>
                <h3 className='font-semibold mb-2'>🏆 Cơ cấu giải thưởng</h3>
                <div className='bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3'>
                  <div className='grid grid-cols-3 gap-3 text-center'>
                    <div className='bg-white rounded-lg p-3'>
                      <div className='text-2xl mb-1'>🥇</div>
                      <div className='text-xs text-gray-600 mb-1'>
                        Giải nhất
                      </div>
                      <div className='font-bold text-yellow-600'>
                        {tournament.first_prize?.toLocaleString() || 0} điểm
                      </div>
                    </div>
                    <div className='bg-white rounded-lg p-3'>
                      <div className='text-2xl mb-1'>🥈</div>
                      <div className='text-xs text-gray-600 mb-1'>Giải nhì</div>
                      <div className='font-bold text-gray-600'>
                        {tournament.second_prize?.toLocaleString() || 0} điểm
                      </div>
                    </div>
                    <div className='bg-white rounded-lg p-3'>
                      <div className='text-2xl mb-1'>🥉</div>
                      <div className='text-xs text-gray-600 mb-1'>Giải ba</div>
                      <div className='font-bold text-orange-600'>
                        {tournament.third_prize?.toLocaleString() || 0} điểm
                      </div>
                    </div>
                  </div>
                  <div className='text-center mt-3 pt-3 border-t border-orange-200'>
                    <span className='text-sm text-gray-600'>
                      Tổng giải thưởng:{' '}
                    </span>
                    <span className='font-bold text-lg text-orange-600'>
                      {tournament.total_prize_pool?.toLocaleString() || 0} điểm
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {tournament.description && (
                <div>
                  <h3 className='font-semibold mb-2'>📝 Mô tả</h3>
                  <div className='bg-gray-50 rounded-lg p-3'>
                    <p className='text-sm text-gray-700 leading-relaxed'>
                      {tournament.description}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value='rules' className='space-y-4 mt-4'>
              <div>
                <h3 className='font-semibold mb-3'>📜 Luật thi đấu</h3>
                <div className='bg-gray-50 rounded-lg p-4'>
                  {tournament.rules ? (
                    <div className='prose prose-sm max-w-none'>
                      <div
                        dangerouslySetInnerHTML={{ __html: tournament.rules }}
                      />
                    </div>
                  ) : (
                    <div className='space-y-3 text-sm'>
                      <div className='flex items-start space-x-2'>
                        <span className='text-blue-500 font-bold'>1.</span>
                        <span>
                          Thể thức thi đấu:{' '}
                          {getTournamentTypeLabel(
                            tournament.tournament_type || 'single_elimination'
                          )}
                        </span>
                      </div>
                      <div className='flex items-start space-x-2'>
                        <span className='text-blue-500 font-bold'>2.</span>
                        <span>
                          Loại bida:{' '}
                          {getGameFormatLabel(
                            tournament.game_format || '8_ball'
                          )}
                        </span>
                      </div>
                      <div className='flex items-start space-x-2'>
                        <span className='text-blue-500 font-bold'>3.</span>
                        <span>
                          Phí tham gia:{' '}
                          {tournament.entry_fee_points ||
                            tournament.entry_fee ||
                            0}{' '}
                          điểm ranking
                        </span>
                      </div>
                      <div className='flex items-start space-x-2'>
                        <span className='text-blue-500 font-bold'>4.</span>
                        <span>
                          Người chơi phải có mặt trước giờ thi đấu 15 phút
                        </span>
                      </div>
                      <div className='flex items-start space-x-2'>
                        <span className='text-blue-500 font-bold'>5.</span>
                        <span>
                          Quyết định của trọng tài là quyết định cuối cùng
                        </span>
                      </div>
                      <div className='flex items-start space-x-2'>
                        <span className='text-blue-500 font-bold'>6.</span>
                        <span>
                          Không được sử dụng điện thoại trong khi thi đấu
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              {tournament.contact_info && (
                <div>
                  <h3 className='font-semibold mb-3'>📞 Thông tin liên hệ</h3>
                  <div className='bg-blue-50 rounded-lg p-3'>
                    <div className='space-y-2 text-sm'>
                      {tournament.contact_info.phone && (
                        <div className='flex items-center space-x-2'>
                          <Phone className='w-4 h-4 text-blue-600' />
                          <span>{tournament.contact_info.phone}</span>
                        </div>
                      )}
                      {tournament.contact_info.email && (
                        <div className='flex items-center space-x-2'>
                          <Mail className='w-4 h-4 text-blue-600' />
                          <span>{tournament.contact_info.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value='participants' className='space-y-4 mt-4'>
              <div className='flex justify-between items-center'>
                <h3 className='font-semibold'>👥 Danh sách tham gia</h3>
                <span className='text-sm text-gray-500'>
                  {tournament.current_participants || 0}/
                  {tournament.max_participants} người
                </span>
              </div>

              <div className='text-center py-8 text-gray-500'>
                <Users className='w-12 h-12 mx-auto mb-2 opacity-50' />
                <p>Danh sách người tham gia sẽ được cập nhật sau khi đăng ký</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer */}
        <div className='flex space-x-3 pt-4 border-t'>
          <Button variant='outline' onClick={onClose} className='flex-1'>
            Đóng
          </Button>
          <Button
            onClick={() => onJoin(tournament)}
            disabled={isFull || !isRegistrationOpen || isJoining}
            className='flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
          >
            {isJoining ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin mr-2' />
                Đang xử lý...
              </>
            ) : isFull ? (
              'Đã đầy'
            ) : !isRegistrationOpen ? (
              'Chưa mở ĐK'
            ) : (
              'Tham gia ngay'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
