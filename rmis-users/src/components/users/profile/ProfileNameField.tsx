import { Input } from "@/components/ui/input";

interface ProfileNameFieldProps {
  name: string;
  onChange: (value: string) => void;
}

export const ProfileNameField = ({ name, onChange }: ProfileNameFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Name</label>
      <Input
        value={name}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter name"
        className="border-input focus:border-primary focus:ring-ring"
      />
    </div>
  );
};
