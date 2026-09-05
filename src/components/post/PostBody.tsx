import { PostContentRenderer } from '@/components/post/PostContentRenderer'
import type { Post } from '@/types/blog'

type PostBodyProps = { post: Post }

export function PostBody({ post }: PostBodyProps) {
  return <PostContentRenderer content={post.content} className="mt-10" />
}
