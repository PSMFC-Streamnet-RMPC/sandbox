import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AppRole } from "@/integrations/supabase/types";
import { UserProfileData } from "@/hooks/useUserProfile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProfileRoleStatusProps {
  userDetails: UserProfileData;
  onRoleChange: (role: AppRole) => void;
  onStatusChange: (status: 'active' | 'inactive') => void;
  onDataSubmitterChange: (isDataSubmitter: boolean) => void;
  pendingRole: AppRole | null;
  pendingStatus: 'active' | 'inactive' | null;
  pendingDataSubmitter: boolean | null;
}

export const ProfileRoleStatus = ({
  userDetails,
  onRoleChange,
  onStatusChange,
  onDataSubmitterChange,
  pendingRole,
  pendingStatus,
  pendingDataSubmitter,
}: ProfileRoleStatusProps) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);

  useEffect(() => {
    const checkCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);

        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        setIsCurrentUserAdmin(data?.role === 'admin');
      }
    };

    checkCurrentUser();
  }, []);

  const isEditingSelf = currentUserId === userDetails.id && isCurrentUserAdmin;

  const currentRole = pendingRole ?? userDetails.role;
  const currentStatus = pendingStatus ?? userDetails.status;
  const currentDataSubmitter = pendingDataSubmitter ?? userDetails.data_submitter;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Role</label>
          <Select
            value={currentRole}
            onValueChange={(value: AppRole) => onRoleChange(value)}
            disabled={isEditingSelf}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="guest">Guest</SelectItem>
            </SelectContent>
          </Select>
          {isEditingSelf && (
            <p className="text-xs text-muted-foreground">
              Cannot change own role
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Data Submitter</label>
          <div className="flex items-center space-x-2 h-10">
            <Switch
              checked={currentDataSubmitter}
              onCheckedChange={onDataSubmitterChange}
            />
            <span className="text-sm text-muted-foreground">
              {currentDataSubmitter ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Status</label>
          <div className="flex items-center space-x-2 h-10">
            <Switch
              checked={currentStatus === 'active'}
              onCheckedChange={(checked) =>
                onStatusChange(checked ? 'active' : 'inactive')
              }
              disabled={isEditingSelf}
            />
            <span className="text-sm text-muted-foreground">
              {currentStatus === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
          {isEditingSelf && (
            <p className="text-xs text-muted-foreground">
              Cannot deactivate own account
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
