import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Cliente admin con service_role — SOLO usar en server-side, nunca en el cliente
export const adminClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
