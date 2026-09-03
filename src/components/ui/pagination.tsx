import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationProps = {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  ariaLabel: string
  scrollTargetId?: string
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
  return pages.filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
}

export function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange, ariaLabel, scrollTargetId }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  if (totalPages <= 1) return null

  const visiblePages = getVisiblePages(currentPage, totalPages)
  const pageItems: Array<number | string> = []
  visiblePages.forEach((page, index) => {
    const previousPage = visiblePages[index - 1]
    if (previousPage && page - previousPage > 1) pageItems.push(`ellipsis-${previousPage}`)
    pageItems.push(page)
  })

  const buttonClassName = 'inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-2.5 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-35 min-[375px]:h-11 min-[375px]:min-w-11 min-[375px]:px-3'
  const defaultButtonClassName = 'border-border-subtle bg-white text-ink-muted hover:border-brand hover:text-brand'
  const currentButtonClassName = 'border-brand bg-brand text-white hover:border-brand-strong hover:bg-brand-strong hover:text-white'

  function changePage(nextPage: number) {
    onPageChange(nextPage)
    if (scrollTargetId) {
      requestAnimationFrame(() => document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }

  return (
    <nav aria-label={ariaLabel} className="mt-10 flex justify-center">
      <ul className="flex flex-wrap items-center justify-center gap-1.5 min-[375px]:gap-2">
        <li>
          <button type="button" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1} aria-label="이전 페이지" className={`${buttonClassName} ${defaultButtonClassName}`}>
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        </li>
        {pageItems.map((item) => typeof item === 'number' ? (
          <li key={item}>
            <button
              type="button"
              onClick={() => changePage(item)}
              aria-label={`${item}페이지`}
              aria-current={item === currentPage ? 'page' : undefined}
              className={`${buttonClassName} ${item === currentPage ? currentButtonClassName : defaultButtonClassName}`}
            >
              {item}
            </button>
          </li>
        ) : (
          <li key={item} aria-hidden="true" className="hidden h-11 min-w-6 items-center justify-center text-sm text-ink-soft min-[375px]:flex">…</li>
        ))}
        <li>
          <button type="button" onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages} aria-label="다음 페이지" className={`${buttonClassName} ${defaultButtonClassName}`}>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>
  )
}
