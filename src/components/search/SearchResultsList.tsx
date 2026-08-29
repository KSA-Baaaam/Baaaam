import { useState } from 'react'

import { categories } from '@/data/categories'
import type { Post } from '@/types/blog'
import { PostCard } from '@/components/home/PostCard'
import { Pagination } from '@/components/ui'

const categoryLabelById = new Map(categories.map((category) => [category.id, category.label]))

const POSTS_PER_PAGE = 6
type SearchResultsListProps = {
  results: Post[]
}

/**
 * 검색 결과 목록. 한 페이지에 6개씩 보여주는 페이지 탐색 패턴을 사용한다.
 *
 * 호출부(`SearchResults`)가 `key={query}`로 렌더링해 검색어가 바뀔 때마다 이 컴포넌트를 다시
 * 마운트시키므로, `page`는 매 검색마다 자동으로 첫 페이지에서 시작한다.
 */
export function SearchResultsList({ results }: SearchResultsListProps) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(results.length / POSTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const visiblePosts = results.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

  return (
    <div id="search-results-list" className="scroll-mt-24">
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {visiblePosts.map((post) => (
          <li key={post.id}>
            <PostCard
              post={post}
              categoryLabel={categoryLabelById.get(post.categoryId) ?? post.categoryId}
            />
          </li>
        ))}
      </ul>

      <Pagination currentPage={currentPage} totalItems={results.length} itemsPerPage={POSTS_PER_PAGE} onPageChange={setPage} ariaLabel="검색 결과 페이지" scrollTargetId="search-results-list" />
    </div>
  )
}
