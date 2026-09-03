import heroMascot from '@/assets/hero-learning-snake.png'
import { SiteSearchForm } from '@/components/search/SiteSearchForm'
import { homeContent } from '@/content/home'

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-3 pt-3 min-[375px]:px-4 min-[375px]:pt-4 sm:px-5 sm:pt-6 md:px-8 md:pt-10">
      <div className="grid overflow-hidden rounded-[1.25rem] border border-hero-border bg-[#ebf6ef] sm:rounded-[1.5rem] md:min-h-[500px] md:grid-cols-[1.02fr_0.98fr] md:items-center">
        <div className="px-5 py-9 min-[375px]:px-6 sm:px-10 sm:py-12 md:px-12 lg:px-16">
          <p className="mb-5 text-sm font-bold text-brand">{homeContent.hero.eyebrow}</p>
          <h1 className="text-[1.95rem] font-extrabold leading-[1.16] tracking-[-0.045em] text-navy min-[375px]:text-[2.35rem] sm:text-5xl lg:text-[3.5rem]">
            {homeContent.hero.headlineLead}
            <br />
            <span className="text-brand">{homeContent.hero.headlineAccent}</span>
          </h1>
          <p className="mt-5 max-w-[34rem] text-base leading-7 text-ink-muted sm:mt-6 sm:text-lg sm:leading-8">
            {homeContent.hero.sub}
          </p>

          <div className="mt-8 max-w-xl">
            <SiteSearchForm size="large" />
          </div>

        </div>

        <div className="relative flex h-full min-h-[270px] items-end justify-center px-4 pt-2 min-[375px]:min-h-[300px] sm:min-h-[340px] sm:px-5 sm:pt-4 md:min-h-[500px] md:px-8">
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
