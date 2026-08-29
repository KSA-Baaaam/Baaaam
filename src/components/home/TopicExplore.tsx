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

      <ul className="grid border-y border-border-subtle sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => {
          const Icon = iconByCategoryId[category.id] ?? Compass

          return (
            <li
              key={category.id}
              className={`group relative border-border-subtle px-1 py-7 sm:px-6 ${
                index % 2 === 0 ? 'sm:border-r' : ''
              } ${index < categories.length - 2 ? 'border-b' : ''} ${
                index % 3 !== 2 ? 'lg:border-r' : 'lg:border-r-0'
              } ${index < categories.length - 3 ? 'lg:border-b' : 'lg:border-b-0'}`}
            >
              <Link
                to={`/category/${category.id}`}
                className="flex min-h-[142px] items-start gap-4 rounded-lg p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${category.accent}14`, color: category.accent }}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <strong className="text-lg font-extrabold text-navy" style={{ color: category.accent }}>
                    {category.label}
                  </strong>
                  <span className="mt-2 text-sm leading-6 text-ink-muted">{category.description}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-navy transition-colors group-hover:text-brand">
                    {homeContent.topics.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
