import { Input } from "@/components/ui/input";

interface ProfileNameFieldProps {
  name: string;
  onChange: (value: string) => void;
}

export const ProfileNameField = ({ name, onChange }: ProfileNameFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#4A5D3F]">Name</label>
      <Input
        value={name}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter name"
        className="border-[#4A5D3F]/20 focus:border-[#4A5D3F] focus:ring-[#4A5D3F]"
      />
    </div>
  );
};
