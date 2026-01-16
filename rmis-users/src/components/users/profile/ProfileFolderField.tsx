import { Input } from "@/components/ui/input";

interface ProfileFolderFieldProps {
  folder: string;
  onChange: (value: string) => void;
}

export const ProfileFolderField = ({ folder, onChange }: ProfileFolderFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#4A5D3F]">Folder</label>
      <Input
        value={folder}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Folder path"
        className="border-[#4A5D3F]/20 focus:border-[#4A5D3F] focus:ring-[#4A5D3F]"
      />
    </div>
  );
};
