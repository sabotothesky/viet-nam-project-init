import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import {
  QRCode,
  TableQRCode,
  QuickMatch,
  MatchResult,
  CreateQuickMatchRequest,
  ConfirmMatchResultRequest,
  PlayerRanking,
} from '../types/qr';

export interface QRScanResult {
  id: string;
  type: QRCode['type'];
  title: string;
  description: string;
  data: {
    [key: string]: any;
  };
  scan_count: number;
  last_scanned: Date;
  created_at: Date;
}

export interface QRScanHistory {
  id: string;
  qr_code_id: string;
  user_id: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  scan_time: Date;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  device_info: {
    user_agent: string;
    platform: string;
    ip_address?: string;
  };
  result: 'success' | 'error' | 'expired' | 'invalid';
  error_message?: string;
}

export interface CreateQRCodeData {
  type: QRCode['type'];
  title: string;
  description: string;
  data: {
    [key: string]: any;
  };
  expires_at?: Date;
}

export const useQRSystem = (userId?: string) => {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [scanHistory, setScanHistory] = useState<QRScanHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch QR codes
  const fetchQRCodes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock QR codes data
      const mockQRCodes: QRCode[] = [
        {
          id: '1',
          type: 'match',
          title: 'Trận đấu bida',
          description: 'Quét để tham gia trận đấu với player1',
          data: {
            match_id: 'match_123',
            opponent: 'player1',
            venue: 'Club Bida ABC',
            scheduled_time: '2024-01-25T14:00:00Z',
          },
          image_url: '/qr-codes/match_123.png',
          is_active: true,
          expires_at: new Date('2024-01-25T16:00:00Z'),
          created_at: new Date('2024-01-20'),
          updated_at: new Date(),
        },
        {
          id: '2',
          type: 'tournament',
          title: 'Giải đấu mùa xuân',
          description: 'Quét để đăng ký tham gia giải đấu',
          data: {
            tournament_id: 'tournament_456',
            name: 'Giải đấu mùa xuân 2024',
            entry_fee: 100000,
            max_participants: 64,
          },
          image_url: '/qr-codes/tournament_456.png',
          is_active: true,
          expires_at: new Date('2024-02-01T00:00:00Z'),
          created_at: new Date('2024-01-15'),
          updated_at: new Date(),
        },
        {
          id: '3',
          type: 'club',
          title: 'Club Bida ABC',
          description: 'Quét để check-in tại club',
          data: {
            club_id: 'club_789',
            name: 'Club Bida ABC',
            address: '123 Đường ABC, Quận 1, TP.HCM',
            check_in_reward: 100,
          },
          image_url: '/qr-codes/club_789.png',
          is_active: true,
          created_at: new Date('2024-01-10'),
          updated_at: new Date(),
        },
        {
          id: '4',
          type: 'payment',
          title: 'Thanh toán nhanh',
          description: 'Quét để thanh toán 50,000 VND',
          data: {
            amount: 50000,
            currency: 'VND',
            description: 'Phí tham gia giải đấu',
            payment_method: 'qr_code',
          },
          image_url: '/qr-codes/payment_001.png',
          is_active: true,
          expires_at: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      setQRCodes(mockQRCodes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải mã QR');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch scan history
  const fetchScanHistory = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock scan history data
      const mockScanHistory: QRScanHistory[] = [
        {
          id: '1',
          qr_code_id: '1',
          user_id: userId,
          user: {
            id: userId,
            username: 'current_user',
            avatar_url: '/avatars/current_user.jpg',
          },
          scan_time: new Date(Date.now() - 1000 * 60 * 30),
          location: {
            lat: 10.7769,
            lng: 106.7009,
            address: 'Club Bida ABC, 123 Đường ABC, Quận 1, TP.HCM',
          },
          device_info: {
            user_agent:
              'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
            platform: 'iOS',
            ip_address: '192.168.1.100',
          },
          result: 'success',
        },
        {
          id: '2',
          qr_code_id: '3',
          user_id: userId,
          user: {
            id: userId,
            username: 'current_user',
            avatar_url: '/avatars/current_user.jpg',
          },
          scan_time: new Date(Date.now() - 1000 * 60 * 60 * 2),
          location: {
            lat: 10.7769,
            lng: 106.7009,
            address: 'Club Bida ABC, 123 Đường ABC, Quận 1, TP.HCM',
          },
          device_info: {
            user_agent:
              'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
            platform: 'iOS',
            ip_address: '192.168.1.100',
          },
          result: 'success',
        },
        {
          id: '3',
          qr_code_id: '2',
          user_id: userId,
          user: {
            id: userId,
            username: 'current_user',
            avatar_url: '/avatars/current_user.jpg',
          },
          scan_time: new Date(Date.now() - 1000 * 60 * 60 * 24),
          location: {
            lat: 10.7829,
            lng: 106.7009,
            address: 'Club Bida XYZ, 456 Đường XYZ, Quận 3, TP.HCM',
          },
          device_info: {
            user_agent:
              'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
            platform: 'iOS',
            ip_address: '192.168.1.100',
          },
          result: 'success',
        },
      ];

      setScanHistory(mockScanHistory);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Không thể tải lịch sử quét mã'
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Create QR code
  const createQRCode = useCallback(
    async (data: CreateQRCodeData) => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newQRCode: QRCode = {
          id: Date.now().toString(),
          type: data.type,
          title: data.title,
          description: data.description,
          data: data.data,
          image_url: `/qr-codes/${data.type}_${Date.now()}.png`,
          is_active: true,
          expires_at: data.expires_at,
          created_at: new Date(),
          updated_at: new Date(),
        };

        setQRCodes(prev => [newQRCode, ...prev]);
        return newQRCode;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tạo mã QR');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  // Scan QR code
  const scanQRCode = useCallback(
    async (
      qrData: string,
      location?: { lat: number; lng: number; address: string }
    ) => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Parse QR data (in real app, this would decode the QR content)
        const qrCode = qrCodes.find(
          qr => qr.id === qrData || qr.image_url?.includes(qrData)
        );

        if (!qrCode) {
          throw new Error('Mã QR không hợp lệ');
        }

        if (!qrCode.is_active) {
          throw new Error('Mã QR đã bị vô hiệu hóa');
        }

        if (qrCode.expires_at && qrCode.expires_at < new Date()) {
          throw new Error('Mã QR đã hết hạn');
        }

        // Create scan history entry
        const scanEntry: QRScanHistory = {
          id: Date.now().toString(),
          qr_code_id: qrCode.id,
          user_id: userId,
          user: {
            id: userId,
            username: 'current_user',
            avatar_url: '/avatars/current_user.jpg',
          },
          scan_time: new Date(),
          location,
          device_info: {
            user_agent: navigator.userAgent,
            platform: navigator.platform,
            ip_address: undefined, // Would be set by server
          },
          result: 'success',
        };

        setScanHistory(prev => [scanEntry, ...prev]);

        // Handle different QR code types
        const result = await handleQRCodeAction(qrCode);

        return {
          qrCode,
          scanEntry,
          result,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Lỗi khi quét mã QR';
        setError(errorMessage);

        // Log failed scan
        const failedScan: QRScanHistory = {
          id: Date.now().toString(),
          qr_code_id: 'unknown',
          user_id: userId,
          user: {
            id: userId,
            username: 'current_user',
            avatar_url: '/avatars/current_user.jpg',
          },
          scan_time: new Date(),
          location,
          device_info: {
            user_agent: navigator.userAgent,
            platform: navigator.platform,
            ip_address: undefined,
          },
          result: 'error',
          error_message: errorMessage,
        };

        setScanHistory(prev => [failedScan, ...prev]);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId, qrCodes]
  );

  // Handle QR code actions based on type
  const handleQRCodeAction = useCallback(async (qrCode: QRCode) => {
    switch (qrCode.type) {
      case 'match':
        return {
          action: 'join_match',
          message: `Đã tham gia trận đấu với ${qrCode.data.opponent}`,
          data: qrCode.data,
        };

      case 'tournament':
        return {
          action: 'register_tournament',
          message: `Đã đăng ký tham gia ${qrCode.data.name}`,
          data: qrCode.data,
        };

      case 'club':
        return {
          action: 'check_in',
          message: `Đã check-in tại ${qrCode.data.name}`,
          data: qrCode.data,
        };

      case 'payment':
        return {
          action: 'initiate_payment',
          message: `Khởi tạo thanh toán ${qrCode.data.amount} ${qrCode.data.currency}`,
          data: qrCode.data,
        };

      case 'user':
        return {
          action: 'view_profile',
          message: `Xem hồ sơ người dùng`,
          data: qrCode.data,
        };

      case 'achievement':
        return {
          action: 'unlock_achievement',
          message: `Mở khóa thành tích`,
          data: qrCode.data,
        };

      default:
        return {
          action: 'unknown',
          message: 'Hành động không xác định',
          data: qrCode.data,
        };
    }
  }, []);

  // Deactivate QR code
  const deactivateQRCode = useCallback(async (qrCodeId: string) => {
    try {
      setQRCodes(prev =>
        prev.map(qr =>
          qr.id === qrCodeId
            ? { ...qr, is_active: false, updated_at: new Date() }
            : qr
        )
      );
    } catch (err) {
      console.error('Failed to deactivate QR code:', err);
    }
  }, []);

  // Delete QR code
  const deleteQRCode = useCallback(async (qrCodeId: string) => {
    try {
      setQRCodes(prev => prev.filter(qr => qr.id !== qrCodeId));
    } catch (err) {
      console.error('Failed to delete QR code:', err);
    }
  }, []);

  // Get QR code by ID
  const getQRCodeById = useCallback(
    (qrCodeId: string) => {
      return qrCodes.find(qr => qr.id === qrCodeId);
    },
    [qrCodes]
  );

  // Get QR codes by type
  const getQRCodesByType = useCallback(
    (type: QRCode['type']) => {
      return qrCodes.filter(qr => qr.type === type);
    },
    [qrCodes]
  );

  // Get active QR codes
  const getActiveQRCodes = useCallback(() => {
    return qrCodes.filter(qr => qr.is_active);
  }, [qrCodes]);

  // Get user's scan history
  const getUserScanHistory = useCallback(
    (targetUserId?: string) => {
      const id = targetUserId || userId;
      if (!id) return [];
      return scanHistory.filter(scan => scan.user_id === id);
    },
    [scanHistory, userId]
  );

  // Get recent scans
  const getRecentScans = useCallback(
    (limit: number = 10) => {
      return scanHistory
        .sort((a, b) => b.scan_time.getTime() - a.scan_time.getTime())
        .slice(0, limit);
    },
    [scanHistory]
  );

  // Get scan statistics
  const getScanStats = useCallback(() => {
    const totalScans = scanHistory.length;
    const successfulScans = scanHistory.filter(
      scan => scan.result === 'success'
    ).length;
    const failedScans = scanHistory.filter(
      scan => scan.result === 'error'
    ).length;
    const expiredScans = scanHistory.filter(
      scan => scan.result === 'expired'
    ).length;

    return {
      total: totalScans,
      successful: successfulScans,
      failed: failedScans,
      expired: expiredScans,
      success_rate: totalScans > 0 ? (successfulScans / totalScans) * 100 : 0,
    };
  }, [scanHistory]);

  // Generate QR code image URL
  const generateQRImageUrl = useCallback((data: string, size: number = 200) => {
    // In a real app, this would call a QR code generation service
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
  }, []);

  useEffect(() => {
    fetchQRCodes();
    fetchScanHistory();
  }, [fetchQRCodes, fetchScanHistory]);

  return {
    qrCodes,
    scanHistory,
    loading,
    error,
    fetchQRCodes,
    fetchScanHistory,
    createQRCode,
    scanQRCode,
    deactivateQRCode,
    deleteQRCode,
    getQRCodeById,
    getQRCodesByType,
    getActiveQRCodes,
    getUserScanHistory,
    getRecentScans,
    getScanStats,
    generateQRImageUrl,
  };
};
