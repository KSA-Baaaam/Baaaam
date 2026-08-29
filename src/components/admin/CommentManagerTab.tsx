import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, Trash2, X } from 'lucide-react'

import { postsService } from '@/services/posts'
import type { Comment } from '@/services/comments'
import { commentsService } from '@/services/comments'
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
  ToastTitle,
} from '@/components/ui'
import { koDateTimeFormatter } from '@/lib/format'
import { adminContent } from '@/content/admin'

type CommentManagerTabProps = {
  staffId: string
  staffName: string
}

type QuestionReplyItemProps = {
  question: Comment
  postTitle: string
  staffName: string
  onReplied: () => void
}

/** 미답변 질문 한 건에 인라인 답변 폼을 붙인 항목. */
function QuestionReplyItem({ question, postTitle, staffName, onReplied }: QuestionReplyItemProps) {
  const queryClient = useQueryClient()
  const [reply, setReply] = useState('')
  const [hasError, setHasError] = useState(false)

  const mutation = useMutation({
    mutationFn: commentsService.addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      setReply('')
      setHasError(false)
      onReplied()
    },
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = reply.trim()
    if (!trimmed) {
      setHasError(true)
      return
    }
    setHasError(false)
    mutation.mutate({
      postId: question.postId,
      author: staffName,
      content: trimmed,
      isQuestion: false,
      inReplyTo: question.id,
    })
  }

  return (
    <li className="rounded-2xl border border-border-subtle bg-surface-card p-5">
      <p className="text-xs font-semibold text-brand-strong">{postTitle}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{question.author}</p>
      <p className="mt-1 text-sm leading-6 text-ink-muted">{question.content}</p>

      <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col items-start gap-2">
        <label htmlFor={`reply-${question.id}`} className="sr-only">
          {adminContent.commentManager.replyPlaceholder}
        </label>
        <textarea
          id={`reply-${question.id}`}
          value={reply}
          onChange={(event) => setReply(event.target.value)}
          placeholder={adminContent.commentManager.replyPlaceholder}
          rows={2}
          aria-invalid={hasError}
          className="w-full resize-none rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong"
        />
        {hasError ? (
          <p role="alert" className="text-xs text-danger">
            {adminContent.commentManager.replyValidation}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 self-start rounded-full bg-brand px-4 py-2 text-sm font-semibold text-surface-card transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-70"
        >
          {mutation.isPending
            ? adminContent.commentManager.replySubmitting
            : adminContent.commentManager.replySubmit}
        </button>
      </form>
    </li>
  )
}

/** 댓글 관리(core: 질문 답변 작성, 댓글 삭제). */
export function CommentManagerTab({ staffId, staffName }: CommentManagerTabProps) {
  const queryClient = useQueryClient()
  const [toast, setToast] = useState({ open: false, message: '' })

  const { data: comments = [], isLoading: isCommentsLoading } = useQuery({
    queryKey: ['comments', 'all'],
    queryFn: commentsService.listAll,
  })
  const { data: posts = [] } = useQuery({ queryKey: ['posts', 'all'], queryFn: postsService.listAll })

  const postTitleById = useMemo(() => new Map(posts.map((post) => [post.id, post.title])), [posts])

  const unansweredQuestions = useMemo(
    () =>
      comments.filter(
        (comment) => comment.isQuestion && !comments.some((other) => other.inReplyTo === comment.id),
      ),
    [comments],
  )

  const deleteMutation = useMutation({
    mutationFn: (id: string) => commentsService.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      setToast({ open: true, message: adminContent.commentManager.deleteSuccessToast })
    },
  })

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="unanswered-heading">
        <h2 id="unanswered-heading" className="mb-4 text-lg font-bold text-ink">
          {adminContent.commentManager.unansweredTitle}
          {unansweredQuestions.length > 0 ? (
            <span className="ml-2 text-base font-medium text-ink-muted">
              {unansweredQuestions.length}
            </span>
          ) : null}
        </h2>

        {isCommentsLoading ? (
          <p className="text-sm text-ink-muted">{adminContent.commentManager.loading}</p>
        ) : unansweredQuestions.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border-subtle bg-surface-card px-6 py-8 text-center text-sm text-ink-muted">
            {adminContent.commentManager.unansweredEmpty}
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {unansweredQuestions.map((question) => (
              <QuestionReplyItem
                key={question.id}
                question={question}
                postTitle={postTitleById.get(question.postId) ?? question.postId}
                staffName={staffName}
                onReplied={() =>
                  setToast({ open: true, message: adminContent.commentManager.replySuccessToast })
                }
              />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="all-comments-heading">
        <h2 id="all-comments-heading" className="mb-4 text-lg font-bold text-ink">
          {adminContent.commentManager.allCommentsTitle}
        </h2>

        {isCommentsLoading ? (
          <p className="text-sm text-ink-muted">{adminContent.commentManager.loading}</p>
        ) : comments.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border-subtle bg-surface-card px-6 py-8 text-center text-sm text-ink-muted">
            {adminContent.commentManager.allCommentsEmpty}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border-subtle bg-surface-card p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold text-brand-strong">
                      {postTitleById.get(comment.postId) ?? comment.postId}
                    </p>
                    {comment.isQuestion ? (
                      <span className="rounded-full bg-spark px-2 py-0.5 text-xs font-semibold text-ink">
                        {adminContent.commentManager.questionBadge}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-ink">{comment.author}</p>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">{comment.content}</p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {koDateTimeFormatter.format(new Date(comment.createdAt))}
                  </p>
                </div>

                {comment.authorId === staffId ? <AlertDialog>
                  <AlertDialogTrigger className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border-subtle px-3 py-1.5 text-xs font-semibold text-ink-muted transition-colors hover:border-danger hover:text-danger">
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    {adminContent.commentManager.deleteCta}
                  </AlertDialogTrigger>
                  <AlertDialogContent
                    overlayProps={{ className: 'fixed inset-0 z-40 bg-ink/40' }}
                    className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-3rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-xl"
                  >
                    <AlertDialogTitle className="text-base font-bold text-ink">
                      {adminContent.commentManager.deleteDialogTitle}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="mt-2 text-sm text-ink-muted">
                      {adminContent.commentManager.deleteDialogDescription}
                    </AlertDialogDescription>
                    <div className="mt-6 flex justify-end gap-3">
                      <AlertDialogCancel className="rounded-full border border-border-subtle px-4 py-2 text-sm font-semibold text-ink-muted transition-colors hover:border-brand hover:text-brand-strong">
                        {adminContent.commentManager.deleteDialogCancel}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(comment.id)}
                        className="rounded-full bg-danger px-4 py-2 text-sm font-semibold text-surface-card transition-colors hover:opacity-90"
                      >
                        {adminContent.commentManager.deleteDialogConfirm}
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <Toast
        open={toast.open}
        onOpenChange={(open) => setToast((current) => ({ ...current, open }))}
        duration={4000}
        className="flex items-start gap-3 rounded-2xl border border-border-subtle bg-surface-card p-4 shadow-lg data-[state=closed]:animate-[toast-out_150ms_ease-in] data-[state=open]:animate-[toast-in_200ms_ease-out]"
      >
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
        <div className="flex-1">
          <ToastTitle className="text-sm font-semibold text-ink">{toast.message}</ToastTitle>
        </div>
        <ToastClose
          aria-label="닫기"
          className="text-ink-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </ToastClose>
      </Toast>
    </div>
  )
}
