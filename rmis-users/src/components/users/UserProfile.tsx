import { Loader2, Fish, Trash2 } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ProfileBasicInfo } from "./ProfileBasicInfo";
import { ProfileRoleStatus } from "./ProfileRoleStatus";
import { ProfileApiKey } from "./ProfileApiKey";
import { useState } from "react";
import { AppRole } from "@/integrations/supabase/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface UserProfileProps {
  userId: string;
  onClose?: () => void;
}

export const UserProfile = ({ userId, onClose }: UserProfileProps) => {
  const {
    userDetails,
    isLoading,
    updateRole,
    updateStatus,
    updateProfile,
    updateDataSubmitter,
    deleteProfile,
  } = useUserProfile(userId);

  const [role, setRole] = useState<AppRole | null>(null);
  const [status, setStatus] = useState<'active' | 'inactive' | null>(null);
  const [isDataSubmitter, setIsDataSubmitter] = useState<boolean | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userDetails) {
    return <div>User not found</div>;
  }

  const handleProfileUpdate = async (data: { name: string; agency: string; folder: string | null; comments: string | null }) => {
    try {
      await updateProfile.mutateAsync(data);

      if (role !== null && role !== userDetails.role) {
        await updateRole.mutateAsync(role);
      }

      if (status !== null && status !== userDetails.status) {
        await updateStatus.mutateAsync(status);
      }

      if (isDataSubmitter !== null && isDataSubmitter !== userDetails.data_submitter) {
        await updateDataSubmitter.mutateAsync(isDataSubmitter);
      }

      setRole(null);
      setStatus(null);
      setIsDataSubmitter(null);

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProfile.mutateAsync();
      setShowDeleteDialog(false);
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3 border-b border-border pb-3">
        <Fish className="h-6 w-6 text-primary animate-[bounce_2s_ease-in-out_infinite]" />
        <h2 className="text-xl font-semibold text-foreground">User Profile</h2>
      </div>
      <div className="space-y-5">
        <ProfileBasicInfo
          userDetails={userDetails}
          onSave={handleProfileUpdate}
          onClose={onClose}
        />
        <div className="border-t border-border pt-5">
          <ProfileRoleStatus
            userDetails={userDetails}
            onRoleChange={setRole}
            onStatusChange={setStatus}
            onDataSubmitterChange={setIsDataSubmitter}
            pendingRole={role}
            pendingStatus={status}
            pendingDataSubmitter={isDataSubmitter}
          />
        </div>
        <div className="border-t border-border pt-5">
          <ProfileApiKey
            apiKey={userDetails.api_key}
            userEmail={userDetails.email}
            userName={userDetails.name}
            userId={userDetails.id}
          />
        </div>
        <Accordion type="single" collapsible className="border-t border-destructive/20 pt-5">
          <AccordionItem value="danger-zone" className="border-none">
            <AccordionTrigger className="text-sm font-medium text-destructive hover:no-underline">
              Danger Zone
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex items-start justify-between gap-4 pt-2">
                <p className="text-xs text-muted-foreground flex-1">
                  Deleting a user will mark them as deleted and disable their account, but preserve their data.
                </p>
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Delete User
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will mark the user as deleted and disable their account. Their data will be preserved for record keeping.
                        This action can be reversed by changing their status back to active.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete User
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
