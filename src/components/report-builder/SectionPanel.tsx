'use client'

import type { ReportSection, ChannelType, ReportBuilderAction } from '@/types/reports'
import { CHANNEL_CONFIG } from '@/types/reports'
import {
  Facebook, Instagram, Music2, Linkedin, Megaphone, Image, LayoutGrid,
  Plus, ChevronUp, ChevronDown, Trash2, GripVertical,
} from 'lucide-react'
import { useState } from 'react'

const CHANNEL_ICONS: Record<ChannelType, React.ElementType> = {
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Music2,
  linkedin: Linkedin,
  meta_ads: Megaphone,
  instagram_ads: Image,
  custom: LayoutGrid,
}

interface SectionPanelProps {
  sections: ReportSection[]
  activeSectionId: string | null
  dispatch: React.Dispatch<ReportBuilderAction>
}

const CHANNEL_OPTIONS: ChannelType[] = [
  'facebook', 'instagram', 'tiktok', 'linkedin', 'meta_ads', 'instagram_ads', 'custom',
]

const SectionPanel = ({ sections, activeSectionId, dispatch }: SectionPanelProps) => {
  const [showAddMenu, setShowAddMenu] = useState(false)

  const handleAddSection = (channel: ChannelType) => {
    dispatch({ type: 'ADD_SECTION', payload: { channel } })
    setShowAddMenu(false)
  }

  return (
    <div className="w-60 flex-shrink-0 bg-surface border-r border-surface-100 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-surface-100">
        <h2 className="text-sm font-semibold text-white font-heading">Secciones</h2>
        <p className="text-xs text-surface-400 mt-0.5">{sections.length} secciones</p>
      </div>

      {/* Lista de secciones */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sections.map((section, idx) => {
          const config = CHANNEL_CONFIG[section.channel]
          const Icon = CHANNEL_ICONS[section.channel]
          const isActive = section.id === activeSectionId

          return (
            <div
              key={section.id}
              className={`group rounded-lg p-2 cursor-pointer transition-colors ${
                isActive ? 'bg-surface-50 border border-surface-200' : 'hover:bg-surface-50/50 border border-transparent'
              }`}
              onClick={() => dispatch({ type: 'SELECT_SECTION', payload: { sectionId: section.id } })}
            >
              <div className="flex items-center gap-2">
                <GripVertical className="w-3 h-3 text-surface-400 opacity-0 group-hover:opacity-100 flex-shrink-0" />
                <div
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: config.color + '20' }}
                >
                  <Icon className="w-3 h-3" style={{ color: config.color }} />
                </div>
                <span className="text-xs font-medium text-white truncate flex-1">{section.name}</span>
              </div>

              {/* Controles */}
              <div className="flex items-center gap-0.5 mt-1.5 ml-5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); dispatch({ type: 'REORDER_SECTION', payload: { sectionId: section.id, direction: 'up' } }) }}
                  disabled={idx === 0}
                  className="p-0.5 text-surface-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); dispatch({ type: 'REORDER_SECTION', payload: { sectionId: section.id, direction: 'down' } }) }}
                  disabled={idx === sections.length - 1}
                  className="p-0.5 text-surface-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); dispatch({ type: 'REMOVE_SECTION', payload: { sectionId: section.id } }) }}
                  className="p-0.5 text-surface-400 hover:text-red-400 ml-auto"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <span className="text-[10px] text-surface-400 ml-1">
                  {section.widgets.length}w
                </span>
              </div>
            </div>
          )
        })}

        {sections.length === 0 && (
          <div className="text-center py-6 text-surface-400 text-xs">
            No hay secciones.<br />Agregá una para empezar.
          </div>
        )}
      </div>

      {/* Botón agregar sección */}
      <div className="p-2 border-t border-surface-100 relative">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-brand/10 text-brand hover:bg-brand/20 transition-colors text-xs font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          Agregar Sección
        </button>

        {/* Menú de canales */}
        {showAddMenu && (
          <div className="absolute bottom-full left-2 right-2 mb-1 bg-surface border border-surface-100 rounded-xl shadow-xl p-2 z-10">
            <span className="text-[10px] text-surface-400 uppercase tracking-wider px-2">
              Elegir canal
            </span>
            {CHANNEL_OPTIONS.map(ch => {
              const cfg = CHANNEL_CONFIG[ch]
              const Icon = CHANNEL_ICONS[ch]
              return (
                <button
                  key={ch}
                  onClick={() => handleAddSection(ch)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-surface-50 transition-colors text-left"
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                  <span className="text-xs text-white">{cfg.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default SectionPanel
