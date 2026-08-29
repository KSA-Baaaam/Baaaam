import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, ChevronDown } from 'lucide-react'

import { categories } from '@/data/categories'
import type { Post, PostInput } from '@/services/posts'
import { postsService } from '@/services/posts'
import {
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { adminContent } from '@/content/admin'

type PostFormProps = {
  /** null이면 새 글 작성, 값이 있으면 해당 글 수정. */
  post: Post | null
  staffName: string
  onCancel: () => void
  onSaved: (mode: 'create' | 'update') => void
}

type FieldErrors = {
  title?: string
  categoryId?: string
  content?: string
  imageUrl?: string
}

const fieldClassName =
  'w-full rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong'

/** 글 작성/수정(core). 제출 성공 시 목록으로 돌아가도록 `onSaved`를 호출한다. */
export function PostForm({ post, staffName, onCancel, onSaved }: PostFormProps) {
  const queryClient = useQueryClient()
  const isEditMode = post !== null

  const [title, setTitle] = useState(post?.title ?? '')
  const [categoryId, setCategoryId] = useState(post?.categoryId ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [imageUrl, setImageUrl] = useState(post?.imageUrl ?? '')
  const [videoUrl, setVideoUrl] = useState(post?.videoUrl ?? '')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const mutation = useMutation({
    mutationFn: (input: PostInput) =>
      isEditMode ? postsService.update(post.id, input) : postsService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      onSaved(isEditMode ? 'update' : 'create')
    },
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()
    const trimmedImageUrl = imageUrl.trim()
    const trimmedVideoUrl = videoUrl.trim()

    const nextErrors: FieldErrors = {}
    if (!trimmedTitle) {
      nextErrors.title = adminContent.postForm.validation.title
    }
    if (!categoryId) {
      nextErrors.categoryId = adminContent.postForm.validation.categoryId
    }
    if (!trimmedContent) {
      nextErrors.content = adminContent.postForm.validation.content
    }
    if (!trimmedImageUrl) {
      nextErrors.imageUrl = adminContent.postForm.validation.imageUrl
    }
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    // 추천 여부는 이 폼이 아니라 목록의 토글이 소유하는 값이므로 기존 값을 그대로 넘긴다.
    mutation.mutate({
      title: trimmedTitle,
      categoryId,
      content: trimmedContent,
      imageUrl: trimmedImageUrl,
      videoUrl: trimmedVideoUrl || null,
      author: staffName,
      isRecommended: post?.isRecommended ?? false,
    })
  }

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 md:p-8">
      <h2 className="text-lg font-bold text-ink">
        {isEditMode ? adminContent.postForm.editTitle : adminContent.postForm.createTitle}
      </h2>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="post-title" className="mb-1.5 block text-sm font-semibold text-ink">
            {adminContent.postForm.titleLabel}
          </label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby={fieldErrors.title ? 'post-title-error' : undefined}
            className={fieldClassName}
          />
          {fieldErrors.title ? (
            <p id="post-title-error" role="alert" className="mt-1.5 text-xs text-danger">
              {fieldErrors.title}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="post-category" className="mb-1.5 block text-sm font-semibold text-ink">
            {adminContent.postForm.categoryLabel}
          </label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger
              id="post-category"
              aria-invalid={Boolean(fieldErrors.categoryId)}
              aria-describedby={fieldErrors.categoryId ? 'post-category-error' : undefined}
              className="flex w-full items-center justify-between rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong"
            >
              <SelectValue placeholder={adminContent.postForm.categoryPlaceholder} />
              <SelectIcon>
                <ChevronDown className="h-4 w-4 text-ink-muted" aria-hidden="true" />
              </SelectIcon>
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="overflow-hidden rounded-xl border border-border-subtle bg-surface-card shadow-lg"
            >
              {categories.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                  className="flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm text-ink outline-none data-[highlighted]:bg-brand/10"
                >
                  <SelectItemText>{category.label}</SelectItemText>
                  <SelectItemIndicator>
                    <Check className="h-4 w-4 text-brand" aria-hidden="true" />
                  </SelectItemIndicator>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldErrors.categoryId ? (
            <p id="post-category-error" role="alert" className="mt-1.5 text-xs text-danger">
              {fieldErrors.categoryId}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="post-content" className="mb-1.5 block text-sm font-semibold text-ink">
            {adminContent.postForm.contentLabel}
          </label>
          <textarea
            id="post-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={6}
            aria-invalid={Boolean(fieldErrors.content)}
            aria-describedby={fieldErrors.content ? 'post-content-error' : undefined}
            className={`${fieldClassName} resize-none`}
          />
          {fieldErrors.content ? (
            <p id="post-content-error" role="alert" className="mt-1.5 text-xs text-danger">
              {fieldErrors.content}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="post-image" className="mb-1.5 block text-sm font-semibold text-ink">
            {adminContent.postForm.imageLabel}
          </label>
          <input
            id="post-image"
            type="text"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder={adminContent.postForm.imagePlaceholder}
            aria-invalid={Boolean(fieldErrors.imageUrl)}
            aria-describedby="post-image-help post-image-error"
            className={fieldClassName}
          />
          <p id="post-image-help" className="mt-1.5 text-xs text-ink-muted">
            {adminContent.postForm.imageHelp}
          </p>
          {fieldErrors.imageUrl ? (
            <p id="post-image-error" role="alert" className="mt-1.5 text-xs text-danger">
              {fieldErrors.imageUrl}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="post-video" className="mb-1.5 block text-sm font-semibold text-ink">
            {adminContent.postForm.videoLabel}
          </label>
          <input
            id="post-video"
            type="url"
            value={videoUrl}
            onChange={(event) => setVideoUrl(event.target.value)}
            placeholder={adminContent.postForm.videoPlaceholder}
            className={fieldClassName}
          />
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-semibold text-ink">
            {adminContent.postForm.authorLabel}
          </span>
          <p className="rounded-xl border border-border-subtle bg-surface-muted px-4 py-2.5 text-sm text-ink-muted">
            {staffName}
          </p>
        </div>

        {mutation.isError ? (
          <p role="alert" className="text-sm text-danger">
            {adminContent.postForm.errorInline}
          </p>
        ) : null}

        <div className="mt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-surface-card transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-70"
          >
            {mutation.isPending
              ? adminContent.postForm.submitting
              : isEditMode
                ? adminContent.postForm.submitUpdate
                : adminContent.postForm.submitCreate}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-border-subtle px-6 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:border-brand hover:text-brand-strong"
          >
            {adminContent.postForm.cancel}
          </button>
        </div>
      </form>
    </div>
  )
}
