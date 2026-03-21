'use client'

import { useReducer, useCallback } from 'react'
import type {
  ReportBuilderState,
  ReportBuilderAction,
  ReportSection,
  ReportWidget,
  WidgetConfig,
  ChannelType,
  ReportJSON,
} from '@/types/reports'
import { CHANNEL_CONFIG } from '@/types/reports'

// Helper para generar IDs
const generateId = () => crypto.randomUUID()

// === Estado inicial ===
const initialState: ReportBuilderState = {
  reportId: null,
  title: '',
  clientId: null,
  dateFrom: '',
  dateTo: '',
  sections: [],
  activeSectionId: null,
  activeWidgetId: null,
  isDirty: false,
}

// === Reducer ===
const reportBuilderReducer = (state: ReportBuilderState, action: ReportBuilderAction): ReportBuilderState => {
  switch (action.type) {
    case 'SET_REPORT_META':
      return {
        ...state,
        ...action.payload,
        isDirty: true,
      }

    case 'LOAD_REPORT':
      return {
        ...action.payload,
        isDirty: false,
      }

    case 'ADD_SECTION': {
      const channel = action.payload.channel
      const name = action.payload.name || CHANNEL_CONFIG[channel].label
      const newSection: ReportSection = {
        id: generateId(),
        name,
        channel,
        widgets: [],
      }
      return {
        ...state,
        sections: [...state.sections, newSection],
        activeSectionId: newSection.id,
        activeWidgetId: null,
        isDirty: true,
      }
    }

    case 'REMOVE_SECTION': {
      const sections = state.sections.filter(s => s.id !== action.payload.sectionId)
      return {
        ...state,
        sections,
        activeSectionId: sections.length > 0 ? sections[0].id : null,
        activeWidgetId: null,
        isDirty: true,
      }
    }

    case 'UPDATE_SECTION':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.id === action.payload.sectionId
            ? { ...s, ...action.payload.name !== undefined && { name: action.payload.name }, ...action.payload.channel !== undefined && { channel: action.payload.channel } }
            : s
        ),
        isDirty: true,
      }

    case 'REORDER_SECTION': {
      const idx = state.sections.findIndex(s => s.id === action.payload.sectionId)
      if (idx === -1) return state
      const newIdx = action.payload.direction === 'up' ? idx - 1 : idx + 1
      if (newIdx < 0 || newIdx >= state.sections.length) return state
      const sections = [...state.sections]
      ;[sections[idx], sections[newIdx]] = [sections[newIdx], sections[idx]]
      return { ...state, sections, isDirty: true }
    }

    case 'SELECT_SECTION':
      return {
        ...state,
        activeSectionId: action.payload.sectionId,
        activeWidgetId: null,
      }

    case 'ADD_WIDGET': {
      const { sectionId, widget, afterWidgetId } = action.payload
      return {
        ...state,
        sections: state.sections.map(s => {
          if (s.id !== sectionId) return s
          const widgets = [...s.widgets]
          if (afterWidgetId) {
            const idx = widgets.findIndex(w => w.id === afterWidgetId)
            widgets.splice(idx + 1, 0, widget)
          } else {
            widgets.push(widget)
          }
          return { ...s, widgets }
        }),
        activeWidgetId: widget.id,
        isDirty: true,
      }
    }

    case 'REMOVE_WIDGET':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.id === action.payload.sectionId
            ? { ...s, widgets: s.widgets.filter(w => w.id !== action.payload.widgetId) }
            : s
        ),
        activeWidgetId: state.activeWidgetId === action.payload.widgetId ? null : state.activeWidgetId,
        isDirty: true,
      }

    case 'UPDATE_WIDGET':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.id === action.payload.sectionId
            ? {
                ...s,
                widgets: s.widgets.map(w =>
                  w.id === action.payload.widgetId
                    ? { ...w, config: action.payload.config, ...(action.payload.colSpan !== undefined && { colSpan: action.payload.colSpan }) }
                    : w
                ),
              }
            : s
        ),
        isDirty: true,
      }

    case 'REORDER_WIDGET': {
      const { sectionId, widgetId, direction } = action.payload
      return {
        ...state,
        sections: state.sections.map(s => {
          if (s.id !== sectionId) return s
          const idx = s.widgets.findIndex(w => w.id === widgetId)
          if (idx === -1) return s
          const newIdx = direction === 'up' ? idx - 1 : idx + 1
          if (newIdx < 0 || newIdx >= s.widgets.length) return s
          const widgets = [...s.widgets]
          ;[widgets[idx], widgets[newIdx]] = [widgets[newIdx], widgets[idx]]
          return { ...s, widgets }
        }),
        isDirty: true,
      }
    }

    case 'DUPLICATE_WIDGET': {
      const { sectionId, widgetId } = action.payload
      return {
        ...state,
        sections: state.sections.map(s => {
          if (s.id !== sectionId) return s
          const idx = s.widgets.findIndex(w => w.id === widgetId)
          if (idx === -1) return s
          const original = s.widgets[idx]
          const copy: ReportWidget = {
            ...original,
            id: generateId(),
            config: JSON.parse(JSON.stringify(original.config)),
          }
          const widgets = [...s.widgets]
          widgets.splice(idx + 1, 0, copy)
          return { ...s, widgets }
        }),
        isDirty: true,
      }
    }

    case 'SELECT_WIDGET':
      return { ...state, activeWidgetId: action.payload.widgetId }

    case 'MARK_SAVED':
      return { ...state, isDirty: false }

    default:
      return state
  }
}

