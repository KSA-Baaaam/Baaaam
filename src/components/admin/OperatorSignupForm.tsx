import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { CheckCircle2, UserPlus } from 'lucide-react'

import { useOperatorSignup } from '@/services/session'
import { adminContent } from '@/content/admin'

type FieldErrors = {
  name?: string
  email?: string
  password?: string
  phone?: string
  code?: string
  termsAgreed?: string
  privacyAgreed?: string
}

const fieldClassName =
  'w-full rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong'

const termsDetailsClassName = 'rounded-xl border border-border-subtle bg-surface px-4 py-3'

const RESEND_COOLDOWN_SECONDS = 60

type OperatorSignupFormProps = {
  onBackToLogin: () => void
}

/** 운영진 가입 신청 폼(core). 프로젝트 설정(config)을 매번 읽어 이메일 인증 단계를 분기한다. */
export function OperatorSignupForm({ onBackToLogin }: OperatorSignupFormProps) {
  const {
    config,
    terms,
    verified,
    fetchConfig,
    fetchTerms,
    sendCode,
    verifyCode,
    signUp,
    isSubmitting,
    signupErrorMessage,
    formatPhone,
  } = useOperatorSignup()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [privacyAgreed, setPrivacyAgreed] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitFailed, setSubmitFailed] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [result, setResult] = useState<'pending' | 'active' | null>(null)

  useEffect(() => {
    // 가입 화면 진입 시 1회만 조회한다(고정값 캐시 금지 — 매 진입마다 최신 설정을 읽는다).
    // SDK 문서 예시와 동일하게 빈 의존성 배열을 쓴다 — fetchConfig/fetchTerms를 넣으면
    // 매 렌더 새 함수라 무한 재요청 루프가 될 수 있다(sdk-surface.md ③ 주의).
    fetchConfig()
    fetchTerms()
  }, [])

  useEffect(() => {
    if (cooldown <= 0) {
      return
    }
    const timer = window.setInterval(() => {
      setCooldown((current) => Math.max(0, current - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [cooldown])

  const requiresEmailVerification = config?.signup_verification === 'EMAIL'
  const showRestOfForm = !requiresEmailVerification || verified

  async function handleSendCode() {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setFieldErrors((current) => ({ ...current, email: adminContent.signupForm.validation.email }))
      return
    }
    setFieldErrors((current) => ({ ...current, email: undefined }))
    setCodeSent(await sendCode(trimmedEmail))
    setCooldown(RESEND_COOLDOWN_SECONDS)
  }

  async function handleVerifyCode() {
    const trimmedCode = code.trim()
    if (!trimmedCode) {
      setFieldErrors((current) => ({ ...current, code: adminContent.signupForm.validation.code }))
      return
    }
    setFieldErrors((current) => ({ ...current, code: undefined }))
    await verifyCode(email.trim(), trimmedCode)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedPhone = phone.trim()

    const nextErrors: FieldErrors = {}
    if (!trimmedName) {
      nextErrors.name = adminContent.signupForm.validation.name
    }
    if (!trimmedEmail) {
      nextErrors.email = adminContent.signupForm.validation.email
    }
    if (password.length < 8) {
      nextErrors.password = adminContent.signupForm.validation.password
    }
    if (!trimmedPhone) {
      nextErrors.phone = adminContent.signupForm.validation.phone
    }
    if (requiresEmailVerification && !verified) {
      nextErrors.email = adminContent.signupForm.validation.emailNotVerified
    }
    if (!termsAgreed) {
      nextErrors.termsAgreed = adminContent.signupForm.validation.termsAgreed
    }
    if (!privacyAgreed) {
      nextErrors.privacyAgreed = adminContent.signupForm.validation.privacyAgreed
    }
    setFieldErrors(nextErrors)
    setSubmitFailed(false)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const user = await signUp({
      name: trimmedName,
      email: trimmedEmail,
      password,
      phone: trimmedPhone,
      termsAgreed,
      privacyAgreed,
    })

    if (!user) {
      setSubmitFailed(true)
      return
    }
    setResult(config?.require_signup_approval ? 'pending' : 'active')
  }

  if (result) {
    const isPending = result === 'pending'
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border-subtle bg-surface-card p-6 text-center md:p-8">
        <CheckCircle2 className="mx-auto h-10 w-10 text-brand" aria-hidden="true" />
        <p className="mt-4 text-lg font-bold text-ink">
          {isPending ? adminContent.signupForm.successPendingTitle : adminContent.signupForm.successActiveTitle}
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          {isPending
            ? adminContent.signupForm.successPendingDescription
            : adminContent.signupForm.successActiveDescription}
        </p>
        <button
          type="button"
          onClick={onBackToLogin}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-surface-card transition-colors hover:bg-brand-strong"
        >
          {adminContent.signupForm.backToLoginCta}
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border-subtle bg-surface-card p-6 md:p-8">
      <p className="mb-1 text-sm font-semibold text-brand-strong">{adminContent.signupForm.eyebrow}</p>
      <p className="mb-6 text-sm text-ink-muted">{adminContent.signupForm.description}</p>

      {!config ? (
        <p className="text-sm text-ink-muted">{adminContent.signupForm.loadingConfig}</p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <label htmlFor="signup-email" className="mb-1.5 block text-sm font-semibold text-ink">
              {adminContent.signupForm.emailLabel}
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={requiresEmailVerification && verified}
              placeholder={adminContent.signupForm.emailPlaceholder}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'signup-email-error' : undefined}
              className={`${fieldClassName} disabled:cursor-not-allowed disabled:opacity-70`}
            />
            {fieldErrors.email ? (
              <p id="signup-email-error" role="alert" className="mt-1.5 text-xs text-danger">
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          {requiresEmailVerification ? (
            <div className="rounded-xl border border-border-subtle bg-surface-muted p-4">
              <p className="mb-3 text-sm font-semibold text-ink">
                {adminContent.signupForm.emailCodeSectionTitle}
              </p>
              <p className="mb-3 text-xs text-ink-muted">{adminContent.signupForm.emailCodeDescription}</p>

              {!verified ? (
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={cooldown > 0}
                    className="inline-flex w-fit items-center justify-center rounded-full border border-brand px-4 py-2 text-sm font-semibold text-brand-strong transition-colors hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {cooldown > 0
                      ? `${adminContent.signupForm.sendCodeRetryCta} (${cooldown}초)`
                      : adminContent.signupForm.sendCodeCta}
                  </button>
                  {codeSent ? (
                    <p className="text-xs text-brand-strong">{adminContent.signupForm.codeSentHelp}</p>
                  ) : null}

                  <div>
                    <label htmlFor="signup-code" className="mb-1.5 block text-sm font-semibold text-ink">
                      {adminContent.signupForm.codeInputLabel}
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="signup-code"
                        type="text"
                        inputMode="numeric"
                        value={code}
                        onChange={(event) => setCode(event.target.value)}
                        placeholder={adminContent.signupForm.codeInputPlaceholder}
                        aria-invalid={Boolean(fieldErrors.code)}
                        aria-describedby={fieldErrors.code ? 'signup-code-error' : undefined}
                        className={fieldClassName}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyCode}
                        className="shrink-0 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-surface-card transition-colors hover:bg-brand-strong"
                      >
                        {adminContent.signupForm.verifyCodeCta}
                      </button>
                    </div>
                    {fieldErrors.code ? (
                      <p id="signup-code-error" role="alert" className="mt-1.5 text-xs text-danger">
                        {fieldErrors.code}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <p className="text-sm font-semibold text-brand-strong">
                  {adminContent.signupForm.codeVerifiedHelp}
                </p>
              )}
            </div>
          ) : null}

          {showRestOfForm ? (
            <>
              <div>
                <label htmlFor="signup-name" className="mb-1.5 block text-sm font-semibold text-ink">
                  {adminContent.signupForm.nameLabel}
                </label>
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={adminContent.signupForm.namePlaceholder}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? 'signup-name-error' : undefined}
                  className={fieldClassName}
                />
                {fieldErrors.name ? (
                  <p id="signup-name-error" role="alert" className="mt-1.5 text-xs text-danger">
                    {fieldErrors.name}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="signup-password" className="mb-1.5 block text-sm font-semibold text-ink">
                  {adminContent.signupForm.passwordLabel}
                </label>
                <input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={adminContent.signupForm.passwordPlaceholder}
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? 'signup-password-error' : undefined}
                  className={fieldClassName}
                />
                {fieldErrors.password ? (
                  <p id="signup-password-error" role="alert" className="mt-1.5 text-xs text-danger">
                    {fieldErrors.password}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="signup-phone" className="mb-1.5 block text-sm font-semibold text-ink">
                  {adminContent.signupForm.phoneLabel}
                </label>
                <input
                  id="signup-phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(formatPhone(event.target.value))}
                  placeholder={adminContent.signupForm.phonePlaceholder}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-describedby={fieldErrors.phone ? 'signup-phone-error' : undefined}
                  className={fieldClassName}
                />
                {fieldErrors.phone ? (
                  <p id="signup-phone-error" role="alert" className="mt-1.5 text-xs text-danger">
                    {fieldErrors.phone}
                  </p>
                ) : null}
              </div>

              {terms ? (
                <div className="flex flex-col gap-3">
                  <div>
                    <details className={termsDetailsClassName}>
                      <summary className="cursor-pointer text-sm font-semibold text-ink marker:text-brand">
                        {adminContent.signupForm.termsSectionTitle}
                      </summary>
                      <p className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap text-xs leading-6 text-ink-muted">
                        {terms.terms.content}
                      </p>
                    </details>
                    <label className="mt-2 flex items-center gap-2 text-sm text-ink">
                      <input
                        type="checkbox"
                        checked={termsAgreed}
                        onChange={(event) => setTermsAgreed(event.target.checked)}
                        aria-invalid={Boolean(fieldErrors.termsAgreed)}
                        className="h-4 w-4 rounded border-border-subtle text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong"
                      />
                      {adminContent.signupForm.termsAgreeLabel}
                    </label>
                    {fieldErrors.termsAgreed ? (
                      <p role="alert" className="mt-1 text-xs text-danger">
                        {fieldErrors.termsAgreed}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <details className={termsDetailsClassName}>
                      <summary className="cursor-pointer text-sm font-semibold text-ink marker:text-brand">
                        {adminContent.signupForm.privacySectionTitle}
                      </summary>
                      <p className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap text-xs leading-6 text-ink-muted">
                        {terms.privacy.content}
                      </p>
                    </details>
                    <label className="mt-2 flex items-center gap-2 text-sm text-ink">
                      <input
                        type="checkbox"
                        checked={privacyAgreed}
                        onChange={(event) => setPrivacyAgreed(event.target.checked)}
                        aria-invalid={Boolean(fieldErrors.privacyAgreed)}
                        className="h-4 w-4 rounded border-border-subtle text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong"
                      />
                      {adminContent.signupForm.privacyAgreeLabel}
                    </label>
                    {fieldErrors.privacyAgreed ? (
                      <p role="alert" className="mt-1 text-xs text-danger">
                        {fieldErrors.privacyAgreed}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </>
          ) : null}

          {submitFailed ? (
            <p role="alert" className="text-sm text-danger">
              {signupErrorMessage ?? adminContent.signupForm.errorFallback}
            </p>
          ) : null}

          <div className="mt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !showRestOfForm}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-surface-card transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-70"
            >
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              {isSubmitting ? adminContent.signupForm.submitting : adminContent.signupForm.submitCta}
            </button>
            <button
              type="button"
              onClick={onBackToLogin}
              className="rounded-full border border-border-subtle px-6 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:border-brand hover:text-brand-strong"
            >
              {adminContent.signupForm.backToLoginCta}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
