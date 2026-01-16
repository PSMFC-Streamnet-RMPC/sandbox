import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: sessionData, isLoading: sessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', sessionData?.user?.id],
    enabled: !!sessionData?.user?.id,
    queryFn: async () => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', sessionData.user.id)
        .maybeSingle();

      if (error) throw error;
      return profile;
    },
  });

  useEffect(() => {
    if (!sessionLoading && !sessionData) {
      navigate('/auth');
    } else if (sessionData?.user?.id && !profileLoading && (!profileData || profileData.status !== 'active')) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: profileData ? "Your account is currently inactive. Please contact an administrator." : "No profile found. Please contact an administrator.",
      });
      supabase.auth.signOut().then(() => {
        navigate('/auth');
      });
    }
  }, [sessionLoading, profileLoading, sessionData, profileData, navigate, toast]);

  if (sessionLoading || (sessionData && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!sessionData || !profileData || profileData.status !== 'active') {
    return null;
  }

  return <>{children}</>;
}
