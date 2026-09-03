export type Post = {
  id: string
  title: string
  categoryId: string
  content: string
  imageUrl: string
  videoUrl: string | null
  author: string
  viewCount: number
  publishedAt: string
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
