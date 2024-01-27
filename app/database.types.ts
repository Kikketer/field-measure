export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      demo: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      device_tokens: {
        Row: {
          device_id: string | null
          device_info: string | null
          id: number
          token: string
          user_id: number
        }
        Insert: {
          device_id?: string | null
          device_info?: string | null
          id?: never
          token: string
          user_id: number
        }
        Update: {
          device_id?: string | null
          device_info?: string | null
          id?: never
          token?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "device_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      fields: {
        Row: {
          active: boolean | null
          created_at: string
          custom_length: number | null
          custom_width: number | null
          deleted: boolean
          description: string | null
          group: string | null
          id: string
          last_painted: string | null
          locked: boolean | null
          marked_unplayable: string | null
          max_dry_days: number | null
          modified: string
          name: string
          paint_team_id: number | null
          predicted_next_paint: string | null
          rainfall_days: number | null
          rainfall_factor: number
          size: string
          sort_order: number | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          custom_length?: number | null
          custom_width?: number | null
          deleted?: boolean
          description?: string | null
          group?: string | null
          id?: string
          last_painted?: string | null
          locked?: boolean | null
          marked_unplayable?: string | null
          max_dry_days?: number | null
          modified?: string
          name: string
          paint_team_id?: number | null
          predicted_next_paint?: string | null
          rainfall_days?: number | null
          rainfall_factor?: number
          size?: string
          sort_order?: number | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          custom_length?: number | null
          custom_width?: number | null
          deleted?: boolean
          description?: string | null
          group?: string | null
          id?: string
          last_painted?: string | null
          locked?: boolean | null
          marked_unplayable?: string | null
          max_dry_days?: number | null
          modified?: string
          name?: string
          paint_team_id?: number | null
          predicted_next_paint?: string | null
          rainfall_days?: number | null
          rainfall_factor?: number
          size?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fields_paint_team_id_fkey"
            columns: ["paint_team_id"]
            isOneToOne: false
            referencedRelation: "decrypted_paintteam"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fields_paint_team_id_fkey"
            columns: ["paint_team_id"]
            isOneToOne: false
            referencedRelation: "paintteam"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          count: number
          date_sent: string | null
          id: number
          user_id: number
        }
        Insert: {
          count?: number
          date_sent?: string | null
          id?: never
          user_id: number
        }
        Update: {
          count?: number
          date_sent?: string | null
          id?: never
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      paint_history: {
        Row: {
          created_at: string
          days_unpainted: number | null
          field_id: string
          id: number
          rainfall_days: number | null
          rainfall_factor: number | null
        }
        Insert: {
          created_at?: string
          days_unpainted?: number | null
          field_id: string
          id?: never
          rainfall_days?: number | null
          rainfall_factor?: number | null
        }
        Update: {
          created_at?: string
          days_unpainted?: number | null
          field_id?: string
          id?: never
          rainfall_days?: number | null
          rainfall_factor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "paint_history_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          }
        ]
      }
      paintteam: {
        Row: {
          created_at: string
          google_api_token: string | null
          id: number
          name: string
          schedule_sheet_date_column: string | null
          schedule_sheet_field_name_column: string | null
          schedule_sheet_url: string | null
          zipcode: string
        }
        Insert: {
          created_at?: string
          google_api_token?: string | null
          id?: never
          name: string
          schedule_sheet_date_column?: string | null
          schedule_sheet_field_name_column?: string | null
          schedule_sheet_url?: string | null
          zipcode?: string
        }
        Update: {
          created_at?: string
          google_api_token?: string | null
          id?: never
          name?: string
          schedule_sheet_date_column?: string | null
          schedule_sheet_field_name_column?: string | null
          schedule_sheet_url?: string | null
          zipcode?: string
        }
        Relationships: []
      }
      rainfall_history: {
        Row: {
          created_at: string
          id: number
          quantity: number
          zipcode: string
        }
        Insert: {
          created_at?: string
          id?: number
          quantity: number
          zipcode: string
        }
        Update: {
          created_at?: string
          id?: number
          quantity?: number
          zipcode?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: number
          paint_team_id: number
          user_auth_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: never
          paint_team_id: number
          user_auth_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: never
          paint_team_id?: number
          user_auth_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_paint_team_id_fkey"
            columns: ["paint_team_id"]
            isOneToOne: false
            referencedRelation: "decrypted_paintteam"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_paint_team_id_fkey"
            columns: ["paint_team_id"]
            isOneToOne: false
            referencedRelation: "paintteam"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      decrypted_paintteam: {
        Row: {
          created_at: string | null
          decrypted_google_api_token: string | null
          google_api_token: string | null
          id: number | null
          name: string | null
          schedule_sheet_date_column: string | null
          schedule_sheet_field_name_column: string | null
          schedule_sheet_url: string | null
          zipcode: string | null
        }
        Insert: {
          created_at?: string | null
          decrypted_google_api_token?: never
          google_api_token?: string | null
          id?: number | null
          name?: string | null
          schedule_sheet_date_column?: string | null
          schedule_sheet_field_name_column?: string | null
          schedule_sheet_url?: string | null
          zipcode?: string | null
        }
        Update: {
          created_at?: string | null
          decrypted_google_api_token?: never
          google_api_token?: string | null
          id?: number | null
          name?: string | null
          schedule_sheet_date_column?: string | null
          schedule_sheet_field_name_column?: string | null
          schedule_sheet_url?: string | null
          zipcode?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      increment_rainfall: {
        Args: {
          paint_team_id: number
          zipcode: string
        }
        Returns: undefined
      }
      set_predicted_paint: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      weather_fetch_log: {
        Args: {
          zipcode: string
          quantity: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
