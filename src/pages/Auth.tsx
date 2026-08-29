import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import brandMascot from '@/assets/brand-mascot.png'
import { useOperatorSession } from '@/services/session'

type AuthProps = { mode: 'login' | 'signup' }
type FormErrors = { name?: string; identifier?: string; password?: string }

export default function Auth({ mode }: AuthProps) {
  const isSignup = mode === 'signup'
  const navigate = useNavigate()
  const { login, isLoggingIn, signUp, isSigningUp } = useOperatorSession()
  const [errors, setErrors] = useState<FormErrors>({})
  const [message, setMessage] = useState('')
  const [submitError, setSubmitError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const identifier = String(formData.get('identifier') ?? '').trim()
    const password = String(formData.get('password') ?? '')
    const nextErrors: FormErrors = {}

    if (isSignup && name.length < 2) nextErrors.name = '이름을 두 글자 이상 입력해주세요.'
    if (!identifier) nextErrors.identifier = isSignup ? '이메일을 입력해주세요.' : '아이디 또는 이메일을 입력해주세요.'
    if (isSignup && !/^\S+@\S+\.\S+$/.test(identifier)) nextErrors.identifier = '올바른 이메일 주소를 입력해주세요.'
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
      if (result.needsEmailConfirmation) {
        setMessage('가입 확인 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인해주세요.')
        return
      }
      navigate('/admin')
      return
    }

    const ok = await login(identifier, password)
    if (ok) navigate('/admin')
    else setSubmitError('아이디 또는 비밀번호를 확인해주세요.')
  }

  return (
    <main className="grid min-h-screen bg-section lg:grid-cols-[0.9fr_1.1fr]">
      <section className="flex min-h-[260px] flex-col justify-between bg-hero px-6 py-8 sm:px-10 lg:min-h-screen lg:px-16 lg:py-12">
        <Link to="/" className="inline-flex w-fit items-center gap-2 text-sm font-bold text-navy hover:text-brand">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> 홈으로
        </Link>
        <div className="mx-auto max-w-md py-8 text-center lg:text-left">
          <img src={brandMascot} alt="Baaaam 초록 뱀 마스코트" width={130} height={126} className="mx-auto h-28 w-28 object-contain lg:mx-0" />
          <p className="mt-5 text-sm font-bold text-brand">학생과 운영진을 위한 공간</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-navy sm:text-4xl">배운 내용을 이어서<br />탐색해보세요.</h1>
        </div>
        <p className="hidden text-xs text-ink-soft lg:block">Baaaam · 초중학생을 위한 수과학 이야기</p>
      </section>

      <section className="flex items-center justify-center bg-white px-5 py-14 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand"><LockKeyhole className="h-5 w-5" /></span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.035em] text-navy">{isSignup ? '회원가입' : '로그인'}</h2>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{isSignup ? 'Baaaam 계정을 만들기 위한 정보를 입력해주세요.' : '아이디 또는 이메일과 비밀번호를 입력해주세요.'}</p>
          </div>

          <form noValidate onSubmit={handleSubmit} className="space-y-5">
            {isSignup ? (
              <label className="block text-sm font-bold text-navy">이름
                <input name="name" type="text" autoComplete="name" aria-invalid={Boolean(errors.name)} className="form-input" placeholder="이름" />
                {errors.name ? <span className="mt-1.5 block text-xs font-semibold text-danger">{errors.name}</span> : null}
              </label>
            ) : null}
            <label className="block text-sm font-bold text-navy">{isSignup ? '이메일' : '아이디 또는 이메일'}
              <input name="identifier" type={isSignup ? 'email' : 'text'} autoComplete={isSignup ? 'email' : 'username'} aria-invalid={Boolean(errors.identifier)} className="form-input" placeholder={isSignup ? 'name@example.com' : 'admin 또는 name@example.com'} />
              {errors.identifier ? <span className="mt-1.5 block text-xs font-semibold text-danger">{errors.identifier}</span> : null}
            </label>
            <label className="block text-sm font-bold text-navy">비밀번호
              <input name="password" type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} aria-invalid={Boolean(errors.password)} className="form-input" placeholder="8자 이상 입력해주세요" />
              {errors.password ? <span className="mt-1.5 block text-xs font-semibold text-danger">{errors.password}</span> : null}
            </label>

            {submitError ? <p role="alert" className="text-sm leading-6 text-danger">{submitError}</p> : null}
            <button type="submit" disabled={isLoggingIn || isSigningUp} className="min-h-12 w-full rounded-lg bg-brand px-5 text-sm font-bold text-white hover:bg-brand-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-70">{isLoggingIn || isSigningUp ? '처리 중...' : isSignup ? '회원가입' : '로그인'}</button>
            <p aria-live="polite" className="min-h-6 text-sm leading-6 text-brand-strong">{message}</p>
          </form>

          <p className="mt-5 text-center text-sm text-ink-muted">
            {isSignup ? '이미 계정이 있나요?' : '아직 계정이 없나요?'}{' '}
            <Link to={isSignup ? '/login' : '/signup'} className="font-bold text-brand hover:text-brand-strong">{isSignup ? '로그인' : '회원가입'}</Link>
          </p>
        </div>
      </section>
    </main>
  )
}