// === Hook ===
export const useReportBuilder = (initial?: Partial<ReportBuilderState>) => {
  const [state, dispatch] = useReducer(
    reportBuilderReducer,
    initial ? { ...initialState, ...initial } : initialState
  )

  // Sección activa
  const activeSection = state.sections.find(s => s.id === state.activeSectionId) || null

  // Widget activo
  const activeWidget = activeSection?.widgets.find(w => w.id === state.activeWidgetId) || null

  // Serializar a JSON para guardar
  const toJSON = useCallback((): ReportJSON => ({
    title: state.title,
    clientId: state.clientId || '',
    dateFrom: state.dateFrom,
    dateTo: state.dateTo,
    sections: state.sections,
  }), [state.title, state.clientId, state.dateFrom, state.dateTo, state.sections])

  // Acciones helpers
  const addSection = useCallback((channel: ChannelType, name?: string) => {
    dispatch({ type: 'ADD_SECTION', payload: { channel, name } })
  }, [])

  const addWidget = useCallback((sectionId: string, type: WidgetConfig['type'], afterWidgetId?: string) => {
    const widget = createDefaultWidget(type, sectionId, state.sections)
    dispatch({ type: 'ADD_WIDGET', payload: { sectionId, widget, afterWidgetId } })
  }, [state.sections])

  return {
    state,
    dispatch,
    activeSection,
    activeWidget,
    toJSON,
    addSection,
    addWidget,
  }
}

// === Factory de widgets con config por defecto ===
const createDefaultWidget = (type: WidgetConfig['type'], sectionId: string, sections: ReportSection[]): ReportWidget => {
  const section = sections.find(s => s.id === sectionId)
  const channel = section?.channel || 'custom'

  const base = {
    id: generateId(),
  }

  switch (type) {
    case 'kpi_card':
      return {
        ...base,
        colSpan: 1,
        config: {
          type: 'kpi_card',
          data: {
            metricKey: '',
            label: 'Nueva Métrica',
            value: 0,
            format: 'number',
            change: null,
            previousValue: null,
            channel,
          },
        },
      }
    case 'line_chart':
    case 'area_chart':
    case 'bar_chart':
      return {
        ...base,
        colSpan: 2,
        config: {
          type,
          data: {
            title: 'Nuevo Gráfico',
            xAxisKey: 'date',
            granularity: 'daily',
            series: [
              {
                key: 'serie1',
                label: 'Serie 1',
                color: CHANNEL_CONFIG[channel].color,
                data: [],
              },
            ],
          },
        },
      }
    case 'pie_chart':
      return {
        ...base,
        colSpan: 2,
        config: {
          type: 'pie_chart',
          data: {
            title: 'Nuevo Gráfico de Torta',
            xAxisKey: 'category',
            granularity: 'daily',
            series: [],
          },
        },
      }
    case 'data_table':
      return {
        ...base,
        colSpan: 4,
        config: {
          type: 'data_table',
          data: {
            title: 'Nueva Tabla',
            variant: 'custom',
            columns: [{ key: 'col1', label: 'Columna 1' }],
            rows: [],
          },
        },
      }
    case 'text_block':
      return {
        ...base,
        colSpan: 4,
        config: {
          type: 'text_block',
          data: {
            content: '',
            placeholder: 'Escribí tu análisis aquí...',
          },
        },
      }
  }
}
