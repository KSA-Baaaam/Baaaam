import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { PostCard } from '@/components/home/PostCard'
import { homeContent } from '@/content/home'
import { categories } from '@/data/categories'
import { postsService } from '@/services/posts'

const categoryLabelById = new Map(categories.map((category) => [category.id, category.label]))
const INITIAL_VISIBLE_COUNT = 6
const LOAD_MORE_STEP = 6
const categoryChipClassName =
  'rounded-full border border-border-subtle bg-white px-4 py-2 text-sm font-bold text-ink-muted transition-colors hover:border-brand hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

export function LatestSection() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts', 'all'],
    queryFn: postsService.listAll,
  })
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
    [posts],
  )
  const visiblePosts = sortedPosts.slice(0, visibleCount)
  const hasMore = visibleCount < sortedPosts.length

  return (
    <section id="latest" aria-labelledby="latest-heading" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
      <header className="mb-8 max-w-2xl">
        <p className="mb-3 text-sm font-bold text-brand">{homeContent.latest.eyebrow}</p>
        <h2 id="latest-heading" className="text-3xl font-extrabold tracking-[-0.035em] text-navy md:text-[2.35rem]">
          {homeContent.latest.title}
        </h2>
        <p className="mt-3 text-base leading-7 text-ink-muted">{homeContent.latest.description}</p>
      </header>

      <nav aria-label="카테고리 바로가기" className="mb-8">
        <ul className="flex flex-wrap gap-2">
          <li><Link to="/category/all" className={categoryChipClassName}>{homeContent.latest.allCategory}</Link></li>
          {categories.map((category) => (
            <li key={category.id}><Link to={`/category/${category.id}`} className={categoryChipClassName}>{category.label}</Link></li>
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

      {!isLoading ? (
        <div className="mt-10 flex justify-center">
          {hasMore ? (
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + LOAD_MORE_STEP)}
              className="rounded-lg border border-brand px-6 py-3 text-sm font-bold text-brand transition-colors hover:bg-brand hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {homeContent.latest.loadMore}
            </button>
          ) : (
            <p className="text-sm text-ink-muted">{homeContent.latest.allLoaded}</p>
          )}
        </div>
      ) : null}
    </section>
  )
}
