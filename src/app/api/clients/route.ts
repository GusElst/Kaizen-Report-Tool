import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

const generateSlug = (text: string) =>
  text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim()

export async function POST(request: NextRequest) {
  // Verificar sesión del usuario
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // Parsear body antes de cualquier otra operación (el stream solo se puede leer una vez)
  const body = await request.json()
  const { name, industry, contact_name, contact_email, website, notes, currency, status } = body

  if (!name) {
    return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
  }

  // Obtener perfil del usuario con admin client (bypasea RLS)
  let { data: userProfile } = await adminClient
    .from('users')
    .select('agency_id')
    .eq('id', user.id)
    .single()

  // Auto-crear agencia y perfil si no existen (usuarios creados fuera del flujo normal)
  if (!userProfile) {
    const agencyName = user.user_metadata?.agency_name ?? 'Kaizen'
    const { data: agency, error: agencyError } = await adminClient
      .from('agencies')
      .insert({ name: agencyName, slug: agencyName.toLowerCase().replace(/\s+/g, '-'), contact_email: user.email })
      .select('id')
      .single()

    if (agencyError || !agency) {
      return NextResponse.json({ error: 'Error al inicializar perfil de usuario' }, { status: 500 })
    }

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
      return NextResponse.json({ error: 'Error al inicializar perfil de usuario' }, { status: 500 })
    }

    userProfile = { agency_id: agency.id }
  }

  const { data, error } = await adminClient
    .from('clients')
    .insert({
      agency_id: userProfile.agency_id,
      name,
      slug: generateSlug(name),
      industry: industry || null,
      contact_name: contact_name || null,
      contact_email: contact_email || null,
      website: website || null,
      notes: notes || null,
      currency: currency ?? 'USD',
      status: status ?? 'active',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
