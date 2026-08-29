import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, Plus, X } from 'lucide-react'

import { categories } from '@/data/categories'
import type { Post } from '@/services/posts'
import { postsService } from '@/services/posts'
import { PostForm } from '@/components/admin/PostForm'
import { Switch, SwitchThumb, Toast, ToastClose, ToastTitle } from '@/components/ui'
import { adminContent } from '@/content/admin'

const categoryLabelById = new Map(categories.map((category) => [category.id, category.label]))

type PostManagerTabProps = {
  staffId: string
  staffName: string
}

/** 글 관리(core: 글 작성/수정, 추천 글 지정). */
export function PostManagerTab({ staffId, staffName }: PostManagerTabProps) {
  const queryClient = useQueryClient()
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts', 'all'],
    queryFn: postsService.listAll,
  })
  const [formTarget, setFormTarget] = useState<'new' | Post | null>(null)
  const [toast, setToast] = useState({ open: false, message: '' })

  const recommendMutation = useMutation({
    mutationFn: (vars: { id: string; isRecommended: boolean }) =>
      postsService.setRecommended(vars.id, vars.isRecommended),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const sortedPosts = useMemo(
    () =>
      posts
        .filter((post) => post.authorId === staffId)
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
    [posts, staffId],
  )

  function handleSaved(mode: 'create' | 'update') {
    setFormTarget(null)
    setToast({
      open: true,
      message:
        mode === 'create' ? adminContent.postManager.createdToast : adminContent.postManager.updatedToast,
    })
  }

  if (formTarget !== null) {
    return (
      <PostForm
        post={formTarget === 'new' ? null : formTarget}
        staffName={staffName}
        onCancel={() => setFormTarget(null)}
        onSaved={handleSaved}
      />
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-ink">{adminContent.postManager.listTitle}</h2>
        <button
          type="button"
          onClick={() => setFormTarget('new')}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-surface-card transition-colors hover:bg-brand-strong"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {adminContent.postManager.newPostCta}
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-ink-muted">{adminContent.postManager.loading}</p>
      ) : sortedPosts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-subtle bg-surface-card px-6 py-12 text-center text-sm text-ink-muted">
          {adminContent.postManager.empty}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border-subtle">
          <table className="w-full min-w-[720px] border-collapse bg-surface-card text-sm">
            <caption className="sr-only">{adminContent.postManager.tableCaption}</caption>
            <thead>
              <tr className="border-b border-border-subtle bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                <th scope="col" className="px-4 py-3">
                  {adminContent.postManager.tableHeaders.title}
                </th>
                <th scope="col" className="px-4 py-3">
                  {adminContent.postManager.tableHeaders.category}
                </th>
                <th scope="col" className="px-4 py-3">
                  {adminContent.postManager.tableHeaders.author}
                </th>
                <th scope="col" className="px-4 py-3">
                  {adminContent.postManager.tableHeaders.recommended}
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  {adminContent.postManager.tableHeaders.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPosts.map((post) => {
                const isTogglePending =
                  recommendMutation.isPending && recommendMutation.variables?.id === post.id

                return (
                  <tr key={post.id} className="border-b border-border-subtle last:border-b-0">
                    <td className="max-w-[280px] truncate px-4 py-3 font-semibold text-ink">
                      {post.title}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {categoryLabelById.get(post.categoryId) ?? post.categoryId}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{post.author}</td>
                    <td className="px-4 py-3">
                      <Switch
                        checked={post.isRecommended}
                        onCheckedChange={(checked) =>
                          recommendMutation.mutate({ id: post.id, isRecommended: checked })
                        }
                        disabled={isTogglePending}
                        aria-label={`${post.title} ${adminContent.postManager.recommendedToggleLabel}`}
                        className="relative h-6 w-11 shrink-0 rounded-full bg-border-subtle transition-colors data-[state=checked]:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong disabled:opacity-60"
                      >
                        <SwitchThumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-surface-card shadow transition-transform data-[state=checked]:translate-x-[22px]" />
                      </Switch>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setFormTarget(post)}
                        className="rounded-full border border-border-subtle px-4 py-1.5 text-sm font-semibold text-ink-muted transition-colors hover:border-brand hover:text-brand-strong"
                      >
                        {adminContent.postManager.editCta}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

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
