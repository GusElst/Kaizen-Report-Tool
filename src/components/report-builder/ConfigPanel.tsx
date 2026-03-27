'use client'

import type { ReportWidget, ReportBuilderAction, WidgetConfig, ValueFormat, ChannelType } from '@/types/reports'
import { CHANNEL_CONFIG } from '@/types/reports'
import { X, Columns } from 'lucide-react'

interface ConfigPanelProps {
  widget: ReportWidget | null
  sectionId: string | null
  dispatch: React.Dispatch<ReportBuilderAction>
}

const VALUE_FORMAT_OPTIONS: Array<{ value: ValueFormat; label: string }> = [
  { value: 'number', label: 'Número' },
  { value: 'currency_ars', label: 'Moneda (ARS)' },
  { value: 'currency_usd', label: 'Moneda (USD)' },
  { value: 'percent', label: 'Porcentaje' },
  { value: 'time', label: 'Tiempo (seg)' },
  { value: 'text', label: 'Texto' },
]

const COL_SPAN_OPTIONS: Array<{ value: 1 | 2 | 3 | 4; label: string }> = [
  { value: 1, label: '1 col' },
  { value: 2, label: '2 cols' },
  { value: 3, label: '3 cols' },
  { value: 4, label: 'Full' },
]

const ConfigPanel = ({ widget, sectionId, dispatch }: ConfigPanelProps) => {
  if (!widget || !sectionId) {
    return (
      <div className="w-80 flex-shrink-0 bg-surface border-l border-surface-100 flex items-center justify-center">
        <p className="text-surface-400 text-xs text-center px-4">
          Seleccioná un widget para ver su configuración
        </p>
      </div>
    )
  }

  const updateConfig = (newConfig: WidgetConfig) => {
    dispatch({
      type: 'UPDATE_WIDGET',
      payload: { sectionId, widgetId: widget.id, config: newConfig },
    })
  }

  const updateColSpan = (colSpan: 1 | 2 | 3 | 4) => {
    dispatch({
      type: 'UPDATE_WIDGET',
      payload: { sectionId, widgetId: widget.id, config: widget.config, colSpan },
    })
  }

  return (
    <div className="w-80 flex-shrink-0 bg-surface border-l border-surface-100 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-surface-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white font-heading">Configuración</h2>
        <button
          onClick={() => dispatch({ type: 'SELECT_WIDGET', payload: { widgetId: null } })}
          className="text-surface-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Tipo de widget */}
        <div>
          <label className="text-xs text-surface-400 uppercase tracking-wider font-medium">
            Tipo
          </label>
          <p className="text-sm text-white mt-1 capitalize">
            {widget.config.type.replace('_', ' ')}
          </p>
        </div>

        {/* Col span */}
        <div>
          <label className="text-xs text-surface-400 uppercase tracking-wider font-medium flex items-center gap-1">
            <Columns className="w-3 h-3" /> Ancho
          </label>
          <div className="flex gap-1 mt-1.5">
            {COL_SPAN_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => updateColSpan(opt.value)}
                className={`flex-1 py-1 text-xs rounded-md transition-colors ${
                  widget.colSpan === opt.value
                    ? 'bg-brand text-white'
                    : 'bg-surface-50 text-surface-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Config específica según tipo */}
        {widget.config.type === 'kpi_card' && (
          <KPIConfigEditor
            config={widget.config}
            onChange={updateConfig}
          />
        )}

        {(widget.config.type === 'line_chart' ||
          widget.config.type === 'area_chart' ||
          widget.config.type === 'bar_chart' ||
          widget.config.type === 'pie_chart') && (
          <ChartConfigEditor
            config={widget.config}
            onChange={updateConfig}
          />
        )}

        {widget.config.type === 'data_table' && (
          <TableConfigEditor
            config={widget.config}
            onChange={updateConfig}
          />
        )}
      </div>
    </div>
  )
}

// === Sub-editores ===

const KPIConfigEditor = ({
  config,
  onChange,
}: {
  config: Extract<WidgetConfig, { type: 'kpi_card' }>
  onChange: (c: WidgetConfig) => void
}) => {
  const data = config.data
  return (
    <>
      <FieldInput
        label="Etiqueta"
        value={data.label}
        onChange={(label) => onChange({ ...config, data: { ...data, label } })}
      />
      <FieldInput
        label="Valor"
        value={String(data.value)}
        type="number"
        onChange={(v) => onChange({ ...config, data: { ...data, value: Number(v) } })}
      />
      <FieldSelect
        label="Formato"
        value={data.format}
        options={VALUE_FORMAT_OPTIONS}
        onChange={(format) => onChange({ ...config, data: { ...data, format: format as ValueFormat } })}
      />
      <FieldInput
        label="Cambio (%)"
        value={data.change !== null && data.change !== undefined ? String(data.change) : ''}
        type="number"
        placeholder="Vacío = +∞%"
        onChange={(v) => onChange({ ...config, data: { ...data, change: v === '' ? null : Number(v) } })}
      />
    </>
  )
}

const ChartConfigEditor = ({
  config,
  onChange,
}: {
  config: Extract<WidgetConfig, { type: 'line_chart' | 'area_chart' | 'bar_chart' | 'pie_chart' }>
  onChange: (c: WidgetConfig) => void
}) => {
  const data = config.data
  return (
    <>
      <FieldInput
        label="Título"
        value={data.title}
        onChange={(title) => onChange({ ...config, data: { ...data, title } })}
      />
      <FieldInput
        label="Subtítulo"
        value={data.subtitle || ''}
        onChange={(subtitle) => onChange({ ...config, data: { ...data, subtitle } })}
      />
      {config.type === 'bar_chart' && (
        <FieldCheckbox
          label="Horizontal"
          checked={data.horizontal || false}
          onChange={(horizontal) => onChange({ ...config, data: { ...data, horizontal } })}
        />
      )}
      {(config.type === 'bar_chart') && (
        <FieldCheckbox
          label="Apilado"
          checked={data.stacked || false}
          onChange={(stacked) => onChange({ ...config, data: { ...data, stacked } })}
        />
      )}
      <div>
        <label className="text-xs text-surface-400 uppercase tracking-wider font-medium">
          Series ({data.series.length})
        </label>
        {data.series.map((s, i) => (
          <div key={i} className="mt-1 p-2 bg-surface-50 rounded-md space-y-1.5">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={s.color}
                onChange={(e) => {
                  const series = [...data.series]
                  series[i] = { ...s, color: e.target.value }
                  onChange({ ...config, data: { ...data, series } })
                }}
                className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs text-white">{s.label}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

const TableConfigEditor = ({
  config,
  onChange,
}: {
  config: Extract<WidgetConfig, { type: 'data_table' }>
  onChange: (c: WidgetConfig) => void
}) => {
  const data = config.data
  return (
    <>
      <FieldInput
        label="Título"
        value={data.title}
        onChange={(title) => onChange({ ...config, data: { ...data, title } })}
      />
      <FieldCheckbox
        label="Mostrar totales"
        checked={data.showTotals || false}
        onChange={(showTotals) => onChange({ ...config, data: { ...data, showTotals } })}
      />
      <div>
        <label className="text-xs text-surface-400 uppercase tracking-wider font-medium">
          Columnas ({data.columns.length})
        </label>
        {data.columns.map((col, i) => (
          <div key={i} className="mt-1 p-2 bg-surface-50 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white">{col.label}</span>
              <span className="text-[10px] text-surface-400">{col.format || 'text'}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// === Campos reutilizables ===

const FieldInput = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) => (
  <div>
    <label className="text-xs text-surface-400 uppercase tracking-wider font-medium">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full mt-1 bg-surface-50 border border-surface-100 rounded-md px-2.5 py-1.5 text-sm text-white outline-none focus:border-brand transition-colors"
    />
  </div>
)

const FieldSelect = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (v: string) => void
}) => (
  <div>
    <label className="text-xs text-surface-400 uppercase tracking-wider font-medium">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 bg-surface-50 border border-surface-100 rounded-md px-2.5 py-1.5 text-sm text-white outline-none focus:border-brand transition-colors"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
)

const FieldCheckbox = ({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="rounded border-surface-100 bg-surface-50 text-brand focus:ring-brand"
    />
    <span className="text-xs text-surface-300">{label}</span>
  </label>
)

export default ConfigPanel
