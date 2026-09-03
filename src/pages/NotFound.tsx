import { ArrowLeft, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

import brandMascot from '@/assets/brand-mascot.png'
import { SiteFooter } from '@/components/home/SiteFooter'
import { SiteHeader } from '@/components/home/SiteHeader'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center md:py-28">
        <img src={brandMascot} alt="길을 찾고 있는 BAAAAM 초록 뱀 마스코트" width={160} height={155} className="h-32 w-32 object-contain" />
        <p className="mt-5 text-sm font-black tracking-[0.18em] text-brand">404</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-navy md:text-4xl">이 페이지는 찾을 수 없어요</h1>
        <p className="mt-4 max-w-lg text-base leading-7 text-ink-muted">주소가 바뀌었거나 사라진 페이지일 수 있어요. 홈으로 돌아가거나 궁금한 개념을 다시 찾아보세요.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand px-5 text-sm font-bold text-white hover:bg-brand-strong"><ArrowLeft className="h-4 w-4" /> 홈으로</Link>
          <Link to="/search" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border-subtle bg-white px-5 text-sm font-bold text-navy hover:border-brand hover:text-brand"><Search className="h-4 w-4" /> 개념 검색</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
