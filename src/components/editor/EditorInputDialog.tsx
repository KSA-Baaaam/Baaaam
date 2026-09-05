import { X } from 'lucide-react'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui'

type EditorInputDialogProps = {
  open: boolean
  title: string
  description: string
  label: string
  value: string
  placeholder: string
  error: string
  submitLabel: string
  onOpenChange: (open: boolean) => void
  onChange: (value: string) => void
  onSubmit: () => void
}

export function EditorInputDialog({
  open,
  title,
  description,
  label,
  value,
  placeholder,
  error,
  submitLabel,
  onOpenChange,
  onChange,
  onSubmit,
}: EditorInputDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent overlayProps={{ className: 'fixed inset-0 z-50 bg-navy/50' }} className="fixed left-1/2 top-1/2 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border-subtle bg-white p-5 shadow-xl sm:p-6">
        <form onSubmit={(event) => { event.preventDefault(); onSubmit() }}>
          <div className="flex items-start justify-between gap-4">
            <div><DialogTitle className="text-lg font-extrabold text-navy">{title}</DialogTitle><DialogDescription className="mt-1 text-sm leading-6 text-ink-muted">{description}</DialogDescription></div>
            <DialogClose className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-muted hover:bg-section" aria-label="닫기"><X className="h-5 w-5" /></DialogClose>
          </div>
          <label className="mt-5 block"><span className="text-sm font-bold text-navy">{label}</span><input autoFocus value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="form-input" /></label>
          {error ? <p role="alert" className="mt-2 text-sm text-danger">{error}</p> : null}
          <div className="mt-6 flex justify-end gap-2">
            <DialogClose className="min-h-11 rounded-lg border border-border-subtle px-4 text-sm font-bold text-ink-muted hover:border-brand">취소</DialogClose>
            <button type="submit" className="min-h-11 rounded-lg bg-brand px-5 text-sm font-extrabold text-white hover:bg-brand-strong">{submitLabel}</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
