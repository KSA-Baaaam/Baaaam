import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, X } from 'lucide-react'

import { commentsService } from '@/services/comments'
import { Toast, ToastClose, ToastDescription, ToastTitle } from '@/components/ui'
import { postContent } from '@/content/post'

type QuestionFormProps = {
  postId: string
}

type FieldErrors = {
  author?: string
  content?: string
}

/** 질문 작성(core). 제출이 성공하면 댓글 목록 쿼리를 무효화하고 토스트로 알린다. */
export function QuestionForm({ postId }: QuestionFormProps) {
  const queryClient = useQueryClient()
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [toastOpen, setToastOpen] = useState(false)

  const mutation = useMutation({
    mutationFn: commentsService.addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      setAuthor('')
      setContent('')
      setFieldErrors({})
      setToastOpen(true)
    },
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedAuthor = author.trim()
    const trimmedContent = content.trim()
    const nextErrors: FieldErrors = {}
    if (!trimmedAuthor) {
      nextErrors.author = postContent.question.validation.author
    }
    if (!trimmedContent) {
      nextErrors.content = postContent.question.validation.content
    }
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    mutation.mutate({
      postId,
      author: trimmedAuthor,
      content: trimmedContent,
      isQuestion: true,
      inReplyTo: null,
    })
  }

  return (
    <section
      aria-labelledby="question-heading"
      className="rounded-2xl border border-border-subtle bg-surface-muted p-6 md:p-8"
    >
      <p className="mb-2 text-sm font-semibold text-brand-strong">
        {postContent.question.eyebrow}
      </p>
      <h2 id="question-heading" className="text-xl font-bold text-ink md:text-2xl">
        {postContent.question.title}
      </h2>
      <p className="mt-2 text-sm text-ink-muted">{postContent.question.description}</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="question-author" className="mb-1.5 block text-sm font-semibold text-ink">
            {postContent.question.nameLabel}
          </label>
          <input
            id="question-author"
            type="text"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder={postContent.question.namePlaceholder}
            aria-invalid={Boolean(fieldErrors.author)}
            aria-describedby={fieldErrors.author ? 'question-author-error' : undefined}
            className="w-full rounded-xl border border-border-subtle bg-surface-card px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong"
          />
          {fieldErrors.author ? (
            <p id="question-author-error" role="alert" className="mt-1.5 text-xs text-danger">
              {fieldErrors.author}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="question-content"
            className="mb-1.5 block text-sm font-semibold text-ink"
          >
            {postContent.question.contentLabel}
          </label>
          <textarea
            id="question-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={postContent.question.contentPlaceholder}
            rows={4}
            aria-invalid={Boolean(fieldErrors.content)}
            aria-describedby={fieldErrors.content ? 'question-content-error' : undefined}
            className="w-full resize-none rounded-xl border border-border-subtle bg-surface-card px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong"
          />
          {fieldErrors.content ? (
            <p
              id="question-content-error"
              role="alert"
              className="mt-1.5 text-xs text-danger"
            >
              {fieldErrors.content}
            </p>
          ) : null}
        </div>

        {mutation.isError ? (
          <p role="alert" className="text-sm text-danger">
            {postContent.question.errorInline}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-surface-card transition-colors hover:bg-brand-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong disabled:cursor-not-allowed disabled:opacity-70"
        >
          {mutation.isPending ? postContent.question.submitting : postContent.question.submit}
        </button>
      </form>

      <Toast
        open={toastOpen}
        onOpenChange={setToastOpen}
        duration={4000}
        className="flex items-start gap-3 rounded-2xl border border-border-subtle bg-surface-card p-4 shadow-lg data-[state=closed]:animate-[toast-out_150ms_ease-in] data-[state=open]:animate-[toast-in_200ms_ease-out]"
      >
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
        <div className="flex-1">
          <ToastTitle className="text-sm font-semibold text-ink">
            {postContent.question.successToastTitle}
          </ToastTitle>
          <ToastDescription className="mt-0.5 text-sm text-ink-muted">
            {postContent.question.successToastDescription}
          </ToastDescription>
        </div>
        <ToastClose
          aria-label="닫기"
          className="text-ink-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </ToastClose>
      </Toast>
    </section>
  )
}
