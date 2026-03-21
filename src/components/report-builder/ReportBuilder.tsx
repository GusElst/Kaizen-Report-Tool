'use client'

import { useState, useEffect } from 'react'
import { useReportBuilder } from '@/hooks/useReportBuilder'
import type { ReportBuilderState, ReportJSON, WidgetConfig } from '@/types/reports'
import SectionPanel from './SectionPanel'
import ReportCanvas from './ReportCanvas'
import ConfigPanel from './ConfigPanel'
import { Save, Eye, FileDown, Monitor, Loader2, Check, ChevronDown, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type ClientRow = Database['public']['Tables']['clients']['Row']

interface ReportBuilderProps {
  initialState?: Partial<ReportBuilderState>
  onSave?: (json: ReportJSON) => Promise<void> | void
  saving?: boolean
}

const ReportBuilder = ({ initialState, onSave, saving: externalSaving }: ReportBuilderProps) => {
  const { state, dispatch, activeSection, activeWidget, toJSON, addWidget } = useReportBuilder(initialState)
  const [clients, setClients] = useState<ClientRow[]>([])
  const [clientsOpen, setClientsOpen] = useState(false)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')

  // Cargar clientes para el selector
  useEffect(() => {
    const loadClients = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('clients')
        .select('*')
        .eq('status', 'active')
        .order('name')
      if (data) setClients(data)
    }
    loadClients()
  }, [])

  const selectedClient = clients.find(c => c.id === state.clientId)

  const handleSave = async () => {
    if (!state.title.trim()) return
    setSaveState('saving')
    try {
      await onSave?.(toJSON())
      dispatch({ type: 'MARK_SAVED' })
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    } catch {
      setSaveState('idle')
    }
  }

  const isSaving = externalSaving || saveState === 'saving'

  const handleAddWidget = (sectionId: string, type: WidgetConfig['type'], afterWidgetId?: string) => {
    addWidget(sectionId, type, afterWidgetId)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Gate mobile — el builder es solo desktop */}
      <div className="flex lg:hidden items-center justify-center h-full bg-surface p-8">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-surface-50 flex items-center justify-center mx-auto mb-4">
            <Monitor className="w-8 h-8 text-brand" />
          </div>
          <h2 className="text-white font-heading font-semibold text-lg mb-2">
            Editor solo en desktop
          </h2>
          <p className="text-surface-400 text-sm leading-relaxed">
            El constructor de reportes necesita una pantalla más grande para funcionar correctamente. Abrí esta página desde una computadora.
          </p>
        </div>
      </div>

      {/* Toolbar superior */}
      <div className="h-14 bg-surface-50 border-b border-surface-100 hidden lg:flex items-center justify-between px-5 flex-shrink-0">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={state.title}
            onChange={(e) => dispatch({ type: 'SET_REPORT_META', payload: { title: e.target.value } })}
            placeholder="Título del reporte..."
            className="bg-surface px-3 py-1.5 rounded-lg text-white font-heading font-semibold text-sm outline-none placeholder:text-surface-400 w-60 border border-surface-100 focus:border-brand/50 transition-colors"
          />

          {/* Separator */}
          <div className="w-px h-6 bg-surface-100" />

          {/* Selector de cliente */}
          <div className="relative">
            <button
              onClick={() => setClientsOpen(!clientsOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-surface border border-surface-100 hover:border-surface-200 transition-colors"
            >
              <span className={selectedClient ? 'text-white font-medium' : 'text-surface-400'}>
                {selectedClient?.name ?? 'Seleccionar cliente'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-surface-400" />
            </button>
            {clientsOpen && (
              <div className="absolute top-full left-0 mt-1 w-60 bg-surface-50 border border-surface-100 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {clients.length === 0 ? (
                  <div className="px-3 py-2.5 text-sm text-surface-400">No hay clientes</div>
                ) : (
                  clients.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        dispatch({ type: 'SET_REPORT_META', payload: { clientId: c.id } })
                        setClientsOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2.5 text-sm hover:bg-surface-100 transition-colors ${
                        c.id === state.clientId ? 'text-brand font-medium' : 'text-surface-300'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-surface-100" />

          {/* Date pickers */}
          <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-lg border border-surface-100">
            <Calendar className="w-4 h-4 text-surface-400" />
            <input
              type="date"
              value={state.dateFrom}
              onChange={(e) => dispatch({ type: 'SET_REPORT_META', payload: { dateFrom: e.target.value } })}
              className="bg-transparent text-white text-sm outline-none [color-scheme:dark] w-32"
            />
            <span className="text-surface-400 text-sm">→</span>
            <input
              type="date"
              value={state.dateTo}
              onChange={(e) => dispatch({ type: 'SET_REPORT_META', payload: { dateTo: e.target.value } })}
              className="bg-transparent text-white text-sm outline-none [color-scheme:dark] w-32"
            />
          </div>

          {state.isDirty && (
            <span className="text-xs text-brand bg-brand/10 px-2 py-1 rounded font-medium">
              Sin guardar
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-surface-300 hover:text-white hover:bg-surface transition-colors"
            title="Vista previa (próximamente)"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-surface-300 hover:text-white hover:bg-surface transition-colors"
            title="Exportar PDF (próximamente)"
          >
            <FileDown className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !state.title.trim()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm bg-brand text-white hover:bg-brand/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveState === 'saved' ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Guardando...' : saveState === 'saved' ? 'Guardado' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Layout 3 columnas */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <SectionPanel
          sections={state.sections}
          activeSectionId={state.activeSectionId}
          dispatch={dispatch}
        />

        <ReportCanvas
          section={activeSection}
          activeWidgetId={state.activeWidgetId}
          dispatch={dispatch}
          onAddWidget={handleAddWidget}
        />

        {activeWidget && (
          <ConfigPanel
            widget={activeWidget}
            sectionId={state.activeSectionId}
            dispatch={dispatch}
          />
        )}
      </div>
    </div>
  )
}

export default ReportBuilder
