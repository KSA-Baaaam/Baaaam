import { Check, CloudOff, LoaderCircle, TriangleAlert } from 'lucide-react'

import type { LocalSaveState } from '@/hooks/useLocalDraft'

type SaveIndicatorProps = {
  localState: LocalSaveState
  cloudState: 'idle' | 'saving' | 'saved' | 'failed'
  offline: boolean
}

export function SaveIndicator({ localState, cloudState, offline }: SaveIndicatorProps) {
  if (localState === 'failed' || cloudState === 'failed') return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-danger"><TriangleAlert className="h-3.5 w-3.5" />저장하지 못했어요</span>
  if (offline) return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted"><CloudOff className="h-3.5 w-3.5" />오프라인 · {localState === 'saved' ? '기기에 저장됨' : '기기에 저장 중'}</span>
  if (localState === 'saving' || cloudState === 'saving') return <span role="status" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted"><LoaderCircle className="h-3.5 w-3.5 animate-spin" />저장 중</span>
  if (cloudState === 'saved') return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft"><Check className="h-3.5 w-3.5" />클라우드에 저장됨</span>
  if (localState === 'saved') return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft"><Check className="h-3.5 w-3.5" />기기에 저장됨</span>
  return <span className="text-xs font-semibold text-ink-soft">아직 저장되지 않음</span>
}
