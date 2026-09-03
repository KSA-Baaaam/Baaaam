import type { LucideIcon } from 'lucide-react'
import { ArrowRight, Atom, Braces, Compass, FlaskConical, Globe2, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

import { homeContent } from '@/content/home'
import { categories } from '@/data/categories'

const iconByCategoryId: Record<string, LucideIcon> = {
  math: Compass,
  physics: Atom,
  chemistry: FlaskConical,
  biology: Leaf,
  'earth-science': Globe2,
  other: Braces,
}

export function TopicExplore() {
  return (
    <section id="topics" aria-labelledby="topics-heading" className="mx-auto max-w-7xl px-5 py-14 sm:py-16 md:px-8 md:py-24">
      <header className="mb-8 max-w-2xl sm:mb-10">
        <p className="mb-3 text-sm font-bold text-brand">{homeContent.topics.eyebrow}</p>
        <h2 id="topics-heading" className="text-3xl font-extrabold tracking-[-0.035em] text-navy md:text-[2.35rem]">
          {homeContent.topics.title}
        </h2>
        <p className="mt-3 text-base leading-7 text-ink-muted">{homeContent.topics.description}</p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = iconByCategoryId[category.id] ?? Compass

          return (
            <li key={category.id}>
              <Link
                to={`/category/${category.id}`}
                className="group flex min-h-28 items-center gap-4 rounded-2xl border border-border-subtle bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:p-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <strong className="min-w-0 flex-1 text-xl font-extrabold tracking-[-0.025em] text-navy transition-colors group-hover:text-brand sm:text-2xl">
                  {category.label}
                </strong>
                <ArrowRight className="h-5 w-5 shrink-0 text-ink-muted transition group-hover:translate-x-1 group-hover:text-brand" aria-hidden="true" />
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
