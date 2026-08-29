import type { Database } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import type { Post as BlogPost } from '@/types/blog'

type PostRow = Database['public']['Tables']['posts']['Row']

export type Post = BlogPost & {
  authorId: string | null
}

export type PostInput = Omit<Post, 'id' | 'viewCount' | 'publishedAt' | 'authorId'>

export interface PostsAdapter {
  listAll(): Promise<Post[]>
  getById(id: string): Promise<Post | undefined>
  create(input: PostInput): Promise<Post>
  update(id: string, input: PostInput): Promise<Post>
  setRecommended(id: string, isRecommended: boolean): Promise<Post>
}

function mapPost(row: PostRow): Post {
  return {
    id: String(row.id),
    title: row.title,
    categoryId: row.category_id,
    content: row.content,
    imageUrl: row.image_url,
    videoUrl: row.video_url,
    author: row.author,
    authorId: row.author_id,
    isRecommended: row.is_recommended,
    viewCount: row.view_count,
    publishedAt: row.published_at,
  }
}

async function requireCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('로그인이 필요합니다.')
  return data.user
}

function displayName(user: Awaited<ReturnType<typeof requireCurrentUser>>) {
  const name = user.user_metadata?.full_name
  return typeof name === 'string' && name.trim() ? name.trim() : (user.email ?? 'Baaaam 사용자')
}

export const postsService: PostsAdapter = {
  async listAll() {
    const { data, error } = await supabase.from('posts').select('*').order('published_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data.map(mapPost)
  },

  async getById(id) {
    const { data, error } = await supabase.from('posts').select('*').eq('id', Number(id)).maybeSingle()
    if (error) throw new Error(error.message)
    return data ? mapPost(data) : undefined
  },

  async create(input) {
    const user = await requireCurrentUser()
    const { data, error } = await supabase
      .from('posts')
      .insert({
        author_id: user.id,
        author: displayName(user),
        title: input.title,
        category_id: input.categoryId,
        content: input.content,
        image_url: input.imageUrl,
        video_url: input.videoUrl,
        is_recommended: input.isRecommended,
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return mapPost(data)
  },

  async update(id, input) {
    const { data, error } = await supabase
      .from('posts')
      .update({
        title: input.title,
        category_id: input.categoryId,
        content: input.content,
        image_url: input.imageUrl,
        video_url: input.videoUrl,
        is_recommended: input.isRecommended,
        updated_at: new Date().toISOString(),
      })
      .eq('id', Number(id))
      .select()
      .single()
    if (error) throw new Error(error.message)
    return mapPost(data)
  },

  async setRecommended(id, isRecommended) {
    const { data, error } = await supabase
      .from('posts')
      .update({ is_recommended: isRecommended, updated_at: new Date().toISOString() })
      .eq('id', Number(id))
      .select()
      .single()
    if (error) throw new Error(error.message)
    return mapPost(data)
  },
}
