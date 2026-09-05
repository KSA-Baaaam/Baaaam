import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { SearchX } from 'lucide-react'
import { useEffect, useState } from 'react'

import { categories } from '@/data/categories'
import { postsService } from '@/services/posts'
import { SiteFooter } from '@/components/home/SiteFooter'
import { SiteHeader } from '@/components/home/SiteHeader'
import { SearchResultsList } from '@/components/search/SearchResultsList'
import { SiteSearchForm } from '@/components/search/SiteSearchForm'
import { searchContent } from '@/content/search'

const POSTS_PER_PAGE = 6

const categoryChipClassName =
  'rounded-full border border-border-subtle bg-white px-4 py-2 text-sm font-bold text-ink-muted transition-colors hover:border-brand hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

/** 검색어 없음/결과 없음 상태에서 다음 탐색을 돕는 카테고리 바로가기. */
function SearchSuggestions() {
  return (
    <div>
        <h2 className="mb-4 text-xl font-extrabold text-navy">{searchContent.suggestions.categoryTitle}</h2>
        <nav aria-label={searchContent.suggestions.categoryTitle}>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link to="/category/all" className={categoryChipClassName}>
                {searchContent.suggestions.allCategoryChip}
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link to={`/category/${category.id}`} className={categoryChipClassName}>
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
    </div>
  )
}

/** 검색 결과 화면(`/search?q=<검색어>`). `postsService`로 조회하므로 관리자 변경이 즉시 반영된다. */
export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = (searchParams.get('q') ?? '').trim()
  const [page, setPage] = useState(1)
  const { data = { items: [], total: 0 }, isLoading } = useQuery({
    queryKey: ['posts', 'search', query, page],
    queryFn: () => postsService.listPublishedPage({ query, page, pageSize: POSTS_PER_PAGE }),
    enabled: Boolean(query),
  })
  const totalPages = Math.max(1, Math.ceil(data.total / POSTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)

  useEffect(() => setPage(1), [query])
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <section className="border-b border-border-subtle bg-hero">
          <header className="mx-auto max-w-7xl px-5 py-10 sm:py-12 md:px-8 md:py-14">
            <p className="mb-3 text-sm font-bold text-brand">{searchContent.eyebrow}</p>
            {query ? (
              <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-navy md:text-[2.65rem]">
                &lsquo;{query}&rsquo; {searchContent.resultsLabel} {data.total}
                {searchContent.countUnit}
              </h1>
            ) : (
              <>
                <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-navy md:text-[2.65rem]">
                  {searchContent.emptyQuery.title}
                </h1>
                <p className="mt-3 text-base leading-7 text-ink-muted">
                  {searchContent.emptyQuery.description}
                </p>
              </>
            )}
            <div className="mt-7 max-w-2xl"><SiteSearchForm size="large" /></div>
          </header>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 py-12 md:px-8 md:py-16">

          {isLoading ? (
            <p className="empty-panel">
              {searchContent.loading}
            </p>
          ) : (
            <>
              {query && data.items.length === 0 ? (
                <div className="mb-10 border-y border-border-subtle bg-section px-5 py-10 text-center sm:px-6">
                  <SearchX className="mx-auto mb-4 h-8 w-8 text-brand" strokeWidth={1.7} aria-hidden="true" />
                  <p className="text-base font-bold text-navy">
                    &lsquo;{query}&rsquo;{searchContent.noResults.titleSuffix}
                  </p>
                  <p className="mt-2 text-sm text-ink-muted">{searchContent.noResults.description}</p>
                </div>
              ) : null}

              {query && data.items.length > 0 ? (
                <SearchResultsList results={data.items} page={currentPage} total={data.total} onPageChange={setPage} />
              ) : (
                <SearchSuggestions />
              )}
            </>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
