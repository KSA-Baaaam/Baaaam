import type { Editor } from '@tiptap/react'
import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Atom,
  Beaker,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Lightbulb,
  ListChecks,
  Minus,
  Pilcrow,
  Quote,
  Sigma,
  Sparkles,
  Table2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import type { EducationVariant } from '@/components/editor/extensions'
import { focusSafeInsertionPoint } from '@/components/editor/editorCommands'

type BlockMenuProps = {
  editor: Editor
  open: boolean
  query: string
  onClose: () => void
  onPickImage: () => void
  clearSlash?: () => void
}

type MenuItem = {
  label: string
  description: string
  keywords: string
  icon: LucideIcon
  run: () => void
}

export function EditorBlockMenu({ editor, open, query, onClose, onPickImage, clearSlash }: BlockMenuProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [search, setSearch] = useState('')

  const items = useMemo<MenuItem[]>(() => [
    { label: '텍스트', description: '일반 본문을 작성합니다', keywords: 'paragraph text 본문', icon: Pilcrow, run: () => { focusSafeInsertionPoint(editor); editor.chain().focus().setParagraph().run() } },
    { label: '제목 1', description: '가장 큰 단락 제목', keywords: 'heading h1', icon: Heading1, run: () => { focusSafeInsertionPoint(editor); editor.chain().focus().toggleHeading({ level: 1 }).run() } },
    { label: '제목 2', description: '중간 크기 단락 제목', keywords: 'heading h2', icon: Heading2, run: () => { focusSafeInsertionPoint(editor); editor.chain().focus().toggleHeading({ level: 2 }).run() } },
    { label: '제목 3', description: '작은 단락 제목', keywords: 'heading h3', icon: Heading3, run: () => { focusSafeInsertionPoint(editor); editor.chain().focus().toggleHeading({ level: 3 }).run() } },
    { label: '이미지', description: '사진을 최적화해 업로드합니다', keywords: 'image photo 사진', icon: ImagePlus, run: onPickImage },
    { label: '표 2×2', description: '간단한 제목 행 표', keywords: 'table grid 표', icon: Table2, run: () => { focusSafeInsertionPoint(editor); editor.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run() } },
    { label: '표 3×3', description: '제목 행이 있는 기본 표', keywords: 'table grid 표', icon: Table2, run: () => { focusSafeInsertionPoint(editor); editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() } },
    { label: '수식', description: 'LaTeX 수식과 미리보기', keywords: 'math latex formula', icon: Sigma, run: () => { focusSafeInsertionPoint(editor); editor.chain().focus().insertContent({ type: 'mathBlock', attrs: { latex: '' } }).run() } },
    { label: '코드', description: '언어별 강조가 있는 코드', keywords: 'code programming', icon: Code2, run: () => { focusSafeInsertionPoint(editor); editor.chain().focus().toggleCodeBlock().run() } },
    { label: '인용문', description: '중요한 문장을 구분합니다', keywords: 'quote', icon: Quote, run: () => { focusSafeInsertionPoint(editor); editor.chain().focus().toggleBlockquote().run() } },
    { label: '구분선', description: '내용 사이에 선을 추가합니다', keywords: 'divider line', icon: Minus, run: () => { focusSafeInsertionPoint(editor); editor.chain().focus().setHorizontalRule().run() } },
    ...([
      ['concept', '핵심 개념', '정의와 핵심 내용을 강조합니다', 'concept 핵심', Lightbulb],
      ['example', '예제', '개념을 적용한 예를 보여줍니다', 'example 예시', Sparkles],
      ['problem', '문제', '문제·정답·해설을 구성합니다', 'problem quiz 정답 해설', ListChecks],
      ['tip', 'Tip', '학습에 도움이 되는 팁을 전합니다', '팁 hint', Atom],
      ['warning', '주의사항', '헷갈리기 쉬운 내용을 알립니다', 'warning caution 주의', AlertTriangle],
      ['experiment', '실험', '목표부터 결과까지 기록합니다', 'experiment 준비물 결과', Beaker],
    ] as const).map(([variant, label, description, keywords, icon]) => ({
      label,
      description,
      keywords,
      icon,
      run: () => { focusSafeInsertionPoint(editor); editor.chain().focus().insertContent({ type: 'educationBlock', attrs: { variant: variant as EducationVariant } }).run() },
    })),
  ], [editor, onPickImage])

  const filtered = useMemo(() => {
    const normalized = search.trim().toLocaleLowerCase('ko-KR')
    return normalized
      ? items.filter((item) => `${item.label} ${item.keywords}`.toLocaleLowerCase('ko-KR').includes(normalized))
      : items
  }, [items, search])

  useEffect(() => {
    if (open) setSearch(query)
  }, [query, open])

  useEffect(() => setActiveIndex(0), [search, open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((current) => (current + 1) % Math.max(1, filtered.length))
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((current) => (current - 1 + Math.max(1, filtered.length)) % Math.max(1, filtered.length))
      } else if (event.key === 'Enter' && filtered[activeIndex]) {
        event.preventDefault()
        clearSlash?.()
        filtered[activeIndex].run()
        onClose()
      } else if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [activeIndex, clearSlash, filtered, onClose, open])

  if (!open) return null

  return (
    <div role="dialog" aria-label="블록 추가" className="fixed bottom-4 left-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-xl border border-border-subtle bg-white shadow-lg sm:bottom-8">
      <div className="border-b border-border-subtle px-4 py-3">
        <label htmlFor="editor-block-search" className="text-xs font-bold text-ink-soft">블록 추가</label>
        <input
          id="editor-block-search"
          autoFocus
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="블록 이름 검색"
          className="mt-2 min-h-10 w-full rounded-lg border border-input-border bg-white px-3 text-sm text-navy outline-none placeholder:text-ink-soft focus:border-brand focus:ring-2 focus:ring-brand/10"
        />
      </div>
      <div className="max-h-72 overflow-y-auto p-2">
        {filtered.length ? filtered.map((item, index) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => {
                clearSlash?.()
                item.run()
                onClose()
              }}
              className={`flex min-h-14 w-full items-center gap-3 rounded-lg px-3 text-left ${activeIndex === index ? 'bg-brand-soft text-brand-strong' : 'text-ink hover:bg-section'}`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${activeIndex === index ? 'bg-white/75' : 'bg-section'}`}><Icon className="h-4 w-4" aria-hidden="true" /></span>
              <span className="min-w-0"><strong className="block text-sm">{item.label}</strong><span className="block truncate text-xs font-medium text-ink-soft">{item.description}</span></span>
            </button>
          )
        }) : <p className="px-3 py-8 text-center text-sm text-ink-muted">일치하는 블록이 없습니다.</p>}
      </div>
    </div>
  )
}
