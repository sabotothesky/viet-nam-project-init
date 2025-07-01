
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useAdminCheck = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-check', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      const { data, error } = await supabase.rpc('is_user_admin', {
        user_uuid: user.id,
      });

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return data || false;
    },
    enabled: !!user?.id,
  });
};
