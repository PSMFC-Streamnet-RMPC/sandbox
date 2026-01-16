export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type AppRole = "admin" | "user" | "guest"

export type Database = {
  public: {
    Tables: {
      agencies: {
        Row: {
          agency: string | null
          agency_name: string | null
          id: string
          location_agency: string | null
          release_agency: string | null
          reporting_agency: string | null
          sampling_agency: string | null
        }
        Insert: {
          agency?: string | null
          agency_name?: string | null
          id?: string
          location_agency?: string | null
          release_agency?: string | null
          reporting_agency?: string | null
          sampling_agency?: string | null
        }
        Update: {
          agency?: string | null
          agency_name?: string | null
          id?: string
          location_agency?: string | null
          release_agency?: string | null
          reporting_agency?: string | null
          sampling_agency?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          agency: string
          api_key: string
          comments: string | null
          created_at: string
          data_submitter: boolean
          folder: string | null
          id: string
          name: string
          organization: string | null
          status: string
          updated_at: string
        }
        Insert: {
          agency?: string
          api_key?: string
          comments?: string | null
          created_at?: string
          data_submitter?: boolean
          folder?: string | null
          id: string
          name?: string
          organization?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          agency?: string
          api_key?: string
          comments?: string | null
          created_at?: string
          data_submitter?: boolean
          folder?: string | null
          id?: string
          name?: string
          organization?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_agency_fkey"
            columns: ["agency"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["agency"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: AppRole
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: AppRole
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: AppRole
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey_profiles"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: { role: AppRole; user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "guest"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
