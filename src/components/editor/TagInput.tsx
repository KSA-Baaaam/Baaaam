import { useRef, useState } from 'react'
import { X } from 'lucide-react'

type TagInputProps = {
  tags: string[]
  onChange: (tags: string[]) => void
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [value, setValue] = useState('')
  const composingRef = useRef(false)

  function addTag(rawValue = value) {
    const normalized = rawValue.trim().replace(/^#+/, '').slice(0, 20)
    if (!normalized || tags.includes(normalized) || tags.length >= 10) {
      setValue('')
      return
    }
    onChange([...tags, normalized])
    setValue('')
  }

  return (
    <div>
      <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-lg border border-input-border bg-white px-3 py-2 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand-strong">
            #{tag}
            <button type="button" onClick={() => onChange(tags.filter((candidate) => candidate !== tag))} aria-label={`${tag} 태그 삭제`} className="rounded-full p-0.5 hover:bg-brand/10"><X className="h-3 w-3" /></button>
          </span>
        ))}
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onCompositionStart={() => { composingRef.current = true }}
          onCompositionEnd={(event) => {
            composingRef.current = false
            setValue(event.currentTarget.value)
          }}
          onBlur={(event) => {
            if (!composingRef.current) addTag(event.currentTarget.value)
          }}
          onKeyDown={(event) => {
            if (composingRef.current || event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault()
              addTag(event.currentTarget.value)
            }
          }}
          maxLength={20}
          disabled={tags.length >= 10}
          placeholder={tags.length >= 10 ? '태그는 10개까지 추가할 수 있어요.' : '태그 입력 후 Enter'}
          className="min-w-36 flex-1 border-0 bg-transparent py-1 text-sm text-navy outline-none placeholder:text-ink-soft"
        />
      </div>
      <p className="mt-1.5 text-xs text-ink-soft">태그당 20자, 최대 10개</p>
    </div>
  )
}
