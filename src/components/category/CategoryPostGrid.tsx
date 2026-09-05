import { BookOpen, Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { PostCard } from '@/components/home/PostCard'
import { Pagination, SimpleSelect } from '@/components/ui'
import { categoryContent } from '@/content/category'
import { categories } from '@/data/categories'
import { postsService } from '@/services/posts'

const categoryLabelById = new Map(categories.map((category) => [category.id, category.label]))
const ALL_CATEGORY_ID = 'all'
const POSTS_PER_PAGE = 6

type SortMode = 'newest' | 'popular'
type CategoryPostGridProps = { activeCategoryId: string }
const sortOptions = [
  { value: 'newest', label: categoryContent.sortNewest },
  { value: 'popular', label: categoryContent.sortPopular },
] as const

export function CategoryPostGrid({ activeCategoryId }: CategoryPostGridProps) {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('newest')

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 350)
    return () => window.clearTimeout(timer)
  }, [query])

  useEffect(() => setPage(1), [activeCategoryId])

  const { data = { items: [], total: 0 }, isLoading } = useQuery({
    queryKey: ['posts', 'published-page', activeCategoryId, page, debouncedQuery, sortMode],
    queryFn: () => postsService.listPublishedPage({ page, pageSize: POSTS_PER_PAGE, categoryId: activeCategoryId, query: debouncedQuery, sort: sortMode }),
  })
  const totalPages = Math.max(1, Math.ceil(data.total / POSTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const heading = activeCategoryId === ALL_CATEGORY_ID ? categoryContent.allCategoryTitle : `${categoryLabelById.get(activeCategoryId) ?? activeCategoryId}${categoryContent.categoryTitleSuffix}`
  const emptyMessage = debouncedQuery
    ? categoryContent.empty
    : activeCategoryId === ALL_CATEGORY_ID
      ? '아직 등록된 글이 없어요.'
      : '아직 이 카테고리에 등록된 글이 없어요.'

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  return (
    <div id="category-post-list" className="scroll-mt-24">
      <div className="mb-7 flex flex-col gap-4 border-b border-border-subtle pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-navy">{heading}</h2>
          <p className="mt-1 text-sm text-ink-muted">{data.total}{categoryContent.countSuffix}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block min-w-0 sm:w-72">
            <span className="sr-only">{categoryContent.filterLabel}</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setPage(1) }}
              placeholder={categoryContent.filterPlaceholder}
              className="min-h-11 w-full rounded-lg border border-input-border bg-white pl-10 pr-4 text-base text-navy placeholder:text-ink-soft focus:border-brand focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-brand/20 sm:text-sm"
            />
          </label>
          <div className="w-full sm:w-40">
            <SimpleSelect
              value={sortMode}
              options={sortOptions}
              onValueChange={(value) => { setSortMode(value as SortMode); setPage(1) }}
              ariaLabel={categoryContent.sortLabel}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <p className="empty-panel">{categoryContent.loading}</p>
      ) : data.items.length === 0 ? (
        <div className="empty-panel">
          <BookOpen className="mx-auto mb-4 h-8 w-8 text-brand" strokeWidth={1.7} aria-hidden="true" />
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.items.map((post) => (
            <li key={post.id}><PostCard post={post} categoryLabel={categoryLabelById.get(post.categoryId) ?? post.categoryId} /></li>
          ))}
        </ul>
      )}

      {!isLoading ? <Pagination currentPage={currentPage} totalItems={data.total} itemsPerPage={POSTS_PER_PAGE} onPageChange={setPage} ariaLabel="카테고리 글 페이지" scrollTargetId="category-post-list" /> : null}
    </div>
  )
}
