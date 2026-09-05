import { useCallback, useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Crop, Eye, ImagePlus, Save, Send, Trash2 } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { BaaaamEditor } from '@/components/editor/BaaaamEditor'
import { CategorySelect } from '@/components/editor/CategorySelect'
import { CoverImageCropDialog } from '@/components/editor/CoverImageCropDialog'
import { PreviewModal } from '@/components/editor/PreviewModal'
import { PublishModal } from '@/components/editor/PublishModal'
import { SaveIndicator } from '@/components/editor/SaveIndicator'
import { TagInput } from '@/components/editor/TagInput'
import { BrandLogo } from '@/components/home/BrandLogo'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui'
import { useLocalDraft } from '@/hooks/useLocalDraft'
import { extractImageBlocks, extractPlainText } from '@/components/post/PostContentRenderer'
import { draftStorage } from '@/services/draftStorage'
import { postImagesService, validatePostImage } from '@/services/postImages'
import { postsService } from '@/services/posts'
import type { PostDraft } from '@/types/blog'
import { EMPTY_POST_CONTENT } from '@/types/blog'
import { useOperatorSession } from '@/services/session'

const CLOUD_SYNC_INTERVAL = 120_000

function freshDraft(): PostDraft {
  return {
    id: null,
    localId: crypto.randomUUID(),
    title: '',
    subtitle: '',
    categoryId: '',
    imageUrl: '',
    content: structuredClone(EMPTY_POST_CONTENT),
    tags: [],
    status: 'draft',
    updatedAt: Date.now(),
  }
}

function postToDraft(post: Awaited<ReturnType<typeof postsService.getById>>): PostDraft | null {
  if (!post) return null
  return {
    id: post.id,
    localId: post.id,
    title: post.title,
    subtitle: post.subtitle,
    categoryId: post.categoryId,
    imageUrl: post.imageUrl,
    content: post.content,
    tags: post.tags,
    status: post.status,
    updatedAt: new Date(post.updatedAt).getTime(),
  }
}

function editorInput(draft: PostDraft) {
  return {
    title: draft.title.trim(),
    subtitle: draft.subtitle.trim(),
    categoryId: draft.categoryId,
    imageUrl: draft.imageUrl,
    content: draft.content,
    tags: draft.tags,
  }
}

function hasBody(draft: PostDraft) {
  if (extractPlainText(draft.content)) return true
  return Boolean(draft.content.content?.some((node) => node.type && !['paragraph', 'hardBreak'].includes(node.type)))
}

function hasMeaningfulDraft(draft: PostDraft) {
  return Boolean(
    draft.title.trim()
    || draft.subtitle.trim()
    || draft.categoryId
    || draft.imageUrl
    || draft.tags.length
    || hasBody(draft),
  )
}

