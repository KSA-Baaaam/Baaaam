import { Check, ChevronDown } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from './select'

export type SimpleSelectOption = {
  value: string
  label: string
}

type SimpleSelectProps = {
  value: string
  options: readonly SimpleSelectOption[]
  onValueChange: (value: string) => void
  placeholder?: string
  id?: string
  ariaLabel?: string
  ariaInvalid?: boolean
  ariaDescribedBy?: string
  title?: string
  disabled?: boolean
  className?: string
}

/** 사이트 전반에서 사용하는 간결한 단일 선택 드롭다운. */
export function SimpleSelect({
  value,
  options,
  onValueChange,
  placeholder,
  id,
  ariaLabel,
  ariaInvalid,
  ariaDescribedBy,
  title,
  disabled = false,
  className = '',
}: SimpleSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        id={id}
        aria-label={ariaLabel}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        title={title}
        className={`group inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-input-border bg-white px-4 text-base font-bold text-navy transition-colors hover:border-brand/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-soft disabled:opacity-70 sm:text-sm ${className}`}
      >
        <SelectValue placeholder={placeholder} />
        <SelectIcon>
          <ChevronDown className="h-4 w-4 text-ink-soft transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
        </SelectIcon>
      </SelectTrigger>
      <SelectContent
        position="popper"
        sideOffset={6}
        className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-border-subtle bg-white p-1 shadow-lg"
        viewportProps={{ className: 'flex flex-col gap-0.5' }}
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="relative flex min-h-10 cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-9 text-sm font-semibold text-navy outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-brand-soft data-[highlighted]:text-brand-strong data-[state=checked]:text-brand-strong"
          >
            <SelectItemText>{option.label}</SelectItemText>
            <SelectItemIndicator className="absolute right-3 inline-flex items-center justify-center text-brand">
              <Check className="h-4 w-4" aria-hidden="true" />
            </SelectItemIndicator>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
