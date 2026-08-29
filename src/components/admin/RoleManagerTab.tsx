import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, X } from 'lucide-react'

import { adminContent } from '@/content/admin'
import { profilesService, roleLabels } from '@/services/profiles'
import type { UserRole } from '@/services/profiles'
import { Toast, ToastClose, ToastTitle } from '@/components/ui'

type RoleManagerTabProps = {
  currentUserId: string
}

const roles: UserRole[] = ['general', 'author', 'admin']

export function RoleManagerTab({ currentUserId }: RoleManagerTabProps) {
  const queryClient = useQueryClient()
  const [toast, setToast] = useState({ open: false, message: '', isError: false })
  const { data: profiles = [], isLoading, isError } = useQuery({
    queryKey: ['profiles', 'all'],
    queryFn: profilesService.listAll,
  })

  const mutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      profilesService.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
      setToast({ open: true, message: adminContent.roleManager.savedToast, isError: false })
    },
    onError: () => {
      setToast({ open: true, message: adminContent.roleManager.saveError, isError: true })
    },
  })

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-ink">{adminContent.roleManager.title}</h2>
        <p className="mt-1 text-sm leading-6 text-ink-muted">{adminContent.roleManager.description}</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-ink-muted">{adminContent.roleManager.loading}</p>
      ) : isError ? (
        <p role="alert" className="rounded-2xl border border-danger/30 bg-surface-card px-6 py-8 text-center text-sm text-danger">
          {adminContent.roleManager.saveError}
        </p>
      ) : profiles.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-subtle bg-surface-card px-6 py-12 text-center text-sm text-ink-muted">
          {adminContent.roleManager.empty}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border-subtle">
          <table className="w-full min-w-[640px] border-collapse bg-surface-card text-sm">
            <caption className="sr-only">{adminContent.roleManager.tableCaption}</caption>
            <thead>
              <tr className="border-b border-border-subtle bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                <th scope="col" className="px-4 py-3">{adminContent.roleManager.name}</th>
                <th scope="col" className="px-4 py-3">{adminContent.roleManager.email}</th>
                <th scope="col" className="px-4 py-3">{adminContent.roleManager.role}</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => {
                const isSelf = profile.id === currentUserId
                const isPending = mutation.isPending && mutation.variables?.id === profile.id

                return (
                  <tr key={profile.id} className="border-b border-border-subtle last:border-b-0">
                    <td className="px-4 py-3 font-semibold text-ink">
                      {profile.displayName}
                      {isSelf ? (
                        <span className="ml-2 rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand-strong">
                          {adminContent.roleManager.selfLabel}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{profile.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={profile.role}
                        disabled={isSelf || isPending}
                        aria-label={`${profile.displayName} 권한`}
                        title={isSelf ? adminContent.roleManager.selfHelp : undefined}
                        onChange={(event) =>
                          mutation.mutate({ id: profile.id, role: event.target.value as UserRole })
                        }
                        className="min-h-10 rounded-lg border border-border-subtle bg-surface px-3 text-sm font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>{roleLabels[role]}</option>
                        ))}
                      </select>
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
        <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${toast.isError ? 'text-danger' : 'text-brand'}`} aria-hidden="true" />
        <div className="flex-1"><ToastTitle className="text-sm font-semibold text-ink">{toast.message}</ToastTitle></div>
        <ToastClose aria-label="닫기" className="text-ink-muted transition-colors hover:text-ink"><X className="h-4 w-4" /></ToastClose>
      </Toast>
    </div>
  )
}
