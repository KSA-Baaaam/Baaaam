import { Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import brandMascot from '@/assets/brand-mascot.png'
import { PostCard } from '@/components/home/PostCard'
import { categoryContent } from '@/content/category'
import { categories } from '@/data/categories'
import { postsService } from '@/services/posts'

const categoryLabelById = new Map(categories.map((category) => [category.id, category.label]))
const ALL_CATEGORY_ID = 'all'
const INITIAL_VISIBLE_COUNT = 6
const LOAD_MORE_STEP = 6

type SortMode = 'newest' | 'popular' | 'recommended'
type CategoryPostGridProps = { activeCategoryId: string }

export function CategoryPostGrid({ activeCategoryId }: CategoryPostGridProps) {
  const { data: posts = [], isLoading } = useQuery({ queryKey: ['posts', 'all'], queryFn: postsService.listAll })
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)
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
      if (sortMode === 'recommended') return Number(b.isRecommended) - Number(a.isRecommended) || new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
  }, [activeCategoryId, posts, query, sortMode])

  const visiblePosts = filteredPosts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPosts.length
  const heading = activeCategoryId === ALL_CATEGORY_ID ? categoryContent.allCategoryTitle : `${categoryLabelById.get(activeCategoryId) ?? activeCategoryId}${categoryContent.categoryTitleSuffix}`

  return (
    <div>
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
              onChange={(event) => { setQuery(event.target.value); setVisibleCount(INITIAL_VISIBLE_COUNT) }}
              placeholder={categoryContent.filterPlaceholder}
              className="min-h-11 w-full rounded-lg border border-input-border bg-white pl-10 pr-4 text-sm text-navy placeholder:text-ink-soft focus:border-brand focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-brand/20"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-ink-muted">
            <span>{categoryContent.sortLabel}</span>
            <select
              value={sortMode}
              onChange={(event) => { setSortMode(event.target.value as SortMode); setVisibleCount(INITIAL_VISIBLE_COUNT) }}
              className="min-h-11 rounded-lg border border-input-border bg-white px-3 text-sm font-semibold text-navy focus:border-brand focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-brand/20"
            >
              <option value="newest">{categoryContent.sortNewest}</option>
              <option value="popular">{categoryContent.sortPopular}</option>
              <option value="recommended">{categoryContent.sortRecommended}</option>
            </select>
          </label>
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

      {!isLoading && hasMore ? (
        <div className="mt-10 flex justify-center">
          <button type="button" onClick={() => setVisibleCount((count) => count + LOAD_MORE_STEP)} className="rounded-lg border border-brand px-6 py-3 text-sm font-bold text-brand hover:bg-brand hover:text-white">
            {categoryContent.loadMore}
          </button>
        </div>
      ) : null}
    </div>
  )
}