export default function WritePost() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { currentStaff, isSessionLoading } = useOperatorSession()
  const [draft, setDraft] = useState<PostDraft | null>(null)
  const [conflictDraft, setConflictDraft] = useState<PostDraft | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)
  const [loadedKey, setLoadedKey] = useState('')
  const [uploads, setUploads] = useState(0)
  const uploadsRef = useRef(0)
  const [coverUploadProgress, setCoverUploadProgress] = useState<number | null>(null)
  const [coverCropFile, setCoverCropFile] = useState<File | null>(null)
  const [coverEditLoading, setCoverEditLoading] = useState(false)
  const [cloudState, setCloudState] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle')
  const [notice, setNotice] = useState('')
  const [offline, setOffline] = useState(!navigator.onLine)
  const initializedFor = useRef<string | null>(null)
  const draftRef = useRef<PostDraft | null>(null)
  const lastSyncedRef = useRef<ReturnType<typeof editorInput> | null>(null)
  const syncPromiseRef = useRef<Promise<boolean> | null>(null)
  const publishingRef = useRef(false)

  const { data: serverPost, isLoading: isPostLoading } = useQuery({
    queryKey: ['posts', 'edit', currentStaff?.id, postId],
    queryFn: () => postsService.getById(postId as string),
    enabled: Boolean(postId && currentStaff && currentStaff.role !== 'general'),
  })

  const localKey = `${currentStaff?.id ?? 'anonymous'}:${postId ?? 'new'}`
  const activeLocalKey = useRef(localKey)
  activeLocalKey.current = localKey
  const draftReady = loadedKey === localKey
  const localState = useLocalDraft(localKey, draft, Boolean(draft) && draftReady && !conflictDraft && !publishing && !published)
  draftRef.current = draftReady ? draft : null

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  useEffect(() => {
    if (isSessionLoading || !currentStaff || currentStaff.role === 'general') return
    const initializationKey = localKey
    if (initializedFor.current === initializationKey) return
    if (postId && isPostLoading) return
    initializedFor.current = initializationKey

    let cancelled = false
    setConflictDraft(null)
    void draftStorage.get(initializationKey).then((local) => {
      if (cancelled) return
      setLoadedKey(initializationKey)
      if (!postId) {
        setDraft(local ?? freshDraft())
        lastSyncedRef.current = null
        return
      }
      const server = postToDraft(serverPost)
      if (!server) {
        setDraft(null)
        return
      }
      lastSyncedRef.current = editorInput(server)
      if (local && local.updatedAt > server.updatedAt && JSON.stringify(editorInput(local)) !== JSON.stringify(editorInput(server))) {
        setDraft(server)
        setConflictDraft(local)
      } else {
        setDraft(server)
      }
    })
    return () => { cancelled = true; initializedFor.current = null }
  }, [currentStaff, isPostLoading, isSessionLoading, localKey, postId, serverPost])

  const updateDraft = useCallback((patch: Partial<PostDraft>) => {
    setDraft((current) => current ? { ...current, ...patch, updatedAt: Date.now() } : current)
    setCloudState((current) => current === 'saving' ? current : 'idle')
  }, [])

  const uploadImage = useCallback(async (file: File, progress: (value: number) => void) => {
    const current = draftRef.current
    if (!current) throw new Error('글을 불러오는 중이에요.')
    uploadsRef.current += 1
    setUploads(uploadsRef.current)
    try {
      return await postImagesService.upload(file, { postKey: current.id ?? current.localId, onProgress: progress })
    } finally {
      uploadsRef.current -= 1
      setUploads(uploadsRef.current)
    }
  }, [])

  const syncCloud = useCallback(async (force = false) => {
    if (publishingRef.current || conflictDraft) return false
    if (syncPromiseRef.current) return syncPromiseRef.current
    const current = draftRef.current
    if (!current) return false
    if (current.status === 'published') {
      try {
        draftStorage.checkpoint(localKey, current)
        await draftStorage.save(localKey, current)
        if (force) setNotice('수정 내용은 이 기기에 저장했습니다. 발행을 눌러야 공개 글에 반영됩니다.')
        return true
      } catch {
        setCloudState('failed')
        if (force) setNotice('기기에 저장하지 못했습니다. 저장 공간과 브라우저 설정을 확인해주세요.')
        return false
      }
    }
    if (!navigator.onLine) {
      if (force) setNotice('오프라인 상태입니다. 작성 내용은 이 기기에 저장되어 있습니다.')
      return false
    }
    if (!hasMeaningfulDraft(current)) {
      if (force) setNotice('저장할 내용을 먼저 입력해주세요.')
      return false
    }
    if (!current.categoryId) {
      if (force) setNotice('카테고리를 선택하면 클라우드에 임시저장할 수 있어요. 작성 내용은 이 기기에 저장되어 있습니다.')
      return false
    }
    const next = editorInput(current)
    if (!force && JSON.stringify(next) === JSON.stringify(lastSyncedRef.current)) return true

    const promise = (async () => {
      setCloudState('saving')
      try {
        let saved
        if (!current.id) {
          saved = await postsService.createDraft(next)
        } else {
          const previous = lastSyncedRef.current
          const patch = Object.fromEntries(Object.entries(next).filter(([key, value]) => JSON.stringify(value) !== JSON.stringify(previous?.[key as keyof typeof next])))
          if (!Object.keys(patch).length) {
            setCloudState('saved')
            if (force) setNotice('이미 최신 상태로 저장되어 있습니다.')
            return true
          }
          saved = await postsService.updateDraft(current.id, patch)
        }
        if (activeLocalKey.current !== localKey) return false
        const savedAt = new Date(saved.updatedAt).getTime()
        lastSyncedRef.current = next
        const latest = draftRef.current ?? current
        const changedDuringSync = JSON.stringify(editorInput(latest)) !== JSON.stringify(next)
        const nextDraft = { ...latest, id: saved.id, status: saved.status, updatedAt: changedDuringSync ? latest.updatedAt : savedAt }
        draftRef.current = nextDraft
        setDraft(nextDraft)
        if (!current.id) {
          const savedKey = `${currentStaff?.id}:${saved.id}`
          draftStorage.checkpoint(savedKey, nextDraft)
          await draftStorage.save(savedKey, nextDraft)
          await draftStorage.remove(localKey)
          initializedFor.current = savedKey
          setLoadedKey(savedKey)
          navigate(`/write/${saved.id}`, { replace: true })
        }
        setCloudState(changedDuringSync ? 'idle' : 'saved')
        if (force) setNotice(changedDuringSync ? '저장 중 추가한 내용은 다음 저장에 반영됩니다.' : '임시저장되었습니다.')
        return true
      } catch {
        setCloudState('failed')
        if (force) setNotice('저장에 실패했습니다. 작성 내용은 이 기기에 보관되어 있습니다.')
        return false
      } finally {
        syncPromiseRef.current = null
      }
    })()
    syncPromiseRef.current = promise
    return promise
  }, [conflictDraft, currentStaff?.id, localKey, navigate])

  const isDraftReady = Boolean(draft) && draftReady && !conflictDraft

  useEffect(() => {
    if (!isDraftReady) return
    const timer = window.setInterval(() => void syncCloud(false), CLOUD_SYNC_INTERVAL)
    const onOnline = () => void syncCloud(false)
    window.addEventListener('online', onOnline)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('online', onOnline)
    }
  }, [isDraftReady, syncCloud])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 4200)
    return () => window.clearTimeout(timer)
  }, [notice])

  async function publish() {
    if (publishingRef.current) return
    if (uploadsRef.current || coverEditLoading || coverCropFile) throw new Error('사진 편집과 업로드를 완료한 후 발행해주세요.')
    setPublishing(true)
    publishingRef.current = true
    try {
      if (syncPromiseRef.current) await syncPromiseRef.current
      if (activeLocalKey.current !== localKey) throw new Error('작성 화면이 변경되었습니다. 다시 시도해주세요.')
      let current = draftRef.current
      if (!current) throw new Error('글을 불러오는 중이에요.')
      if (!current.title.trim()) throw new Error('제목을 입력해주세요.')
      if (!current.categoryId) throw new Error('카테고리를 선택해주세요.')
      if (!hasBody(current)) throw new Error('본문을 입력해주세요.')
      if (!current.id) {
        const created = await postsService.createDraft(editorInput(current))
        if (activeLocalKey.current !== localKey) throw new Error('작성 화면이 변경되었습니다. 저장된 글은 글 관리에서 확인해주세요.')
        current = { ...current, id: created.id }
        draftRef.current = current
        setDraft(current)
        // Retain the ID before publishing so a failed publish retries the same draft.
        try { draftStorage.checkpoint(localKey, current); await draftStorage.save(localKey, current) } catch { /* Keep the ID in memory even if device storage is full. */ }
      }
      const saved = await postsService.publish(current.id, editorInput(current))
      setPublished(true)
      await Promise.allSettled([...new Set([localKey, `${currentStaff?.id}:${saved.id}`])].map((key) => draftStorage.remove(key)))
      void queryClient.invalidateQueries({ queryKey: ['posts'] })
      setPublishOpen(false)
      navigate(`/id=${saved.id}`, { replace: true })
    } finally {
      publishingRef.current = false
      setPublishing(false)
    }
  }

  function chooseCoverFile(file: File) {
    const validationError = validatePostImage(file)
    if (validationError) {
      setNotice(validationError)
      return
    }
    setCoverCropFile(file)
  }

  async function saveCoverCrop(file: File) {
    setCoverUploadProgress(0)
    try {
      const image = await uploadImage(file, setCoverUploadProgress)
      updateDraft({ imageUrl: image.publicUrl })
      setCoverCropFile(null)
    } catch (error) {
      throw error instanceof Error ? error : new Error('대표 이미지를 업로드하지 못했어요.')
    } finally {
      setCoverUploadProgress(null)
    }
  }

  async function adjustCurrentCover() {
    const currentUrl = draftRef.current?.imageUrl
    if (!currentUrl) return
    setCoverEditLoading(true)
    try {
      const response = await fetch(currentUrl)
      if (!response.ok) throw new Error('대표 이미지를 불러오지 못했어요.')
      const blob = await response.blob()
      const type = blob.type || 'image/webp'
      const file = new File([blob], 'current-cover', { type, lastModified: Date.now() })
      const validationError = validatePostImage(file)
      if (validationError) throw new Error(validationError)
      setCoverCropFile(file)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : '대표 이미지를 불러오지 못했어요.')
    } finally {
      setCoverEditLoading(false)
    }
  }

  function removeCoverImage() {
    setCoverCropFile(null)
    updateDraft({ imageUrl: '' })
    setNotice('대표 이미지를 삭제했어요.')
  }

  if (!isSessionLoading && (!currentStaff || currentStaff.role === 'general')) return <Navigate to="/" replace />

  if (postId && !isPostLoading && currentStaff && (
    !serverPost
    || (currentStaff.role === 'author' && serverPost.authorId !== currentStaff.id)
  )) return <Navigate to="/admin" replace />

  if (isSessionLoading || (postId && isPostLoading) || !draft || !draftReady) {
    return <main className="flex min-h-screen items-center justify-center bg-white px-5 text-sm font-semibold text-ink-muted">작성 화면을 불러오는 중입니다.</main>
  }

  const imageOptions = [{ src: draft.imageUrl, alt: '' }, ...extractImageBlocks(draft.content)].filter((image, index, list) => image.src && list.findIndex((candidate) => candidate.src === image.src) === index)

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 border-b border-border-subtle bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-2 px-3 min-[375px]:px-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Link to="/admin" aria-label="글 관리로 돌아가기" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ink-muted hover:bg-section hover:text-brand"><ArrowLeft className="h-5 w-5" /></Link>
            <Link to="/" className="hidden lg:block"><BrandLogo variant="header" className="h-10 w-20" alt="BAAAAM 홈" /></Link>
            <span className="truncate text-sm font-extrabold text-navy">{postId ? '글 수정' : '새 글 작성'}</span>
          </div>
          <div className="hidden shrink-0 sm:block"><SaveIndicator localState={localState} cloudState={cloudState} offline={offline} /></div>
          <div className="flex shrink-0 items-center gap-1.5 sm:flex-1 sm:justify-end sm:gap-2">
            <button type="button" onClick={() => setPreviewOpen(true)} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border-subtle px-2.5 text-sm font-bold text-ink-muted hover:border-brand hover:text-brand sm:px-3"><Eye className="h-4 w-4" /><span className="hidden min-[430px]:inline">미리보기</span></button>
            <button type="button" onClick={() => void syncCloud(true)} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border-subtle px-2.5 text-sm font-bold text-ink-muted hover:border-brand hover:text-brand sm:px-3"><Save className="h-4 w-4" /><span className="hidden min-[520px]:inline">임시저장</span></button>
            <button type="button" onClick={() => setPublishOpen(true)} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-brand px-3 text-sm font-extrabold text-white hover:bg-brand-strong sm:px-3.5"><Send className="h-4 w-4" />발행</button>
          </div>
        </div>
        <div className="flex min-h-8 items-center justify-center border-t border-border-subtle/70 bg-section px-3 sm:hidden">
          <SaveIndicator localState={localState} cloudState={cloudState} offline={offline} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[900px] px-4 py-8 min-[375px]:px-5 sm:px-8 sm:py-12">
        <div className="grid gap-8">
          <section aria-labelledby="post-basic-info" className="grid gap-6">
            {draft.status === 'published' ? <p role="note" className="rounded-lg bg-section px-4 py-3 text-sm leading-6 text-ink-muted">공개된 글을 수정하고 있습니다. 수정 내용은 이 기기에만 임시저장되며, 발행을 눌러야 독자에게 반영됩니다.</p> : null}
            {uploads > 0 ? <p role="status" className="text-sm text-brand">사진을 업로드하고 있습니다. 완료 후 발행해주세요.</p> : null}
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-brand">글 정보</p>
              <h1 id="post-basic-info" className="mt-1 text-xl font-extrabold tracking-[-0.02em] text-navy">독자에게 보일 정보를 입력하세요</h1>
            </div>
            <CategorySelect value={draft.categoryId} onChange={(categoryId) => updateDraft({ categoryId })} />
            <label>
              <span className="sr-only">제목</span>
              <input value={draft.title} onChange={(event) => updateDraft({ title: event.target.value })} maxLength={100} placeholder="제목을 입력해주세요." className="w-full border-0 border-b border-border-subtle bg-transparent px-0 pb-3 text-3xl font-extrabold leading-tight tracking-[-0.04em] text-navy outline-none placeholder:text-ink-soft/60 focus:border-brand sm:text-5xl" />
              <span className="mt-2 block text-right text-xs text-ink-soft">{draft.title.length}/100</span>
            </label>
            <label>
              <span className="sr-only">한 줄 설명</span>
              <textarea value={draft.subtitle} onChange={(event) => updateDraft({ subtitle: event.target.value })} maxLength={200} rows={2} placeholder="이 글에서 무엇을 배우게 되나요?" className="write-autogrow w-full resize-none border-0 border-b border-border-subtle bg-transparent px-0 pb-3 text-lg leading-8 text-ink-muted outline-none placeholder:text-ink-soft/70 focus:border-brand" />
              <span className="mt-2 block text-right text-xs text-ink-soft">{draft.subtitle.length}/200</span>
            </label>

          <div>
            {draft.imageUrl ? (
              <div className="overflow-hidden rounded-xl border border-border-subtle bg-white">
                <img src={draft.imageUrl} alt="대표 이미지 미리보기" className="aspect-[16/7] w-full object-cover" />
                <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border-subtle bg-section/45 p-3">
                  <button type="button" onClick={() => void adjustCurrentCover()} disabled={coverEditLoading || coverUploadProgress !== null} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border-subtle bg-white px-4 text-sm font-bold text-navy hover:border-brand hover:text-brand disabled:opacity-60"><Crop className="h-4 w-4" />{coverEditLoading ? '불러오는 중' : '구도 조절'}</button>
                  <button type="button" onClick={removeCoverImage} disabled={coverUploadProgress !== null} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-danger/30 bg-white px-4 text-sm font-bold text-danger hover:border-danger hover:bg-[#fff5f4] disabled:opacity-60"><Trash2 className="h-4 w-4" />대표 이미지 삭제</button>
                </div>
              </div>
            ) : (
              <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-input-border bg-section px-4 text-center text-sm font-bold text-ink-muted hover:border-brand hover:text-brand"><span className="inline-flex items-center gap-2"><ImagePlus className="h-5 w-5" />{coverUploadProgress === null ? '대표 이미지 추가' : `사진 업로드 ${coverUploadProgress}%`}</span><span className="text-xs font-medium text-ink-soft">선택 사항 · 업로드 전 16:7 구도 조절 · 원본 10MB 이하</span><input type="file" accept="image/jpeg,image/png,image/webp" disabled={coverUploadProgress !== null} className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) chooseCoverFile(file); event.target.value = '' }} /></label>
            )}
          </div>
          </section>

          <section aria-labelledby="post-body-heading">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
              <h2 id="post-body-heading" className="text-lg font-extrabold text-navy">본문</h2>
            </div>
            <BaaaamEditor content={draft.content} onChange={(content) => updateDraft({ content })} onUploadImage={uploadImage} />
          </section>

          <section className="border-t border-border-subtle pt-7"><h2 className="text-sm font-extrabold text-navy">태그</h2><div className="mt-3"><TagInput tags={draft.tags} onChange={(tags) => updateDraft({ tags })} /></div></section>
        </div>
      </main>

      {notice ? <div role="status" className="fixed bottom-5 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg bg-navy px-4 py-3 text-center text-sm font-semibold text-white shadow-lg">{notice}</div> : null}

      <PreviewModal open={previewOpen} onOpenChange={setPreviewOpen} draft={draft} />
      <PublishModal open={publishOpen} onOpenChange={setPublishOpen} draft={draft} imageOptions={imageOptions} publishing={publishing} coverUploadProgress={coverUploadProgress} coverEditLoading={coverEditLoading} onChange={updateDraft} onChooseThumbnail={chooseCoverFile} onAdjustThumbnail={() => void adjustCurrentCover()} onPublish={publish} />
      <CoverImageCropDialog file={coverCropFile} saving={coverUploadProgress !== null} onCancel={() => setCoverCropFile(null)} onSave={saveCoverCrop} />

      <Dialog open={Boolean(conflictDraft)} onOpenChange={() => { /* Choose a version explicitly before discarding a recovery draft. */ }}>
        <DialogContent overlayProps={{ className: 'fixed inset-0 z-50 bg-navy/55' }} className="fixed left-1/2 top-1/2 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border-subtle bg-white p-6 shadow-2xl">
          <DialogTitle className="text-lg font-extrabold text-navy">더 최근에 작성한 내용이 있어요</DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-6 text-ink-muted">이 기기에 더 최근에 작성된 내용이 있습니다. 이어서 작성할 버전을 선택해주세요.</DialogDescription>
          <div className="mt-6 flex flex-col-reverse gap-2 min-[375px]:flex-row min-[375px]:justify-end">
            <button type="button" onClick={() => setConflictDraft(null)} className="min-h-11 rounded-lg border border-border-subtle px-4 text-sm font-bold text-ink-muted hover:border-brand">서버 버전 사용</button>
            <button type="button" onClick={() => { if (conflictDraft) setDraft(conflictDraft); setConflictDraft(null) }} className="min-h-11 rounded-lg bg-brand px-4 text-sm font-extrabold text-white hover:bg-brand-strong">기기 내용 복구</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
