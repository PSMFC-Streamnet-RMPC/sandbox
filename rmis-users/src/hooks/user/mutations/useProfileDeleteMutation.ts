import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useProfileDeleteMutation = (userId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ status: 'deleted' })
        .eq('id', userId);

      if (profileError) throw profileError;

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      toast({
        title: "User deleted",
        description: "The user has been marked as deleted.",
      });
    },
    onError: (error) => {
      console.error('Profile delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    },
  });
};
