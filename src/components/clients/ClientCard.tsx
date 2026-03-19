'use client'

import { Globe, Mail, Phone, MoreVertical, Pencil, Trash2, FileText } from 'lucide-react'
import { useState } from 'react'
import type { Client } from '@/hooks/useClients'

const STATUS_STYLES = {
  active:   { label: 'Activo',    class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  paused:   { label: 'Pausado',   class: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  archived: { label: 'Archivado', class: 'bg-white/5 text-white/30 border-white/10' },
}

const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()

// Colores para los avatares de clientes
const AVATAR_COLORS = [
  'bg-blue-600', 'bg-violet-600', 'bg-pink-600',
  'bg-teal-600', 'bg-orange-600', 'bg-cyan-600',
]
const getAvatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

interface ClientCardProps {
  client: Client
  onEdit: (client: Client) => void
  onDelete: (client: Client) => void
}

export const ClientCard = ({ client, onEdit, onDelete }: ClientCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const status = STATUS_STYLES[client.status] ?? STATUS_STYLES.active

  return (
    <div className="group relative flex flex-col rounded-xl border border-white/5 bg-surface-200 p-5 hover:border-white/10 transition-all hover:shadow-lg hover:shadow-black/20">

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white font-heading ${getAvatarColor(client.name)}`}>
            {getInitials(client.name)}
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-white leading-tight">{client.name}</h3>
            {client.industry && (
              <p className="font-body text-xs text-white/40 mt-0.5">{client.industry}</p>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:bg-white/10 hover:text-white/70 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 w-40 rounded-lg border border-white/10 bg-surface-300 py-1 shadow-xl">
                <button
                  onClick={() => { onEdit(client); setMenuOpen(false) }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors font-body"
                >
                  <Pencil className="h-3.5 w-3.5" /> Editar
                </button>
                <button
                  onClick={() => { onDelete(client); setMenuOpen(false) }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors font-body"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 space-y-2">
        {client.contact_email && (
          <div className="flex items-center gap-2 text-xs text-white/40 font-body">
            <Mail className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{client.contact_email}</span>
          </div>
        )}
        {client.website && (
          <div className="flex items-center gap-2 text-xs text-white/40 font-body">
            <Globe className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{client.website.replace(/^https?:\/\//, '')}</span>
          </div>
        )}
        {client.contact_name && (
          <div className="flex items-center gap-2 text-xs text-white/40 font-body">
            <Phone className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{client.contact_name}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border font-heading ${status.class}`}>
          {status.label}
        </span>
        <div className="flex items-center gap-1 text-xs text-white/30 font-body">
          <FileText className="h-3 w-3" />
          <span>0 reportes</span>
        </div>
      </div>
    </div>
  )
}
