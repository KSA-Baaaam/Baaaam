import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, Plus, Trash2, X } from 'lucide-react'
import { Link } from 'react-router-dom'

import { categories } from '@/data/categories'
import { postsService } from '@/services/posts'
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
import { adminContent } from '@/content/admin'
import type { UserRole } from '@/services/profiles'

const categoryLabelById = new Map(categories.map((category) => [category.id, category.label]))

type PostManagerTabProps = {
  staffId: string
  role: UserRole
}

/** 글 관리(core: 글 작성/수정/삭제). */
export function PostManagerTab({ staffId, role }: PostManagerTabProps) {
  const queryClient = useQueryClient()
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts', 'manageable', role, staffId],
    queryFn: () => postsService.listManageable({ role, staffId }),
  })
  const [toast, setToast] = useState({ open: false, message: '' })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => postsService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setToast({ open: true, message: adminContent.postManager.deletedToast })
    },
    onError: () => {
      setToast({ open: true, message: adminContent.postManager.deleteErrorToast })
    },
  })

  const sortedPosts = useMemo(
    () =>
      posts
        .filter((post) => role === 'admin' || role === 'developer' || post.authorId === staffId)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [posts, role, staffId],
  )

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-ink">{adminContent.postManager.listTitle}</h2>
        <Link
          to="/write"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-surface-card transition-colors hover:bg-brand-strong"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {adminContent.postManager.newPostCta}
        </Link>
      </div>

      {isLoading ? (
        <p className="text-sm text-ink-muted">{adminContent.postManager.loading}</p>
      ) : sortedPosts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-subtle bg-surface-card px-6 py-12 text-center text-sm text-ink-muted">
          {adminContent.postManager.empty}
        </p>
      ) : (
        <div className="responsive-scroll overflow-x-auto rounded-2xl border border-border-subtle" tabIndex={0} aria-label="글 관리 표, 좌우로 스크롤할 수 있습니다">
          <table className="w-full min-w-[620px] border-collapse bg-surface-card text-sm">
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
                <th scope="col" className="px-4 py-3 text-right">
                  {adminContent.postManager.tableHeaders.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPosts.map((post) => (
                <tr key={post.id} className="border-b border-border-subtle last:border-b-0">
                  <td className="max-w-[280px] truncate px-4 py-3 font-semibold text-ink">
                    {post.title || '제목 없는 초안'}
                    {post.status === 'draft' ? <span className="ml-2 rounded-full bg-section px-2 py-0.5 text-[11px] text-ink-soft">초안</span> : null}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {categoryLabelById.get(post.categoryId) ?? post.categoryId}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{post.author}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/write/${post.id}`}
                        className="rounded-full border border-border-subtle px-4 py-1.5 text-sm font-semibold text-ink-muted transition-colors hover:border-brand hover:text-brand-strong"
                      >
                        {adminContent.postManager.editCta}
                      </Link>
                      {role === 'admin' || role === 'developer' || post.authorId === staffId ? (
                        <AlertDialog>
                            <AlertDialogTrigger className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle px-3 py-1.5 text-sm font-semibold text-ink-muted transition-colors hover:border-danger hover:text-danger">
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                              {adminContent.postManager.deleteCta}
                            </AlertDialogTrigger>
                            <AlertDialogContent
                              overlayProps={{ className: 'fixed inset-0 z-40 bg-ink/40' }}
                              className="responsive-dialog fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border-subtle bg-surface-card p-5 shadow-xl sm:p-6"
                            >
                              <AlertDialogTitle className="text-base font-bold text-ink">
                                {adminContent.postManager.deleteDialogTitle}
                              </AlertDialogTitle>
                              <AlertDialogDescription className="mt-2 text-sm leading-6 text-ink-muted">
                                {adminContent.postManager.deleteDialogDescription}
                              </AlertDialogDescription>
                              <div className="responsive-actions mt-6">
                                <AlertDialogCancel className="min-h-11 w-full rounded-full border border-border-subtle px-4 py-2 text-sm font-semibold text-ink-muted transition-colors hover:border-brand hover:text-brand-strong min-[375px]:w-auto">
                                  {adminContent.postManager.deleteDialogCancel}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(post.id)}
                                  disabled={deleteMutation.isPending}
                                  className="min-h-11 w-full rounded-full bg-danger px-4 py-2 text-sm font-semibold text-surface-card transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 min-[375px]:w-auto"
                                >
                                  {adminContent.postManager.deleteDialogConfirm}
                                </AlertDialogAction>
                              </div>
                            </AlertDialogContent>
                        </AlertDialog>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
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
