import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LiveStream } from '@/components/streaming/LiveStream';

const LiveStreamPage: React.FC = () => {
  const { streamId } = useParams();
  const [streamData, setStreamData] = useState({
    title: 'Trận đấu bida live - Player1 vs Player2',
    streamer: {
      id: '1',
      username: 'pool_master',
      avatar_url: '/avatars/pool_master.jpg',
      followers: 1234
    },
    viewers: 156,
    isLive: true
  });

  useEffect(() => {
    // Fetch stream data based on streamId
    console.log('Fetching stream data for:', streamId);
  }, [streamId]);

  return (
    <div className="min-h-screen bg-black">
      <LiveStream
        streamId={streamId || 'default'}
        title={streamData.title}
        streamer={streamData.streamer}
        viewers={streamData.viewers}
        isLive={streamData.isLive}
        onJoinStream={() => console.log('Joined stream')}
        onLeaveStream={() => console.log('Left stream')}
      />
    </div>
  );
};

export default LiveStreamPage; 