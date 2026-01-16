import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProfileAgencyField } from "@/components/users/profile/ProfileAgencyField";

interface SignUpFieldsProps {
  name: string;
  setName: (name: string) => void;
  agency: string;
  setAgency: (agency: string) => void;
}

export const SignUpFields = ({ name, setName, agency, setAgency }: SignUpFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-[#4A5D3F]">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border-[#4A5D3F]/20 focus:border-[#4A5D3F] focus:ring-[#4A5D3F]"
        />
      </div>
      <ProfileAgencyField
        agency={agency}
        onChange={setAgency}
      />
    </>
  );
};
