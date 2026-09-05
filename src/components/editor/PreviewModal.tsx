import { useState } from 'react'
import { Monitor, Smartphone, X } from 'lucide-react'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui'
import { PostContentRenderer } from '@/components/post/PostContentRenderer'
import { categories } from '@/data/categories'
import type { PostDraft } from '@/types/blog'

export function PreviewModal({ open, onOpenChange, draft }: { open: boolean; onOpenChange: (open: boolean) => void; draft: PostDraft }) {
  const [mode, setMode] = useState<'desktop' | 'mobile'>('desktop')
  const category = categories.find((item) => item.id === draft.categoryId)?.label ?? '카테고리 미정'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent overlayProps={{ className: 'fixed inset-0 z-40 bg-navy/55' }} className="fixed inset-0 z-50 flex flex-col bg-section sm:inset-5 sm:rounded-2xl sm:border sm:border-border-subtle sm:shadow-2xl">
        <header className="flex min-h-16 items-center justify-between gap-3 border-b border-border-subtle bg-white px-4 sm:px-6">
          <div><DialogTitle className="font-extrabold text-navy">미리보기</DialogTitle><DialogDescription className="sr-only">현재 작성 중인 글을 발행 화면처럼 확인합니다.</DialogDescription></div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border-subtle p-1" aria-label="미리보기 화면 크기">
              <button type="button" aria-label="데스크톱 미리보기" aria-pressed={mode === 'desktop'} onClick={() => setMode('desktop')} className={`flex h-9 w-9 items-center justify-center rounded-md ${mode === 'desktop' ? 'bg-brand-soft text-brand' : 'text-ink-soft'}`}><Monitor className="h-4 w-4" /></button>
              <button type="button" aria-label="모바일 미리보기" aria-pressed={mode === 'mobile'} onClick={() => setMode('mobile')} className={`flex h-9 w-9 items-center justify-center rounded-md ${mode === 'mobile' ? 'bg-brand-soft text-brand' : 'text-ink-soft'}`}><Smartphone className="h-4 w-4" /></button>
            </div>
            <DialogClose className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-muted hover:bg-section" aria-label="미리보기 닫기"><X className="h-5 w-5" /></DialogClose>
          </div>
        </header>
        <div className="responsive-scroll flex-1 overflow-y-auto p-3 sm:p-6">
          <article className={`mx-auto min-h-full bg-white shadow-sm transition-[max-width] ${mode === 'mobile' ? 'max-w-[390px] px-5 py-10' : 'max-w-4xl px-5 py-10 sm:px-10 sm:py-14'}`}>
            <p className="text-sm font-extrabold text-brand">{category}</p>
            <h1 className={`mt-3 break-words font-extrabold tracking-[-0.04em] text-navy ${mode === 'mobile' ? 'text-3xl' : 'text-3xl sm:text-5xl'}`}>{draft.title || '제목을 입력해주세요'}</h1>
            {draft.subtitle ? <p className={`mt-5 leading-8 text-ink-muted ${mode === 'mobile' ? 'text-base' : 'text-base sm:text-lg'}`}>{draft.subtitle}</p> : null}
            {draft.imageUrl ? <img src={draft.imageUrl} alt="" className="mt-9 aspect-[16/8] w-full rounded-xl object-cover" /> : null}
            <PostContentRenderer content={draft.content} className="mt-10" />
          </article>
        </div>
      </DialogContent>
    </Dialog>
  )
}
