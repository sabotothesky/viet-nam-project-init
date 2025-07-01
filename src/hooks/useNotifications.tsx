
import { useState, useEffect } from 'react';
import { Notification } from '@/types/common';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Mock data for now
      const mockNotifications: Notification[] = [
        {
          id: '1',
          user_id: 'user1',
          title: 'Thách đấu mới',
          message: 'Bạn có một thách đấu mới từ Player1',
          type: 'challenge_received',
          created_at: new Date().toISOString(),
          priority: 'high',
        },
        {
          id: '2',
          user_id: 'user1',
          title: 'Trận đấu sắp diễn ra',
          message: 'Trận đấu với Player2 sẽ bắt đầu trong 30 phút',
          type: 'match_reminder',
          created_at: new Date(Date.now() - 1800000).toISOString(),
          read_at: new Date().toISOString(),
          priority: 'medium',
        }
      ];
      setNotifications(mockNotifications);
    } catch (err) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read_at: new Date().toISOString() }
          : notification
      )
    );
  };

  const markAllAsRead = async () => {
    const now = new Date().toISOString();
    setNotifications(prev =>
      prev.map(notification =>
        notification.read_at ? notification : { ...notification, read_at: now }
      )
    );
  };

  const deleteNotification = async (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.read_at).length;
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
  };
};
