import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignUpFields } from "./SignUpFields";
import { AuthFields } from "./AuthFields";

interface AuthFormProps {
  onSubmit: (email: string, password: string, userData?: { name: string; agency: string }) => void;
  isLoading: boolean;
  isSignUp: boolean;
  onToggleMode: () => void;
}

export const AuthForm = ({ onSubmit, isLoading, isSignUp, onToggleMode }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [agency, setAgency] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (!name.trim()) {
        return;
      }
      onSubmit(email, password, { name, agency });
    } else {
      onSubmit(email, password);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignUp && (
        <SignUpFields
          key="signup-fields"
          name={name}
          setName={setName}
          agency={agency}
          setAgency={setAgency}
        />
      )}
      <AuthFields
        key="auth-fields"
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
      <Button
        type="submit"
        className="w-full bg-[#4A5D3F] hover:bg-[#4A5D3F]/90"
        disabled={isLoading || (isSignUp && !name.trim())}
      >
        <Mail className="mr-2 h-4 w-4" />
        {isSignUp ? "Sign up" : "Sign in"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full text-[#4A5D3F] hover:text-[#4A5D3F]/90 hover:bg-[#F2FCE2]"
        onClick={onToggleMode}
      >
        {isSignUp
          ? "Already have an account? Sign in"
          : "Don't have an account? Sign up"}
      </Button>
    </form>
  );
};
