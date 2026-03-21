'use client'

import { useRouter } from 'next/navigation'
import ReportBuilder from '@/components/report-builder/ReportBuilder'
import type { ReportJSON } from '@/types/reports'

export default function NewReportPage() {
  const router = useRouter()

  const handleSave = async (json: ReportJSON) => {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: json.title,
        client_id: json.clientId,
        date_from: json.dateFrom || new Date().toISOString().split('T')[0],
        date_to: json.dateTo || new Date().toISOString().split('T')[0],
        config: { sections: json.sections },
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error ?? 'Error al crear reporte')
    }

    const { data } = await res.json()
    // Redirect a edit para seguir trabajando con el reporte persistido
    router.push(`/reports/${data.id}/edit`)
  }

  return (
    <ReportBuilder
      initialState={{
        title: '',
        dateFrom: new Date().toISOString().split('T')[0],
        dateTo: new Date().toISOString().split('T')[0],
        sections: [],
      }}
      onSave={handleSave}
    />
  )
}
