export interface Client {
  id: string
  agency_id: string
  name: string
  email: string | null
  status: 'active' | 'inactive'
  created_at: string
}
