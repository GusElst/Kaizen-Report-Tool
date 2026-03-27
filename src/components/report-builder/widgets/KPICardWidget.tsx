'use client'

import type { KPIConfig } from '@/types/reports'
import { CHANNEL_CONFIG } from '@/types/reports'
import { formatNumber, formatCurrency, formatPercent } from '@/lib/utils/formatters'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPICardWidgetProps {
  data: KPIConfig
}

const formatValue = (value: number | string, format: KPIConfig['format']): string => {
  if (typeof value === 'string') return value
  switch (format) {
    case 'currency_ars': return formatCurrency(value, 'ARS')
    case 'currency_usd': return formatCurrency(value, 'USD')
    case 'percent': return formatPercent(value)
    case 'time': return `${value}s`
    default: return formatNumber(value)
  }
}

const formatChange = (change: number | null | undefined): string => {
  if (change === null || change === undefined) return '+∞%'
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(1)}%`
}

const KPICardWidget = ({ data }: KPICardWidgetProps) => {
  const channelConfig = CHANNEL_CONFIG[data.channel]
  const isPositive = data.change === null || data.change === undefined || data.change >= 0
  const isNeutral = data.change === 0

  return (
    <div className="rounded-xl border border-surface-100 bg-surface-50 p-4 flex flex-col gap-2">
      {/* Header: canal + métrica */}
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: channelConfig.color }}
        />
        <span className="text-xs text-surface-400 uppercase tracking-wider font-medium">
          {data.label}
        </span>
      </div>

      {/* Valor principal */}
      <div className="text-2xl font-bold text-white font-heading">
        {formatValue(data.value, data.format)}
      </div>

      {/* Badge de variación */}
      <div className="flex items-center gap-1.5">
        {isNeutral ? (
          <Minus className="w-3 h-3 text-surface-400" />
        ) : isPositive ? (
          <TrendingUp className="w-3 h-3 text-emerald-400" />
        ) : (
          <TrendingDown className="w-3 h-3 text-red-400" />
        )}
        <span
          className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
            isNeutral
              ? 'bg-surface-100 text-surface-400'
              : isPositive
                ? 'bg-emerald-400/10 text-emerald-400'
                : 'bg-red-400/10 text-red-400'
          }`}
        >
          {formatChange(data.change)}
        </span>
        <span className="text-xs text-surface-400">vs anterior</span>
      </div>
    </div>
  )
}

export default KPICardWidget
