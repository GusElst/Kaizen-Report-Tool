'use client'

import type { ChartConfig } from '@/types/reports'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

interface PieChartWidgetProps {
  data: ChartConfig
}

const PieChartWidget = ({ data }: PieChartWidgetProps) => {
  const chartData = data.series.map(s => ({
    name: s.label,
    value: s.data[0]?.value ?? 0,
    color: s.color,
  }))

  const total = chartData.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="rounded-xl border border-surface-100 bg-surface-50 p-4">
      <h4 className="text-sm font-semibold text-white mb-1">{data.title}</h4>
      {data.subtitle && (
        <p className="text-xs text-surface-400 mb-3">{data.subtitle}</p>
      )}
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#111920', border: '1px solid #1e2a33', borderRadius: 8, fontSize: 12 }}
            formatter={(value, name) => {
              const num = Number(value)
              return [
                `${num} (${total > 0 ? ((num / total) * 100).toFixed(1) : 0}%)`,
                String(name),
              ]
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: '#6b7f8e' }}
            formatter={(value, entry) => {
              const item = chartData.find(d => d.name === value)
              const pct = item && total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'
              return `${value} (${pct}%)`
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PieChartWidget
