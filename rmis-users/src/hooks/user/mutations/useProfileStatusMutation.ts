import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useProfileStatusMutation = (userId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newStatus: 'active' | 'inactive' | 'deleted') => {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: (_, newStatus) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      toast({
        title: "Status updated",
        description: `User is now ${newStatus}.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    },
  });
};
