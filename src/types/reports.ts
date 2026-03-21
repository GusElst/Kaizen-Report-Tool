// Tipos del Report Builder — Kaizen Report Tool

// === Canales disponibles ===
export type ChannelType =
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'linkedin'
  | 'meta_ads'
  | 'instagram_ads'
  | 'custom'

export const CHANNEL_CONFIG: Record<ChannelType, { label: string; color: string; icon: string }> = {
  facebook: { label: 'Facebook', color: '#1877F2', icon: 'facebook' },
  instagram: { label: 'Instagram', color: '#E1306C', icon: 'instagram' },
  tiktok: { label: 'TikTok', color: '#69C9D0', icon: 'music-2' },
  linkedin: { label: 'LinkedIn', color: '#0A66C2', icon: 'linkedin' },
  meta_ads: { label: 'Meta Ads', color: '#0081FB', icon: 'megaphone' },
  instagram_ads: { label: 'Instagram Ads', color: '#E1306C', icon: 'image' },
  custom: { label: 'Personalizado', color: '#f26c09', icon: 'layout-grid' },
}

// === Tipos de widget ===
export type WidgetType =
  | 'kpi_card'
  | 'line_chart'
  | 'bar_chart'
  | 'area_chart'
  | 'pie_chart'
  | 'data_table'
  | 'text_block'

// === Formato de valores ===
export type ValueFormat = 'number' | 'currency_ars' | 'currency_usd' | 'percent' | 'time' | 'text'

// === Configuración de KPI Card ===
export interface KPIConfig {
  metricKey: string
  label: string
  value: number | string
  format: ValueFormat
  change?: number | null       // porcentaje de cambio vs período anterior
  previousValue?: number | null
  channel: ChannelType
}

// === Configuración de gráficos ===
export interface ChartSeries {
  key: string
  label: string
  color: string
  data: Array<{ date: string; value: number }>
}

export interface ChartConfig {
  title: string
  subtitle?: string
  series: ChartSeries[]
  xAxisKey: string
  granularity: 'daily' | 'weekly' | 'monthly'
  stacked?: boolean
  horizontal?: boolean // solo para bar chart
}

// === Configuración de tablas ===
export interface TableColumn {
  key: string
  label: string
  format?: ValueFormat
  sortable?: boolean
}

export interface TableConfig {
  title: string
  columns: TableColumn[]
  rows: Record<string, unknown>[]
  showTotals?: boolean
  variant: 'posts' | 'campaigns' | 'custom'
}

// === Configuración de bloque de texto ===
export interface TextBlockConfig {
  content: string // HTML simple (negrita, cursiva, listas)
  placeholder?: string
}

// === Widget unificado ===
export type WidgetConfig =
  | { type: 'kpi_card'; data: KPIConfig }
  | { type: 'line_chart'; data: ChartConfig }
  | { type: 'bar_chart'; data: ChartConfig }
  | { type: 'area_chart'; data: ChartConfig }
  | { type: 'pie_chart'; data: ChartConfig }
  | { type: 'data_table'; data: TableConfig }
  | { type: 'text_block'; data: TextBlockConfig }

// === Widget dentro de una sección ===
export interface ReportWidget {
  id: string
  config: WidgetConfig
  colSpan: 1 | 2 | 3 | 4
}

// === Sección del reporte ===
export interface ReportSection {
  id: string
  name: string
  channel: ChannelType
  widgets: ReportWidget[]
}

// === Estado completo del builder ===
export interface ReportBuilderState {
  reportId: string | null
  title: string
  clientId: string | null
  dateFrom: string
  dateTo: string
  sections: ReportSection[]
  activeSectionId: string | null
  activeWidgetId: string | null
  isDirty: boolean
}

// === Acciones del reducer ===
export type ReportBuilderAction =
  | { type: 'SET_REPORT_META'; payload: { title?: string; clientId?: string; dateFrom?: string; dateTo?: string } }
  | { type: 'LOAD_REPORT'; payload: ReportBuilderState }
  | { type: 'ADD_SECTION'; payload: { channel: ChannelType; name?: string } }
  | { type: 'REMOVE_SECTION'; payload: { sectionId: string } }
  | { type: 'UPDATE_SECTION'; payload: { sectionId: string; name?: string; channel?: ChannelType } }
  | { type: 'REORDER_SECTION'; payload: { sectionId: string; direction: 'up' | 'down' } }
  | { type: 'SELECT_SECTION'; payload: { sectionId: string } }
  | { type: 'ADD_WIDGET'; payload: { sectionId: string; widget: ReportWidget; afterWidgetId?: string } }
  | { type: 'REMOVE_WIDGET'; payload: { sectionId: string; widgetId: string } }
  | { type: 'UPDATE_WIDGET'; payload: { sectionId: string; widgetId: string; config: WidgetConfig; colSpan?: 1 | 2 | 3 | 4 } }
  | { type: 'REORDER_WIDGET'; payload: { sectionId: string; widgetId: string; direction: 'up' | 'down' } }
  | { type: 'DUPLICATE_WIDGET'; payload: { sectionId: string; widgetId: string } }
  | { type: 'SELECT_WIDGET'; payload: { widgetId: string | null } }
  | { type: 'MARK_SAVED' }

// === Tipos para serialización (guardar en Supabase) ===
export interface ReportJSON {
  title: string
  clientId: string
  dateFrom: string
  dateTo: string
  sections: ReportSection[]
}

// === Estado del reporte en DB ===
export type ReportStatus = 'draft' | 'generated' | 'sent' | 'scheduled'

export interface Report {
  id: string
  agency_id: string
  client_id: string
  template_id: string | null
  title: string
  description: string | null
  status: ReportStatus
  date_from: string
  date_to: string
  config: ReportJSON | null
  public_url: string | null
  public_token: string | null
  sent_at: string | null
  sent_to: string[] | null
  created_at: string
  updated_at: string
}
