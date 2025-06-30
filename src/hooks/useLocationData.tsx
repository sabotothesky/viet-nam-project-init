import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Province {
  id: string;
  name: string;
  code: string;
  region: string;
}

interface District {
  id: string;
  province_id: string;
  name: string;
  code: string;
}

interface Ward {
  id: string;
  district_id: string;
  name: string;
  code: string;
}

export const useLocationData = () => {
  // Fetch provinces
  const { data: provinces = [], isLoading: provincesLoading } = useQuery({
    queryKey: ['provinces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('provinces')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch districts by province
  const fetchDistricts = async (provinceId: string) => {
    const { data, error } = await supabase
      .from('districts')
      .select('*')
      .eq('province_id', provinceId)
      .order('name');

    if (error) throw error;
    return data || [];
  };

  // Fetch wards by district
  const fetchWards = async (districtId: string) => {
    const { data, error } = await supabase
      .from('wards')
      .select('*')
      .eq('district_id', districtId)
      .order('name');

    if (error) throw error;
    return data || [];
  };

  return {
    provinces,
    provincesLoading,
    fetchDistricts,
    fetchWards,
  };
};
