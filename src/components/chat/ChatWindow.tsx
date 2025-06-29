import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Paperclip, 
  Image, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Search,
  ArrowLeft,
  User,
  Users
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ChatUser {
  id: string;
  username: string;
  avatar_url?: string;
  rank: string;
  is_online: boolean;
  last_seen: Date;
}

interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  created_at: Date;
  is_read: boolean;
  type: 'text' | 'image' | 'file' | 'system';
  file_url?: string;
  file_name?: string;
  file_size?: number;
}

interface ChatConversation {
  id: string;
  type: 'direct' | 'group';
  participants: ChatUser[];
  title?: string;
}

interface ChatWindowProps {
  conversation: ChatConversation | null;
  onBack: () => void;
  onSendMessage: (content: string, type?: 'text' | 'image' | 'file') => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  onBack,
  onSendMessage
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversation) {
      fetchMessages();
    }
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!conversation) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMessages([
        {
          id: '1',
          content: 'Xin chào! Bạn có muốn thách đấu không?',
          sender_id: conversation.participants[0]?.id || '1',
          sender_name: conversation.participants[0]?.username || 'player2',
          sender_avatar: conversation.participants[0]?.avatar_url,
          created_at: new Date(Date.now() - 1000 * 60 * 10),
          is_read: true,
          type: 'text'
        },
        {
          id: '2',
          content: 'Chào bạn! Có thể thách đấu với số tiền bao nhiêu?',
          sender_id: 'current-user',
          sender_name: 'Bạn',
          created_at: new Date(Date.now() - 1000 * 60 * 8),
          is_read: true,
          type: 'text'
        },
        {
          id: '3',
          content: '100,000 VNĐ nhé! Bạn có đồng ý không?',
          sender_id: conversation.participants[0]?.id || '1',
          sender_name: conversation.participants[0]?.username || 'player2',
          sender_avatar: conversation.participants[0]?.avatar_url,
          created_at: new Date(Date.now() - 1000 * 60 * 5),
          is_read: true,
          type: 'text'
        },
        {
          id: '4',
          content: 'Được rồi! Khi nào chơi?',
          sender_id: 'current-user',
          sender_name: 'Bạn',
          created_at: new Date(Date.now() - 1000 * 60 * 3),
          is_read: false,
          type: 'text'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender_id: 'current-user',
      sender_name: 'Bạn',
      created_at: new Date(),
      is_read: false,
      type: 'text'
    };
    
    setMessages(prev => [...prev, message]);
    onSendMessage(newMessage, 'text');
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getConversationTitle = () => {
    if (!conversation) return '';
    
    if (conversation.type === 'group') {
      return conversation.title || `Nhóm ${conversation.participants.map(p => p.username).join(', ')}`;
    }
    
    return conversation.participants[0]?.username || 'Unknown';
  };

  const getConversationAvatar = () => {
    if (!conversation) return null;
    
    if (conversation.type === 'group') {
      return (
        <div className="relative">
          <Avatar className="h-8 w-8">
            <AvatarImage src={conversation.participants[0]?.avatar_url} />
            <AvatarFallback>
              <Users className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      );
    }
    
    const user = conversation.participants[0];
    return (
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.avatar_url} />
          <AvatarFallback>{user?.username[0]}</AvatarFallback>
        </Avatar>
        {user?.is_online && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
        )}
      </div>
    );
  };

  const renderMessage = (message: ChatMessage) => {
    const isOwnMessage = message.sender_id === 'current-user';
    
    return (
      <div
        key={message.id}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex items-end gap-2 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
          {!isOwnMessage && (
            <Avatar className="h-6 w-6 flex-shrink-0">
              <AvatarImage src={message.sender_avatar} />
              <AvatarFallback>{message.sender_name[0]}</AvatarFallback>
            </Avatar>
          )}
          
          <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
            {!isOwnMessage && (
              <span className="text-xs text-gray-500 mb-1">{message.sender_name}</span>
            )}
            
            <div className={`px-3 py-2 rounded-lg ${
              isOwnMessage
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}>
              {message.type === 'text' && (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
              {message.type === 'image' && (
                <img
                  src={message.file_url}
                  alt="Image"
                  className="max-w-full rounded"
                />
              )}
              {message.type === 'file' && (
                <div className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{message.file_name}</div>
                    <div className="text-xs opacity-75">
                      {(message.file_size || 0 / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(message.created_at, { addSuffix: true, locale: vi })}
              </span>
              {isOwnMessage && (
                <div className="w-3 h-3">
                  {message.is_read ? (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  ) : (
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Chọn một cuộc trò chuyện để bắt đầu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="md:hidden">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          {getConversationAvatar()}
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{getConversationTitle()}</CardTitle>
            <div className="flex items-center gap-2">
              {conversation.type === 'direct' && conversation.participants[0]?.is_online && (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              )}
              <span className="text-sm text-gray-600">
                {conversation.type === 'direct' && conversation.participants[0]?.is_online
                  ? 'Đang hoạt động'
                  : `${conversation.participants.length} thành viên`
                }
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(renderMessage)}
              
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-end gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={conversation.participants[0]?.avatar_url} />
                      <AvatarFallback>{conversation.participants[0]?.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 px-3 py-2 rounded-lg">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Message Input */}
      <CardContent className="border-t p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-[40px] max-h-32"
              multiline
            />
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Image className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Smile className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
}; 