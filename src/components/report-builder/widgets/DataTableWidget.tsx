'use client'

import type { TableConfig, ValueFormat } from '@/types/reports'
import { formatNumber, formatCurrency, formatPercent } from '@/lib/utils/formatters'

interface DataTableWidgetProps {
  data: TableConfig
}

const formatCell = (value: unknown, format?: ValueFormat): string => {
  if (value === null || value === undefined) return '—'
  const num = Number(value)
  switch (format) {
    case 'currency_ars': return formatCurrency(num, 'ARS')
    case 'currency_usd': return formatCurrency(num, 'USD')
    case 'percent': return formatPercent(num)
    case 'number': return formatNumber(num)
    case 'time': return `${num}s`
    default: return String(value)
  }
}

const DataTableWidget = ({ data }: DataTableWidgetProps) => {
  // Calcular totales
  const totals = data.showTotals
    ? data.columns.reduce<Record<string, number | string>>((acc, col) => {
        if (col.format === 'text') {
          acc[col.key] = col.key === data.columns[0].key ? 'Total' : ''
          return acc
        }
        const sum = data.rows.reduce((s, row) => {
          const val = Number(row[col.key])
          return s + (isNaN(val) ? 0 : val)
        }, 0)
        // Para promedios (CTR, CPC, etc.) calcular promedio, no suma
        if (col.format === 'percent' || col.key === 'cpc' || col.key === 'cpa' || col.key === 'avgWatch') {
          acc[col.key] = data.rows.length > 0 ? sum / data.rows.length : 0
        } else {
          acc[col.key] = sum
        }
        return acc
      }, {})
    : null

  return (
    <div className="rounded-xl border border-surface-100 bg-surface-50 p-4">
      <h4 className="text-sm font-semibold text-white mb-3">{data.title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-100">
              {data.columns.map(col => (
                <th
                  key={col.key}
                  className="text-left text-xs font-medium text-surface-400 uppercase tracking-wider pb-2 pr-4 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr key={i} className="border-b border-surface-100/50 hover:bg-surface-100/30 transition-colors">
                {data.columns.map(col => (
                  <td key={col.key} className="py-2.5 pr-4 text-surface-300 whitespace-nowrap">
                    {col.key === data.columns[0].key && data.variant === 'posts' ? (
                      <div className="flex items-center gap-2 max-w-[280px]">
                        {row['thumbnail'] ? (
                          <div className="w-8 h-8 rounded bg-surface-100 flex-shrink-0" />
                        ) : null}
                        <span className="truncate text-white text-xs">
                          {String(row[col.key] ?? '')}
                        </span>
                      </div>
                    ) : (
                      formatCell(row[col.key], col.format)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {totals && (
            <tfoot>
              <tr className="border-t-2 border-surface-200">
                {data.columns.map(col => (
                  <td key={col.key} className="py-2.5 pr-4 font-semibold text-white whitespace-nowrap">
                    {formatCell(totals[col.key], col.format === 'text' ? 'text' : col.format)}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}

export default DataTableWidget
