import { ArrowRight, BookOpenCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import { homeContent } from '@/content/home'

const grades = [
  { label: '중1', query: '중1' },
  { label: '중2', query: '중2' },
  { label: '중3', query: '중3' },
] as const

export function GradeExplore() {
  return (
    <section aria-labelledby="grades-heading" className="border-y border-border-subtle bg-section py-12 sm:py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <header className="mb-7 max-w-2xl sm:mb-9">
          <p className="mb-3 text-sm font-bold text-brand">{homeContent.grades.eyebrow}</p>
          <h2 id="grades-heading" className="text-3xl font-extrabold tracking-[-0.035em] text-navy md:text-[2.35rem]">
            {homeContent.grades.title}
          </h2>
          <p className="mt-3 text-base leading-7 text-ink-muted">{homeContent.grades.description}</p>
        </header>

        <ul className="grid grid-cols-3 gap-px overflow-hidden border-y border-border-subtle bg-border-subtle">
          {grades.map((grade) => (
            <li key={grade.label}>
              <Link
                to={`/search?q=${encodeURIComponent(grade.query)}`}
                className="group flex min-h-24 flex-col items-center justify-center gap-2 bg-white px-2 py-4 text-center transition-colors hover:bg-brand-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand sm:min-h-28 sm:flex-row sm:justify-start sm:gap-4 sm:px-6 sm:text-left"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white sm:h-11 sm:w-11">
                  <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <strong className="min-w-0 text-base font-extrabold tracking-[-0.025em] text-navy transition-colors group-hover:text-brand sm:flex-1 sm:text-xl">
                  {grade.label}
                </strong>
                <ArrowRight className="hidden h-5 w-5 shrink-0 text-ink-muted transition group-hover:translate-x-1 group-hover:text-brand sm:block" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
