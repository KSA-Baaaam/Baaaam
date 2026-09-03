import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { PostCard } from '@/components/home/PostCard'
import { Pagination } from '@/components/ui'
import { homeContent } from '@/content/home'
import { categories } from '@/data/categories'
import { postsService } from '@/services/posts'

const categoryLabelById = new Map(categories.map((category) => [category.id, category.label]))
const POSTS_PER_PAGE = 6
const categoryChipClassName =
  'rounded-full border border-border-subtle bg-white px-4 py-2 text-sm font-bold text-ink-muted transition-colors hover:border-brand hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

export function LatestSection() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts', 'all'],
    queryFn: postsService.listAll,
  })
  const [page, setPage] = useState(1)

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
    [posts],
  )
  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / POSTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const visiblePosts = sortedPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

  return (
    <section id="latest" aria-label="글 목록" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 sm:py-16 md:px-8 md:py-24">
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

      {!isLoading ? <Pagination currentPage={currentPage} totalItems={sortedPosts.length} itemsPerPage={POSTS_PER_PAGE} onPageChange={setPage} ariaLabel="최근 글 페이지" scrollTargetId="latest" /> : null}
    </section>
  )
}
