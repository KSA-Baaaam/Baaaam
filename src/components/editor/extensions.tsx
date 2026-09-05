import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { Node, mergeAttributes } from '@tiptap/core'
import { useEffect, useId, useRef, useState } from 'react'
import katex from 'katex'

export type EducationVariant = 'concept' | 'example' | 'problem' | 'tip' | 'warning' | 'experiment'

export function normalizeImageDisplayWidth(value: unknown) {
  const width = Number(value)
  if (!Number.isFinite(width)) return 100
  return Math.min(100, Math.max(25, Math.round(width / 5) * 5))
}

type ImageMetadataInputProps = {
  label: string
  value: string
  placeholder: string
  onCommit: (value: string) => void
}

function ImageMetadataInput({ label, value, placeholder, onCommit }: ImageMetadataInputProps) {
  const [draftValue, setDraftValue] = useState(value)
  const composingRef = useRef(false)
  const lastCommittedRef = useRef(value)

  useEffect(() => {
    lastCommittedRef.current = value
    if (!composingRef.current) setDraftValue(value)
  }, [value])

  function commit(nextValue: string) {
    if (lastCommittedRef.current === nextValue) return
    lastCommittedRef.current = nextValue
    onCommit(nextValue)
  }

  return (
    <input
      aria-label={label}
      value={draftValue}
      onCompositionStart={() => { composingRef.current = true }}
      onCompositionEnd={(event) => {
        const nextValue = event.currentTarget.value
        composingRef.current = false
        setDraftValue(nextValue)
        commit(nextValue)
      }}
      onChange={(event) => {
        const nextValue = event.target.value
        setDraftValue(nextValue)
        if (!composingRef.current) commit(nextValue)
      }}
      onBlur={(event) => commit(event.currentTarget.value)}
      placeholder={placeholder}
      className="min-h-10 w-full rounded-md border border-border-subtle bg-white px-3 text-sm outline-none focus:border-brand"
    />
  )
}

export const educationLabels: Record<EducationVariant, string> = {
  concept: '핵심 개념',
  example: '예제',
  problem: '문제',
  tip: 'Tip',
  warning: '주의사항',
  experiment: '실험',
}

const educationStyles: Record<EducationVariant, string> = {
  concept: 'border-brand/30 bg-brand-soft',
  example: 'border-[#6b8bc3]/30 bg-[#f2f6fc]',
  problem: 'border-[#8b70b9]/30 bg-[#f7f3fb]',
  tip: 'border-[#d89a32]/35 bg-[#fff9ec]',
  warning: 'border-[#d56a5d]/30 bg-[#fff4f2]',
  experiment: 'border-[#3f91a8]/30 bg-[#eff9fb]',
}

function fieldClassName() {
  return 'mt-2 w-full resize-y rounded-md border border-border-subtle bg-white px-3 py-2 text-sm leading-6 text-navy outline-none focus:border-brand focus:ring-2 focus:ring-brand/10'
}

function EducationBlockView({ node, updateAttributes, selected }: NodeViewProps) {
  const variant = node.attrs.variant as EducationVariant
  const set = (name: string) => (event: React.ChangeEvent<HTMLTextAreaElement>) => updateAttributes({ [name]: event.target.value })
  const simple = variant !== 'problem' && variant !== 'experiment'

  return (
    <NodeViewWrapper className={`my-5 rounded-xl border p-4 sm:p-5 ${educationStyles[variant]} ${selected ? 'ring-2 ring-brand/25' : ''}`}>
      <div contentEditable={false}>
        <p className="text-sm font-extrabold text-navy">{educationLabels[variant]}</p>
        {simple ? (
          <textarea aria-label={`${educationLabels[variant]} 내용`} value={node.attrs.body} onChange={set('body')} rows={3} placeholder="내용을 입력해주세요." className={fieldClassName()} />
        ) : null}
        {variant === 'problem' ? (
          <div className="mt-3 grid gap-3">
            <textarea aria-label="문제 내용" value={node.attrs.body} onChange={set('body')} rows={3} placeholder="문제 내용을 입력해주세요." className={fieldClassName()} />
            <textarea aria-label="정답" value={node.attrs.answer} onChange={set('answer')} rows={2} placeholder="정답을 입력해주세요." className={fieldClassName()} />
            <textarea aria-label="해설" value={node.attrs.explanation} onChange={set('explanation')} rows={3} placeholder="해설을 입력해주세요." className={fieldClassName()} />
          </div>
        ) : null}
        {variant === 'experiment' ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              ['goal', '목표'],
              ['materials', '준비물'],
              ['steps', '실험 방법'],
              ['result', '결과'],
              ['caution', '주의사항'],
            ].map(([name, label]) => (
              <label key={name} className={name === 'steps' ? 'sm:col-span-2' : ''}>
                <span className="text-xs font-bold text-ink-muted">{label}</span>
                <textarea aria-label={label} value={node.attrs[name]} onChange={set(name)} rows={2} className={fieldClassName()} />
              </label>
            ))}
          </div>
        ) : null}
      </div>
    </NodeViewWrapper>
  )
}

