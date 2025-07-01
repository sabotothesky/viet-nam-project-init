
import { useState, useEffect } from 'react';

interface QueueItem {
  id: string;
  action: string;
  data: any;
  retries: number;
  timestamp: number;
}

export const useOfflineQueue = () => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const maxRetries = 3; // Define maxRetries here

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addToQueue = (action: string, data: any) => {
    const item: QueueItem = {
      id: Date.now().toString(),
      action,
      data,
      retries: 0,
      timestamp: Date.now()
    };
    setQueue(prev => [...prev, item]);
  };

  const processQueue = async () => {
    if (!isOnline || queue.length === 0) return;

    const item = queue[0];
    try {
      // Process the queue item
      console.log('Processing queue item:', item);
      
      // Remove successful item from queue
      setQueue(prev => prev.slice(1));
    } catch (error) {
      console.error('Failed to process queue item:', error);
      
      // Retry logic
      if (item.retries < maxRetries) {
        setQueue(prev => [
          { ...item, retries: item.retries + 1 },
          ...prev.slice(1)
        ]);
      } else {
        // Remove failed item after max retries
        setQueue(prev => prev.slice(1));
      }
    }
  };

  useEffect(() => {
    if (isOnline) {
      processQueue();
    }
  }, [isOnline, queue]);

  return {
    addToQueue,
    queue,
    isOnline
  };
};
