import type { JSONContent } from '@tiptap/core'
import { Check, Clipboard, FlaskConical, Lightbulb, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import katex from 'katex'
import { baaaamLowlight } from '@/lib/lowlight'

import type { EducationVariant } from '@/components/editor/extensions'
import { educationLabels, normalizeImageDisplayWidth } from '@/components/editor/extensions'

type RendererProps = {
  content: JSONContent
  className?: string
}

type HighlightNode = {
  type: 'text' | 'element'
  value?: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HighlightNode[]
}

function HighlightedNode({ node, path }: { node: HighlightNode; path: string }) {
  if (node.type === 'text') return <>{node.value ?? ''}</>
  const classValue = node.properties?.className
  const className = Array.isArray(classValue) ? classValue.join(' ') : typeof classValue === 'string' ? classValue : undefined
  const children = node.children?.map((child, index) => <HighlightedNode key={`${path}-${index}`} node={child} path={`${path}-${index}`} />)
  if (node.tagName === 'span') return <span className={className}>{children}</span>
  return <>{children}</>
}

function highlightCode(code: string, language: string) {
  try {
    const result = language && language !== 'plaintext' && baaaamLowlight.registered(language)
      ? baaaamLowlight.highlight(language, code)
      : baaaamLowlight.highlightAuto(code)
    return result.children.map((node, index) => <HighlightedNode key={index} node={node as HighlightNode} path={String(index)} />)
  } catch {
    return code
  }
}

function safeExternalUrl(value: unknown) {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null
  } catch {
    return null
  }
}

function renderMath(latex: string, displayMode: boolean) {
  return katex.renderToString(latex || '\\square', { displayMode, throwOnError: false, strict: 'warn', trust: false })
}

function TextNode({ node }: { node: JSONContent }) {
  let rendered: React.ReactNode = node.text ?? ''
  for (const mark of node.marks ?? []) {
    if (mark.type === 'bold') rendered = <strong>{rendered}</strong>
    else if (mark.type === 'italic') rendered = <em>{rendered}</em>
    else if (mark.type === 'underline') rendered = <u>{rendered}</u>
    else if (mark.type === 'strike') rendered = <s>{rendered}</s>
    else if (mark.type === 'highlight') rendered = <mark>{rendered}</mark>
    else if (mark.type === 'code') rendered = <code className="rounded bg-section px-1.5 py-0.5 text-[0.92em] text-brand-strong">{rendered}</code>
    else if (mark.type === 'link') {
      const href = safeExternalUrl(mark.attrs?.href)
      if (href) rendered = <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline decoration-brand/30 underline-offset-4">{rendered}</a>
    }
  }
  return <>{rendered}</>
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }
  return (
    <div className="my-7 overflow-hidden rounded-xl border border-[#263b35] bg-[#14251f] text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-white/65">
        <span>{language || 'Plain Text'}</span>
        <button type="button" onClick={() => void copyCode()} className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 font-bold text-white/75 hover:bg-white/10 hover:text-white" aria-label="코드 복사">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}{copied ? '복사됨' : '복사'}
        </button>
      </div>
      <pre className="responsive-scroll overflow-x-auto p-4 text-sm leading-7"><code className={`language-${language}`}>{highlightCode(code, language)}</code></pre>
    </div>
  )
}

