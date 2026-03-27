'use client'

import type { ChartConfig } from '@/types/reports'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { formatNumber } from '@/lib/utils/formatters'

interface BarChartWidgetProps {
  data: ChartConfig
}

const BarChartWidget = ({ data }: BarChartWidgetProps) => {
  const mergedData = data.series[0]?.data.map((point, i) => {
    const row: Record<string, unknown> = { date: point.date }
    data.series.forEach(s => {
      row[s.key] = s.data[i]?.value ?? 0
    })
    return row
  }) ?? []

  const formatDate = (date: string) => {
    const d = new Date(date + 'T00:00:00')
    return `${d.getDate()}/${d.getMonth() + 1}`
  }

  const layout = data.horizontal ? 'vertical' as const : 'horizontal' as const

  return (
    <div className="rounded-xl border border-surface-100 bg-surface-50 p-4">
      <h4 className="text-sm font-semibold text-white mb-1">{data.title}</h4>
      {data.subtitle && (
        <p className="text-xs text-surface-400 mb-3">{data.subtitle}</p>
      )}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={mergedData} layout={layout} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2a33" />
          {layout === 'horizontal' ? (
            <>
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fill: '#6b7f8e', fontSize: 11 }}
                axisLine={{ stroke: '#1e2a33' }}
              />
              <YAxis
                tickFormatter={(v) => formatNumber(v)}
                tick={{ fill: '#6b7f8e', fontSize: 11 }}
                axisLine={{ stroke: '#1e2a33' }}
                width={50}
              />
            </>
          ) : (
            <>
              <XAxis
                type="number"
                tickFormatter={(v) => formatNumber(v)}
                tick={{ fill: '#6b7f8e', fontSize: 11 }}
                axisLine={{ stroke: '#1e2a33' }}
              />
              <YAxis
                type="category"
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fill: '#6b7f8e', fontSize: 11 }}
                axisLine={{ stroke: '#1e2a33' }}
                width={60}
              />
            </>
          )}
          <Tooltip
            contentStyle={{ backgroundColor: '#111920', border: '1px solid #1e2a33', borderRadius: 8, fontSize: 12 }}
            labelFormatter={(label) => formatDate(String(label))}
            formatter={(value) => [formatNumber(Number(value)), '']}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: '#6b7f8e' }} />
          {data.series.map(s => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={s.color}
              radius={[4, 4, 0, 0]}
              stackId={data.stacked ? 'stack' : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarChartWidget
