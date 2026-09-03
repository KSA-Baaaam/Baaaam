import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

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
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts', 'all'],
    queryFn: postsService.listAll,
  })
  const [page, setPage] = useState(1)
  const [activeCategoryId, setActiveCategoryId] = useState(ALL_CATEGORY_ID)

  const sortedPosts = useMemo(
    () => posts
      .filter((post) => activeCategoryId === ALL_CATEGORY_ID || post.categoryId === activeCategoryId)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
    [activeCategoryId, posts],
  )
  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / POSTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const visiblePosts = sortedPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

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
      ) : visiblePosts.length === 0 ? (
        <p className="empty-panel">{homeContent.latest.empty}</p>
      ) : (
        <ul className="grid gap-5 lg:grid-cols-2">
          {visiblePosts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} categoryLabel={categoryLabelById.get(post.categoryId) ?? post.categoryId} variant="row" />
            </li>
          ))}
        </ul>
      )}

      {!isLoading ? <Pagination currentPage={currentPage} totalItems={sortedPosts.length} itemsPerPage={POSTS_PER_PAGE} onPageChange={setPage} ariaLabel="최근 글 페이지" scrollTargetId="latest" /> : null}
    </section>
  )
}
