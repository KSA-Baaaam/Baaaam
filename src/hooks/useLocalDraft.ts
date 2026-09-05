import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { draftStorage } from '@/services/draftStorage'
import type { PostDraft } from '@/types/blog'

export type LocalSaveState = 'idle' | 'saving' | 'saved' | 'failed'

export function useLocalDraft(key: string, draft: PostDraft | null, enabled: boolean) {
  const [state, setState] = useState<LocalSaveState>('idle')
  const latestDraft = useRef(draft)

  latestDraft.current = draft

  useLayoutEffect(() => {
    if (!enabled || !draft) return
    try {
      draftStorage.checkpoint(key, draft)
      setState('saved')
    } catch {
      // Start IDB immediately if a synchronous recovery journal is unavailable.
      void draftStorage.save(key, draft).then(() => setState('saved')).catch(() => setState('failed'))
    }
  }, [draft, enabled, key])

  useEffect(() => {
    if (!enabled || !draft) return
    setState('saving')
    const timer = window.setTimeout(() => {
      void draftStorage.save(key, draft).then(() => setState('saved')).catch(() => setState('failed'))
    }, 700)
    return () => window.clearTimeout(timer)
  }, [draft, enabled, key])

  useEffect(() => {
    if (!enabled) return
    const saveImmediately = () => {
      if (document.visibilityState === 'hidden' && latestDraft.current) {
        void draftStorage.save(key, latestDraft.current).catch(() => setState('failed'))
      }
    }
    document.addEventListener('visibilitychange', saveImmediately)
    return () => document.removeEventListener('visibilitychange', saveImmediately)
  }, [enabled, key])

  return state
}
