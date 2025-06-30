import { useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  types: {
    challenges: boolean;
    tournaments: boolean;
    achievements: boolean;
    system: boolean;
  };
}

export const useNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    inApp: true,
    types: {
      challenges: true,
      tournaments: true,
      achievements: true,
      system: true,
    },
  });

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock notifications
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'success',
          title: 'Thành tích mới!',
          message: 'Bạn đã đạt được thành tích "Chiến thắng liên tiếp"',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          read: false,
          action: {
            label: 'Xem thành tích',
            url: '/achievements',
          },
        },
        {
          id: '2',
          type: 'info',
          title: 'Giải đấu sắp diễn ra',
          message: 'Giải đấu mùa xuân sẽ bắt đầu trong 2 giờ',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          read: false,
          action: {
            label: 'Tham gia',
            url: '/tournaments/1',
          },
        },
        {
          id: '3',
          type: 'warning',
          title: 'Thách đấu sắp hết hạn',
          message: 'Thách đấu với player2 sẽ hết hạn trong 1 giờ',
          timestamp: new Date(Date.now() - 1000 * 60 * 90),
          read: true,
          action: {
            label: 'Xem thách đấu',
            url: '/challenges/1',
          },
        },
        {
          id: '4',
          type: 'error',
          title: 'Kết nối mạng không ổn định',
          message: 'Vui lòng kiểm tra kết nối mạng của bạn',
          timestamp: new Date(Date.now() - 1000 * 60 * 120),
          read: true,
        },
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));

        const notification = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));

        if (notification && !notification.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      } catch (error) {
        console.error('Failed to delete notification:', error);
      }
    },
    [notifications]
  );

  // Update notification settings
  const updateSettings = useCallback(
    async (newSettings: Partial<NotificationSettings>) => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        setSettings(prev => ({ ...prev, ...newSettings }));
      } catch (error) {
        console.error('Failed to update notification settings:', error);
      }
    },
    []
  );

  // Send notification (for testing)
  const sendNotification = useCallback(
    async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      try {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date(),
          read: false,
        };

        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    },
    []
  );

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!userId) return;

    fetchNotifications();

    // Simulate real-time updates
    const interval = setInterval(() => {
      // Randomly add new notifications for demo
      if (Math.random() < 0.1) {
        // 10% chance every 30 seconds
        sendNotification({
          type: 'info',
          title: 'Cập nhật hệ thống',
          message: 'Hệ thống đã được cập nhật với các tính năng mới',
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [userId, fetchNotifications, sendNotification]);

  return {
    notifications,
    unreadCount,
    loading,
    settings,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings,
    sendNotification,
  };
};
