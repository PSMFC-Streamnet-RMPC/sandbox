import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@/types/user";

export const useUsers = () => {
  const { data: emailMap } = useQuery({
    queryKey: ['userEmails'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-user-emails');
      if (error) throw error;
      return data as Record<string, string>;
    },
  });

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, agency, status, data_submitter, folder')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const roleMap = roles.reduce((acc, curr) => {
        acc[curr.user_id] = curr.role;
        return acc;
      }, {} as Record<string, string>);

      return profiles.map(profile => ({
        id: profile.id,
        email: emailMap?.[profile.id] || 'No email',
        name: profile.name || 'Unnamed User',
        agency: profile.agency,
        folder: profile.folder,
        status: profile.status as 'active' | 'inactive',
        role: roleMap[profile.id] || 'guest',
        data_submitter: profile.data_submitter
      })) as User[];
    },
    enabled: !!emailMap,
  });

  return { users, isLoading };
};
