export type ReportStatus = 'draft' | 'scheduled' | 'sent'

export interface Report {
  id: string
  agency_id: string
  client_id: string
  title: string
  status: ReportStatus
  created_at: string
  updated_at: string
}

export interface ReportWidget {
  id: string
  report_id: string
  type: 'kpi' | 'line_chart' | 'bar_chart' | 'pie_chart' | 'table' | 'text'
  title: string
  config: Record<string, unknown>
  position: { x: number; y: number; w: number; h: number }
}
