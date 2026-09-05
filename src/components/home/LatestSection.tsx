import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { PostCard } from '@/components/home/PostCard'
import { Pagination } from '@/components/ui'
import { homeContent } from '@/content/home'
import { categories } from '@/data/categories'
import { postsService } from '@/services/posts'

const categoryLabelById = new Map(categories.map((category) => [category.id, category.label]))
const POSTS_PER_PAGE = 6
const ALL_CATEGORY_ID = 'all'
const categoryChipClassName =
  'inline-flex min-h-10 items-center border-b-2 px-3 py-2 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

export function LatestSection() {
  const [page, setPage] = useState(1)
  const [activeCategoryId, setActiveCategoryId] = useState(ALL_CATEGORY_ID)

  const { data = { items: [], total: 0 }, isLoading } = useQuery({
    queryKey: ['posts', 'published-page', activeCategoryId, page, 'newest'],
    queryFn: () => postsService.listPublishedPage({ page, pageSize: POSTS_PER_PAGE, categoryId: activeCategoryId }),
  })
  const totalPages = Math.max(1, Math.ceil(data.total / POSTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const emptyMessage = activeCategoryId === ALL_CATEGORY_ID
    ? '아직 등록된 글이 없어요.'
    : homeContent.latest.empty

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  return (
    <section id="latest" aria-label="글 목록" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-12 sm:py-14 md:px-8 md:py-16">
      <nav aria-label="글 카테고리 필터" className="responsive-scroll -mx-5 mb-8 overflow-x-auto border-b border-border-subtle px-5 [scrollbar-width:none] md:mx-0 md:px-0">
        <ul className="flex min-w-max gap-1">
          <li>
            <button
              type="button"
              aria-pressed={activeCategoryId === ALL_CATEGORY_ID}
              className={`${categoryChipClassName} ${activeCategoryId === ALL_CATEGORY_ID ? 'border-brand text-brand' : 'border-transparent text-ink-muted hover:border-brand/40 hover:text-brand'}`}
              onClick={() => {
                setActiveCategoryId(ALL_CATEGORY_ID)
                setPage(1)
              }}
            >
              {homeContent.latest.allCategory}
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                type="button"
                aria-pressed={activeCategoryId === category.id}
                className={`${categoryChipClassName} ${activeCategoryId === category.id ? 'border-brand text-brand' : 'border-transparent text-ink-muted hover:border-brand/40 hover:text-brand'}`}
                onClick={() => {
                  setActiveCategoryId(category.id)
                  setPage(1)
                }}
              >
                {category.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {isLoading ? (
        <p className="empty-panel">{homeContent.latest.loading}</p>
      ) : data.items.length === 0 ? (
        <p className="empty-panel" aria-live="polite">{emptyMessage}</p>
      ) : (
        <ul className="grid gap-5 lg:grid-cols-2">
          {data.items.map((post) => (
            <li key={post.id}>
              <PostCard post={post} categoryLabel={categoryLabelById.get(post.categoryId) ?? post.categoryId} variant="row" />
            </li>
          ))}
        </ul>
      )}

      {!isLoading ? <Pagination currentPage={currentPage} totalItems={data.total} itemsPerPage={POSTS_PER_PAGE} onPageChange={setPage} ariaLabel="최근 글 페이지" scrollTargetId="latest" /> : null}
    </section>
  )
}
