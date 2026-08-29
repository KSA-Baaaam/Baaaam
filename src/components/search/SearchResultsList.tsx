import { useState } from 'react'

import { categories } from '@/data/categories'
import type { Post } from '@/types/blog'
import { PostCard } from '@/components/home/PostCard'
import { searchContent } from '@/content/search'

const categoryLabelById = new Map(categories.map((category) => [category.id, category.label]))

const INITIAL_VISIBLE_COUNT = 6
const LOAD_MORE_STEP = 6
type SearchResultsListProps = {
  results: Post[]
}

/**
 * 검색 결과 목록. `CategoryPostGrid`와 동일한 더 보기 패턴(초기 6개, +6씩)을 재사용한다.
 *
 * 호출부(`SearchResults`)가 `key={query}`로 렌더링해 검색어가 바뀔 때마다 이 컴포넌트를 다시
 * 마운트시키므로, `visibleCount`는 매 검색마다 자동으로 초기값에서 시작한다.
 */
export function SearchResultsList({ results }: SearchResultsListProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)

  const visiblePosts = results.slice(0, visibleCount)
  const hasMore = visibleCount < results.length

  return (
    <div>
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

      <div className="mt-10 flex justify-center">
        {hasMore ? (
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + LOAD_MORE_STEP)}
            className="rounded-lg border border-brand px-6 py-3 text-sm font-bold text-brand transition-colors hover:bg-brand hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {searchContent.loadMore}
          </button>
        ) : (
          <p className="text-sm text-ink-muted">{searchContent.allLoaded}</p>
        )}
      </div>
    </div>
  )
}
