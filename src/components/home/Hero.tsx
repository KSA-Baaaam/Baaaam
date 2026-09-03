import heroMascot from '@/assets/hero-learning-snake.jpg'
import { SiteSearchForm } from '@/components/search/SiteSearchForm'
import { homeContent } from '@/content/home'

export function Hero() {
  return (
    <section className="border-b border-hero-border bg-[#ebf6ef]">
      <div className="mx-auto grid max-w-7xl overflow-hidden md:min-h-[470px] md:grid-cols-[1.02fr_0.98fr] md:items-center">
        <div className="px-5 py-10 min-[375px]:px-6 sm:px-8 sm:py-14 md:pl-8 md:pr-10 lg:pr-16">
          <p className="mb-4 text-sm font-bold text-brand">{homeContent.hero.eyebrow}</p>
          <h1 className="text-[1.95rem] font-extrabold leading-[1.16] tracking-[-0.045em] text-navy min-[375px]:text-[2.35rem] sm:text-5xl lg:text-[3.5rem]">
            {homeContent.hero.headlineLead}
            <br />
            <span className="text-brand">{homeContent.hero.headlineAccent}</span>
          </h1>
          <p className="mt-5 max-w-[34rem] text-base leading-7 text-ink-muted sm:mt-6 sm:text-lg sm:leading-8">
            {homeContent.hero.sub}
          </p>

          <div className="mt-7 max-w-xl sm:mt-8">
            <SiteSearchForm size="large" />
          </div>

        </div>

        <div className="relative flex h-full min-h-[230px] items-end justify-center px-5 pt-0 min-[375px]:min-h-[260px] sm:min-h-[320px] sm:px-8 md:min-h-[470px]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-12 bg-[linear-gradient(to_bottom,#ebf6ef,transparent)]" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-12 bg-[linear-gradient(to_right,#ebf6ef,transparent)] md:block" aria-hidden="true" />
          <img
            src={heroMascot}
            alt="배워보자고 말하는 초록 뱀 마스코트와 수학·과학 기호"
            width={1617}
            height={972}
            className="relative z-10 h-auto w-full max-w-[640px] object-contain"
          />
        </div>
      </div>
    </section>
  )
}
