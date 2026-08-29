import { useQuery } from '@tanstack/react-query'

import { commentsService } from '@/services/comments'
import { koDateTimeFormatter } from '@/lib/format'
import { postContent } from '@/content/post'

type CommentListProps = {
  postId: string
}

/** 댓글 목록(core). 전체 공개로 노출되며, 질문 작성이 성공하면 같은 쿼리 키 무효화로 갱신된다. */
export function CommentList({ postId }: CommentListProps) {
  const {
    data: comments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentsService.listByPostId(postId),
  })

  return (
    <section aria-labelledby="comments-heading">
      <header className="mb-6">
        <p className="mb-2 text-sm font-semibold text-brand-strong">
          {postContent.comments.eyebrow}
        </p>
        <h2 id="comments-heading" className="text-2xl font-bold text-ink">
          {postContent.comments.title}
          {comments && comments.length > 0 ? (
            <span className="ml-2 text-base font-medium text-ink-muted">{comments.length}</span>
          ) : null}
        </h2>
      </header>

      {isLoading ? (
        <p className="text-sm text-ink-muted">{postContent.comments.loading}</p>
      ) : isError ? (
        <p className="text-sm text-danger">{postContent.comments.loadError}</p>
      ) : comments && comments.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-2xl border border-border-subtle bg-surface-card p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-ink">{comment.author}</span>
                {comment.isQuestion ? (
                  <span className="rounded-full bg-spark px-2 py-0.5 text-xs font-semibold text-ink">
                    {postContent.comments.questionBadge}
                  </span>
                ) : null}
                <span className="text-xs text-ink-muted">
                  {koDateTimeFormatter.format(new Date(comment.createdAt))}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-ink-muted">{comment.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-border-subtle bg-surface-card px-6 py-10 text-center text-sm text-ink-muted">
          {postContent.comments.empty}
        </p>
      )}
    </section>
  )
}
