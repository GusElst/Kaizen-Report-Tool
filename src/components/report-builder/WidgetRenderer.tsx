'use client'

import type { WidgetConfig, ChannelType } from '@/types/reports'
import KPICardWidget from './widgets/KPICardWidget'
import LineChartWidget from './widgets/LineChartWidget'
import AreaChartWidget from './widgets/AreaChartWidget'
import BarChartWidget from './widgets/BarChartWidget'
import PieChartWidget from './widgets/PieChartWidget'
import DataTableWidget from './widgets/DataTableWidget'
import TextBlockWidget from './widgets/TextBlockWidget'

interface WidgetRendererProps {
  config: WidgetConfig
  isEditing?: boolean
  onTextChange?: (content: string) => void
  sectionName?: string
  channel?: ChannelType
}

const WidgetRenderer = ({ config, isEditing, onTextChange, sectionName, channel }: WidgetRendererProps) => {
  switch (config.type) {
    case 'kpi_card':
      return <KPICardWidget data={config.data} />
    case 'line_chart':
      return <LineChartWidget data={config.data} />
    case 'area_chart':
      return <AreaChartWidget data={config.data} />
    case 'bar_chart':
      return <BarChartWidget data={config.data} />
    case 'pie_chart':
      return <PieChartWidget data={config.data} />
    case 'data_table':
      return <DataTableWidget data={config.data} />
    case 'text_block':
      return (
        <TextBlockWidget
          data={config.data}
          isEditing={isEditing}
          onChange={onTextChange}
          sectionName={sectionName}
          channel={channel}
        />
      )
    default:
      return (
        <div className="rounded-xl border border-surface-100 bg-surface-50 p-4 text-surface-400 text-sm">
          Widget no reconocido
        </div>
      )
  }
}

export default WidgetRenderer
