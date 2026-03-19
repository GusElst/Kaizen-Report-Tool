import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const body = await request.json()
  const { title, client_id, date_from, date_to, status } = body

  if (!title || !client_id || !date_from || !date_to) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  // Obtener perfil del usuario
  const { data: userProfile } = await adminClient
    .from('users')
    .select('agency_id')
    .eq('id', user.id)
    .single()

  if (!userProfile) {
    return NextResponse.json({ error: 'Perfil de usuario no encontrado' }, { status: 404 })
  }

  const { data, error } = await adminClient
    .from('reports')
    .insert({
      agency_id: userProfile.agency_id,
      client_id,
      title,
      date_from,
      date_to,
      status: status ?? 'draft',
      created_by: user.id,
    })
    .select('*, clients(name)')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
