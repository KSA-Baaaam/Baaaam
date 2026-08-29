import { useState } from 'react'
import type { FormEvent } from 'react'
import { LogIn } from 'lucide-react'

import { useOperatorSession } from '@/services/session'
import { adminContent } from '@/content/admin'

type FieldErrors = {
  email?: string
  password?: string
}

const fieldClassName =
  'w-full rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong'

type OperatorLoginFormProps = {
  onSwitchToSignup: () => void
}

/** 운영진 로그인 폼(core: 실제 BaaS 계정 인증). */
export function OperatorLoginForm({ onSwitchToSignup }: OperatorLoginFormProps) {
  const { login, isLoggingIn, loginErrorMessage } = useOperatorSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitFailed, setSubmitFailed] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedEmail = email.trim()
    const nextErrors: FieldErrors = {}
    if (!trimmedEmail) {
      nextErrors.email = adminContent.loginForm.validation.email
    }
    if (!password) {
      nextErrors.password = adminContent.loginForm.validation.password
    }
    setFieldErrors(nextErrors)
    setSubmitFailed(false)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const ok = await login(trimmedEmail, password)
    if (!ok) {
      setSubmitFailed(true)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border-subtle bg-surface-card p-6 md:p-8">
      <p className="mb-1 text-sm font-semibold text-brand-strong">{adminContent.loginForm.eyebrow}</p>
      <p className="mb-6 text-sm text-ink-muted">{adminContent.loginForm.description}</p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-ink">
            {adminContent.loginForm.emailLabel}
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={adminContent.loginForm.emailPlaceholder}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
            className={fieldClassName}
          />
          {fieldErrors.email ? (
            <p id="login-email-error" role="alert" className="mt-1.5 text-xs text-danger">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold text-ink">
            {adminContent.loginForm.passwordLabel}
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={adminContent.loginForm.passwordPlaceholder}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
            className={fieldClassName}
          />
          {fieldErrors.password ? (
            <p id="login-password-error" role="alert" className="mt-1.5 text-xs text-danger">
              {fieldErrors.password}
            </p>
          ) : null}
        </div>

        {submitFailed ? (
          <p role="alert" className="text-sm text-danger">
            {loginErrorMessage ?? adminContent.loginForm.errorFallback}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isLoggingIn}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-surface-card transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-70"
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          {isLoggingIn ? adminContent.loginForm.submitting : adminContent.loginForm.submitCta}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        {adminContent.loginForm.switchToSignupPrompt}{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-semibold text-brand-strong underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong"
        >
          {adminContent.loginForm.switchToSignupCta}
        </button>
      </p>
    </div>
  )
}
