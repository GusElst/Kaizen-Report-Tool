'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

export type Client = Database['public']['Tables']['clients']['Row']
export type ClientInsert = Database['public']['Tables']['clients']['Insert']
export type ClientUpdate = Database['public']['Tables']['clients']['Update']

const generateSlug = (text: string) =>
  text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim()

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = useCallback(async () => {
    const supabase = createClient()!
    setLoading(true)
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setClients(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchClients() }, [fetchClients])

  const createClient_ = async (input: Omit<ClientInsert, 'agency_id' | 'slug'>) => {
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const json = await res.json()
    if (!res.ok) return { error: json.error ?? 'Error al crear cliente' }
    setClients((prev) => [json.data, ...prev])
    return { data: json.data }
  }

  const updateClient = async (id: string, input: ClientUpdate) => {
    const supabase = createClient()!
    const { data, error } = await supabase
      .from('clients')
      .update(input)
      .eq('id', id)
      .select()
      .single()

    if (error) return { error: error.message }
    setClients((prev) => prev.map((c) => (c.id === id ? data : c)))
    return { data }
  }

  const deleteClient = async (id: string) => {
    const supabase = createClient()!
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (error) return { error: error.message }
    setClients((prev) => prev.filter((c) => c.id !== id))
    return {}
  }

  return { clients, loading, error, refetch: fetchClients, createClient: createClient_, updateClient, deleteClient }
}
