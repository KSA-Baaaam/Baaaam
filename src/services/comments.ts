import type { Database } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import type { Comment as BlogComment } from '@/types/blog'

type CommentRow = Database['public']['Tables']['comments']['Row']

export type Comment = BlogComment & {
  authorId: string
}

export type AddCommentInput = {
  postId: string
  author: string
  content: string
  isQuestion: boolean
  inReplyTo: string | null
}

export interface CommentsAdapter {
  listByPostId(postId: string): Promise<Comment[]>
  listAll(): Promise<Comment[]>
  addComment(input: AddCommentInput): Promise<Comment>
  deleteComment(id: string): Promise<void>
}

function mapComment(row: CommentRow): Comment {
  return {
    id: String(row.id),
    postId: String(row.post_id),
    authorId: row.author_id,
    author: row.author,
    content: row.content,
    createdAt: row.created_at,
    isQuestion: row.is_question,
    inReplyTo: row.in_reply_to === null ? null : String(row.in_reply_to),
  }
}

async function currentUserIdentity() {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('댓글을 작성하려면 로그인해주세요.')
  const metadataName = data.user.user_metadata?.full_name
  return {
    id: data.user.id,
    name:
      typeof metadataName === 'string' && metadataName.trim()
        ? metadataName.trim()
        : (data.user.email ?? 'Baaaam 사용자'),
  }
}

export const commentsService: CommentsAdapter = {
  async listByPostId(postId) {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', Number(postId))
      .order('created_at', { ascending: true })
    if (error) throw new Error(error.message)
    return data.map(mapComment)
  },

  async listAll() {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data.map(mapComment)
  },

  async addComment(input) {
    const identity = await currentUserIdentity()
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: Number(input.postId),
        author_id: identity.id,
        author: identity.name,
        content: input.content,
        is_question: input.isQuestion,
        in_reply_to: input.inReplyTo === null ? null : Number(input.inReplyTo),
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return mapComment(data)
  },

  async deleteComment(id) {
    const { error } = await supabase.from('comments').delete().eq('id', Number(id))
    if (error) throw new Error(error.message)
  },
}
