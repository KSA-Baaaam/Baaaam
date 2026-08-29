import { Link } from 'react-router-dom'

import { categoryContent } from '@/content/category'
import { categories } from '@/data/categories'

const ALL_CATEGORY_ID = 'all'

type CategoryTabsProps = { activeCategoryId: string }

export function CategoryTabs({ activeCategoryId }: CategoryTabsProps) {
  return (
    <nav aria-label={categoryContent.tabsAriaLabel} className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0">
      <ul className="flex min-w-max gap-2">
        <li>
          <Link
            to="/category/all"
            aria-current={activeCategoryId === ALL_CATEGORY_ID ? 'page' : undefined}
            className={`inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-bold ${activeCategoryId === ALL_CATEGORY_ID ? 'border-brand bg-brand text-white' : 'border-border-subtle bg-white text-ink-muted hover:border-brand hover:text-brand'}`}
          >
            {categoryContent.allCategoryChip}
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              to={`/category/${category.id}`}
              aria-current={activeCategoryId === category.id ? 'page' : undefined}
              className={`inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-bold ${activeCategoryId === category.id ? 'border-brand bg-brand text-white' : 'border-border-subtle bg-white text-ink-muted hover:border-brand hover:text-brand'}`}
            >
              {category.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
