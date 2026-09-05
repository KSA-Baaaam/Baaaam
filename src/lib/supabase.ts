import { createClient } from '@supabase/supabase-js'

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type PostRow = {
  id: number
  author_id: string | null
  title: string
  subtitle: string
  slug: string | null
  category_id: string
  content: Json
  tags: string[]
  thumbnail_url: string
  video_url: string | null
  author: string
  is_recommended: boolean
  status: 'draft' | 'published'
  view_count: number
  published_at: string | null
  updated_at: string
}

type CommentRow = {
  id: number
  post_id: number
  author_id: string
  author: string
  content: string
  is_question: boolean
  in_reply_to: number | null
  created_at: string
}

type ProfileRow = {
  id: string
  email: string
  display_name: string
  role: 'developer' | 'admin' | 'author' | 'general'
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      posts: {
        Row: PostRow
        Insert: {
          id?: number
          author_id?: string | null
          title: string
          subtitle?: string
          slug?: string | null
          category_id: string
          content: Json
          tags?: string[]
          thumbnail_url?: string
          video_url?: string | null
          author: string
          is_recommended?: boolean
          status?: PostRow['status']
          view_count?: number
          published_at?: string | null
          updated_at?: string
        }
        Update: Partial<Omit<PostRow, 'id'>>
        Relationships: []
      }
      comments: {
        Row: CommentRow
        Insert: {
          id?: number
          post_id: number
          author_id: string
          author: string
          content: string
          is_question?: boolean
          in_reply_to?: number | null
          created_at?: string
        }
        Update: Partial<Omit<CommentRow, 'id'>>
        Relationships: []
      }
      profiles: {
        Row: ProfileRow
        Insert: {
          id: string
          email: string
          display_name: string
          role?: ProfileRow['role']
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<ProfileRow, 'id'>>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Publishable keys identify a public web client and are intentionally safe to ship to browsers.
// Authorization is enforced by the RLS policies in supabase/migrations.
const supabaseUrl = 'https://bkfarvplbzyzuqavflqp.supabase.co'
const supabasePublishableKey = 'sb_publishable_oGLZTe2B4VBKOg3N5RBsDA_vIQGic4k'

export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