export const EducationBlock = Node.create({
  name: 'educationBlock',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      variant: { default: 'concept' },
      body: { default: '' },
      answer: { default: '' },
      explanation: { default: '' },
      goal: { default: '' },
      materials: { default: '' },
      steps: { default: '' },
      result: { default: '' },
      caution: { default: '' },
    }
  },
  parseHTML() { return [{ tag: 'section[data-education-block]' }] },
  renderHTML({ HTMLAttributes }) {
    return ['section', mergeAttributes(HTMLAttributes, { 'data-education-block': HTMLAttributes.variant })]
  },
  addNodeView() { return ReactNodeViewRenderer(EducationBlockView) },
})

function renderMath(latex: string, displayMode: boolean) {
  try {
    return katex.renderToString(latex || '\\square', { displayMode, throwOnError: false, strict: 'warn', trust: false })
  } catch {
    return '<span>수식을 확인해주세요.</span>'
  }
}

function MathBlockView({ node, updateAttributes, selected }: NodeViewProps) {
  return (
    <NodeViewWrapper className={`my-5 rounded-xl border border-border-subtle bg-section p-4 ${selected ? 'ring-2 ring-brand/25' : ''}`}>
      <div contentEditable={false}>
        <label className="text-xs font-bold text-ink-muted">LaTeX 수식</label>
        <textarea aria-label="LaTeX 수식" value={node.attrs.latex} onChange={(event) => updateAttributes({ latex: event.target.value })} rows={2} placeholder="예: \\frac{1}{2}mv^2" className={fieldClassName()} />
        <div className="mt-3 min-h-16 overflow-x-auto rounded-lg bg-white px-4 py-5 text-center text-navy" dangerouslySetInnerHTML={{ __html: renderMath(node.attrs.latex, true) }} />
      </div>
    </NodeViewWrapper>
  )
}

export const MathBlock = Node.create({
  name: 'mathBlock',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() { return { latex: { default: '' } } },
  parseHTML() { return [{ tag: 'div[data-math-block]' }] },
  renderHTML({ HTMLAttributes }) { return ['div', mergeAttributes(HTMLAttributes, { 'data-math-block': '' })] },
  addNodeView() { return ReactNodeViewRenderer(MathBlockView) },
})

export const MathInline = Node.create({
  name: 'mathInline',
  group: 'inline',
  inline: true,
  atom: true,
  addAttributes() { return { latex: { default: '' } } },
  parseHTML() { return [{ tag: 'span[data-math-inline]' }] },
  renderHTML({ HTMLAttributes }) { return ['span', mergeAttributes(HTMLAttributes, { 'data-math-inline': '' })] },
  addNodeView() {
    return ReactNodeViewRenderer(({ node, updateAttributes, selected }: NodeViewProps) => (
      <NodeViewWrapper as="span" className={`inline-flex align-baseline ${selected ? 'rounded ring-2 ring-brand/25' : ''}`}>
        <button
          type="button"
          contentEditable={false}
          title="수식 수정"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('baaaam:edit-inline-math', {
              detail: { latex: node.attrs.latex, apply: (latex: string) => updateAttributes({ latex }) },
            }))
          }}
          className="inline-flex min-h-8 items-center rounded-md px-1.5 text-navy hover:bg-brand-soft"
          dangerouslySetInnerHTML={{ __html: renderMath(node.attrs.latex, false) }}
        />
      </NodeViewWrapper>
    ))
  },
})

function ImageBlockView({ node, updateAttributes, selected }: NodeViewProps) {
  const widthInputId = useId()
  const width = Number(node.attrs.width) || undefined
  const height = Number(node.attrs.height) || undefined
  const displayWidth = normalizeImageDisplayWidth(node.attrs.displayWidth)
  return (
    <NodeViewWrapper className={`my-6 rounded-xl border border-border-subtle bg-section p-3 ${selected ? 'ring-2 ring-brand/25' : ''}`}>
      <figure contentEditable={false}>
        <div className="mx-auto max-w-full" style={{ width: `${displayWidth}%` }}>
          <img src={node.attrs.src} alt={node.attrs.alt} width={width} height={height} className="h-auto w-full rounded-lg object-contain" />
        </div>
        <div className="mt-3 rounded-lg border border-border-subtle bg-white px-3 py-2.5">
          <div className="flex items-center justify-between gap-3 text-xs font-bold text-ink-muted">
            <label htmlFor={widthInputId}>이미지 크기</label>
            <output htmlFor={widthInputId} className="tabular-nums text-brand-strong">{displayWidth}%</output>
          </div>
          <input
            id={widthInputId}
            type="range"
            min="25"
            max="100"
            step="5"
            value={displayWidth}
            onChange={(event) => updateAttributes({ displayWidth: Number(event.target.value) })}
            aria-label="본문 이미지 크기"
            className="mt-2 h-5 w-full accent-brand"
          />
        </div>
        <div className="mt-3">
          <ImageMetadataInput label="이미지 캡션" value={String(node.attrs.caption ?? '')} onCommit={(caption) => updateAttributes({ caption })} placeholder="캡션(선택)" />
        </div>
      </figure>
    </NodeViewWrapper>
  )
}

export const ImageBlock = Node.create({
  name: 'imageBlock',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: '' },
      alt: { default: '' },
      caption: { default: '' },
      width: { default: null },
      height: { default: null },
      displayWidth: { default: 100 },
    }
  },
  parseHTML() { return [{ tag: 'figure[data-image-block]' }] },
  renderHTML({ HTMLAttributes }) { return ['figure', mergeAttributes(HTMLAttributes, { 'data-image-block': '' })] },
  addNodeView() { return ReactNodeViewRenderer(ImageBlockView) },
})
