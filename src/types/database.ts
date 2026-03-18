// Tipos generados del schema de Supabase
// Actualizar con: supabase gen types typescript --project-id flqwoynwdbmbkyyslxob

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type ClientStatus = 'active' | 'paused' | 'archived'
export type DataSourceType = 'google_ads' | 'meta_ads' | 'google_analytics' | 'search_console' | 'email_marketing' | 'linkedin_ads' | 'manual'
export type ReportStatus = 'draft' | 'generated' | 'sent' | 'scheduled'
export type WidgetType = 'kpi_card' | 'line_chart' | 'bar_chart' | 'area_chart' | 'pie_chart' | 'data_table' | 'text_block' | 'comparison' | 'funnel'
export type ScheduleFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly'
export type CurrencyType = 'USD' | 'ARS'

export interface Database {
  public: {
    Tables: {
      agencies: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          contact_email: string | null
          website: string | null
          timezone: string
          default_currency: CurrencyType
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['agencies']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['agencies']['Insert']>
      }
      users: {
        Row: {
          id: string
          agency_id: string
          full_name: string
          email: string
          avatar_url: string | null
          role: 'owner' | 'admin' | 'member' | 'viewer'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      clients: {
        Row: {
          id: string
          agency_id: string
          name: string
          slug: string
          industry: string | null
          logo_url: string | null
          brand_color: string | null
          contact_name: string | null
          contact_email: string | null
          website: string | null
          notes: string | null
          currency: CurrencyType
          status: ClientStatus
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['clients']['Insert']>
      }
      data_sources: {
        Row: {
          id: string
          client_id: string
          agency_id: string
          source_type: DataSourceType
          display_name: string
          credentials: Json
          config: Json
          is_active: boolean
          last_sync_at: string | null
          last_sync_status: string | null
          last_sync_error: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['data_sources']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['data_sources']['Insert']>
      }
      report_templates: {
        Row: {
          id: string
          agency_id: string
          name: string
          description: string | null
          category: string
          default_widgets: Json
          layout_config: Json
          is_shared: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['report_templates']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['report_templates']['Insert']>
      }
      reports: {
        Row: {
          id: string
          agency_id: string
          client_id: string
          template_id: string | null
          title: string
          description: string | null
          status: ReportStatus
          date_from: string
          date_to: string
          config: Json
          public_url: string | null
          public_token: string | null
          sent_at: string | null
          sent_to: string[] | null
          opened_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['reports']['Insert']>
      }
      report_widgets: {
        Row: {
          id: string
          report_id: string
          widget_type: WidgetType
          title: string | null
          position_order: number
          grid_col_span: number
          config: Json
          cached_data: Json | null
          cached_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['report_widgets']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['report_widgets']['Insert']>
      }
      metrics_cache: {
        Row: {
          id: string
          data_source_id: string
          client_id: string
          metric_date: string
          impressions: number
          clicks: number
          conversions: number
          cost: number
          revenue: number
          ctr: number | null
          cpc: number | null
          cpa: number | null
          roas: number | null
          extra_metrics: Json
          campaign_name: string | null
          ad_group_name: string | null
          channel: string | null
          device: string | null
          country: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['metrics_cache']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['metrics_cache']['Insert']>
      }
      report_schedules: {
        Row: {
          id: string
          agency_id: string
          client_id: string
          template_id: string
          frequency: ScheduleFrequency
          send_day: number
          send_hour: number
          recipients: string[]
          is_active: boolean
          include_pdf: boolean
          custom_subject: string | null
          custom_message: string | null
          last_sent_at: string | null
          next_send_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['report_schedules']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['report_schedules']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: {
      get_user_agency_id: { Args: Record<string, never>; Returns: string }
      generate_slug: { Args: { input_text: string }; Returns: string }
      get_client_metrics_summary: {
        Args: { p_client_id: string; p_date_from: string; p_date_to: string }
        Returns: { total_impressions: number; total_clicks: number; total_conversions: number; total_cost: number; total_revenue: number; avg_ctr: number; avg_cpc: number; avg_cpa: number; avg_roas: number }[]
      }
      get_client_metrics_comparison: {
        Args: { p_client_id: string; p_date_from: string; p_date_to: string }
        Returns: { metric_name: string; current_value: number; previous_value: number; change_pct: number }[]
      }
    }
    Enums: {
      client_status: ClientStatus
      data_source_type: DataSourceType
      report_status: ReportStatus
      widget_type: WidgetType
      schedule_frequency: ScheduleFrequency
      currency_type: CurrencyType
    }
  }
}
