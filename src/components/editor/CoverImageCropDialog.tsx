import { Crop, LoaderCircle, RotateCcw, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui'

const OUTPUT_WIDTH = 1600
const OUTPUT_HEIGHT = 700
const TARGET_RATIO = OUTPUT_WIDTH / OUTPUT_HEIGHT
const MIN_CROP_WIDTH = 0.18

type CropArea = {
  x: number
  y: number
  width: number
  height: number
}

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se'

type Interaction = {
  mode: 'move' | 'resize'
  handle?: ResizeHandle
  pointerId: number
  startClientX: number
  startClientY: number
  startCrop: CropArea
  boundsWidth: number
  boundsHeight: number
}

type CoverImageCropDialogProps = {
  file: File | null
  saving: boolean
  onCancel: () => void
  onSave: (file: File) => Promise<void>
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getInitialCrop(imageWidth: number, imageHeight: number): CropArea {
  const sourceRatio = imageWidth / imageHeight
  if (sourceRatio >= TARGET_RATIO) {
    const width = TARGET_RATIO / sourceRatio
    return { x: (1 - width) / 2, y: 0, width, height: 1 }
  }
  const height = sourceRatio / TARGET_RATIO
  return { x: 0, y: (1 - height) / 2, width: 1, height }
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('사진을 편집하지 못했어요.'))
    }, 'image/webp', 0.9)
  })
}

async function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('사진을 읽지 못했어요. 다른 사진을 선택해주세요.'))
    image.src = source
  })
}

