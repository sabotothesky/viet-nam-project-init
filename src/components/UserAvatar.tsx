import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface UserAvatarProps {
  user: {
    name: string;
    nickname?: string;
    avatar?: string;
    rank: string;
    ranking_points?: number;
    win_rate?: number;
  };
  size?: 'sm' | 'md' | 'lg';
  showRank?: boolean;
  showStats?: boolean;
  useNickname?: boolean;
}

const UserAvatar = ({ 
  user, 
  size = 'md', 
  showRank = true, 
  showStats = false,
  useNickname = true
}: UserAvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const getRankColor = (rank: string) => {
    if (rank.startsWith('G')) return 'bg-purple-600 text-white';
    if (rank.startsWith('B')) return 'bg-blue-600 text-white';
    if (rank.startsWith('A')) return 'bg-green-600 text-white';
    if (rank.startsWith('K')) return 'bg-gray-600 text-white';
    return 'bg-gray-600 text-white';
  };

  // Use nickname if available and useNickname is true, otherwise use name
  const displayName = (useNickname && user.nickname) ? user.nickname : user.name;

  return (
    <div className="flex items-center space-x-3">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={user.avatar} alt={displayName} />
        <AvatarFallback className="bg-primary-blue text-white">
          {displayName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h3 className="username text-gray-900 truncate">{displayName}</h3>
          {showRank && (
            <Badge className={`text-xs px-2 py-1 ${getRankColor(user.rank)}`}>
              {user.rank}
            </Badge>
          )}
        </div>
        {showStats && (
          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
            <span>{user.ranking_points || 1000} điểm</span>
            {user.win_rate !== undefined && (
              <>
                <span>•</span>
                <span>{user.win_rate}% thắng</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAvatar;
