import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Fish } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthFlow } from "@/hooks/useAuthFlow";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { session, isLoading, handleAuth } = useAuthFlow();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/users");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F2FCE2] to-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#4A5D3F]/10">
        <div className="flex flex-col items-center space-y-2">
          <Fish className="h-12 w-12 text-[#4A5D3F] animate-[bounce_2s_ease-in-out_infinite]" />
          <h1 className="text-2xl font-bold text-[#4A5D3F]">
            RMIS User Management
          </h1>
          <p className="text-[#4A5D3F]/70">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        <AuthForm
          onSubmit={handleAuth}
          isLoading={isLoading}
          isSignUp={isSignUp}
          onToggleMode={() => setIsSignUp(!isSignUp)}
        />
      </div>
    </div>
  );
};

export default Auth;
