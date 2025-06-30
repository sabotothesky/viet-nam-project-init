import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface QueueItem {
  id: string;
  type: string;
  data: Record<string, any>;
  timestamp: number;
  retries: number;
}

export const useOfflineQueue = () => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Load saved queue
    const savedQueue = localStorage.getItem('offline-queue');
    if (savedQueue) {
      setQueue(JSON.parse(savedQueue));
    }

    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Đã kết nối internet');
      processQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('Mất kết nối internet - Các thao tác sẽ được lưu tạm thời');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Save queue to localStorage
    localStorage.setItem('offline-queue', JSON.stringify(queue));
  }, [queue]);

  const addToQueue = (
    type: string,
    data: Record<string, any>,
    maxRetries = 3
  ) => {
    const action: QueueItem = {
      id: Date.now().toString(),
      type,
      data,
      timestamp: new Date().getTime(),
      retries: 0,
    };

    setQueue(prev => [...prev, action]);

    if (isOnline) {
      processQueue();
    } else {
      toast.info('Thao tác đã được lưu tạm thời');
    }
  };

  const processQueue = async () => {
    if (queue.length === 0) return;

    const actionsToProcess = [...queue];

    for (const action of actionsToProcess) {
      try {
        await executeAction(action);
        // Remove successful action from queue
        setQueue(prev => prev.filter(item => item.id !== action.id));
        toast.success('Đồng bộ thành công');
      } catch (error) {
        // Increment retry count
        setQueue(prev =>
          prev.map(item =>
            item.id === action.id
              ? { ...item, retries: item.retries + 1 }
              : item
          )
        );

        if (action.retries >= maxRetries) {
          // Remove failed action after max retries
          setQueue(prev => prev.filter(item => item.id !== action.id));
          toast.error('Không thể đồng bộ một số thao tác');
        }
      }
    }
  };

  const executeAction = async (action: QueueItem) => {
    // This would implement the actual API calls based on action type
    console.log('Executing action:', action);

    // Mock implementation - replace with real API calls
    switch (action.type) {
      case 'create_challenge':
        // await createChallenge(action.data);
        break;
      case 'update_match_result':
        // await updateMatchResult(action.data);
        break;
      default:
        console.warn('Unknown action type:', action.type);
    }
  };

  return {
    isOnline,
    queueSize: queue.length,
    addToQueue,
    processQueue,
  };
};
