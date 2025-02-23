
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
          organization_id: number | null
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
          organization_id?: number | null
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
          organization_id?: number | null
        }
      }
      organizations: {
        Row: {
          id: number
          name: string
          type: "client" | "partner" | "internal"
          address: string | null
          phone: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          type?: "client" | "partner" | "internal"
          address?: string | null
          phone?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          type?: "client" | "partner" | "internal"
          address?: string | null
          phone?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: number
          organization_id: number
          first_name: string
          last_name: string
          email: string
          phone: string | null
          role: string | null
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          organization_id: number
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          role?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          organization_id?: number
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          role?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      ticket_contacts: {
        Row: {
          ticket_id: number
          contact_id: number
          created_at: string
        }
        Insert: {
          ticket_id: number
          contact_id: number
          created_at?: string
        }
        Update: {
          ticket_id?: number
          contact_id?: number
          created_at?: string
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
