import React, { useEffect } from 'react';
import { useRealtimeSubscriptions } from '@/hooks/useRealtimeSubscriptions';
import { useAuth } from '@/hooks/useAuth';
import { Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RealtimeNotificationSystemProps {
  children: React.ReactNode;
}

const RealtimeNotificationSystem = ({ children }: RealtimeNotificationSystemProps) => {
  const { user } = useAuth();
  
  const { isConnected, connectionError, reconnect } = useRealtimeSubscriptions({
    onChallengeReceived: (challenge) => {
      console.log('New challenge received:', challenge);
      // Additional custom handling if needed
    },
    onChallengeUpdated: (challenge) => {
      console.log('Challenge updated:', challenge);
      // Additional custom handling if needed
    },
    onBookingCreated: (booking) => {
      console.log('New booking created:', booking);
      // Additional custom handling if needed
    },
    onBookingUpdated: (booking) => {
      console.log('Booking updated:', booking);
      // Additional custom handling if needed
    },
    onNotificationReceived: (notification) => {
      console.log('New notification received:', notification);
      // Additional custom handling if needed
    }
  });

  // Show connection status in development
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <>
      {children}
      
      {/* Connection Status Indicator (only show if there are issues or in dev mode) */}
      {(isDev || connectionError) && user && (
        <div className="fixed bottom-4 right-4 z-50">
          <Badge 
            variant={isConnected ? "default" : "destructive"}
            className="flex items-center space-x-2 p-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              if (connectionError) {
                reconnect();
              }
            }}
          >
            {isConnected ? (
              <>
                <Wifi className="w-3 h-3" />
                <span className="text-xs">Real-time ON</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                <span className="text-xs">
                  {connectionError || 'Connecting...'}
                </span>
              </>
            )}
          </Badge>
        </div>
      )}
    </>
  );
};

export default RealtimeNotificationSystem;
