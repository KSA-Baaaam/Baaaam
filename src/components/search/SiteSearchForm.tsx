import { Search } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { searchContent } from '@/content/search'

type SiteSearchFormProps = {
  size?: 'compact' | 'large'
  className?: string
}

const sizeStyles = {
  compact: {
    shell: 'min-h-11 rounded-lg pl-3 pr-1',
    input: 'text-base sm:text-sm',
    button: 'h-9 w-9',
  },
  large: {
    shell: 'min-h-14 rounded-lg pl-4 pr-1.5 shadow-search',
    input: 'text-base',
    button: 'h-11 w-11 gap-2 rounded-lg min-[375px]:w-auto min-[375px]:px-4 sm:px-5',
  },
} as const

export function SiteSearchForm({ size = 'compact', className = '' }: SiteSearchFormProps) {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const generatedId = useId()
  const currentQuery = searchParams.get('q') ?? ''
  const [inputValue, setInputValue] = useState(currentQuery)
  const styles = sizeStyles[size]

  useEffect(() => setInputValue(currentQuery), [currentQuery])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedQuery = inputValue.trim()
    const destination = trimmedQuery ? `/search?q=${encodeURIComponent(trimmedQuery)}` : '/search'
    navigate(destination, { replace: location.pathname === '/search' })
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={`w-full ${className}`}>
      <label htmlFor={generatedId} className="sr-only">{searchContent.inputLabel}</label>
      <div className={`flex w-full items-center gap-2 border border-input-border bg-white focus-within:border-brand focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-brand/20 ${styles.shell}`}>
        <Search className="h-[1.1rem] w-[1.1rem] shrink-0 text-ink-soft" aria-hidden="true" />
        <input
          id={generatedId}
          type="search"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={searchContent.inputPlaceholder}
          className={`min-w-0 flex-1 bg-transparent text-navy placeholder:text-ink-soft focus:outline-none ${styles.input}`}
        />
        <button
          type="submit"
          aria-label={searchContent.submitLabel}
          className={`inline-flex shrink-0 items-center justify-center bg-brand text-sm font-bold text-white transition-colors hover:bg-brand-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${styles.button}`}
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          {size === 'large' ? <span className="hidden min-[375px]:inline">{searchContent.submitLabel}</span> : null}
        </button>
      </div>
    </form>
  )
}
