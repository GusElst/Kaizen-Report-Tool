'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

export type Report = Database['public']['Tables']['reports']['Row'] & {
  clients?: { name: string } | null
}
export type ReportInsert = Database['public']['Tables']['reports']['Insert']
export type ReportUpdate = Database['public']['Tables']['reports']['Update']

export const useReports = (clientId?: string) => {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    const supabase = createClient()
    setLoading(true)
    let query = supabase
      .from('reports')
      .select('*, clients(name)')
      .order('created_at', { ascending: false })

    if (clientId) query = query.eq('client_id', clientId)

    const { data, error } = await query
    if (error) setError(error.message)
    else setReports((data as unknown as Report[]) ?? [])
    setLoading(false)
  }, [clientId])

  useEffect(() => { fetchReports() }, [fetchReports])

  const createReport = async (input: Omit<ReportInsert, 'agency_id' | 'created_by'>) => {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const json = await res.json()
    if (!res.ok) return { error: json.error ?? 'Error al crear reporte' }
    setReports((prev) => [json.data, ...prev])
    return { data: json.data }
  }

  const updateReport = async (id: string, input: ReportUpdate) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('reports')
      .update(input)
      .eq('id', id)
      .select('*, clients(name)')
      .single()

    if (error) return { error: error.message }
    setReports((prev) => prev.map((r) => (r.id === id ? (data as unknown as Report) : r)))
    return { data }
  }

  const deleteReport = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('reports').delete().eq('id', id)
    if (error) return { error: error.message }
    setReports((prev) => prev.filter((r) => r.id !== id))
    return {}
  }

  return { reports, loading, error, refetch: fetchReports, createReport, updateReport, deleteReport }
}
