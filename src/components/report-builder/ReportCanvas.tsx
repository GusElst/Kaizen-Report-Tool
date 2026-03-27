'use client'

import { useState, useRef, useEffect, Fragment } from 'react'
import type { ReportSection, ReportBuilderAction, WidgetConfig } from '@/types/reports'
import SectionHeader from './SectionHeader'
import WidgetRenderer from './WidgetRenderer'
import WidgetPalette from './WidgetPalette'
import {
  ChevronUp, ChevronDown, Copy, Trash2, Settings, Plus, LayoutGrid,
} from 'lucide-react'

interface ReportCanvasProps {
  section: ReportSection | null
  activeWidgetId: string | null
  dispatch: React.Dispatch<ReportBuilderAction>
  onAddWidget: (sectionId: string, type: WidgetConfig['type'], afterWidgetId?: string) => void
}

const COL_SPAN_MAP = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
} as const

const ReportCanvas = ({ section, activeWidgetId, dispatch, onAddWidget }: ReportCanvasProps) => {
  const [paletteAfterWidgetId, setPaletteAfterWidgetId] = useState<string | null>(null)
  const [showBottomPalette, setShowBottomPalette] = useState(false)
  const bottomPaletteRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Scroll automático cuando se abre la palette del fondo
  useEffect(() => {
    if (showBottomPalette && bottomPaletteRef.current) {
      bottomPaletteRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [showBottomPalette])

  if (!section) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface">
        <div className="text-center">
          <LayoutGrid className="w-12 h-12 text-surface-200 mx-auto mb-3" />
          <p className="text-surface-400 text-sm">Seleccioná una sección para ver sus widgets</p>
          <p className="text-surface-500 text-xs mt-1">O agregá una nueva sección desde el panel izquierdo</p>
        </div>
      </div>
    )
  }

  const handleInsertWidget = (type: WidgetConfig['type'], afterWidgetId?: string) => {
    onAddWidget(section.id, type, afterWidgetId)
    setPaletteAfterWidgetId(null)
    setShowBottomPalette(false)
  }

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto bg-surface p-6 min-w-0">
      <div className="max-w-5xl mx-auto">
        {/* Header de sección */}
        <SectionHeader
          name={section.name}
          channel={section.channel}
          onUpdateName={(name) =>
            dispatch({ type: 'UPDATE_SECTION', payload: { sectionId: section.id, name } })
          }
        />

        {/* Grid de widgets */}
        <div className="grid grid-cols-4 gap-4">
          {section.widgets.map((widget, idx) => {
            const isSelected = widget.id === activeWidgetId

            return (
              <Fragment key={widget.id}>
                <div className={`${COL_SPAN_MAP[widget.colSpan]} relative group`}>
                  {/* Widget */}
                  <div
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? 'ring-2 ring-brand rounded-xl'
                        : 'hover:ring-1 hover:ring-surface-200 rounded-xl'
                    }`}
                    onClick={() => dispatch({ type: 'SELECT_WIDGET', payload: { widgetId: widget.id } })}
                  >
                    <WidgetRenderer
                      config={widget.config}
                      isEditing={isSelected && widget.config.type === 'text_block'}
                      sectionName={section.name}
                      channel={section.channel}
                      onTextChange={(content) => {
                        if (widget.config.type === 'text_block') {
                          dispatch({
                            type: 'UPDATE_WIDGET',
                            payload: {
                              sectionId: section.id,
                              widgetId: widget.id,
                              config: { type: 'text_block', data: { ...widget.config.data, content } },
                            },
                          })
                        }
                      }}
                    />

                    {/* Overlay con controles */}
                    <div className={`absolute top-2 right-2 flex items-center gap-0.5 transition-opacity bg-surface/90 rounded-lg px-1 py-0.5 border border-surface-100 ${
                      isSelected && widget.config.type === 'text_block'
                        ? 'hidden'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <button
                        onClick={(e) => { e.stopPropagation(); dispatch({ type: 'REORDER_WIDGET', payload: { sectionId: section.id, widgetId: widget.id, direction: 'up' } }) }}
                        disabled={idx === 0}
                        className="p-1 text-surface-400 hover:text-white disabled:opacity-30"
                        title="Mover arriba"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); dispatch({ type: 'REORDER_WIDGET', payload: { sectionId: section.id, widgetId: widget.id, direction: 'down' } }) }}
                        disabled={idx === section.widgets.length - 1}
                        className="p-1 text-surface-400 hover:text-white disabled:opacity-30"
                        title="Mover abajo"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); dispatch({ type: 'SELECT_WIDGET', payload: { widgetId: widget.id } }) }}
                        className="p-1 text-surface-400 hover:text-brand"
                        title="Configurar"
                      >
                        <Settings className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DUPLICATE_WIDGET', payload: { sectionId: section.id, widgetId: widget.id } }) }}
                        className="p-1 text-surface-400 hover:text-white"
                        title="Duplicar"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); dispatch({ type: 'REMOVE_WIDGET', payload: { sectionId: section.id, widgetId: widget.id } }) }}
                        className="p-1 text-surface-400 hover:text-red-400"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Botón "+" entre widgets */}
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setPaletteAfterWidgetId(paletteAfterWidgetId === widget.id ? null : widget.id)
                        setShowBottomPalette(false)
                      }}
                      className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center hover:bg-brand/80 transition-colors shadow-lg"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Palette como item separado del grid — full width */}
                {paletteAfterWidgetId === widget.id && (
                  <div className="col-span-4 py-2" ref={(el) => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) }}>
                    <WidgetPalette
                      onSelect={(type) => handleInsertWidget(type, widget.id)}
                      onClose={() => setPaletteAfterWidgetId(null)}
                    />
                  </div>
                )}
              </Fragment>
            )
          })}
        </div>

        {/* Botón agregar widget al final */}
        <div className="mt-6">
          <button
            onClick={() => {
              setShowBottomPalette(!showBottomPalette)
              setPaletteAfterWidgetId(null)
            }}
            className="w-full py-3 border-2 border-dashed border-surface-100 rounded-xl text-surface-400 hover:border-brand/50 hover:text-brand transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Agregar Widget
          </button>

          {showBottomPalette && (
            <div ref={bottomPaletteRef} className="mt-3 pb-4">
              <WidgetPalette
                onSelect={(type) => handleInsertWidget(type)}
                onClose={() => setShowBottomPalette(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportCanvas
