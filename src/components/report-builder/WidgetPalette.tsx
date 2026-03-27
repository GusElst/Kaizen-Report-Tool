'use client'

import type { WidgetConfig } from '@/types/reports'
import {
  BarChart3, LineChart, PieChart, Table2, Type, Activity, TrendingUp, X,
} from 'lucide-react'

interface WidgetPaletteProps {
  onSelect: (type: WidgetConfig['type']) => void
  onClose: () => void
}

const WIDGET_OPTIONS: Array<{ type: WidgetConfig['type']; label: string; description: string; icon: React.ElementType }> = [
  { type: 'kpi_card', label: 'KPI Card', description: 'Métrica con variación', icon: TrendingUp },
  { type: 'line_chart', label: 'Gráfico de Línea', description: 'Tendencias temporales', icon: LineChart },
  { type: 'area_chart', label: 'Gráfico de Área', description: 'Tendencias con relleno', icon: Activity },
  { type: 'bar_chart', label: 'Gráfico de Barras', description: 'Comparación por categoría', icon: BarChart3 },
  { type: 'pie_chart', label: 'Gráfico de Torta', description: 'Distribución porcentual', icon: PieChart },
  { type: 'data_table', label: 'Tabla de Datos', description: 'Posts o campañas', icon: Table2 },
  { type: 'text_block', label: 'Bloque de Texto', description: 'Análisis o notas', icon: Type },
]

const WidgetPalette = ({ onSelect, onClose }: WidgetPaletteProps) => {
  return (
    <div className="bg-surface border border-surface-100 rounded-xl p-3 shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-surface-400 uppercase tracking-wider">
          Agregar Widget
        </span>
        <button onClick={onClose} className="text-surface-400 hover:text-white p-0.5">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {WIDGET_OPTIONS.map(opt => (
          <button
            key={opt.type}
            onClick={() => {
              onSelect(opt.type)
              onClose()
            }}
            className="flex items-start gap-2 p-2 rounded-lg hover:bg-surface-50 transition-colors text-left group"
          >
            <opt.icon className="w-4 h-4 text-surface-400 group-hover:text-brand mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-medium text-white">{opt.label}</div>
              <div className="text-[10px] text-surface-400">{opt.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default WidgetPalette
