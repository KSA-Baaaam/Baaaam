import { Link } from 'react-router-dom'

/** 인증이 없는 사용자에게 로그인과 회원가입 경로를 안내한다. */
export function OperatorAuthGate() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border-subtle bg-surface-card p-6 text-center md:p-8">
      <h2 className="text-xl font-bold text-ink">로그인이 필요해요</h2>
      <p className="mt-2 text-sm leading-6 text-ink-muted">글을 작성하고 관리하려면 작성자 또는 관리자 계정으로 로그인해주세요.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/login" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-strong">로그인</Link>
        <Link to="/signup" className="rounded-full border border-brand px-5 py-2.5 text-sm font-semibold text-brand hover:bg-brand-soft">회원가입</Link>
      </div>
    </div>
  )
}
