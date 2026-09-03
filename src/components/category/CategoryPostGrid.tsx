import { Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import brandMascot from '@/assets/brand-mascot.png'
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
  const { data: posts = [], isLoading } = useQuery({ queryKey: ['posts', 'all'], queryFn: postsService.listAll })
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('newest')

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ko-KR')
    const matches = posts.filter((post) => {
      const categoryMatches = activeCategoryId === ALL_CATEGORY_ID || post.categoryId === activeCategoryId
      const queryMatches = !normalizedQuery || `${post.title} ${post.content}`.toLocaleLowerCase('ko-KR').includes(normalizedQuery)
      return categoryMatches && queryMatches
    })

    return [...matches].sort((a, b) => {
      if (sortMode === 'popular') return b.viewCount - a.viewCount
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
  }, [activeCategoryId, posts, query, sortMode])

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const visiblePosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)
  const heading = activeCategoryId === ALL_CATEGORY_ID ? categoryContent.allCategoryTitle : `${categoryLabelById.get(activeCategoryId) ?? activeCategoryId}${categoryContent.categoryTitleSuffix}`

  return (
    <div id="category-post-list" className="scroll-mt-24">
      <div className="mb-7 flex flex-col gap-4 border-b border-border-subtle pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-navy">{heading}</h2>
          <p className="mt-1 text-sm text-ink-muted">{filteredPosts.length}{categoryContent.countSuffix}</p>
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
      ) : visiblePosts.length === 0 ? (
        <div className="empty-panel">
          <img src={brandMascot} alt="" width={76} height={76} className="mx-auto mb-3 h-16 w-16 object-contain opacity-85" />
          <p>{categoryContent.empty}</p>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visiblePosts.map((post) => (
            <li key={post.id}><PostCard post={post} categoryLabel={categoryLabelById.get(post.categoryId) ?? post.categoryId} /></li>
          ))}
        </ul>
      )}

      {!isLoading ? <Pagination currentPage={currentPage} totalItems={filteredPosts.length} itemsPerPage={POSTS_PER_PAGE} onPageChange={setPage} ariaLabel="카테고리 글 페이지" scrollTargetId="category-post-list" /> : null}
    </div>
  )
}
