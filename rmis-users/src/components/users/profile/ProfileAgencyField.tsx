import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAgencies } from "@/hooks/useAgencies";

interface ProfileAgencyFieldProps {
  agency: string;
  onChange: (value: string) => void;
}

export const ProfileAgencyField = ({ agency, onChange }: ProfileAgencyFieldProps) => {
  const { data: agencies, isLoading: isLoadingAgencies } = useAgencies();

  const getAgencyDisplayName = (agency: string, agencyName: string | null) => {
    return `${agency}${agencyName ? ` | ${agencyName}` : ''}`;
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Agency</label>
      <Select
        value={agency}
        onValueChange={onChange}
        disabled={isLoadingAgencies}
      >
        <SelectTrigger className="border-input focus:ring-ring">
          <SelectValue placeholder="Select agency" />
        </SelectTrigger>
        <SelectContent>
          {agencies?.map((a) => (
            <SelectItem
              key={a.agency}
              value={a.agency || ""}
              className="hover:bg-accent focus:bg-accent"
            >
              {getAgencyDisplayName(a.agency || "", a.agency_name)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
