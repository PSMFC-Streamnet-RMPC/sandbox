import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type ProfileUpdateData = {
  name: string;
  agency: string | null;
  folder: string | null;
  comments: string | null;
};

export const useProfileUpdateMutation = (userId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileUpdateData) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          agency: data.agency,
          folder: data.folder,
          comments: data.comments
        })
        .eq('id', userId);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      toast({
        title: "Profile updated",
        description: "The user's profile has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: "Failed to update user profile. Please try again.",
        variant: "destructive",
      });
    },
  });
};
