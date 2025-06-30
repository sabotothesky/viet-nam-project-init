import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface AdminUser {
  id: string;
  user_id: string;
  role: 'system_admin' | 'club_admin';
  permissions: Record<string, boolean>;
  created_at: string;
}

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setLoading(false);
    }
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Error checking admin status: ${errorMessage}`);
        return;
      }

      if (data) {
        setIsAdmin(true);
        setAdminUser({
          ...data,
          role: data.role as 'system_admin' | 'club_admin',
          permissions: (data.permissions as Record<string, boolean>) || {},
        });
      }
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Error in checkAdminStatus: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    isAdmin,
    adminUser,
    loading,
    error,
  };
};
