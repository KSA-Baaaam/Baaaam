import type { JSONContent } from '@tiptap/core'

import type { Database, Json } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { postImagesService } from '@/services/postImages'
import type { Post, PostStatus, PostSummary } from '@/types/blog'

type PostRow = Database['public']['Tables']['posts']['Row']

const summaryColumns = 'id, author_id, title, subtitle, slug, category_id, thumbnail_url, author, status, view_count, published_at, updated_at'
const detailColumns = `${summaryColumns}, content, tags, video_url`

export type PostEditorInput = {
  title: string
  subtitle: string
  categoryId: string
  imageUrl: string
  content: JSONContent
  tags: string[]
}

export type PostDraftPatch = Partial<PostEditorInput>

export type PublishedPostPage = {
  items: PostSummary[]
  total: number
}

export type PublishedPostPageOptions = {
  page?: number
  pageSize?: number
  categoryId?: string
  categoryIds?: string[]
  query?: string
  sort?: 'newest' | 'popular'
}

function mapSummary(row: Pick<PostRow, 'id' | 'author_id' | 'title' | 'subtitle' | 'slug' | 'category_id' | 'thumbnail_url' | 'author' | 'status' | 'view_count' | 'published_at' | 'updated_at'>): PostSummary {
  return {
    id: String(row.id),
    title: row.title,
    subtitle: row.subtitle,
    slug: row.slug,
    categoryId: row.category_id,
    imageUrl: row.thumbnail_url,
    author: row.author,
    authorId: row.author_id,
    status: row.status,
    viewCount: row.view_count,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  }
}

function mapPost(row: PostRow): Post {
  return {
    ...mapSummary(row),
    content: row.content as JSONContent,
    tags: row.tags,
    videoUrl: row.video_url,
  }
}

async function requireCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('로그인이 필요합니다.')
  return data.user
}

function displayName(user: Awaited<ReturnType<typeof requireCurrentUser>>) {
  const name = user.user_metadata?.full_name
  return typeof name === 'string' && name.trim() ? name.trim() : (user.email ?? 'BAAAAM 사용자')
}

function inputToRow(input: PostEditorInput) {
  return {
    title: input.title.trim(),
    subtitle: input.subtitle.trim(),
    category_id: input.categoryId,
    thumbnail_url: input.imageUrl,
    content: input.content as Json,
    tags: input.tags,
  }
}

function patchToRow(patch: PostDraftPatch): Database['public']['Tables']['posts']['Update'] {
  const row: Database['public']['Tables']['posts']['Update'] = { updated_at: new Date().toISOString() }
  if (patch.title !== undefined) row.title = patch.title.trim()
  if (patch.subtitle !== undefined) row.subtitle = patch.subtitle.trim()
  if (patch.categoryId !== undefined) row.category_id = patch.categoryId
  if (patch.imageUrl !== undefined) row.thumbnail_url = patch.imageUrl
  if (patch.content !== undefined) row.content = patch.content as Json
  if (patch.tags !== undefined) row.tags = patch.tags
  return row
}

function friendlyPostError(error: { code?: string; message: string }) {
  if (error.code === '23505') return new Error('글 주소를 자동으로 만들지 못했어요. 잠시 후 다시 시도해주세요.')
  if (error.code === '23514') return new Error('입력한 글 정보를 다시 확인해주세요.')
  if (error.code === '42501') return new Error('이 글을 저장할 권한이 없습니다. 계정 권한을 확인해주세요.')
  if (error.code === 'PGRST116') return new Error('글을 찾을 수 없거나 수정 권한이 없습니다.')
  return new Error(error.message)
}

function safeSearchTerm(value: string) {
  return value
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
}

