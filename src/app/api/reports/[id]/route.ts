import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { data, error } = await adminClient
    .from('reports')
    .select('*, clients(name)')
    .eq('id', params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json({ data })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const body = await request.json()
  const { title, client_id, date_from, date_to, status, config } = body

  const updatePayload: Record<string, unknown> = {}
  if (title !== undefined) updatePayload.title = title
  if (client_id !== undefined) updatePayload.client_id = client_id
  if (date_from !== undefined) updatePayload.date_from = date_from
  if (date_to !== undefined) updatePayload.date_to = date_to
  if (status !== undefined) updatePayload.status = status
  if (config !== undefined) updatePayload.config = config

  const { data, error } = await adminClient
    .from('reports')
    .update(updatePayload)
    .eq('id', params.id)
    .select('*, clients(name)')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
