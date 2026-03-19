'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Report, ReportUpdate } from '@/hooks/useReports'
import type { ReportStatus } from '@/types/database'

interface ClientOption {
  id: string
  name: string
}

interface ReportModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Record<string, unknown>) => Promise<{ error?: string } | undefined>
  report?: Report | null
}

interface FormState {
  title: string
  client_id: string
  date_from: string
  date_to: string
  status: ReportStatus
}

const today = new Date()
const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
const todayStr = today.toISOString().split('T')[0]

const EMPTY_FORM: FormState = {
  title: '',
  client_id: '',
  date_from: firstOfMonth,
  date_to: todayStr,
  status: 'draft',
}

export const ReportModal = ({ open, onClose, onSubmit, report }: ReportModalProps) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [clients, setClients] = useState<ClientOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar clientes para el selector
  useEffect(() => {
    const supabase = createClient()
    supabase.from('clients').select('id, name').eq('status', 'active').order('name').then(({ data }) => {
      setClients(data ?? [])
    })
  }, [])

  // Precargar datos al editar
  useEffect(() => {
    if (report) {
      setForm({
        title: report.title,
        client_id: report.client_id,
        date_from: report.date_from,
        date_to: report.date_to,
        status: report.status as ReportStatus,
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setError(null)
  }, [report, open])

  const set = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return setError('El nombre es requerido')
    if (!form.client_id) return setError('Seleccioná un cliente')
    if (!form.date_from || !form.date_to) return setError('Completá el rango de fechas')
    if (form.date_from > form.date_to) return setError('La fecha de inicio debe ser anterior a la de fin')

    setLoading(true)
    setError(null)
    const result = await onSubmit(form as unknown as ReportUpdate)
    setLoading(false)
    if (result?.error) return setError(result.error)
    onClose()
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface-200 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <h2 className="font-heading text-base font-bold text-white">
              {report ? 'Editar reporte' : 'Nuevo reporte'}
            </h2>
            <button onClick={onClose} className="rounded-lg p-1.5 text-white/30 hover:bg-white/5 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Nombre */}
            <div>
              <label className="font-heading text-xs font-semibold uppercase tracking-widest text-white/40 mb-1.5 block">
                Nombre del reporte *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Ej: Reporte Marzo 2026"
                className="w-full rounded-lg border border-white/10 bg-surface-300 px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all font-body"
              />
            </div>

            {/* Cliente */}
            <div>
              <label className="font-heading text-xs font-semibold uppercase tracking-widest text-white/40 mb-1.5 block">
                Cliente *
              </label>
              <select
                value={form.client_id}
                onChange={(e) => set('client_id', e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-surface-300 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all font-body"
              >
                <option value="">Seleccioná un cliente</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Rango de fechas */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-heading text-xs font-semibold uppercase tracking-widest text-white/40 mb-1.5 block">
                  Fecha inicio *
                </label>
                <input
                  type="date"
                  value={form.date_from}
                  onChange={(e) => set('date_from', e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-surface-300 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all font-body"
                />
              </div>
              <div>
                <label className="font-heading text-xs font-semibold uppercase tracking-widest text-white/40 mb-1.5 block">
                  Fecha fin *
                </label>
                <input
                  type="date"
                  value={form.date_to}
                  onChange={(e) => set('date_to', e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-surface-300 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all font-body"
                />
              </div>
            </div>

            {/* Estado (solo al editar) */}
            {report && (
              <div>
                <label className="font-heading text-xs font-semibold uppercase tracking-widest text-white/40 mb-1.5 block">
                  Estado
                </label>
                <select
                  value={form.status}
                  onChange={(e) => set('status', e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-surface-300 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all font-body"
                >
                  <option value="draft">Borrador</option>
                  <option value="generated">Generado</option>
                  <option value="scheduled">Programado</option>
                  <option value="sent">Enviado</option>
                </select>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
                <p className="font-body text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors font-body">
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50 transition-colors font-heading">
                {loading ? 'Guardando...' : report ? 'Guardar cambios' : 'Crear reporte'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