function EducationBlockView({ attrs }: { attrs: Record<string, unknown> }) {
  const variant = (attrs.variant ?? 'concept') as EducationVariant
  const body = String(attrs.body ?? '')
  const styles: Record<EducationVariant, string> = {
    concept: 'border-brand/35 bg-brand-soft',
    example: 'border-[#6b8bc3]/35 bg-[#f2f6fc]',
    problem: 'border-[#8b70b9]/35 bg-[#f7f3fb]',
    tip: 'border-[#d89a32]/40 bg-[#fff9ec]',
    warning: 'border-[#d56a5d]/35 bg-[#fff4f2]',
    experiment: 'border-[#3f91a8]/35 bg-[#eff9fb]',
  }
  const Icon = variant === 'warning' ? TriangleAlert : variant === 'experiment' ? FlaskConical : Lightbulb

  return (
    <section className={`my-8 rounded-xl border p-5 sm:p-6 ${styles[variant]}`}>
      <h3 className="flex items-center gap-2 text-base font-extrabold text-navy"><Icon className="h-5 w-5 text-brand" />{educationLabels[variant]}</h3>
      {body ? <p className="mt-3 whitespace-pre-wrap leading-8 text-ink">{body}</p> : null}
      {variant === 'problem' ? (
        <details className="mt-5 rounded-lg border border-border-subtle bg-white p-4">
          <summary className="min-h-8 cursor-pointer font-extrabold text-brand">정답과 해설 보기</summary>
          {attrs.answer ? <div className="mt-4"><p className="text-xs font-bold text-ink-soft">정답</p><p className="mt-1 whitespace-pre-wrap leading-7 text-navy">{String(attrs.answer)}</p></div> : null}
          {attrs.explanation ? <div className="mt-4"><p className="text-xs font-bold text-ink-soft">해설</p><p className="mt-1 whitespace-pre-wrap leading-7 text-ink-muted">{String(attrs.explanation)}</p></div> : null}
        </details>
      ) : null}
      {variant === 'experiment' ? (
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            ['goal', '목표'], ['materials', '준비물'], ['steps', '실험 방법'], ['result', '결과'], ['caution', '주의사항'],
          ].filter(([key]) => attrs[key]).map(([key, label]) => (
            <div key={key} className={key === 'steps' ? 'sm:col-span-2' : ''}><dt className="text-xs font-bold text-ink-soft">{label}</dt><dd className="mt-1 whitespace-pre-wrap leading-7 text-ink">{String(attrs[key])}</dd></div>
          ))}
        </dl>
      ) : null}
    </section>
  )
}

function positiveInteger(value: unknown, fallback = 1) {
  const number = Number(value)
  return Number.isSafeInteger(number) && number > 0 ? Math.min(number, 10000) : fallback
}

