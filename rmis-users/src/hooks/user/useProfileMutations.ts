import { useProfileRoleMutation } from "./mutations/useProfileRoleMutation";
import { useProfileStatusMutation } from "./mutations/useProfileStatusMutation";
import { useProfileDataSubmitterMutation } from "./mutations/useProfileDataSubmitterMutation";
import { useProfileUpdateMutation } from "./mutations/useProfileUpdateMutation";
import { useProfileDeleteMutation } from "./mutations/useProfileDeleteMutation";

export const useProfileMutations = (userId: string) => {
  const updateRole = useProfileRoleMutation(userId);
  const updateStatus = useProfileStatusMutation(userId);
  const updateDataSubmitter = useProfileDataSubmitterMutation(userId);
  const updateProfile = useProfileUpdateMutation(userId);
  const deleteProfile = useProfileDeleteMutation(userId);

  return {
    updateRole,
    updateStatus,
    updateProfile,
    updateDataSubmitter,
    deleteProfile,
  };
};
