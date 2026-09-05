import { useMemo, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, MessageCircle, RefreshCw, Send, Trash2, X } from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from '@/components/ui'
import { postContent } from '@/content/post'
import { koDateTimeFormatter } from '@/lib/format'
import { commentsService } from '@/services/comments'
import { useOperatorSession } from '@/services/session'

type CommentSectionProps = {
  postId: string
}

type SortOrder = 'latest' | 'oldest'

/** 글을 읽는 흐름 안에서 작성·정렬·필터·삭제를 한 번에 처리하는 댓글 영역. */
export function CommentSection({ postId }: CommentSectionProps) {
  const queryClient = useQueryClient()
  const { currentStaff, isSessionLoading } = useOperatorSession()
  const [content, setContent] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest')
  const [showMineOnly, setShowMineOnly] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')
  const [toast, setToast] = useState({ open: false, title: '', description: '' })

  const {
    data: comments = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentsService.listByPostId(postId),
  })

  const visibleComments = useMemo(() => {
    const filtered = showMineOnly && currentStaff
      ? comments.filter((comment) => comment.authorId === currentStaff.id)
      : comments

    return [...filtered].sort((a, b) => {
      const difference = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return sortOrder === 'latest' ? -difference : difference
    })
  }, [comments, currentStaff, showMineOnly, sortOrder])

  const createMutation = useMutation({
    mutationFn: commentsService.addComment,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      setContent('')
      setValidationMessage('')
      setToast({
        open: true,
        title: postContent.comments.createSuccessTitle,
        description: postContent.comments.createSuccessDescription,
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: commentsService.deleteComment,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      setToast({
        open: true,
        title: postContent.comments.deleteSuccessTitle,
        description: postContent.comments.deleteSuccessDescription,
      })
    },
  })

  function submitComment() {
    const trimmedContent = content.trim()
    if (!trimmedContent) {
      setValidationMessage(postContent.comments.validation)
      return
    }
    if (!currentStaff) return

    setValidationMessage('')
    createMutation.mutate({
      postId,
      author: currentStaff.name,
      content: trimmedContent,
      isQuestion: false,
      inReplyTo: null,
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    submitComment()
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  const canDelete = (authorId: string) => Boolean(
    currentStaff && (
      currentStaff.id === authorId
      || currentStaff.role === 'admin'
      || currentStaff.role === 'developer'
    ),
  )

  return (
    <section aria-labelledby="comments-heading" className="min-w-0">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-5">
        <div className="flex items-center gap-2.5">
          <h2 id="comments-heading" className="text-2xl font-extrabold tracking-[-0.035em] text-navy sm:text-[1.75rem]">
            {comments.length}{postContent.comments.countSuffix}
          </h2>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            aria-label={postContent.comments.refreshLabel}
            title={postContent.comments.refreshLabel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-ink-soft transition-colors hover:border-brand hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowMineOnly((current) => !current)}
          disabled={!currentStaff}
          aria-pressed={showMineOnly}
          className={`relative inline-flex min-h-11 items-center rounded-full px-5 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-45 ${showMineOnly ? 'bg-brand text-white' : 'bg-navy text-white hover:bg-[#1d4036]'}`}
        >
          {postContent.comments.mineLabel}
          {currentStaff ? <span className="absolute right-1 top-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#33bd67]" aria-hidden="true" /> : null}
        </button>
      </header>

      {isSessionLoading ? (
        <div className="mt-5 h-32 animate-pulse rounded-2xl bg-surface-muted" aria-label="로그인 상태 확인 중" />
      ) : currentStaff ? (
        <form onSubmit={handleSubmit} noValidate className="mt-5">
          <label htmlFor="comment-content" className="sr-only">{postContent.comments.inputLabel}</label>
          <div className="rounded-2xl border border-border-subtle bg-white p-3 transition-colors focus-within:border-brand sm:p-4">
            <textarea
              id="comment-content"
              value={content}
              onChange={(event) => {
                setContent(event.target.value)
                if (validationMessage) setValidationMessage('')
              }}
              onKeyDown={handleComposerKeyDown}
              maxLength={2000}
              rows={3}
              placeholder={postContent.comments.inputPlaceholder}
              aria-invalid={Boolean(validationMessage)}
              aria-describedby={validationMessage ? 'comment-content-error' : 'comment-composer-help'}
              className="min-h-24 w-full resize-y bg-transparent px-1 py-1 text-base leading-7 text-ink outline-none placeholder:text-ink-soft"
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-3">
              <p id="comment-composer-help" className="text-xs text-ink-soft">
                {currentStaff.name} · {content.length.toLocaleString('ko-KR')}/2,000
              </p>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-bold text-white transition-colors hover:bg-brand-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-60"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {createMutation.isPending ? postContent.comments.submitting : postContent.comments.submit}
              </button>
            </div>
          </div>
          {validationMessage ? <p id="comment-content-error" role="alert" className="mt-2 text-sm text-danger">{validationMessage}</p> : null}
          {createMutation.isError ? <p role="alert" className="mt-2 text-sm text-danger">{postContent.comments.createError}</p> : null}
        </form>
      ) : (
        <div className="mt-5 flex min-h-28 flex-col items-start justify-center gap-3 rounded-2xl border border-border-subtle bg-surface-muted px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-ink">{postContent.comments.loginTitle}</p>
            <p className="mt-1 text-sm text-ink-muted">{postContent.comments.loginDescription}</p>
          </div>
          <Link to="/login" className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-brand px-5 text-sm font-bold text-white transition-colors hover:bg-brand-strong">
            {postContent.comments.loginCta}
          </Link>
        </div>
      )}

      <div className="mt-7 flex items-center justify-between gap-4 border-b border-border-subtle">
        <div role="group" aria-label={postContent.comments.sortLabel} className="flex gap-5">
          {(['latest', 'oldest'] as const).map((order) => (
            <button
              key={order}
              type="button"
              onClick={() => setSortOrder(order)}
              aria-pressed={sortOrder === order}
              className={`relative min-h-11 pb-3 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${sortOrder === order ? 'text-brand' : 'text-ink-soft hover:text-ink'}`}
            >
              {order === 'latest' ? postContent.comments.latestSort : postContent.comments.oldestSort}
              {sortOrder === order ? <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand" aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
        {showMineOnly ? <span className="pb-3 text-xs font-semibold text-brand">{visibleComments.length}{postContent.comments.filteredCountSuffix}</span> : null}
      </div>

      {isLoading ? (
        <div className="space-y-3 py-6" aria-label={postContent.comments.loading}>
          {[0, 1].map((item) => <div key={item} className="h-28 animate-pulse rounded-2xl bg-surface-muted" />)}
        </div>
      ) : isError ? (
        <div className="py-10 text-center">
          <p className="text-sm text-danger">{postContent.comments.loadError}</p>
          <button type="button" onClick={() => void refetch()} className="mt-4 min-h-11 rounded-full border border-border-subtle px-5 text-sm font-bold text-ink hover:border-brand hover:text-brand">{postContent.comments.retry}</button>
        </div>
      ) : visibleComments.length > 0 ? (
        <ul className="divide-y divide-border-subtle">
          {visibleComments.map((comment) => {
            const isMine = currentStaff?.id === comment.authorId
            return (
              <li key={comment.id} className="flex gap-3 py-5 sm:gap-4 sm:py-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-extrabold text-brand-strong" aria-hidden="true">
                  {comment.author.trim().charAt(0).toUpperCase() || 'B'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-bold text-ink">{comment.author}</span>
                    {isMine ? <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-bold text-brand">{postContent.comments.mineBadge}</span> : null}
                    {comment.inReplyTo ? <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-semibold text-ink-muted">{postContent.comments.replyBadge}</span> : null}
                    <time dateTime={comment.createdAt} className="text-xs text-ink-soft">{koDateTimeFormatter.format(new Date(comment.createdAt))}</time>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap break-words text-base leading-7 text-ink-muted">{comment.content}</p>
                </div>
                {canDelete(comment.authorId) ? (
                  <AlertDialog>
                    <AlertDialogTrigger className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-[#fff2f1] hover:text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger" aria-label={postContent.comments.deleteLabel}>
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </AlertDialogTrigger>
                    <AlertDialogContent
                      overlayProps={{ className: 'fixed inset-0 z-40 bg-ink/40' }}
                      className="responsive-dialog fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border-subtle bg-white p-5 shadow-xl sm:p-6"
                    >
                      <AlertDialogTitle className="text-lg font-extrabold text-navy">{postContent.comments.deleteDialogTitle}</AlertDialogTitle>
                      <AlertDialogDescription className="mt-2 text-sm leading-6 text-ink-muted">{postContent.comments.deleteDialogDescription}</AlertDialogDescription>
                      <div className="responsive-actions mt-6">
                        <AlertDialogCancel className="min-h-11 w-full rounded-full border border-border-subtle px-4 text-sm font-bold text-ink-muted min-[375px]:w-auto">{postContent.comments.cancel}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(comment.id)} className="min-h-11 w-full rounded-full bg-danger px-4 text-sm font-bold text-white min-[375px]:w-auto">{postContent.comments.deleteConfirm}</AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : null}
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center px-5 py-12 text-center">
          <MessageCircle className="h-14 w-14 text-border-strong" strokeWidth={1.4} aria-hidden="true" />
          <p className="mt-5 text-base font-bold text-ink-muted">{showMineOnly ? postContent.comments.mineEmpty : postContent.comments.empty}</p>
        </div>
      )}

      <Toast
        open={toast.open}
        onOpenChange={(open) => setToast((current) => ({ ...current, open }))}
        duration={3500}
        className="flex items-start gap-3 rounded-2xl border border-border-subtle bg-white p-4 shadow-lg data-[state=closed]:animate-[toast-out_150ms_ease-in] data-[state=open]:animate-[toast-in_200ms_ease-out]"
      >
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
        <div className="flex-1">
          <ToastTitle className="text-sm font-bold text-ink">{toast.title}</ToastTitle>
          <ToastDescription className="mt-0.5 text-sm text-ink-muted">{toast.description}</ToastDescription>
        </div>
        <ToastClose aria-label="닫기" className="text-ink-soft hover:text-ink">
          <X className="h-4 w-4" aria-hidden="true" />
        </ToastClose>
      </Toast>
    </section>
  )
}
