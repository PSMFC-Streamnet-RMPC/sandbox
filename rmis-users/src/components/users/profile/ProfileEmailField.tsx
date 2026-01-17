import { Input } from "@/components/ui/input";

interface ProfileEmailFieldProps {
  email: string;
}

export const ProfileEmailField = ({ email }: ProfileEmailFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Email</label>
      <Input
        value={email}
        readOnly
        className="bg-muted border-input focus:border-primary focus:ring-ring"
      />
    </div>
  );
};
