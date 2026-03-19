import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

// Endpoint de setup: crea agencia + perfil si no existen
// Usar solo en desarrollo para usuarios creados sin el flujo correcto
export async function POST() {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // Verificar si ya tiene perfil
  const { data: existing } = await adminClient
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single()

  if (existing) {
    return NextResponse.json({ message: 'Perfil ya existe' })
  }

  // Crear agencia
  const agencyName = user.user_metadata?.agency_name ?? 'Kaizen'
  const { data: agency, error: agencyError } = await adminClient
    .from('agencies')
    .insert({ name: agencyName, slug: agencyName.toLowerCase().replace(/\s+/g, '-'), contact_email: user.email })
    .select('id')
    .single()

  if (agencyError || !agency) {
    return NextResponse.json({ error: 'Error al crear agencia' }, { status: 500 })
  }

  // Crear perfil
  const { error: userError } = await adminClient
    .from('users')
    .insert({
      id: user.id,
      agency_id: agency.id,
      full_name: user.user_metadata?.full_name ?? user.email ?? 'Usuario',
      email: user.email ?? '',
      role: 'owner',
    })

  if (userError) {
    return NextResponse.json({ error: 'Error al crear perfil' }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Perfil creado correctamente' })
}
