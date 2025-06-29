import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Check, 
  X, 
  Trash2, 
  Settings,
  MessageCircle,
  Trophy,
  Target,
  Users,
  Calendar,
  Star
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'message' | 'challenge' | 'tournament' | 'achievement' | 'system' | 'match';
  title: string;
  message: string;
  sender?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  created_at: Date;
  is_read: boolean;
  action_url?: string;
  action_data?: any;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationClick: (notification: Notification) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onNotificationClick
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNotifications([
        {
          id: '1',
          type: 'message',
          title: 'Tin nhắn mới',
          message: 'player2 đã gửi tin nhắn cho bạn',
          sender: {
            id: '2',
            username: 'player2',
            avatar_url: '/avatars/player2.jpg'
          },
          created_at: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
          is_read: false,
          action_url: '/chat/1'
        },
        {
          id: '2',
          type: 'challenge',
          title: 'Thách đấu mới',
          message: 'pool_master muốn thách đấu với bạn - 200,000 VNĐ',
          sender: {
            id: '3',
            username: 'pool_master',
            avatar_url: '/avatars/pool_master.jpg'
          },
          created_at: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
          is_read: false,
          action_url: '/challenges/1'
        },
        {
          id: '3',
          type: 'tournament',
          title: 'Giải đấu sắp diễn ra',
          message: 'Giải đấu mùa xuân sẽ bắt đầu trong 2 giờ',
          created_at: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          is_read: false,
          action_url: '/tournaments/1'
        },
        {
          id: '4',
          type: 'achievement',
          title: 'Thành tích mới',
          message: 'Chúc mừng! Bạn đã đạt được thành tích "Chiến thắng liên tiếp"',
          created_at: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          is_read: true,
          action_url: '/profile/achievements'
        },
        {
          id: '5',
          type: 'match',
          title: 'Kết quả trận đấu',
          message: 'Bạn đã thắng trận đấu vs player2 với tỷ số 7-3',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          is_read: true,
          action_url: '/matches/1'
        },
        {
          id: '6',
          type: 'system',
          title: 'Cập nhật hệ thống',
          message: 'Hệ thống sẽ bảo trì từ 2:00 - 4:00 sáng mai',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          is_read: true
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-4 w-4 text-blue-600" />;
      case 'challenge':
        return <Target className="h-4 w-4 text-red-600" />;
      case 'tournament':
        return <Trophy className="h-4 w-4 text-yellow-600" />;
      case 'achievement':
        return <Star className="h-4 w-4 text-purple-600" />;
      case 'match':
        return <Users className="h-4 w-4 text-green-600" />;
      case 'system':
        return <Bell className="h-4 w-4 text-gray-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'bg-blue-50 border-blue-200';
      case 'challenge':
        return 'bg-red-50 border-red-200';
      case 'tournament':
        return 'bg-yellow-50 border-yellow-200';
      case 'achievement':
        return 'bg-purple-50 border-purple-200';
      case 'match':
        return 'bg-green-50 border-green-200';
      case 'system':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, is_read: true }
          : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, is_read: true }))
    );
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.is_read;
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
      <div className="bg-black bg-opacity-50 absolute inset-0" onClick={onClose}></div>
      
      <Card className="w-full max-w-md max-h-[80vh] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Thông báo
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <Check className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
            <TabsTrigger value="message">Tin nhắn</TabsTrigger>
            <TabsTrigger value="challenge">Thách đấu</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="space-y-2 p-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                      notification.is_read 
                        ? 'bg-white' 
                        : 'bg-blue-50 border-blue-200'
                    } ${getNotificationColor(notification.type)}`}
                    onClick={() => onNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {notification.sender ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={notification.sender.avatar_url} />
                            <AvatarFallback>{notification.sender.username[0]}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(notification.created_at, { 
                              addSuffix: true, 
                              locale: vi 
                            })}
                          </span>
                          
                          <div className="flex items-center gap-1">
                            {!notification.is_read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNotification(notification.id);
                              }}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Không có thông báo nào
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}; 