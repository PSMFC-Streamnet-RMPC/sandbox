import { useState, useEffect } from "react";
import { UserProfileData } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { ProfileEmailField } from "./profile/ProfileEmailField";
import { ProfileNameField } from "./profile/ProfileNameField";
import { ProfileAgencyField } from "./profile/ProfileAgencyField";
import { ProfileFolderField } from "./profile/ProfileFolderField";
import { ProfileCommentsField } from "./profile/ProfileCommentsField";

interface ProfileBasicInfoProps {
  userDetails: UserProfileData;
  onSave: (data: { name: string; agency: string; folder: string | null; comments: string | null }) => void;
  onClose?: () => void;
}

export const ProfileBasicInfo = ({ userDetails, onSave, onClose }: ProfileBasicInfoProps) => {
  const [name, setName] = useState(userDetails.name);
  const [agency, setAgency] = useState<string>(userDetails.agency || "");
  const [folder, setFolder] = useState(userDetails.folder || "");
  const [comments, setComments] = useState(userDetails.comments || "");

  useEffect(() => {
    setName(userDetails.name);
    setAgency(userDetails.agency || "");
    setFolder(userDetails.folder || "");
    setComments(userDetails.comments || "");
  }, [userDetails]);

  useEffect(() => {
    if (agency && (!folder || folder === agency.toLowerCase())) {
      setFolder(agency.toLowerCase());
    }
  }, [agency, folder]);

  const handleSave = () => {
    onSave({
      name,
      agency,
      folder: folder || null,
      comments: comments || null
    });
  };

  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-2 gap-3">
        <ProfileEmailField email={userDetails.email} />
        <ProfileNameField name={name} onChange={setName} />
        <ProfileAgencyField agency={agency} onChange={setAgency} />
        <ProfileFolderField folder={folder} onChange={setFolder} />
      </div>
      <ProfileCommentsField comments={comments} onChange={setComments} />
      <div className="flex justify-end gap-2">
        {onClose && (
          <Button variant="outline" onClick={onClose}>Close</Button>
        )}
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};
