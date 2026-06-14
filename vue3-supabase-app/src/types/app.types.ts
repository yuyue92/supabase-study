import type { Database } from './database.types'

// ── Table row aliases ────────────────────────────────────────────────────────
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']

// ── Enriched / joined types ──────────────────────────────────────────────────
export type ProjectWithOwner = Project & {
  owner: Pick<Profile, 'full_name' | 'avatar_url'> | null
}

// ── UI state types ───────────────────────────────────────────────────────────
export type AsyncState<T> = {
  data: T | null
  loading: boolean
  error: string | null
}

export type ProjectStatus = Database['public']['Enums']['project_status']
