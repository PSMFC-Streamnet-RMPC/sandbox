import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AppRole } from "@/integrations/supabase/types";

export const useProfileRoleMutation = (userId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRole: AppRole) => {
      const { error } = await supabase
        .from('user_roles')
        .upsert(
          { user_id: userId, role: newRole },
          { onConflict: 'user_id' }
        );

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      toast({
        title: "Role updated",
        description: "The user's role has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    },
  });
};
