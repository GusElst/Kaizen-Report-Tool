import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'

const generateSlug = (text: string) =>
  text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim()

export async function POST(request: NextRequest) {
  const { fullName, agencyName, email, password } = await request.json()

  if (!fullName || !agencyName || !email || !password) {
    return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 })
  }

  // 1. Crear usuario en Supabase Auth (con admin — bypasea rate limits de email)
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    user_metadata: { full_name: fullName },
    email_confirm: true, // confirmar email automáticamente
  })

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: authError?.message ?? 'Error al crear la cuenta' },
      { status: 400 }
    )
  }

  // 2. Crear agencia (bypasea RLS con admin client)
  const { data: agency, error: agencyError } = await adminClient
    .from('agencies')
    .insert({ name: agencyName, slug: generateSlug(agencyName), contact_email: email })
    .select('id')
    .single()

  if (agencyError || !agency) {
    // Revertir usuario creado si falla la agencia
    await adminClient.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: 'Error al crear la agencia' }, { status: 500 })
  }

  // 3. Crear perfil de usuario vinculado a la agencia
  const { error: userError } = await adminClient
    .from('users')
    .insert({ id: authData.user.id, agency_id: agency.id, full_name: fullName, email, role: 'owner' })

  if (userError) {
    await adminClient.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: 'Error al crear el perfil' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
