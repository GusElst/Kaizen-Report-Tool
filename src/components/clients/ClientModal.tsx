'use client'

import { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import type { Client, ClientInsert, ClientUpdate } from '@/hooks/useClients'
import type { CurrencyType, ClientStatus } from '@/types/database'

const INDUSTRIES = [
  'Turismo', 'Gastronomía', 'Retail', 'Inmobiliario', 'Salud', 'Educación',
  'Tecnología', 'Servicios', 'Construcción', 'Agro', 'Entretenimiento', 'Otro',
]

interface ClientModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Omit<ClientInsert, 'agency_id' | 'slug'> | ClientUpdate) => Promise<{ error?: string }>
  client?: Client | null
}

const EMPTY_FORM: {
  name: string; industry: string; contact_name: string; contact_email: string
  website: string; notes: string; currency: CurrencyType; status: ClientStatus
} = {
  name: '', industry: '', contact_name: '', contact_email: '',
  website: '', notes: '', currency: 'USD', status: 'active',
}

export const ClientModal = ({ open, onClose, onSubmit, client }: ClientModalProps) => {
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (client) {
      setForm({
        name: client.name,
        industry: client.industry ?? '',
        contact_name: client.contact_name ?? '',
        contact_email: client.contact_email ?? '',
        website: client.website ?? '',
        notes: client.notes ?? '',
        currency: client.currency ?? 'USD',
        status: client.status ?? 'active',
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setError(null)
  }, [client, open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      name: form.name,
      industry: form.industry || null,
      contact_name: form.contact_name || null,
      contact_email: form.contact_email || null,
      website: form.website || null,
      notes: form.notes || null,
      currency: form.currency,
      status: form.status,
    }

    const result = await onSubmit(payload)
    setLoading(false)

    if (result.error) { setError(result.error); return }
    onClose()
  }

  const inputClass = "w-full rounded-lg border border-white/10 bg-surface-300 px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all font-body"
  const labelClass = "font-body text-xs font-medium text-white/60 block mb-1.5"

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface-200 shadow-2xl" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <h2 className="font-heading text-base font-bold text-white">
              {client ? 'Editar cliente' : 'Nuevo cliente'}
            </h2>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin">

            {/* Nombre */}
            <div>
              <label className={labelClass}>Nombre del cliente *</label>
              <input type="text" value={form.name} onChange={set('name')} placeholder="Bodega Catena" required className={inputClass} />
            </div>

            {/* Industria */}
            <div>
              <label className={labelClass}>Industria</label>
              <select value={form.industry} onChange={set('industry')} className={inputClass}>
                <option value="">Seleccionar industria</option>
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            {/* Contacto */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Nombre de contacto</label>
                <input type="text" value={form.contact_name} onChange={set('contact_name')} placeholder="Juan García" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email de contacto</label>
                <input type="email" value={form.contact_email} onChange={set('contact_email')} placeholder="juan@empresa.com" className={inputClass} />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className={labelClass}>Sitio web</label>
              <input type="url" value={form.website} onChange={set('website')} placeholder="https://empresa.com" className={inputClass} />
            </div>

            {/* Moneda y estado */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Moneda</label>
                <select value={form.currency} onChange={set('currency')} className={inputClass}>
                  <option value="USD">USD — Dólar</option>
                  <option value="ARS">ARS — Peso</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Estado</label>
                <select value={form.status} onChange={set('status')} className={inputClass}>
                  <option value="active">Activo</option>
                  <option value="paused">Pausado</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className={labelClass}>Notas internas</label>
              <textarea value={form.notes} onChange={set('notes')} placeholder="Información relevante sobre el cliente..." rows={3}
                className={`${inputClass} resize-none`} />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
                <p className="font-body text-xs text-red-400">{error}</p>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
            <button type="button" onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white transition-colors font-body">
              Cancelar
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50 transition-colors font-heading">
              {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Guardando...</> : client ? 'Guardar cambios' : 'Crear cliente'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
