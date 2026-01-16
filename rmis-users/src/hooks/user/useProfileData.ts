import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserProfileData } from "@/types/user";

export const useProfileData = (userId: string) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, agency, api_key, status, data_submitter, folder, comments')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) throw new Error('Profile not found');

      const { data: role, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (roleError) throw roleError;

      const { data: emailData, error: emailError } = await supabase.functions.invoke(
        'get-user-email',
        {
          body: { userId },
        }
      );

      if (emailError) throw emailError;

      return {
        id: profile.id,
        name: profile.name,
        agency: profile.agency,
        folder: profile.folder,
        api_key: profile.api_key,
        status: profile.status as 'active' | 'inactive',
        role: role?.role || 'guest',
        data_submitter: profile.data_submitter,
        email: emailData?.email || '',
        comments: profile.comments,
      } as UserProfileData;
    },
  });
};
