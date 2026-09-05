import type { JSONContent } from '@tiptap/core'

export type PostStatus = 'draft' | 'published'

export type PostSummary = {
  id: string
  title: string
  subtitle: string
  slug: string | null
  categoryId: string
  imageUrl: string
  author: string
  authorId: string | null
  status: PostStatus
  viewCount: number
  publishedAt: string | null
  updatedAt: string
}

export type Post = PostSummary & {
  content: JSONContent
  tags: string[]
  videoUrl: string | null
}

export type PostDraft = {
  id: string | null
  localId: string
  title: string
  subtitle: string
  categoryId: string
  imageUrl: string
  content: JSONContent
  tags: string[]
  status: PostStatus
  updatedAt: number
}

export const EMPTY_POST_CONTENT: JSONContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
}

export type Comment = {
  id: string
  postId: string
  author: string
  content: string
  createdAt: string
  isQuestion: boolean
  inReplyTo: string | null
}