export const postsService = {
  async listAll(): Promise<PostSummary[]> {
    const page = await postsService.listPublishedPage({ pageSize: 12 })
    return page.items
  },

  async listByIds(ids: string[]): Promise<PostSummary[]> {
    const numericIds = [...new Set(ids.map(Number).filter(Number.isFinite))]
    if (numericIds.length === 0) return []

    const { data, error } = await supabase
      .from('posts')
      .select(summaryColumns)
      .in('id', numericIds)
    if (error) throw friendlyPostError(error)
    return data.map((row) => mapSummary(row as PostRow))
  },

  async listPublishedPage({
    page = 1,
    pageSize = 12,
    categoryId,
    categoryIds,
    query = '',
    sort = 'newest',
  }: PublishedPostPageOptions = {}): Promise<PublishedPostPage> {
    const safePage = Math.max(1, Math.floor(page))
    const safePageSize = Math.min(24, Math.max(1, Math.floor(pageSize)))
    const from = (safePage - 1) * safePageSize
    const searchTerm = safeSearchTerm(query)
    if (query.trim() && !searchTerm) return { items: [], total: 0 }
    const request = supabase
      .from('posts')
      .select(summaryColumns, { count: 'exact' })
      .eq('status', 'published')

    if (categoryId && categoryId !== 'all') request.eq('category_id', categoryId)
    if (categoryIds?.length) request.in('category_id', categoryIds)
    if (searchTerm) request.or(`title.ilike.%${searchTerm}%,subtitle.ilike.%${searchTerm}%`)

    if (sort === 'popular') request.order('view_count', { ascending: false }).order('published_at', { ascending: false })
    else request.order('published_at', { ascending: false })

    const { data, error, count } = await request.range(from, from + safePageSize - 1)
    if (error) throw friendlyPostError(error)
    return { items: data.map((row) => mapSummary(row as PostRow)), total: count ?? 0 }
  },

  async listManageable(options?: { staffId: string; role: 'developer' | 'admin' | 'author' | 'general' }): Promise<PostSummary[]> {
    const request = supabase
      .from('posts')
      .select(summaryColumns)
      .order('updated_at', { ascending: false })
      .limit(120)
    if (options && !['developer', 'admin'].includes(options.role)) request.eq('author_id', options.staffId)
    const { data, error } = await request
    if (error) throw friendlyPostError(error)
    return data.map((row) => mapSummary(row as PostRow))
  },

  async getById(id: string): Promise<Post | undefined> {
    const { data, error } = await supabase
      .from('posts')
      .select(detailColumns)
      .eq('id', Number(id))
      .maybeSingle()
    if (error) throw friendlyPostError(error)
    return data ? mapPost(data as PostRow) : undefined
  },

  async getBySlug(slug: string): Promise<Post | undefined> {
    const { data, error } = await supabase
      .from('posts')
      .select(detailColumns)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()
    if (error) throw friendlyPostError(error)
    return data ? mapPost(data as PostRow) : undefined
  },

  async createDraft(input: PostEditorInput): Promise<Post> {
    const user = await requireCurrentUser()
    const { data, error } = await supabase
      .from('posts')
      .insert({
        ...inputToRow(input),
        author_id: user.id,
        author: displayName(user),
        status: 'draft',
        published_at: null,
      })
      .select(detailColumns)
      .single()
    if (error) throw friendlyPostError(error)
    return mapPost(data as PostRow)
  },

  async updateDraft(id: string, patch: PostDraftPatch): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .update(patchToRow(patch))
      .eq('id', Number(id))
      .select(detailColumns)
      .single()
    if (error) throw friendlyPostError(error)
    return mapPost(data as PostRow)
  },

  async publish(id: string | null, input: PostEditorInput): Promise<Post> {
    const publishedAt = new Date().toISOString()
    if (!id) {
      const user = await requireCurrentUser()
      const { data: draft, error: draftError } = await supabase
        .from('posts')
        .insert({
          ...inputToRow(input),
          author_id: user.id,
          author: displayName(user),
          status: 'draft',
          published_at: null,
        })
        .select('id')
        .single()
      if (draftError) throw friendlyPostError(draftError)

      const { data, error } = await supabase
        .from('posts')
        .update({
          ...inputToRow(input),
          slug: `post-${draft.id}`,
          status: 'published' as PostStatus,
          published_at: publishedAt,
          updated_at: publishedAt,
        })
        .eq('id', draft.id)
        .select(detailColumns)
        .single()
      if (error) throw friendlyPostError(error)
      return mapPost(data as PostRow)
    }

    const current = await postsService.getById(id)
    const { data, error } = await supabase
      .from('posts')
      .update({
        ...inputToRow(input),
        slug: `post-${id}`,
        status: 'published' as PostStatus,
        published_at: current?.publishedAt ?? publishedAt,
        updated_at: publishedAt,
      })
      .eq('id', Number(id))
      .select(detailColumns)
      .single()
    if (error) throw friendlyPostError(error)
    return mapPost(data as PostRow)
  },

  async deletePost(id: string): Promise<void> {
    const { data, error } = await supabase
      .from('posts')
      .delete()
      .eq('id', Number(id))
      .select('id, thumbnail_url')
      .single()
    if (error) throw friendlyPostError(error)
    await postImagesService.removeByPublicUrl(data.thumbnail_url).catch(() => undefined)
  },
}
