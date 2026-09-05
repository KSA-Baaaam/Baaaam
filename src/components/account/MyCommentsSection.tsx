import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronRight, MessageCircle, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui'
import { koDateTimeFormatter } from '@/lib/format'
import { commentsService } from '@/services/comments'
import { postsService } from '@/services/posts'

/** 로그인한 사용자가 직접 작성한 댓글과 원문을 마이페이지에서 연결해 보여준다. */
export function MyCommentsSection() {
  const queryClient = useQueryClient()
  const [statusMessage, setStatusMessage] = useState('')

  const {
    data: comments = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['comments', 'mine'],
    queryFn: commentsService.listMine,
  })

  const postIds = useMemo(() => [...new Set(comments.map((comment) => comment.postId))], [comments])
  const { data: posts = [] } = useQuery({
    queryKey: ['posts', 'commented', postIds],
    queryFn: () => postsService.listByIds(postIds),
    enabled: postIds.length > 0,
  })
  const postTitleById = useMemo(() => new Map(posts.map((post) => [post.id, post.title])), [posts])

  const deleteMutation = useMutation({
    mutationFn: commentsService.deleteComment,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['comments'] })
      setStatusMessage('댓글을 삭제했어요.')
    },
    onError: () => setStatusMessage('댓글을 삭제하지 못했어요. 잠시 후 다시 시도해주세요.'),
  })

  return (
    <section className="rounded-xl border border-border-subtle bg-surface-card p-5 sm:p-7" aria-labelledby="my-comments-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="my-comments-title" className="text-lg font-bold text-navy">내 댓글</h2>
            <p className="mt-1 text-sm leading-6 text-ink-muted">내가 남긴 댓글을 확인하고 원문으로 이동할 수 있어요.</p>
          </div>
        </div>
        {!isLoading && !isError ? <span className="inline-flex min-h-8 items-center rounded-full bg-brand-soft px-3 text-sm font-bold text-brand-strong">{comments.length}개</span> : null}
      </div>

      <div className="mt-6 border-t border-border-subtle pt-1">
        {isLoading ? (
          <div className="space-y-3 pt-4" aria-label="내 댓글을 불러오는 중">
            {[0, 1].map((item) => <div key={item} className="h-28 animate-pulse rounded-xl bg-surface-muted" />)}
          </div>
        ) : isError ? (
          <div className="py-9 text-center">
            <p className="text-sm text-danger">내 댓글을 불러오지 못했어요.</p>
            <button type="button" onClick={() => void refetch()} className="mt-4 min-h-11 rounded-full border border-border-subtle px-5 text-sm font-bold text-ink hover:border-brand hover:text-brand">다시 불러오기</button>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex min-h-44 flex-col items-center justify-center py-8 text-center">
            <MessageCircle className="h-10 w-10 text-border-strong" strokeWidth={1.5} aria-hidden="true" />
            <p className="mt-4 text-sm font-semibold text-ink-muted">아직 작성한 댓글이 없어요.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border-subtle">
            {comments.map((comment) => (
              <li key={comment.id} className="py-5">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <Link to={`/id=${comment.postId}`} className="group inline-flex max-w-full items-center gap-1 text-sm font-bold text-brand-strong hover:text-brand">
                      <span className="truncate">{postTitleById.get(comment.postId) ?? `글 #${comment.postId}`}</span>
                      <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                    <p className="mt-2 whitespace-pre-wrap break-words text-base leading-7 text-ink">{comment.content}</p>
                    <time dateTime={comment.createdAt} className="mt-2 block text-xs text-ink-soft">{koDateTimeFormatter.format(new Date(comment.createdAt))}</time>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-[#fff2f1] hover:text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger" aria-label="댓글 삭제">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </AlertDialogTrigger>
                    <AlertDialogContent
                      overlayProps={{ className: 'fixed inset-0 z-40 bg-ink/50' }}
                      className="responsive-dialog fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border-subtle bg-white p-5 shadow-xl sm:p-6"
                    >
                      <AlertDialogTitle className="text-lg font-extrabold text-navy">댓글을 삭제할까요?</AlertDialogTitle>
                      <AlertDialogDescription className="mt-2 text-sm leading-6 text-ink-muted">삭제한 댓글은 다시 복구할 수 없습니다.</AlertDialogDescription>
                      <div className="responsive-actions mt-6">
                        <AlertDialogCancel className="min-h-11 w-full rounded-full border border-border-subtle px-4 text-sm font-bold text-ink-muted min-[375px]:w-auto">취소</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(comment.id)}
                          className="min-h-11 w-full rounded-full bg-danger px-4 text-sm font-bold text-white min-[375px]:w-auto"
                        >
                          삭제
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {statusMessage ? <p role="status" className={`mt-3 text-sm font-semibold ${deleteMutation.isError ? 'text-danger' : 'text-brand-strong'}`}>{statusMessage}</p> : null}
    </section>
  )
}
