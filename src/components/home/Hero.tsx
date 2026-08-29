import { ArrowDown } from 'lucide-react'

import heroMascot from '@/assets/hero-mascot.png'
import { SiteSearchForm } from '@/components/search/SiteSearchForm'
import { homeContent } from '@/content/home'

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-6 md:px-8 md:pt-10">
      <div className="grid min-h-[500px] overflow-hidden rounded-[1.5rem] border border-hero-border bg-hero md:grid-cols-[1.02fr_0.98fr] md:items-center">
        <div className="px-6 py-12 sm:px-10 md:px-12 lg:px-16">
          <p className="mb-5 text-sm font-bold text-brand">{homeContent.hero.eyebrow}</p>
          <h1 className="text-[2.55rem] font-extrabold leading-[1.16] tracking-[-0.045em] text-navy sm:text-5xl lg:text-[3.5rem]">
            {homeContent.hero.headlineLead}
            <br />
            <span className="text-brand">{homeContent.hero.headlineAccent}</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-base leading-8 text-ink-muted sm:text-lg">
            {homeContent.hero.sub}
          </p>

          <div className="mt-8 max-w-xl">
            <SiteSearchForm size="large" />
          </div>

          <a
            href="#topics"
            className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-brand hover:text-brand-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {homeContent.hero.scrollCta}
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="relative flex h-full min-h-[340px] items-end justify-center px-5 pt-4 md:min-h-[500px] md:px-8">
          <div className="absolute inset-x-12 bottom-8 h-16 rounded-[50%] bg-[#cddcef]/60" aria-hidden="true" />
          <img
            src={heroMascot}
            alt="배워보자고 말하는 초록 뱀 마스코트와 수학·과학 기호"
            width={700}
            height={430}
            className="relative z-10 h-auto w-full max-w-[640px] object-contain"
          />
        </div>
      </div>
    </section>
  )
}
