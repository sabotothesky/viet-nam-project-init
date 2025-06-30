import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface UserLocation {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  district?: string;
  max_distance_km?: number;
  created_at?: string;
  updated_at: string;
}

export const useUserLocation = () => {
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      });
    });
  };

  const saveUserLocation = async (
    latitude: number,
    longitude: number,
    address?: string
  ) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_locations')
        .upsert({
          user_id: user.id,
          latitude,
          longitude,
          address,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Use the data as returned from Supabase
      setUserLocation(data);
      return data;
    } catch (error) {
      console.error('Error saving location:', error);
      throw error;
    }
  };

  const requestLocationPermission = async () => {
    try {
      setLoading(true);
      const position = await getCurrentLocation();

      const { latitude, longitude } = position.coords;

      // Reverse geocoding để lấy address (simplified)
      const address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

      await saveUserLocation(latitude, longitude, address);
      toast.success('Đã cập nhật vị trí của bạn');
    } catch (error) {
      console.error('Location error:', error);
      setError('Không thể lấy vị trí của bạn');
      toast.error('Không thể lấy vị trí. Vui lòng cho phép truy cập vị trí.');
    } finally {
      setLoading(false);
    }
  };

  const loadUserLocation = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        // Use the data as returned from Supabase
        setUserLocation(data);
      }
    } catch (error) {
      console.error('Error loading location:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadUserLocation();
    }
  }, [user?.id]);

  return {
    userLocation,
    loading,
    error,
    requestLocationPermission,
    saveUserLocation,
    getCurrentLocation,
  };
};
