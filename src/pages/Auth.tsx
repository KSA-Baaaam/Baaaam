import { ArrowLeft, LockKeyhole, MailCheck } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { BrandLogo } from '@/components/home/BrandLogo'
import { useOperatorSession } from '@/services/session'
import type { EmailCodePurpose } from '@/services/session'

type AuthProps = { mode: 'login' | 'signup' }
type FormErrors = { name?: string; identifier?: string; password?: string }
type EmailChallenge = { email: string; purpose: EmailCodePurpose }

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
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
      const result = await signUp({ name, email: identifier, password })
      if (!result.ok) {
        setSubmitError(result.errorMessage ?? '회원가입에 실패했어요. 잠시 후 다시 시도해주세요.')
        return
      }
      if (result.challenge) {
        setChallenge(result.challenge)
        setMessage('인증코드를 보냈어요. 메일함을 확인해주세요.')
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
      setMessage('인증코드를 보냈어요. 메일함을 확인해주세요.')
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

  return (
    <main className="grid min-h-screen bg-section lg:grid-cols-[0.9fr_1.1fr]">
      <section className="flex min-h-[260px] flex-col justify-between bg-hero px-6 py-8 sm:px-10 lg:min-h-screen lg:px-16 lg:py-12">
        <Link to="/" className="inline-flex w-fit items-center gap-2 text-sm font-bold text-navy hover:text-brand">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> 홈으로
        </Link>
        <div className="mx-auto max-w-md py-8 text-center lg:text-left">
          <BrandLogo
            alt="프로젝트 Baaaam 공식 로고"
            className="mx-auto h-[126px] w-[230px] rounded-2xl shadow-sm lg:mx-0"
          />
          <p className="mt-5 text-sm font-bold text-brand">KAIST부설 한국과학영재학교 Baaaam 연구회</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-navy sm:text-4xl">배운 내용을 이어서<br />탐색해보세요</h1>
        </div>
        <p className="hidden text-xs text-ink-soft lg:block">Baaaam · 초중학생을 위한 수과학 이야기</p>
      </section>

      <section className="flex items-center justify-center bg-white px-5 py-14 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">{challenge ? <MailCheck className="h-5 w-5" /> : <LockKeyhole className="h-5 w-5" />}</span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.035em] text-navy">{challenge ? '이메일 인증' : isSignup ? '회원가입' : '로그인'}</h2>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{challenge ? <><strong className="font-bold text-navy">{challenge.email}</strong>으로 보낸 인증코드 6자리를 입력해주세요.</> : isSignup ? '이메일 인증은 계정을 만들 때 한 번만 진행해요.' : '일반 회원은 이메일로, 관리자는 admin 아이디로 로그인할 수 있어요.'}</p>
          </div>

          {challenge ? (
            <form noValidate onSubmit={handleVerifyCode} className="space-y-5">
              <label className="block text-sm font-bold text-navy">인증코드
                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="form-input text-center text-xl font-extrabold tracking-[0.35em]"
                  placeholder="000000"
                  aria-describedby="email-code-help"
                  autoFocus
                />
              </label>
              <p id="email-code-help" className="rounded-xl bg-brand-soft px-4 py-3 text-xs leading-5 text-brand-strong">인증코드는 한 번만 사용할 수 있어요. 메일이 여러 통이면 가장 최근 코드를 입력해주세요.</p>
              {submitError ? <p role="alert" className="text-sm leading-6 text-danger">{submitError}</p> : null}
              <button type="submit" disabled={isVerifyingEmailCode} className="min-h-12 w-full rounded-lg bg-brand px-5 text-sm font-bold text-white hover:bg-brand-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-70">{isVerifyingEmailCode ? '확인 중...' : '인증하고 계속하기'}</button>
              <div className="flex items-center justify-between gap-3 text-sm">
                <button type="button" onClick={() => { setChallenge(null); setCode(''); setMessage(''); setSubmitError('') }} className="font-semibold text-ink-muted hover:text-navy">정보 다시 입력</button>
                <button type="button" onClick={() => void handleResendCode()} disabled={isResendingEmailCode} className="font-bold text-brand hover:text-brand-strong disabled:cursor-not-allowed disabled:opacity-60">{isResendingEmailCode ? '전송 중...' : '인증코드 다시 받기'}</button>
              </div>
              <p aria-live="polite" className="min-h-6 text-sm leading-6 text-brand-strong">{message}</p>
            </form>
          ) : <form noValidate onSubmit={handleSubmit} className="space-y-5">
            {isSignup ? (
              <label className="block text-sm font-bold text-navy">이름
                <input name="name" type="text" autoComplete="name" aria-invalid={Boolean(errors.name)} className="form-input" placeholder="이름" />
                {errors.name ? <span className="mt-1.5 block text-xs font-semibold text-danger">{errors.name}</span> : null}
              </label>
            ) : null}
            <label className="block text-sm font-bold text-navy">{isSignup ? '이메일' : '아이디 또는 이메일'}
              <input name="identifier" type={isSignup ? 'email' : 'text'} inputMode={isSignup ? 'email' : 'text'} autoComplete={isSignup ? 'email' : 'username'} aria-invalid={Boolean(errors.identifier)} className="form-input" placeholder={isSignup ? 'name@example.com' : 'admin 또는 name@example.com'} />
              {errors.identifier ? <span className="mt-1.5 block text-xs font-semibold text-danger">{errors.identifier}</span> : null}
            </label>
            <label className="block text-sm font-bold text-navy">비밀번호
              <input name="password" type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} aria-invalid={Boolean(errors.password)} className="form-input" placeholder="비밀번호를 입력해주세요" />
              {errors.password ? <span className="mt-1.5 block text-xs font-semibold text-danger">{errors.password}</span> : null}
            </label>

            {submitError ? <p role="alert" className="text-sm leading-6 text-danger">{submitError}</p> : null}
            <button type="submit" disabled={isLoggingIn || isSigningUp} className="min-h-12 w-full rounded-lg bg-brand px-5 text-sm font-bold text-white hover:bg-brand-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-70">{isLoggingIn || isSigningUp ? '처리 중...' : isSignup ? '회원가입' : '로그인'}</button>
            <p aria-live="polite" className="min-h-6 text-sm leading-6 text-brand-strong">{message}</p>
          </form>}

          {!challenge ? <p className="mt-5 text-center text-sm text-ink-muted">
            {isSignup ? '이미 계정이 있나요?' : '아직 계정이 없나요?'}{' '}
            <Link to={isSignup ? '/login' : '/signup'} className="font-bold text-brand hover:text-brand-strong">{isSignup ? '로그인' : '회원가입'}</Link>
          </p> : null}
        </div>
      </section>
    </main>
  )
}
