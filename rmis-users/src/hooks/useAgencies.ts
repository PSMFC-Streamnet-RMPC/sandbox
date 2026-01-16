import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Agency {
  agency: string;
  agency_name: string | null;
}

export const useAgencies = () => {
  return useQuery({
    queryKey: ['agencies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agencies')
        .select('agency, agency_name')
        .order('agency_name')
        .throwOnError();

      if (error) throw error;
      return data as Agency[];
    },
  });
};
