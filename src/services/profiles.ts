import type { Database } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'

type ProfileRow = Database['public']['Tables']['profiles']['Row']

export type UserRole = ProfileRow['role']

export type Profile = {
  id: string
  email: string
  displayName: string
  role: UserRole
  createdAt: string
}

export const roleLabels: Record<UserRole, string> = {
  admin: '관리자',
  author: '작성자',
  general: '일반',
}

function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    createdAt: row.created_at,
  }
}

export const profilesService = {
  async getById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw new Error(error.message)
    return data ? mapProfile(data) : null
  },

  async listAll(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) throw new Error(error.message)
    return data.map(mapProfile)
  },

  async updateRole(id: string, role: UserRole): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return mapProfile(data)
  },
}
