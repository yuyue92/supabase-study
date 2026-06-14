/**
 * Auto-generated Supabase types placeholder.
 *
 * To regenerate with your real schema, run:
 *   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
 *
 * Or via the Supabase CLI after linking your project:
 *   supabase gen types typescript --local > src/types/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string | null
          status: 'active' | 'archived' | 'draft'
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description?: string | null
          status?: 'active' | 'archived' | 'draft'
          user_id: string
        }
        Update: {
          id?: string
          updated_at?: string
          title?: string
          description?: string | null
          status?: 'active' | 'archived' | 'draft'
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      project_status: 'active' | 'archived' | 'draft'
    }
  }
}
