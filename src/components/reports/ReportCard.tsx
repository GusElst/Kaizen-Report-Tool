'use client'

import { useState } from 'react'
import { FileText, MoreVertical, Pencil, Trash2, Eye, Calendar } from 'lucide-react'
import type { Report } from '@/hooks/useReports'
import type { ReportStatus } from '@/types/database'

interface ReportCardProps {
  report: Report
  onEdit: (report: Report) => void
  onDelete: (report: Report) => void
}

const STATUS_CONFIG: Record<ReportStatus, { label: string; classes: string }> = {
  draft:     { label: 'Borrador',    classes: 'bg-white/5 text-white/40 border border-white/10' },
  generated: { label: 'Generado',   classes: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
  sent:      { label: 'Enviado',    classes: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  scheduled: { label: 'Programado', classes: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' },
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const ReportCard = ({ report, onEdit, onDelete }: ReportCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const status = STATUS_CONFIG[report.status as ReportStatus] ?? STATUS_CONFIG.draft
  const clientName = report.clients?.name ?? '—'
  const reportTitle = report.title

  return (
    <div className="group relative rounded-xl border border-white/5 bg-surface-200 p-5 hover:border-white/10 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-surface-400 border border-white/10">
            <FileText className="h-5 w-5 text-brand-500" />
          </div>
          <div className="min-w-0">
            <h3 className="font-heading text-sm font-bold text-white truncate">{reportTitle}</h3>
            <p className="font-body text-xs text-white/40 truncate">{clientName}</p>
          </div>
        </div>

        {/* Menú */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-white/30 opacity-0 group-hover:opacity-100 hover:bg-white/10 hover:text-white transition-all"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 w-40 rounded-lg border border-white/10 bg-surface-100 py-1 shadow-xl">
                <a
                  href={`/reports/${report.id}`}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-white/60 hover:bg-white/5 hover:text-white transition-colors font-body"
                  onClick={() => setMenuOpen(false)}
                >
                  <Eye className="h-3.5 w-3.5" /> Ver reporte
                </a>
                <button
                  onClick={() => { setMenuOpen(false); onEdit(report) }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-white/60 hover:bg-white/5 hover:text-white transition-colors font-body"
                >
                  <Pencil className="h-3.5 w-3.5" /> Editar
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onDelete(report) }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors font-body"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Fecha */}
      <div className="flex items-center gap-1.5 mb-4 text-white/30">
        <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="font-body text-xs">
          {formatDate(report.date_from)} — {formatDate(report.date_to)}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest font-heading ${status.classes}`}>
          {status.label}
        </span>
        <span className="font-body text-[10px] text-white/20">
          {formatDate(report.created_at)}
        </span>
      </div>
    </div>
  )
}