export function CoverImageCropDialog({ file, saving: uploading, onCancel, onSave }: CoverImageCropDialogProps) {
  const imageFrameRef = useRef<HTMLDivElement>(null)
  const interactionRef = useRef<Interaction | null>(null)
  const [imageSize, setImageSize] = useState({ width: 16, height: 7 })
  const [cropArea, setCropArea] = useState<CropArea>(() => getInitialCrop(16, 7))
  const [errorMessage, setErrorMessage] = useState('')
  const [imageReady, setImageReady] = useState(false)
  const [processing, setProcessing] = useState(false)
  const processingRef = useRef(false)
  const saving = uploading || processing

  const source = useMemo(() => file ? URL.createObjectURL(file) : '', [file])
  const heightPerWidth = (imageSize.width / imageSize.height) / TARGET_RATIO

  useEffect(() => {
    setImageReady(false)
    if (!source) return
    let active = true
    void loadImage(source).then((image) => {
      if (!active) return
      const nextSize = { width: image.naturalWidth, height: image.naturalHeight }
      setImageSize(nextSize)
      setCropArea(getInitialCrop(nextSize.width, nextSize.height))
      setImageReady(true)
    }).catch((error) => {
      if (active) setErrorMessage(error instanceof Error ? error.message : '사진을 읽지 못했어요.')
    })
    return () => {
      active = false
      URL.revokeObjectURL(source)
    }
  }, [source])

  useEffect(() => {
    if (!file) return
    setErrorMessage('')
    interactionRef.current = null
  }, [file])

  function startInteraction(event: ReactPointerEvent<HTMLElement>, mode: Interaction['mode'], handle?: ResizeHandle) {
    if (saving || !imageFrameRef.current) return
    const bounds = imageFrameRef.current.getBoundingClientRect()
    interactionRef.current = {
      mode,
      handle,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startCrop: cropArea,
      boundsWidth: bounds.width,
      boundsHeight: bounds.height,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.preventDefault()
  }

  function updateInteraction(event: ReactPointerEvent<HTMLElement>) {
    const interaction = interactionRef.current
    if (!interaction || interaction.pointerId !== event.pointerId) return
    const deltaX = (event.clientX - interaction.startClientX) / interaction.boundsWidth
    const deltaY = (event.clientY - interaction.startClientY) / interaction.boundsHeight

    if (interaction.mode === 'move') {
      setCropArea({
        ...interaction.startCrop,
        x: clamp(interaction.startCrop.x + deltaX, 0, 1 - interaction.startCrop.width),
        y: clamp(interaction.startCrop.y + deltaY, 0, 1 - interaction.startCrop.height),
      })
      return
    }

    const handle = interaction.handle ?? 'se'
    const movesRight = handle.endsWith('e')
    const movesDown = handle.startsWith('s')
    const horizontalChange = deltaX * (movesRight ? 1 : -1)
    const verticalChangeAsWidth = deltaY * (movesDown ? 1 : -1) / heightPerWidth
    const widthChange = (horizontalChange + verticalChangeAsWidth) / 2
    const fixedRight = interaction.startCrop.x + interaction.startCrop.width
    const fixedBottom = interaction.startCrop.y + interaction.startCrop.height
    const maxHorizontalWidth = movesRight ? 1 - interaction.startCrop.x : fixedRight
    const maxVerticalWidth = movesDown
      ? (1 - interaction.startCrop.y) / heightPerWidth
      : fixedBottom / heightPerWidth
    const width = clamp(interaction.startCrop.width + widthChange, MIN_CROP_WIDTH, Math.min(maxHorizontalWidth, maxVerticalWidth))
    const height = width * heightPerWidth

    setCropArea({
      x: movesRight ? interaction.startCrop.x : fixedRight - width,
      y: movesDown ? interaction.startCrop.y : fixedBottom - height,
      width,
      height,
    })
  }

  function stopInteraction(event: ReactPointerEvent<HTMLElement>) {
    if (interactionRef.current?.pointerId !== event.pointerId) return
    interactionRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  function moveCropWithKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 0.05 : 0.01
    const direction = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }[event.key]
    if (!direction) return
    event.preventDefault()
    setCropArea((current) => ({
      ...current,
      x: clamp(current.x + direction[0], 0, 1 - current.width),
      y: clamp(current.y + direction[1], 0, 1 - current.height),
    }))
  }

  async function save() {
    if (!source || !imageReady || saving || processingRef.current) return
    processingRef.current = true
    setProcessing(true)
    setErrorMessage('')
    try {
      const image = await loadImage(source)
      const canvas = document.createElement('canvas')
      canvas.width = OUTPUT_WIDTH
      canvas.height = OUTPUT_HEIGHT
      const context = canvas.getContext('2d')
      if (!context) throw new Error('사진을 편집할 수 없는 브라우저입니다.')
      context.drawImage(
        image,
        cropArea.x * image.naturalWidth,
        cropArea.y * image.naturalHeight,
        cropArea.width * image.naturalWidth,
        cropArea.height * image.naturalHeight,
        0,
        0,
        OUTPUT_WIDTH,
        OUTPUT_HEIGHT,
      )
      const blob = await canvasToBlob(canvas)
      await onSave(new File([blob], 'cover-image.webp', { type: 'image/webp', lastModified: Date.now() }))
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '사진을 편집하지 못했어요.')
    } finally {
      processingRef.current = false
      setProcessing(false)
    }
  }

  function reset() {
    setCropArea(getInitialCrop(imageSize.width, imageSize.height))
  }

  const handles: Array<{ position: ResizeHandle; label: string; className: string }> = [
    { position: 'nw', label: '왼쪽 위 모서리로 크기 조절', className: '-left-3 -top-3 cursor-nwse-resize' },
    { position: 'ne', label: '오른쪽 위 모서리로 크기 조절', className: '-right-3 -top-3 cursor-nesw-resize' },
    { position: 'sw', label: '왼쪽 아래 모서리로 크기 조절', className: '-bottom-3 -left-3 cursor-nesw-resize' },
    { position: 'se', label: '오른쪽 아래 모서리로 크기 조절', className: '-bottom-3 -right-3 cursor-nwse-resize' },
  ]

  return (
    <Dialog open={Boolean(file)} onOpenChange={(open) => { if (!open && !saving) onCancel() }}>
      <DialogContent overlayProps={{ className: 'fixed inset-0 z-[70] bg-navy/60 backdrop-blur-[2px]' }} className="responsive-dialog fixed bottom-0 left-0 right-0 z-[80] rounded-t-2xl border border-border-subtle bg-white p-5 shadow-2xl sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-1/2 sm:w-[min(48rem,calc(100%-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <DialogTitle className="flex items-center gap-2 text-xl font-extrabold text-navy"><Crop className="h-5 w-5 text-brand" aria-hidden="true" />대표 이미지 영역 선택</DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-6 text-ink-muted">밝은 네모 박스를 움직이거나 모서리를 잡아 보여줄 영역을 정해주세요.</DialogDescription>
          </div>
          <button type="button" onClick={onCancel} disabled={saving} aria-label="편집 취소" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ink-muted hover:bg-section hover:text-navy disabled:opacity-50"><X className="h-5 w-5" /></button>
        </div>

        <div className="mt-5 flex min-h-52 max-h-[55vh] items-center justify-center overflow-hidden rounded-xl bg-navy p-3 sm:p-4">
          <div ref={imageFrameRef} className="relative inline-flex max-h-[50vh] max-w-full overflow-hidden select-none">
            {source ? <img src={source} alt="대표 이미지 영역 선택 미리보기" draggable={false} className="block max-h-[50vh] max-w-full object-contain" /> : null}
            <div
              role="button"
              tabIndex={0}
              aria-label="대표 이미지 선택 영역. 드래그하거나 방향키로 이동"
              onKeyDown={moveCropWithKeyboard}
              onPointerDown={(event) => startInteraction(event, 'move')}
              onPointerMove={updateInteraction}
              onPointerUp={stopInteraction}
              onPointerCancel={stopInteraction}
              className="absolute touch-none cursor-move border-2 border-white outline-none ring-brand focus-visible:ring-4"
              style={{
                left: `${cropArea.x * 100}%`,
                top: `${cropArea.y * 100}%`,
                width: `${cropArea.width * 100}%`,
                height: `${cropArea.height * 100}%`,
                boxShadow: '0 0 0 9999px rgb(8 25 20 / 62%)',
              }}
            >
              <span className="pointer-events-none absolute left-1/3 top-0 h-full border-l border-white/45" aria-hidden="true" />
              <span className="pointer-events-none absolute left-2/3 top-0 h-full border-l border-white/45" aria-hidden="true" />
              <span className="pointer-events-none absolute left-0 top-1/3 w-full border-t border-white/45" aria-hidden="true" />
              <span className="pointer-events-none absolute left-0 top-2/3 w-full border-t border-white/45" aria-hidden="true" />
              {handles.map((handle) => (
                <button
                  key={handle.position}
                  type="button"
                  aria-label={handle.label}
                  disabled={saving}
                  onPointerDown={(event) => { event.stopPropagation(); startInteraction(event, 'resize', handle.position) }}
                  onPointerMove={updateInteraction}
                  onPointerUp={stopInteraction}
                  onPointerCancel={stopInteraction}
                  className={`absolute h-6 w-6 touch-none rounded-full border-2 border-brand bg-white shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/35 ${handle.className}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-ink-soft">
          <span>선택 영역은 대표 이미지 비율인 16:7로 유지됩니다.</span>
          <span className="shrink-0 rounded-full bg-section px-2.5 py-1 font-bold text-brand">{Math.round(cropArea.width * 100)}%</span>
        </div>

        {errorMessage ? <p role="alert" className="mt-4 rounded-lg bg-[#fff5f4] px-4 py-3 text-sm text-danger">{errorMessage}</p> : null}

        <div className="mt-5 flex flex-col-reverse gap-3 min-[375px]:flex-row min-[375px]:items-center">
          <button type="button" onClick={reset} disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border-subtle px-4 text-sm font-bold text-ink-muted hover:border-brand hover:text-brand disabled:opacity-50"><RotateCcw className="h-4 w-4" />선택 영역 초기화</button>
          <div className="flex flex-1 gap-3 min-[375px]:justify-end">
            <button type="button" onClick={onCancel} disabled={saving} className="min-h-11 flex-1 rounded-lg border border-border-subtle px-4 text-sm font-bold text-ink-muted hover:border-brand disabled:opacity-50 min-[375px]:flex-none">취소</button>
            <button type="button" onClick={() => void save()} disabled={saving || processing || !imageReady} className="inline-flex min-h-11 flex-[1.4] items-center justify-center gap-2 rounded-lg bg-brand px-5 text-sm font-extrabold text-white hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-55 min-[375px]:flex-none">{saving || processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}{saving || processing ? '저장 중...' : '선택 영역 저장'}</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
