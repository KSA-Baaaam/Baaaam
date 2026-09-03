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
    <section aria-labelledby="grades-heading" className="bg-section py-14 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <header className="mb-8 max-w-2xl sm:mb-10">
          <p className="mb-3 text-sm font-bold text-brand">{homeContent.grades.eyebrow}</p>
          <h2 id="grades-heading" className="text-3xl font-extrabold tracking-[-0.035em] text-navy md:text-[2.35rem]">
            {homeContent.grades.title}
          </h2>
          <p className="mt-3 text-base leading-7 text-ink-muted">{homeContent.grades.description}</p>
        </header>

        <ul className="grid gap-3 sm:grid-cols-3">
          {grades.map((grade) => (
            <li key={grade.label}>
              <Link
                to={`/search?q=${encodeURIComponent(grade.query)}`}
                className="group flex min-h-28 items-center gap-4 rounded-2xl border border-border-subtle bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:p-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <BookOpenCheck className="h-6 w-6" aria-hidden="true" />
                </span>
                <strong className="min-w-0 flex-1 text-xl font-extrabold tracking-[-0.025em] text-navy transition-colors group-hover:text-brand sm:text-2xl">
                  {grade.label}
                </strong>
                <ArrowRight className="h-5 w-5 shrink-0 text-ink-muted transition group-hover:translate-x-1 group-hover:text-brand" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
