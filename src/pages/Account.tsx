import { AlertTriangle, KeyRound, LockKeyhole, UserRound } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { SiteFooter } from '@/components/home/SiteFooter'
import { SiteHeader } from '@/components/home/SiteHeader'
import { MyCommentsSection } from '@/components/account/MyCommentsSection'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui'
import { roleLabels } from '@/services/profiles'
import { useOperatorSession } from '@/services/session'

export default function Account() {
  const navigate = useNavigate()
  const { currentStaff, isSessionLoading, changePassword, isChangingPassword, deleteAccount, isDeletingAccount } = useOperatorSession()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [passwordChangeError, setPasswordChangeError] = useState('')
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('')

  function resetDialog(open: boolean) {
    setDialogOpen(open)
    if (!open) {
      setPassword('')
      setErrorMessage('')
    }
  }

  async function handleDelete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    if (!password) {
      setErrorMessage('현재 비밀번호를 입력해주세요.')
      return
    }

    const result = await deleteAccount(password)
    if (!result.ok) {
      setErrorMessage(result.errorMessage ?? '계정을 삭제하지 못했어요.')
      return
    }

    setDialogOpen(false)
    navigate('/', { replace: true })
  }

  async function handlePasswordChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPasswordChangeError('')
    setPasswordChangeSuccess('')

    if (!currentPassword) {
      setPasswordChangeError('현재 비밀번호를 입력해주세요.')
      return
    }
    if (newPassword.length < 8) {
      setPasswordChangeError('새 비밀번호는 8자 이상으로 입력해주세요.')
      return
    }
    if (newPassword !== newPasswordConfirm) {
      setPasswordChangeError('새 비밀번호가 서로 일치하지 않아요.')
      return
    }
    if (currentPassword === newPassword) {
      setPasswordChangeError('현재 비밀번호와 다른 비밀번호를 입력해주세요.')
      return
    }

    const result = await changePassword(currentPassword, newPassword)
    if (!result.ok) {
      setPasswordChangeError(result.errorMessage ?? '비밀번호를 변경하지 못했어요.')
      return
    }

    setCurrentPassword('')
    setNewPassword('')
    setNewPasswordConfirm('')
    setPasswordChangeSuccess('비밀번호가 변경됐어요.')
  }

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main mx-auto w-full max-w-3xl px-4 py-10 min-[375px]:px-5 sm:px-6 sm:py-14">
        <p className="text-sm font-bold text-brand-strong">내 계정</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.035em] text-navy sm:text-4xl">계정 관리</h1>
        <p className="mt-3 text-sm leading-6 text-ink-muted">로그인 정보와 비밀번호, 회원탈퇴를 관리할 수 있어요.</p>

        {isSessionLoading ? (
          <p className="mt-10 text-sm text-ink-muted">계정 정보를 불러오고 있어요.</p>
        ) : currentStaff ? (
          <div className="mt-10 space-y-8">
            <section className="rounded-xl border border-border-subtle bg-surface-card p-5 sm:p-7" aria-labelledby="account-profile-title">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <UserRound className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h2 id="account-profile-title" className="text-lg font-bold text-navy">{currentStaff.name}</h2>
                  <p className="mt-1 break-all text-sm text-ink-muted">{currentStaff.email}</p>
                  <span className="mt-3 inline-flex rounded-full bg-section px-3 py-1 text-xs font-bold text-brand-strong">{roleLabels[currentStaff.role]}</span>
                </div>
              </div>
            </section>

            <MyCommentsSection />

            <section className="rounded-xl border border-border-subtle bg-surface-card p-5 sm:p-7" aria-labelledby="change-password-title">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <KeyRound className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 id="change-password-title" className="text-lg font-bold text-navy">비밀번호 변경</h2>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">현재 비밀번호를 확인한 뒤 새 비밀번호로 변경합니다.</p>
                </div>
              </div>

              <form onSubmit={(event) => void handlePasswordChange(event)} className="mt-6 grid gap-5" noValidate>
                <label className="block text-sm font-bold text-navy">현재 비밀번호
                  <input
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    type="password"
                    autoComplete="current-password"
                    className="form-input"
                    placeholder="현재 비밀번호를 입력해주세요"
                    disabled={isChangingPassword}
                  />
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-sm font-bold text-navy">새 비밀번호
                    <input
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      type="password"
                      autoComplete="new-password"
                      className="form-input"
                      placeholder="8자 이상 입력해주세요"
                      minLength={8}
                      disabled={isChangingPassword}
                    />
                  </label>
                  <label className="block text-sm font-bold text-navy">새 비밀번호 확인
                    <input
                      value={newPasswordConfirm}
                      onChange={(event) => setNewPasswordConfirm(event.target.value)}
                      type="password"
                      autoComplete="new-password"
                      className="form-input"
                      placeholder="한 번 더 입력해주세요"
                      minLength={8}
                      disabled={isChangingPassword}
                    />
                  </label>
                </div>
                {passwordChangeError ? <p role="alert" className="text-sm leading-6 text-danger">{passwordChangeError}</p> : null}
                {passwordChangeSuccess ? <p role="status" className="text-sm font-semibold leading-6 text-brand-strong">{passwordChangeSuccess}</p> : null}
                <div>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand px-5 text-sm font-bold text-white transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-60 min-[375px]:w-auto"
                  >
                    {isChangingPassword ? '변경 중...' : '비밀번호 변경'}
                  </button>
                </div>
              </form>
            </section>

            <section className="rounded-xl border border-danger/30 bg-surface-card p-5 sm:p-7" aria-labelledby="delete-account-title">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
                <div>
                  <h2 id="delete-account-title" className="text-lg font-bold text-navy">회원탈퇴</h2>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">탈퇴하면 계정 정보와 작성한 질문·댓글이 영구 삭제돼요.</p>
                </div>
              </div>

              <AlertDialog open={dialogOpen} onOpenChange={resetDialog}>
                <AlertDialogTrigger className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-danger px-5 text-sm font-bold text-danger transition-colors hover:bg-danger hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger">
                  회원탈퇴
                </AlertDialogTrigger>
                <AlertDialogContent
                  overlayProps={{ className: 'fixed inset-0 z-40 bg-ink/50' }}
                  className="responsive-dialog fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border-subtle bg-surface-card p-5 shadow-xl sm:p-8"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                    <LockKeyhole className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <AlertDialogTitle className="mt-5 text-xl font-extrabold text-navy">정말 탈퇴하시겠어요?</AlertDialogTitle>
                  <AlertDialogDescription className="mt-2 text-sm leading-6 text-ink-muted">삭제된 계정과 댓글은 복구할 수 없습니다. 본인 확인을 위해 현재 비밀번호를 입력해주세요.</AlertDialogDescription>

                  <form onSubmit={(event) => void handleDelete(event)} className="mt-5">
                    <label className="block text-sm font-bold text-navy">현재 비밀번호
                      <input
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        type="password"
                        autoComplete="current-password"
                        className="form-input"
                        placeholder="비밀번호를 입력해주세요"
                        disabled={isDeletingAccount}
                        autoFocus
                      />
                    </label>
                    {errorMessage ? <p role="alert" className="mt-3 text-sm leading-6 text-danger">{errorMessage}</p> : null}
                    <div className="mt-6 flex flex-col-reverse gap-3 min-[375px]:flex-row min-[375px]:justify-end">
                      <AlertDialogCancel type="button" disabled={isDeletingAccount} className="rounded-full border border-border-subtle px-4 py-2 text-sm font-semibold text-ink-muted transition-colors hover:border-brand hover:text-brand-strong disabled:opacity-60">취소</AlertDialogCancel>
                      <button
                        type="submit"
                        disabled={isDeletingAccount}
                        className="rounded-full bg-danger px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isDeletingAccount ? '탈퇴 처리 중...' : '계정 영구 삭제'}
                      </button>
                    </div>
                  </form>
                </AlertDialogContent>
              </AlertDialog>
            </section>
          </div>
        ) : (
          <section className="mt-10 rounded-3xl border border-border-subtle bg-surface-card px-6 py-12 text-center">
            <h2 className="text-xl font-bold text-navy">로그인이 필요해요</h2>
            <p className="mt-2 text-sm text-ink-muted">계정을 관리하려면 먼저 로그인해주세요.</p>
            <Link to="/login" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-brand px-5 text-sm font-bold text-white hover:bg-brand-strong">로그인</Link>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
