import React from 'react';
import { Wifi, WifiOff, Activity, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRealtimeSubscriptions } from '@/hooks/useRealtimeSubscriptions';

interface RealtimeStatusProps {
  showDetails?: boolean;
  onReconnect?: () => void;
}

const RealtimeStatus = ({
  showDetails = false,
  onReconnect,
}: RealtimeStatusProps) => {
  const { isConnected, connectionError, reconnect } =
    useRealtimeSubscriptions();

  if (!showDetails && isConnected) {
    return null; // Don't show anything if connected and details not requested
  }

  const handleReconnect = () => {
    reconnect();
    onReconnect?.();
  };

  return (
    <div className='flex items-center space-x-2'>
      {isConnected ? (
        <Badge variant='default' className='flex items-center space-x-1'>
          <Activity className='w-3 h-3' />
          <span className='text-xs'>Real-time</span>
        </Badge>
      ) : (
        <div className='flex items-center space-x-2'>
          <Badge variant='destructive' className='flex items-center space-x-1'>
            <WifiOff className='w-3 h-3' />
            <span className='text-xs'>Offline</span>
          </Badge>

          {connectionError && (
            <Button
              variant='ghost'
              size='sm'
              onClick={handleReconnect}
              className='text-xs h-6 px-2'
            >
              <AlertCircle className='w-3 h-3 mr-1' />
              Retry
            </Button>
          )}
        </div>
      )}

      {showDetails && (
        <div className='text-xs text-gray-500'>
          Status:{' '}
          {isConnected ? 'Connected' : connectionError || 'Connecting...'}
        </div>
      )}
    </div>
  );
};

export default RealtimeStatus;
