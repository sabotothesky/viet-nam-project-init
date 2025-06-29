
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Trophy, Building, Shield, Settings, Crown } from 'lucide-react';

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  onTabChange,
  children
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="basic" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Cơ bản
        </TabsTrigger>
        <TabsTrigger value="billiards" className="flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          Bida
        </TabsTrigger>
        <TabsTrigger value="club" className="flex items-center gap-2">
          <Building className="h-4 w-4" />
          CLB
        </TabsTrigger>
        <TabsTrigger value="membership" className="flex items-center gap-2">
          <Crown className="h-4 w-4" />
          Hội viên
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Bảo mật
        </TabsTrigger>
        <TabsTrigger value="preferences" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Tùy chọn
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};
