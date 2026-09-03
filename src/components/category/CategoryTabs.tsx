import { Link } from 'react-router-dom'

import { categoryContent } from '@/content/category'
import { categories } from '@/data/categories'

const ALL_CATEGORY_ID = 'all'

type CategoryTabsProps = { activeCategoryId: string }

export function CategoryTabs({ activeCategoryId }: CategoryTabsProps) {
  return (
    <nav aria-label={categoryContent.tabsAriaLabel} className="responsive-scroll -mx-5 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0">
      <ul className="flex min-w-max gap-1 rounded-2xl bg-surface-muted p-1.5">
        <li>
          <Link
            to="/category/all"
            aria-current={activeCategoryId === ALL_CATEGORY_ID ? 'page' : undefined}
            className={`inline-flex min-h-10 items-center rounded-xl px-4 text-sm font-bold transition-colors ${activeCategoryId === ALL_CATEGORY_ID ? 'bg-white text-brand shadow-sm' : 'text-ink-muted hover:bg-white/70 hover:text-brand'}`}
          >
            {categoryContent.allCategoryChip}
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              to={`/category/${category.id}`}
              aria-current={activeCategoryId === category.id ? 'page' : undefined}
              className={`inline-flex min-h-10 items-center rounded-xl px-4 text-sm font-bold transition-colors ${activeCategoryId === category.id ? 'bg-white text-brand shadow-sm' : 'text-ink-muted hover:bg-white/70 hover:text-brand'}`}
            >
              {category.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
