import { Check } from 'lucide-react'

import { categories } from '@/data/categories'

type CategorySelectProps = {
  value: string
  onChange: (value: string) => void
  compact?: boolean
}

export function CategorySelect({ value, onChange, compact = false }: CategorySelectProps) {
  return (
    <fieldset>
      <legend className="text-sm font-extrabold text-navy">
        카테고리 <span className="text-danger">*</span>
      </legend>
      <div className={`mt-2 flex flex-wrap ${compact ? 'gap-1.5' : 'gap-2'}`}>
        {categories.map((category) => {
          const selected = value === category.id
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(category.id)}
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                selected
                  ? 'border-brand bg-brand text-white'
                  : 'border-input-border bg-white text-ink-muted hover:border-brand hover:text-brand-strong'
              }`}
            >
              {selected ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
              {category.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
