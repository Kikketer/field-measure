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
      fields: {
        Row: {
          _deleted: boolean
          _modified: string
          active: boolean | null
          code: string
          created_at: string
          custom_length: number | null
          custom_width: number | null
          description: string | null
          id: string
          last_painted: string | null
          marked_unplayable: string | null
          max_dry_days: number | null
          name: string
          rainfall_days: number | null
          rainfall_factor: number
          should_paint: number | null
          size: string
          sort_order: number | null
        }
        Insert: {
          _deleted?: boolean
          _modified?: string
          active?: boolean | null
          code: string
          created_at?: string
          custom_length?: number | null
          custom_width?: number | null
          description?: string | null
          id?: string
          last_painted?: string | null
          marked_unplayable?: string | null
          max_dry_days?: number | null
          name: string
          rainfall_days?: number | null
          rainfall_factor?: number
          should_paint?: number | null
          size?: string
          sort_order?: number | null
        }
        Update: {
          _deleted?: boolean
          _modified?: string
          active?: boolean | null
          code?: string
          created_at?: string
          custom_length?: number | null
          custom_width?: number | null
          description?: string | null
          id?: string
          last_painted?: string | null
          marked_unplayable?: string | null
          max_dry_days?: number | null
          name?: string
          rainfall_days?: number | null
          rainfall_factor?: number
          should_paint?: number | null
          size?: string
          sort_order?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
