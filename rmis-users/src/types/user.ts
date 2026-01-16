import { AppRole } from "@/integrations/supabase/types";

export type User = {
  id: string;
  email: string;
  role: string;
  name: string;
  agency: string | null;
  status: 'active' | 'inactive' | 'deleted';
  data_submitter: boolean;
  folder: string | null;
};

export type UserProfileData = {
  id: string;
  name: string;
  agency: string | null;
  api_key: string;
  status: 'active' | 'inactive' | 'deleted';
  role: AppRole;
  data_submitter: boolean;
  email: string;
  folder: string | null;
  comments: string | null;
};
