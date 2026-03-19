export type MetricSource = 'google_ads' | 'meta_ads' | 'google_analytics'

export interface MetricValue {
  label: string
  value: number
  change?: number // porcentaje de cambio vs período anterior
  currency?: 'USD' | 'ARS'
}

export interface MetricsData {
  source: MetricSource
  period: { from: string; to: string }
  metrics: Record<string, MetricValue>
}
