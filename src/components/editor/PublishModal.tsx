import { ImagePlus, LoaderCircle, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui'
import { TagInput } from '@/components/editor/TagInput'
import { CategorySelect } from '@/components/editor/CategorySelect'
import type { PostDraft } from '@/types/blog'

type PublishModalProps = {
  open: boolean
  draft: PostDraft
  imageOptions: Array<{ src: string; alt: string }>
  publishing: boolean
  coverUploadProgress: number | null
  coverEditLoading: boolean
  onOpenChange: (open: boolean) => void
  onChange: (patch: Partial<PostDraft>) => void
  onChooseThumbnail: (file: File) => void
  onAdjustThumbnail: () => void
  onPublish: () => Promise<void>
}

export function PublishModal({ open, draft, imageOptions, publishing, coverUploadProgress, coverEditLoading, onOpenChange, onChange, onChooseThumbnail, onAdjustThumbnail, onPublish }: PublishModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (!open) return
    setSubmitError('')
  }, [open])

  async function submit() {
    setSubmitError('')
    try {
      await onPublish()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '글을 발행하지 못했어요.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent overlayProps={{ className: 'fixed inset-0 z-40 bg-navy/55' }} className="responsive-dialog fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border border-border-subtle bg-white p-5 shadow-2xl sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-1/2 sm:w-[min(38rem,calc(100%-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div><DialogTitle className="text-xl font-extrabold text-navy">발행 설정</DialogTitle><DialogDescription className="mt-1 text-sm leading-6 text-ink-muted">카테고리와 대표 이미지를 확인해주세요. 글 주소는 발행할 때 자동으로 만들어집니다.</DialogDescription></div>
          <DialogClose className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-muted hover:bg-section" aria-label="닫기"><X className="h-5 w-5" /></DialogClose>
        </div>

        <div className="mt-6 grid gap-5">
          <CategorySelect compact value={draft.categoryId} onChange={(categoryId) => onChange({ categoryId })} />
          <div>
            <p className="text-sm font-bold text-navy">대표 이미지</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <button type="button" onClick={() => inputRef.current?.click()} disabled={coverUploadProgress !== null || coverEditLoading} className="flex aspect-[16/10] items-center justify-center rounded-lg border border-dashed border-input-border text-xs font-bold text-ink-muted hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-55"><ImagePlus className="mr-1 h-4 w-4" />업로드</button>
              {imageOptions.slice(0, 5).map((image) => <button key={image.src} type="button" onClick={() => onChange({ imageUrl: image.src })} aria-label="이 이미지를 대표 이미지로 선택" className={`aspect-[16/10] overflow-hidden rounded-lg border-2 ${draft.imageUrl === image.src ? 'border-brand' : 'border-transparent'}`}><img src={image.src} alt={image.alt} className="h-full w-full object-cover" /></button>)}
            </div>
            {draft.imageUrl ? <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2"><button type="button" onClick={onAdjustThumbnail} disabled={coverEditLoading || coverUploadProgress !== null} className="text-xs font-bold text-brand underline underline-offset-2 disabled:opacity-50">{coverEditLoading ? '사진 불러오는 중...' : '구도 조절'}</button><button type="button" onClick={() => onChange({ imageUrl: '' })} className="text-xs font-bold text-ink-soft underline underline-offset-2">대표 이미지 사용 안 함</button></div> : null}
            {coverUploadProgress !== null ? <p role="status" className="mt-2 inline-flex items-center gap-1.5 text-xs text-brand"><LoaderCircle className="h-3.5 w-3.5 animate-spin" />업로드 {coverUploadProgress}%</p> : null}
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) onChooseThumbnail(file); event.target.value = '' }} />
          </div>
          <div><p className="text-sm font-bold text-navy">태그</p><div className="mt-2"><TagInput tags={draft.tags} onChange={(tags) => onChange({ tags })} /></div></div>
        </div>

        {submitError ? <p role="alert" className="mt-5 rounded-lg bg-[#fff5f4] px-4 py-3 text-sm text-danger">{submitError}</p> : null}
        <div className="mt-7 flex gap-3">
          <DialogClose className="min-h-11 flex-1 rounded-lg border border-border-subtle px-4 text-sm font-bold text-ink-muted hover:border-brand">취소</DialogClose>
          <button type="button" onClick={() => void submit()} disabled={publishing || coverUploadProgress !== null || coverEditLoading} className="inline-flex min-h-11 flex-[1.5] items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-extrabold text-white hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-55">{publishing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}발행하기</button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
