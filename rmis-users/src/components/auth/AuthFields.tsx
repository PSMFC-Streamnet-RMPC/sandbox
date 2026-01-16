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
        <Label htmlFor="email" className="text-[#4A5D3F]">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-[#4A5D3F]/20 focus:border-[#4A5D3F] focus:ring-[#4A5D3F]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-[#4A5D3F]">
          Password <span className="text-red-500">*</span>
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="border-[#4A5D3F]/20 focus:border-[#4A5D3F] focus:ring-[#4A5D3F]"
        />
        <p className="text-sm text-[#4A5D3F]/70 mt-1">
          Note: Your password is securely encrypted and cannot be viewed by administrators.
        </p>
      </div>
    </>
  );
};
