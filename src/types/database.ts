// Tipos generados de Supabase — se reemplazarán con `supabase gen types` cuando se conecte la DB

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
      agencies: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['agencies']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['agencies']['Insert']>
      }
      clients: {
        Row: {
          id: string
          agency_id: string
          name: string
          email: string | null
          status: 'active' | 'inactive'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['clients']['Insert']>
      }
      reports: {
        Row: {
          id: string
          agency_id: string
          client_id: string
          title: string
          status: 'draft' | 'scheduled' | 'sent'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['reports']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
