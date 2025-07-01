import { useState } from 'react';
import { Notification } from '@/types/common';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    // Mock implementation
  };

  const markAsRead = async (notificationId: string) => {
    // Mock implementation
  };

  const markAllAsRead = async () => {
    // Mock implementation
  };

  const deleteNotification = async (notificationId: string) => {
    // Mock implementation
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read_at).length;
  };

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
