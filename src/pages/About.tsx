import { ArrowRight, Eye, HelpCircle, MessageCircleMore } from 'lucide-react'
import { Link } from 'react-router-dom'

import { BrandLogo } from '@/components/home/BrandLogo'
import { SiteFooter } from '@/components/home/SiteFooter'
import { SiteHeader } from '@/components/home/SiteHeader'

const principles = [
  { number: '01', icon: MessageCircleMore, label: 'Easy', title: '학생의 언어로 설명해요', description: '어려운 표현을 그대로 옮기지 않고, 이미 알고 있는 경험과 말로 차근차근 풀어냅니다.' },
  { number: '02', icon: Eye, label: 'Visual', title: '보이면 더 잘 이해돼요', description: '그림과 구조가 도움이 되는 개념은 눈으로 관계를 확인할 수 있게 전달합니다.' },
  { number: '03', icon: HelpCircle, label: 'Why', title: '결과보다 이유를 먼저 물어요', description: '공식을 외우기 전에 왜 그런 결과가 나오는지 생각할 수 있도록 돕습니다.' },
] as const

export default function About() {
  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <section className="border-b border-border-subtle bg-hero">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:py-14 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-16">
            <div>
              <p className="text-sm font-bold text-brand">BAAAAM이 만드는 이해의 순간</p>
              <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.045em] text-navy min-[375px]:text-4xl md:text-5xl">
                어려운 개념도<br />제대로 이해하면 재미있습니다.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted md:text-lg">
                BAAAAM은 학생들이 수학과 과학을 단순히 암기하는 대신, “왜 그런지” 이해하도록 돕는 학습 블로그입니다.
              </p>
            </div>
            <BrandLogo
              alt="프로젝트 BAAAAM 공식 로고"
              className="mx-auto aspect-[1.8/1] w-full max-w-lg"
            />
          </div>
        </section>

        <section aria-labelledby="principles-heading" className="mx-auto max-w-7xl px-5 py-12 sm:py-14 md:px-8 md:py-16">
          <header className="mb-10 max-w-2xl">
            <p className="text-sm font-bold text-brand">우리가 글을 쓰는 기준</p>
            <h2 id="principles-heading" className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-navy md:text-[2.35rem]">세 가지 원칙</h2>
          </header>

          <ol className="border-y border-border-subtle">
            {principles.map((principle) => {
              const Icon = principle.icon
              return (
                <li key={principle.label} className="grid gap-5 border-b border-border-subtle py-8 last:border-b-0 md:grid-cols-[80px_1fr_1.35fr] md:items-start">
                  <span className="text-sm font-black text-brand">{principle.number}</span>
                  <div>
                    <Icon className="mb-4 h-6 w-6 text-brand" aria-hidden="true" />
                    <p className="text-sm font-bold text-brand">{principle.label}</p>
                    <h3 className="mt-1 text-xl font-extrabold text-navy">{principle.title}</h3>
                  </div>
                  <p className="text-base leading-8 text-ink-muted">{principle.description}</p>
                </li>
              )
            })}
          </ol>

          <div className="mt-10 flex flex-col items-start justify-between gap-5 border-y border-hero-border bg-brand-soft px-5 py-6 sm:flex-row sm:items-center sm:px-7">
            <div>
              <p className="font-extrabold text-navy">이제 궁금했던 개념을 만나볼까요?</p>
              <p className="mt-1 text-sm text-ink-muted">수학부터 생물, 지구과학까지 분야별로 둘러보세요.</p>
            </div>
            <Link to="/category/all" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand px-5 text-sm font-bold text-white hover:bg-brand-strong">
              전체 글 보기 <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
