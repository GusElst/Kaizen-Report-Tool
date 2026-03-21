'use client'

import type { ChannelType } from '@/types/reports'
import { CHANNEL_CONFIG } from '@/types/reports'
import {
  Facebook, Instagram, Music2, Linkedin, Megaphone, Image, LayoutGrid,
  Pencil, Check, X,
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

interface SectionHeaderProps {
  name: string
  channel: ChannelType
  onUpdateName?: (name: string) => void
}

const SectionHeader = ({ name, channel, onUpdateName }: SectionHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(name)
  const config = CHANNEL_CONFIG[channel]
  const Icon = CHANNEL_ICONS[channel]

  const handleSave = () => {
    if (editName.trim()) {
      onUpdateName?.(editName.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditName(name)
    setIsEditing(false)
  }

  return (
    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-surface-100">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: config.color + '20' }}
      >
        <Icon className="w-4 h-4" style={{ color: config.color }} />
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave()
              if (e.key === 'Escape') handleCancel()
            }}
            className="bg-surface-100 border border-surface-200 rounded-md px-2 py-1 text-white text-sm font-heading flex-1 outline-none focus:border-brand"
            autoFocus
          />
          <button onClick={handleSave} className="text-emerald-400 hover:text-emerald-300 p-1">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={handleCancel} className="text-surface-400 hover:text-red-400 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 flex-1">
          <h3 className="text-lg font-semibold text-white font-heading">{name}</h3>
          {onUpdateName && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-surface-400 hover:text-white p-1 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default SectionHeader
