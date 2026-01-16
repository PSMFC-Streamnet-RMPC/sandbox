import { Input } from "@/components/ui/input";

interface ProfileCommentsFieldProps {
  comments: string;
  onChange: (value: string) => void;
}

export const ProfileCommentsField = ({ comments, onChange }: ProfileCommentsFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#4A5D3F]">Comments</label>
      <Input
        value={comments}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter comments"
        className="w-full border-[#4A5D3F]/20 focus:border-[#4A5D3F] focus:ring-[#4A5D3F]"
      />
    </div>
  );
};
