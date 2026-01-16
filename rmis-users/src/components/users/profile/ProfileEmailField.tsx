import { Input } from "@/components/ui/input";

interface ProfileEmailFieldProps {
  email: string;
}

export const ProfileEmailField = ({ email }: ProfileEmailFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#4A5D3F]">Email</label>
      <Input
        value={email}
        readOnly
        className="bg-[#F2FCE2] border-[#4A5D3F]/20 focus:border-[#4A5D3F] focus:ring-[#4A5D3F]"
      />
    </div>
  );
};
