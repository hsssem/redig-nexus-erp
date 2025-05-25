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
      clients: {
        Row: {
          classification: string | null
          company_name: string
          created_at: string | null
          id: string
          industry: string | null
          manager: string | null
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          classification?: string | null
          company_name: string
          created_at?: string | null
          id?: string
          industry?: string | null
          manager?: string | null
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          classification?: string | null
          company_name?: string
          created_at?: string | null
          id?: string
          industry?: string | null
          manager?: string | null
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          client_id: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          image_url: string | null
          job_title: string | null
          notes: string | null
          phone: string | null
          updated_at: string | null
          user_id: string
          whatsapp: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          image_url?: string | null
          job_title?: string | null
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id: string
          whatsapp?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          image_url?: string | null
          job_title?: string | null
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      helpdesk_tickets: {
        Row: {
          assigned_to: string | null
          attachment_url: string | null
          created_at: string | null
          description: string | null
          id: string
          priority: string | null
          status: string | null
          subject: string
          submitted_by: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          attachment_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          subject: string
          submitted_by?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          attachment_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          subject?: string
          submitted_by?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          quantity: number
          total: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          quantity?: number
          total?: number
          unit_price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          total?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string | null
          due_date: string
          id: string
          issue_date: string
          notes: string | null
          number: string
          project_id: string | null
          status: string | null
          subtotal: number
          tax: number
          total: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          due_date: string
          id?: string
          issue_date: string
          notes?: string | null
          number: string
          project_id?: string | null
          status?: string | null
          subtotal: number
          tax: number
          total: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          due_date?: string
          id?: string
          issue_date?: string
          notes?: string | null
          number?: string
          project_id?: string | null
          status?: string | null
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string
          estimated_budget: number
          id: string
          name: string
          negative_qualities: string | null
          notes: string | null
          percentage: number
          phone: string | null
          positive_qualities: string | null
          source: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          estimated_budget?: number
          id?: string
          name: string
          negative_qualities?: string | null
          notes?: string | null
          percentage?: number
          phone?: string | null
          positive_qualities?: string | null
          source: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          estimated_budget?: number
          id?: string
          name?: string
          negative_qualities?: string | null
          notes?: string | null
          percentage?: number
          phone?: string | null
          positive_qualities?: string | null
          source?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          created_at: string | null
          datetime: string
          id: string
          notes: string | null
          participants: string[] | null
          project_id: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          datetime: string
          id?: string
          notes?: string | null
          participants?: string[] | null
          project_id?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          datetime?: string
          id?: string
          notes?: string | null
          participants?: string[] | null
          project_id?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          client_id: string | null
          created_at: string | null
          duration_days: number | null
          id: string
          manager: string | null
          name: string
          notes: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          budget?: number | null
          client_id?: string | null
          created_at?: string | null
          duration_days?: number | null
          id?: string
          manager?: string | null
          name: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          budget?: number | null
          client_id?: string | null
          created_at?: string | null
          duration_days?: number | null
          id?: string
          manager?: string | null
          name?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          duration: number | null
          id: string
          name: string
          project_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          name: string
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          name?: string
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          currency_code: string
          currency_symbol: string
          id: string
          tax_enabled: boolean
          tax_name: string
          tax_rate: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency_code?: string
          currency_symbol?: string
          id?: string
          tax_enabled?: boolean
          tax_name?: string
          tax_rate?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency_code?: string
          currency_symbol?: string
          id?: string
          tax_enabled?: boolean
          tax_name?: string
          tax_rate?: number
          updated_at?: string
          user_id?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
