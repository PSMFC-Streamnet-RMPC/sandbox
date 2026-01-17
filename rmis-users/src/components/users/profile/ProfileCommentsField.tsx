import { Input } from "@/components/ui/input";

interface ProfileCommentsFieldProps {
  comments: string;
  onChange: (value: string) => void;
}

export const ProfileCommentsField = ({ comments, onChange }: ProfileCommentsFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Comments</label>
      <Input
        value={comments}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter comments"
        className="w-full border-input focus:border-primary focus:ring-ring"
      />
    </div>
  );
};
