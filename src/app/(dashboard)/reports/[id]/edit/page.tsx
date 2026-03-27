'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ReportBuilder from '@/components/report-builder/ReportBuilder'
import type { ReportBuilderState, ReportJSON, ReportSection } from '@/types/reports'
import { Loader2 } from 'lucide-react'

export default function EditReportPage() {
  const params = useParams<{ id: string }>()
  const [initialState, setInitialState] = useState<Partial<ReportBuilderState> | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadReport = async () => {
      const res = await fetch(`/api/reports/${params.id}`)
      if (!res.ok) {
        setError('No se pudo cargar el reporte')
        return
      }
      const { data } = await res.json()
      const config = (data.config ?? {}) as { sections?: ReportSection[] }

      setInitialState({
        reportId: data.id,
        title: data.title,
        clientId: data.client_id,
        dateFrom: data.date_from,
        dateTo: data.date_to,
        sections: config.sections ?? [],
        activeSectionId: config.sections?.[0]?.id ?? null,
      })
    }
    loadReport()
  }, [params.id])

  const handleSave = async (json: ReportJSON) => {
    const res = await fetch(`/api/reports/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: json.title,
        client_id: json.clientId,
        date_from: json.dateFrom,
        date_to: json.dateTo,
        config: { sections: json.sections },
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error ?? 'Error al guardar')
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-surface">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-2">{error}</p>
          <a href="/reports" className="text-brand text-xs hover:underline">
            Volver a reportes
          </a>
        </div>
      </div>
    )
  }

  if (!initialState) {
    return (
      <div className="flex items-center justify-center h-full bg-surface">
        <div className="flex items-center gap-2 text-surface-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Cargando reporte...</span>
        </div>
      </div>
    )
  }

  return (
    <ReportBuilder
      key={params.id}
      initialState={initialState}
      onSave={handleSave}
    />
  )
}
