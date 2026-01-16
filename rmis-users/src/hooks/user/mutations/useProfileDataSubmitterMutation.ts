import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useProfileDataSubmitterMutation = (userId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isDataSubmitter: boolean) => {
      const { error } = await supabase
        .from('profiles')
        .update({ data_submitter: isDataSubmitter })
        .eq('id', userId);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: (_, isDataSubmitter) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      toast({
        title: "Data submitter status updated",
        description: `User is ${isDataSubmitter ? 'now' : 'no longer'} a data submitter.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update data submitter status. Please try again.",
        variant: "destructive",
      });
    },
  });
};
