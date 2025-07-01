
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface User {
  id: string;
  name: string;
  avatar?: string;
  rank?: string;
}

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar = ({ user, size = 'md', className }: UserAvatarProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback>
        {user.name?.charAt(0)?.toUpperCase() || 'U'}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
