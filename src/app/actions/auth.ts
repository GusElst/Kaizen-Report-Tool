'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const logout = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
