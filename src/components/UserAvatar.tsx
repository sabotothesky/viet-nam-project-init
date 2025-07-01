
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface User {
  id?: string;
  name: string;
  avatar?: string;
  rank?: string;
}

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showRank?: boolean;
}

const UserAvatar = ({ user, size = 'md', className, showRank = false }: UserAvatarProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex items-center gap-3">
      <Avatar className={`${sizeClasses[size]} ${className}`}>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>
          {user.name?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">{user.name}</div>
        {showRank && user.rank && (
          <Badge variant="secondary" className="text-xs">
            {user.rank}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default UserAvatar;
