import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { categories } from '@/data/categories'
import { CategoryPostGrid } from '@/components/category/CategoryPostGrid'
import { CategoryTabs } from '@/components/category/CategoryTabs'
import { SiteFooter } from '@/components/home/SiteFooter'
import { SiteHeader } from '@/components/home/SiteHeader'
import { categoryContent } from '@/content/category'

const ALL_CATEGORY_ID = 'all'
const knownCategoryIds = new Set(categories.map((category) => category.id))

function normalizeCategoryId(categoryId?: string) {
  return categoryId && (categoryId === ALL_CATEGORY_ID || knownCategoryIds.has(categoryId))
    ? categoryId
    : ALL_CATEGORY_ID
}

/**
 * 카테고리별 글 목록 화면(`/category/:categoryId`).
 *
 * URL의 `categoryId`가 상태의 원천이라 새로고침·뒤로가기에도 선택이 유지된다. 알 수 없는
 * 값이 들어오면 "전체"로 대체 렌더링한다.
 */
export default function CategoryList() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const routeCategoryId = normalizeCategoryId(categoryId)
  const [activeCategoryId, setActiveCategoryId] = useState(routeCategoryId)
  const activeCategory = categories.find((category) => category.id === activeCategoryId)

  useEffect(() => setActiveCategoryId(routeCategoryId), [routeCategoryId])

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <section className="border-b border-border-subtle bg-section">
          <div className="mx-auto max-w-7xl px-5 py-10 sm:py-12 md:px-8 md:py-14">
          <header className="mb-9 max-w-3xl">
            <p className="mb-3 text-sm font-bold text-brand">
              {categoryContent.eyebrow}
            </p>
            <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-navy md:text-[2.65rem]">
              {activeCategory ? `${activeCategory.label} 개념을 살펴봐요` : categoryContent.title}
            </h1>
            <p className="mt-3 text-base leading-7 text-ink-muted">
              {activeCategory?.description ?? categoryContent.description}
            </p>
          </header>

          <div className="mb-10">
            <CategoryTabs activeCategoryId={activeCategoryId} onCategoryChange={setActiveCategoryId} />
          </div>
          </div>
        </section>
        <section className="mx-auto w-full max-w-7xl px-5 py-12 md:px-8 md:py-16">
          <CategoryPostGrid key={activeCategoryId} activeCategoryId={activeCategoryId} />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
