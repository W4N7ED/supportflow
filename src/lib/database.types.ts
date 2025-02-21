
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
      tickets: {
        Row: {
          id: number
          title: string
          description: string | null
          priority: "low" | "medium" | "high"
          status: "open" | "in-progress" | "resolved" | "closed"
          created_at: string
          updated_at: string
          assigned_to: string | null
          created_by: string
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          priority: "low" | "medium" | "high"
          status?: "open" | "in-progress" | "resolved" | "closed"
          created_at?: string
          updated_at?: string
          assigned_to?: string | null
          created_by: string
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          priority?: "low" | "medium" | "high"
          status?: "open" | "in-progress" | "resolved" | "closed"
          created_at?: string
          updated_at?: string
          assigned_to?: string | null
          created_by?: string
        }
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
  }
}
