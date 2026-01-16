import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAuthFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', error);
          return null;
        }

        return session;
      } catch (error) {
        console.error('Unexpected error in session check:', error);
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 4,
  });

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      await queryClient.removeQueries();

      toast({
        title: "Signed out successfully",
        duration: 2000,
      });

      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserStatus = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return false;
      }

      return profile?.status === 'active';
    } catch (error) {
      console.error("Status check error:", error);
      return false;
    }
  };

  const handleAuth = async (
    email: string,
    password: string,
    isSignUp: boolean,
    userData?: { name: string; agency: string }
  ) => {
    setIsLoading(true);

    try {
      if (isSignUp) {
        await supabase.auth.signOut();
        await queryClient.removeQueries();
      }

      const authResponse = isSignUp
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
              data: userData,
            },
          })
        : await supabase.auth.signInWithPassword({
            email,
            password,
          });

      const { error } = authResponse;

      if (error) {
        let description = "An error occurred during authentication. Please try again.";

        if (error.message.includes("Invalid login credentials")) {
          description = "Invalid email or password. Please check your credentials and try again.";
        } else if (error.message.includes("Email not confirmed")) {
          description = "Please check your email and verify your account before signing in.";
        } else if (error.message.includes("User already registered")) {
          description = "This email address is already registered. Please sign in instead.";
        }

        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description,
        });
        return;
      }

      if (!isSignUp && authResponse.data.user) {
        const isActive = await checkUserStatus(authResponse.data.user.id);

        if (!isActive) {
          await supabase.auth.signOut();
          await queryClient.removeQueries();

          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Your account is currently inactive. Please contact an administrator.",
          });
          return;
        }

        await queryClient.invalidateQueries();

        navigate('/users');
      }

      if (isSignUp) {
        toast({
          title: "Success",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error) {
      console.error("Unexpected auth error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    session,
    isLoading,
    handleAuth,
    handleSignOut,
  };
};
