import { Input } from "@/components/ui/input";

interface ProfileFolderFieldProps {
  folder: string;
  onChange: (value: string) => void;
}

export const ProfileFolderField = ({ folder, onChange }: ProfileFolderFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Folder</label>
      <Input
        value={folder}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Folder path"
        className="border-input focus:border-primary focus:ring-ring"
      />
    </div>
  );
};
