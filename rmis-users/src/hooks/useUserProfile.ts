import { useProfileData } from "./user/useProfileData";
import { useProfileMutations } from "./user/useProfileMutations";

export const useUserProfile = (userId: string) => {
  const { data: userDetails, isLoading } = useProfileData(userId);
  const mutations = useProfileMutations(userId);

  return {
    userDetails,
    isLoading,
    ...mutations,
  };
};

export type { UserProfileData } from "@/types/user";