function RenderNode({ node, index }: { node: JSONContent; index: number }) {
  const children = node.content?.map((child, childIndex) => <RenderNode key={`${child.type}-${childIndex}`} node={child} index={childIndex} />)
  const attrs = (node.attrs ?? {}) as Record<string, unknown>
  const align = typeof attrs.textAlign === 'string' ? { textAlign: attrs.textAlign as React.CSSProperties['textAlign'] } : undefined

  switch (node.type) {
    case 'text': return <TextNode node={node} />
    case 'paragraph': return <p style={align} className="my-4 min-h-7 whitespace-pre-wrap text-[1.04rem] leading-8 text-ink-muted">{children}</p>
    case 'heading': {
      const level = Number(attrs.level ?? 2)
      if (level === 1) return <h2 id={`section-${index}`} style={align} className="mb-4 mt-12 scroll-mt-28 text-3xl font-extrabold tracking-[-0.04em] text-navy">{children}</h2>
      if (level === 2) return <h3 id={`section-${index}`} style={align} className="mb-3 mt-10 scroll-mt-28 text-2xl font-extrabold tracking-[-0.03em] text-navy">{children}</h3>
      return <h4 id={`section-${index}`} style={align} className="mb-2 mt-8 scroll-mt-28 text-xl font-extrabold text-navy">{children}</h4>
    }
    case 'bulletList': return <ul className="my-5 list-disc space-y-2 pl-6 text-ink-muted">{children}</ul>
    case 'orderedList': return <ol start={Number.isSafeInteger(Number(attrs.start)) ? Number(attrs.start) : 1} className="my-5 list-decimal space-y-2 pl-6 text-ink-muted">{children}</ol>
    case 'listItem': return <li className="pl-1 leading-8">{children}</li>
    case 'taskList': return <ul className="my-5 list-none space-y-2 p-0">{children}</ul>
    case 'taskItem': return <li className="flex gap-3 leading-8"><input type="checkbox" checked={Boolean(attrs.checked)} readOnly className="mt-2 h-4 w-4 accent-brand" /><div>{children}</div></li>
    case 'blockquote': return <blockquote className="my-7 border-l-4 border-brand bg-brand-soft px-5 py-3 italic text-navy">{children}</blockquote>
    case 'horizontalRule': return <hr className="my-10 border-0 border-t border-border-subtle" />
    case 'hardBreak': return <br />
    case 'codeBlock': return <CodeBlock code={(node.content ?? []).map((child) => child.text ?? '').join('')} language={String(attrs.language ?? 'plaintext')} />
    case 'table': {
      const widths = (node.content?.[0]?.content ?? []).flatMap((cell) => {
        const span = positiveInteger(cell.attrs?.colspan)
        return Array.from({ length: span }, (_, column) => positiveInteger(cell.attrs?.colwidth?.[column], 0))
      })
      const width = widths.length && widths.every(Boolean) ? widths.reduce((sum, value) => sum + value, 0) : undefined
      return <div className="responsive-scroll my-8 max-w-full overflow-x-auto"><table style={{ width, minWidth: width ?? 520 }} className="w-full border-collapse text-left text-sm"><colgroup>{widths.map((value, column) => <col key={column} style={value ? { width: value } : undefined} />)}</colgroup><tbody>{children}</tbody></table></div>
    }
    case 'tableRow': return <tr>{children}</tr>
    case 'tableHeader': return <th colSpan={positiveInteger(attrs.colspan)} rowSpan={positiveInteger(attrs.rowspan)} className="border border-border-subtle bg-section px-3 py-2 font-extrabold text-navy">{children}</th>
    case 'tableCell': return <td colSpan={positiveInteger(attrs.colspan)} rowSpan={positiveInteger(attrs.rowspan)} className="border border-border-subtle px-3 py-2 align-top text-ink-muted">{children}</td>
    case 'imageBlock': {
      const src = safeExternalUrl(attrs.src)
      if (!src) return null
      const displayWidth = normalizeImageDisplayWidth(attrs.displayWidth)
      return <figure className="mx-auto my-8 max-w-full" style={{ width: `${displayWidth}%` }}><img src={src} alt={String(attrs.alt ?? '')} width={Number(attrs.width) || undefined} height={Number(attrs.height) || undefined} loading="lazy" className="h-auto w-full rounded-xl object-contain" />{attrs.caption ? <figcaption className="mt-3 text-center text-sm text-ink-soft">{String(attrs.caption)}</figcaption> : null}</figure>
    }
    case 'mathBlock': return <div className="responsive-scroll my-8 overflow-x-auto rounded-xl bg-section px-5 py-6 text-center text-navy" dangerouslySetInnerHTML={{ __html: renderMath(String(attrs.latex ?? ''), true) }} />
    case 'mathInline': return <span className="inline-block px-1 text-navy" dangerouslySetInnerHTML={{ __html: renderMath(String(attrs.latex ?? ''), false) }} />
    case 'educationBlock': return <EducationBlockView attrs={attrs} />
    default: return <>{children}</>
  }
}

export function PostContentRenderer({ content, className = '' }: RendererProps) {
  return <div className={`post-rich-content ${className}`}>{content.content?.map((node, index) => <RenderNode key={`${node.type}-${index}`} node={node} index={index} />)}</div>
}

export function extractPlainText(content: JSONContent): string {
  const parts: string[] = []
  const visit = (node: JSONContent) => {
    if (node.text) parts.push(node.text)
    const attrs = (node.attrs ?? {}) as Record<string, unknown>
    if (node.type === 'educationBlock') {
      for (const key of ['body', 'answer', 'explanation', 'goal', 'materials', 'steps', 'result', 'caution']) {
        if (attrs[key]) parts.push(String(attrs[key]))
      }
    }
    node.content?.forEach(visit)
  }
  visit(content)
  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

export function extractImageBlocks(content: JSONContent) {
  const images: Array<{ src: string; alt: string }> = []
  const visit = (node: JSONContent) => {
    if (node.type === 'imageBlock') {
      const src = safeExternalUrl(node.attrs?.src)
      if (src) images.push({ src, alt: String(node.attrs?.alt ?? '') })
    }
    node.content?.forEach(visit)
  }
  visit(content)
  return images
}
