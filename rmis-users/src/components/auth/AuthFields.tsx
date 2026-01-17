import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFieldsProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

export const AuthFields = ({ email, setEmail, password, setPassword }: AuthFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-input focus:border-primary focus:ring-ring"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground">
          Password <span className="text-red-500">*</span>
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="border-input focus:border-primary focus:ring-ring"
        />
        <p className="text-sm text-foreground/70 mt-1">
          Note: Your password is securely encrypted and cannot be viewed by administrators.
        </p>
      </div>
    </>
  );
};
