import { categories } from '@/data/categories'
import type { PostSummary } from '@/types/blog'
import { PostCard } from '@/components/home/PostCard'
import { Pagination } from '@/components/ui'

const categoryLabelById = new Map(categories.map((category) => [category.id, category.label]))

const POSTS_PER_PAGE = 6
type SearchResultsListProps = {
  results: PostSummary[]
  page: number
  total: number
  onPageChange: (page: number) => void
}

/** 검색 결과 목록. 서버에서 한 페이지에 6개씩 받은 결과만 렌더링한다. */
export function SearchResultsList({ results, page, total, onPageChange }: SearchResultsListProps) {
  return (
    <div id="search-results-list" className="scroll-mt-24">
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {results.map((post) => (
          <li key={post.id}>
            <PostCard
              post={post}
              categoryLabel={categoryLabelById.get(post.categoryId) ?? post.categoryId}
            />
          </li>
        ))}
      </ul>

      <Pagination currentPage={page} totalItems={total} itemsPerPage={POSTS_PER_PAGE} onPageChange={onPageChange} ariaLabel="검색 결과 페이지" scrollTargetId="search-results-list" />
    </div>
  )
}
