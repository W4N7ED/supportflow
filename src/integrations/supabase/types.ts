export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: number
          is_primary: boolean | null
          last_name: string
          organization_id: number | null
          phone: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: number
          is_primary?: boolean | null
          last_name: string
          organization_id?: number | null
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: number
          is_primary?: boolean | null
          last_name?: string
          organization_id?: number | null
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      email_config: {
        Row: {
          check_interval: number
          created_at: string
          email_server: string
          folder: string
          id: number
          password: string
          updated_at: string
          username: string
        }
        Insert: {
          check_interval?: number
          created_at?: string
          email_server: string
          folder?: string
          id?: number
          password: string
          updated_at?: string
          username: string
        }
        Update: {
          check_interval?: number
          created_at?: string
          email_server?: string
          folder?: string
          id?: number
          password?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: number
          is_internal: boolean | null
          sender_id: string | null
          ticket_id: number | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          is_internal?: boolean | null
          sender_id?: string | null
          ticket_id?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          is_internal?: boolean | null
          sender_id?: string | null
          ticket_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          created_at: string
          id: number
          name: string
          phone: string | null
          type: Database["public"]["Enums"]["organization_type"]
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: number
          name: string
          phone?: string | null
          type?: Database["public"]["Enums"]["organization_type"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: number
          name?: string
          phone?: string | null
          type?: Database["public"]["Enums"]["organization_type"]
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      ticket_contacts: {
        Row: {
          contact_id: number
          created_at: string
          ticket_id: number
        }
        Insert: {
          contact_id: number
          created_at?: string
          ticket_id: number
        }
        Update: {
          contact_id?: number
          created_at?: string
          ticket_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ticket_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_contacts_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          actual_behavior: string | null
          assigned_to: string | null
          attempted_actions: string | null
          availability_slots: string | null
          browser_version: string | null
          category: Database["public"]["Enums"]["ticket_category"] | null
          contact_person: string | null
          context: string | null
          created_at: string
          created_by: string
          description: string | null
          email_conversation_id: string | null
          email_source: string | null
          equipment: Database["public"]["Enums"]["equipment_type"] | null
          expected_behavior: string | null
          id: number
          impacted_user: string | null
          last_email_date: string | null
          organization_id: number | null
          priority: string
          reproducibility: string | null
          request_type: Database["public"]["Enums"]["ticket_type"] | null
          screenshot_url: string | null
          software_version: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          actual_behavior?: string | null
          assigned_to?: string | null
          attempted_actions?: string | null
          availability_slots?: string | null
          browser_version?: string | null
          category?: Database["public"]["Enums"]["ticket_category"] | null
          contact_person?: string | null
          context?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          email_conversation_id?: string | null
          email_source?: string | null
          equipment?: Database["public"]["Enums"]["equipment_type"] | null
          expected_behavior?: string | null
          id?: number
          impacted_user?: string | null
          last_email_date?: string | null
          organization_id?: number | null
          priority: string
          reproducibility?: string | null
          request_type?: Database["public"]["Enums"]["ticket_type"] | null
          screenshot_url?: string | null
          software_version?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          actual_behavior?: string | null
          assigned_to?: string | null
          attempted_actions?: string | null
          availability_slots?: string | null
          browser_version?: string | null
          category?: Database["public"]["Enums"]["ticket_category"] | null
          contact_person?: string | null
          context?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          email_conversation_id?: string | null
          email_source?: string | null
          equipment?: Database["public"]["Enums"]["equipment_type"] | null
          expected_behavior?: string | null
          id?: number
          impacted_user?: string | null
          last_email_date?: string | null
          organization_id?: number | null
          priority?: string
          reproducibility?: string | null
          request_type?: Database["public"]["Enums"]["ticket_type"] | null
          screenshot_url?: string | null
          software_version?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      equipment_type: "pc" | "mobile" | "server" | "other"
      organization_type: "client" | "partner" | "internal"
      ticket_category:
        | "hardware"
        | "software"
        | "network"
        | "specific_application"
      ticket_priority: "urgent" | "high" | "medium" | "low"
      ticket_type: "incident" | "anomaly" | "improvement" | "question"
      user_role: "user" | "technician" | "admin"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
