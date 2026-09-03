import { ArrowLeft, ChevronRight, FileText, Mail, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useOperatorSession } from '@/services/session'
import type { EmailCodePurpose } from '@/services/session'

type AuthProps = { mode: 'login' | 'signup' }
type FormErrors = { name?: string; identifier?: string; password?: string }
type EmailChallenge = { email: string; purpose: EmailCodePurpose }
type SignupStep = 'consent' | 'details'

export default function Auth({ mode }: AuthProps) {
  const isSignup = mode === 'signup'
  const navigate = useNavigate()
  const {
    login,
    isLoggingIn,
    signUp,
    isSigningUp,
    verifyEmailCode,
    isVerifyingEmailCode,
    resendEmailCode,
    isResendingEmailCode,
  } = useOperatorSession()
  const [errors, setErrors] = useState<FormErrors>({})
  const [message, setMessage] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [challenge, setChallenge] = useState<EmailChallenge | null>(null)
  const [code, setCode] = useState('')
  const [signupStep, setSignupStep] = useState<SignupStep>(isSignup ? 'consent' : 'details')
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [privacyAgreed, setPrivacyAgreed] = useState(false)
  const [newsletterOptIn, setNewsletterOptIn] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSignup && (!termsAgreed || !privacyAgreed)) {
      setSignupStep('consent')
      setSubmitError('이용약관과 개인정보 처리방침에 모두 동의해주세요.')
      return
    }
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const identifier = String(formData.get('identifier') ?? '').trim()
    const password = String(formData.get('password') ?? '')
    const nextErrors: FormErrors = {}

    if (isSignup && name.length < 2) nextErrors.name = '이름을 두 글자 이상 입력해주세요.'
    if (!identifier) nextErrors.identifier = isSignup ? '이메일을 입력해주세요.' : '아이디 또는 이메일을 입력해주세요.'
    else if (isSignup && !/^\S+@\S+\.\S+$/.test(identifier)) nextErrors.identifier = '올바른 이메일 주소를 입력해주세요.'
    else if (!isSignup && identifier.toLowerCase() !== 'admin' && !/^\S+@\S+\.\S+$/.test(identifier)) nextErrors.identifier = 'admin 또는 올바른 이메일 주소를 입력해주세요.'
    if (password.length < 8) nextErrors.password = '비밀번호는 8자 이상이어야 해요.'

    setErrors(nextErrors)
    setMessage('')
    setSubmitError('')
    if (Object.keys(nextErrors).length > 0) return

    if (isSignup) {
      const result = await signUp({ name, email: identifier, password, newsletterOptIn })
      if (!result.ok) {
        setSubmitError(result.errorMessage ?? '회원가입에 실패했어요. 잠시 후 다시 시도해주세요.')
        return
      }
      if (result.challenge) {
        setChallenge(result.challenge)
        return
      }
      navigate(result.destination ?? '/')
      return
    }

    const result = await login(identifier, password)
    if (!result.ok) {
      setSubmitError(result.errorMessage ?? '아이디 또는 이메일과 비밀번호를 확인해주세요.')
      return
    }
    if (result.challenge) {
      setChallenge(result.challenge)
      return
    }
    navigate(result.destination ?? '/')
  }

  async function handleVerifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!challenge) return
    setSubmitError('')
    setMessage('')
    if (!/^\d{6}$/.test(code)) {
      setSubmitError('메일로 받은 숫자 6자리를 입력해주세요.')
      return
    }

    const result = await verifyEmailCode({ ...challenge, token: code })
    if (!result.ok) {
      setSubmitError(result.errorMessage ?? '인증코드를 확인해주세요.')
      return
    }
    navigate(result.destination ?? '/')
  }

  async function handleResendCode() {
    if (!challenge) return
    setSubmitError('')
    setMessage('')
    const result = await resendEmailCode(challenge)
    if (!result.ok) {
      setSubmitError(result.errorMessage ?? '인증코드를 다시 보내지 못했어요.')
      return
    }
    setMessage('새 인증코드를 보냈어요. 가장 최근 메일을 확인해주세요.')
  }

  const isConsentStep = isSignup && signupStep === 'consent' && !challenge
  const requiredAgreed = termsAgreed && privacyAgreed
  const allAgreed = requiredAgreed && newsletterOptIn
  const title = challenge ? '이메일 인증' : isConsentStep ? '약관 동의' : isSignup ? '회원가입' : '로그인'
  const description = challenge
    ? <><strong className="font-bold text-navy">{challenge.email}</strong>으로 보낸 인증코드 6자리를 입력해주세요.</>
    : isConsentStep
      ? '회원가입을 위해 필수 약관을 확인하고 동의해주세요.'
      : isSignup
        ? '계정을 만들고 BAAAAM의 수학·과학 이야기를 만나보세요.'
        : '이메일과 비밀번호로 학습을 이어가세요.'

  return (
    <main className="relative flex min-h-dvh justify-center bg-white px-4 py-6 min-[375px]:px-5 sm:px-8 sm:py-10">
      <Link to="/" className="absolute left-2 top-3 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-bold text-ink-muted transition-colors hover:bg-brand-soft hover:text-brand min-[375px]:left-3 min-[375px]:top-4 sm:left-8 sm:top-8">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> 홈으로
      </Link>

      <section className="flex w-full max-w-[520px] items-center py-14 sm:py-20 lg:py-24">
        <div className="w-full">
          <div className="mb-9 sm:mb-10">
            {isSignup && !challenge ? (
              <p className="mb-4 text-sm font-bold text-brand" aria-label={`회원가입 ${isConsentStep ? '1' : '2'}단계 중 2단계`}>
                {isConsentStep ? '1' : '2'} / 2
              </p>
            ) : null}
            <h1 className="text-4xl font-extrabold tracking-[-0.045em] text-navy sm:text-5xl">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-ink-muted sm:text-base">{description}</p>
          </div>

          {isConsentStep ? (
            <div>
              <div className="overflow-hidden rounded-xl border border-border-subtle bg-white">
                <div className="flex items-start gap-2.5 border-b border-border-subtle p-4 min-[375px]:gap-3 min-[375px]:p-5">
                  <input
                    id="terms-agreement"
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(event) => { setTermsAgreed(event.target.checked); setSubmitError('') }}
                    className="mt-1 h-5 w-5 shrink-0 accent-brand"
                  />
                  <FileText className="mt-0.5 hidden h-5 w-5 shrink-0 text-brand min-[375px]:block" aria-hidden="true" />
                  <label htmlFor="terms-agreement" className="min-w-0 flex-1 cursor-pointer">
                    <span className="block font-bold text-navy"><span className="mr-1 text-brand">[필수]</span> 이용약관 동의</span>
                    <span className="mt-1 block text-xs leading-5 text-ink-muted">서비스 이용 규칙과 회원의 권리·의무를 확인해주세요.</span>
                  </label>
                  <Link to="/terms" target="_blank" rel="noreferrer" aria-label="이용약관 새 창에서 보기" className="inline-flex min-h-9 shrink-0 items-center gap-0.5 rounded-md px-1.5 text-xs font-bold text-ink-muted hover:bg-brand-soft hover:text-brand min-[375px]:px-2">
                    보기 <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>

                <div className="flex items-start gap-2.5 p-4 min-[375px]:gap-3 min-[375px]:p-5">
                  <input
                    id="privacy-agreement"
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(event) => { setPrivacyAgreed(event.target.checked); setSubmitError('') }}
                    className="mt-1 h-5 w-5 shrink-0 accent-brand"
                  />
                  <ShieldCheck className="mt-0.5 hidden h-5 w-5 shrink-0 text-brand min-[375px]:block" aria-hidden="true" />
                  <label htmlFor="privacy-agreement" className="min-w-0 flex-1 cursor-pointer">
                    <span className="block font-bold text-navy"><span className="mr-1 text-brand">[필수]</span> 개인정보 처리방침 동의</span>
                    <span className="mt-1 block text-xs leading-5 text-ink-muted">수집하는 정보와 이용·보관 방법을 확인해주세요.</span>
                  </label>
                  <Link to="/privacy" target="_blank" rel="noreferrer" aria-label="개인정보 처리방침 새 창에서 보기" className="inline-flex min-h-9 shrink-0 items-center gap-0.5 rounded-md px-1.5 text-xs font-bold text-ink-muted hover:bg-brand-soft hover:text-brand min-[375px]:px-2">
                    보기 <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>

                <div className="flex items-start gap-2.5 border-t border-border-subtle p-4 min-[375px]:gap-3 min-[375px]:p-5">
                  <input
                    id="newsletter-agreement"
                    type="checkbox"
                    checked={newsletterOptIn}
                    onChange={(event) => setNewsletterOptIn(event.target.checked)}
                    className="mt-1 h-5 w-5 shrink-0 accent-brand"
                  />
                  <Mail className="mt-0.5 hidden h-5 w-5 shrink-0 text-brand min-[375px]:block" aria-hidden="true" />
                  <label htmlFor="newsletter-agreement" className="min-w-0 flex-1 cursor-pointer">
                    <span className="block font-bold text-navy"><span className="mr-1 text-ink-muted">[선택]</span> 매달 정기 간행물 이메일 수신</span>
                    <span className="mt-1 block text-xs leading-5 text-ink-muted">BAAAAM의 새로운 수학·과학 이야기를 매달 이메일로 받아보세요.</span>
                  </label>
                </div>

                <label className="flex cursor-pointer items-center gap-3 border-t border-border-subtle bg-section p-5 transition-colors hover:bg-brand-soft/60">
                  <input
                    type="checkbox"
                    checked={allAgreed}
                    onChange={(event) => {
                    setTermsAgreed(event.target.checked)
                    setPrivacyAgreed(event.target.checked)
                    setNewsletterOptIn(event.target.checked)
                    setSubmitError('')
                    }}
                    className="h-5 w-5 shrink-0 accent-brand"
                  />
                  <span className="font-extrabold text-navy">모두 동의합니다</span>
                </label>
              </div>

              {submitError ? <p role="alert" className="mt-4 text-sm leading-6 text-danger">{submitError}</p> : null}
              <button
                type="button"
                disabled={!requiredAgreed}
                onClick={() => { setSignupStep('details'); setSubmitError('') }}
                className="mt-6 min-h-14 w-full rounded-xl bg-brand px-5 text-base font-bold text-white transition-colors hover:bg-brand-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:bg-ink-soft"
              >
                동의하고 다음으로
              </button>
            </div>
          ) : challenge ? (
            <form noValidate onSubmit={handleVerifyCode} className="space-y-6">
              <label className="block text-sm font-bold text-navy">인증코드
                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="form-input text-center text-xl font-extrabold tracking-[0.35em]"
                  placeholder="000000"
                  autoFocus
                />
              </label>
              {submitError ? <p role="alert" className="text-sm leading-6 text-danger">{submitError}</p> : null}
              <button type="submit" disabled={isVerifyingEmailCode} className="min-h-14 w-full rounded-xl bg-brand px-5 text-base font-bold text-white transition-colors hover:bg-brand-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-70">{isVerifyingEmailCode ? '확인 중...' : '인증하고 계속하기'}</button>
              <div className="flex flex-col items-start gap-3 text-sm min-[375px]:flex-row min-[375px]:items-center min-[375px]:justify-between">
                <button type="button" onClick={() => { setChallenge(null); setCode(''); setMessage(''); setSubmitError('') }} className="font-semibold text-ink-muted hover:text-navy">정보 다시 입력</button>
                <button type="button" onClick={() => void handleResendCode()} disabled={isResendingEmailCode} className="font-bold text-brand hover:text-brand-strong disabled:cursor-not-allowed disabled:opacity-60">{isResendingEmailCode ? '전송 중...' : '인증코드 다시 받기'}</button>
              </div>
              <p aria-live="polite" className="min-h-6 text-sm leading-6 text-brand-strong">{message}</p>
            </form>
          ) : <form noValidate onSubmit={handleSubmit} className="space-y-6">
            {isSignup ? (
              <label className="block text-sm font-bold text-navy">이름
                <input name="name" type="text" autoComplete="name" aria-invalid={Boolean(errors.name)} className="form-input" placeholder="이름" />
                {errors.name ? <span className="mt-1.5 block text-xs font-semibold text-danger">{errors.name}</span> : null}
              </label>
            ) : null}
            <label className="block text-sm font-bold text-navy">{isSignup ? '이메일' : '아이디 또는 이메일'}
              <input name="identifier" type={isSignup ? 'email' : 'text'} inputMode={isSignup ? 'email' : 'text'} autoComplete={isSignup ? 'email' : 'username'} aria-invalid={Boolean(errors.identifier)} className="form-input" placeholder="name@example.com" />
              {errors.identifier ? <span className="mt-1.5 block text-xs font-semibold text-danger">{errors.identifier}</span> : null}
            </label>
            <label className="block text-sm font-bold text-navy">비밀번호
              <input name="password" type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} aria-invalid={Boolean(errors.password)} className="form-input" placeholder="비밀번호를 입력해주세요" />
              {errors.password ? <span className="mt-1.5 block text-xs font-semibold text-danger">{errors.password}</span> : null}
            </label>

            {submitError ? <p role="alert" className="text-sm leading-6 text-danger">{submitError}</p> : null}
            <button type="submit" disabled={isLoggingIn || isSigningUp} className="min-h-14 w-full rounded-xl bg-brand px-5 text-base font-bold text-white transition-colors hover:bg-brand-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-70">{isLoggingIn || isSigningUp ? '처리 중...' : isSignup ? '회원가입' : '로그인'}</button>
            {isSignup ? (
              <button type="button" onClick={() => { setSignupStep('consent'); setSubmitError('') }} className="w-full text-sm font-bold text-ink-muted hover:text-brand">
                이전 단계로
              </button>
            ) : null}
            <p aria-live="polite" className="min-h-6 text-sm leading-6 text-brand-strong">{message}</p>
          </form>}

          {!challenge ? <p className="mt-7 text-center text-sm text-ink-muted">
            {isSignup ? '이미 계정이 있나요?' : '아직 계정이 없나요?'}{' '}
            <Link to={isSignup ? '/login' : '/signup'} className="font-bold text-brand hover:text-brand-strong">{isSignup ? '로그인' : '회원가입'}</Link>
          </p> : null}
        </div>
      </section>
    </main>
  )
}
