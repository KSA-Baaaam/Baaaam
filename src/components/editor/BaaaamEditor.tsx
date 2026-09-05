import type { JSONContent } from '@tiptap/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BubbleMenu } from '@tiptap/react/menus'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import CharacterCount from '@tiptap/extension-character-count'
import Typography from '@tiptap/extension-typography'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Blocks,
  Bold,
  CheckSquare,
  Code2,
  Columns3,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  LoaderCircle,
  Minus,
  Quote,
  Redo2,
  Rows3,
  Sigma,
  Strikethrough,
  Table2,
  Trash2,
  Underline as UnderlineIcon,
  Undo2,
} from 'lucide-react'

import { EducationBlock, ImageBlock, MathBlock, MathInline } from '@/components/editor/extensions'
import { EditorBlockMenu } from '@/components/editor/EditorBlockMenu'
import { EditorInputDialog } from '@/components/editor/EditorInputDialog'
import { focusSafeInsertionPoint } from '@/components/editor/editorCommands'
import type { UploadedPostImage } from '@/services/postImages'
import { baaaamLowlight } from '@/lib/lowlight'

type BaaaamEditorProps = {
  content: JSONContent
  onChange: (content: JSONContent) => void
  onUploadImage: (file: File, onProgress: (progress: number) => void) => Promise<UploadedPostImage>
}

type ToolbarButtonProps = {
  label: string
  active?: boolean
  disabled?: boolean
  showLabel?: boolean
  onClick: () => void
  children: React.ReactNode
}

type EditorDialogState = {
  kind: 'link' | 'math'
  value: string
  error: string
  apply?: (value: string) => void
} | null

function ToolbarButton({ label, active, disabled = false, showLabel = false, onClick, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active === undefined ? undefined : active}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-9 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand ${showLabel ? 'gap-1.5 px-2.5' : 'w-9'} ${active ? 'bg-brand-soft text-brand-strong' : 'text-ink-muted hover:bg-white hover:text-navy'} disabled:cursor-not-allowed disabled:opacity-35`}
    >
      {children}
      {showLabel ? <span className="text-xs font-bold">{label}</span> : null}
    </button>
  )
}

export function BaaaamEditor({ content, onChange, onUploadImage }: BaaaamEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<ReturnType<typeof useEditor>>(null)
  const blockMenuOpenRef = useRef(false)
  const slashRange = useRef<{ from: number; to: number } | null>(null)
  const [blockMenu, setBlockMenu] = useState({ open: false, query: '' })
  const [uploadState, setUploadState] = useState({ active: false, progress: 0, error: '' })
  const [inputDialog, setInputDialog] = useState<EditorDialogState>(null)

  const uploadImage = useCallback(async (file: File) => {
    setUploadState({ active: true, progress: 0, error: '' })
    try {
      const image = await onUploadImage(file, (progress) => setUploadState({ active: true, progress, error: '' }))
      const currentEditor = editorRef.current
      if (!currentEditor) return
      focusSafeInsertionPoint(currentEditor)
      currentEditor.chain().focus().insertContent({
        type: 'imageBlock',
        attrs: { src: image.publicUrl, alt: '', caption: '', width: image.width, height: image.height },
      }).run()
      setUploadState({ active: false, progress: 100, error: '' })
    } catch (error) {
      setUploadState({ active: false, progress: 0, error: error instanceof Error ? error.message : '사진을 업로드하지 못했어요.' })
    }
  }, [onUploadImage])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Highlight.configure({ multicolor: false }),
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: '내용을 입력하세요. 빈 문단에서 / 를 입력하면 블록을 고를 수 있어요.' }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CharacterCount.configure({ limit: 60000 }),
      Typography,
      CodeBlockLowlight.configure({ lowlight: baaaamLowlight, defaultLanguage: 'plaintext' }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      EducationBlock,
      MathBlock,
      MathInline,
      ImageBlock,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'baaaam-prosemirror min-h-[360px] px-4 py-6 outline-none sm:min-h-[440px] sm:px-7 sm:py-8',
        'aria-label': '글 본문 편집기',
      },
      handlePaste: (_view, event) => {
        const file = Array.from(event.clipboardData?.files ?? []).find((item) => item.type.startsWith('image/'))
        if (!file) return false
        event.preventDefault()
        void uploadImage(file)
        return true
      },
      handleDrop: (_view, event) => {
        const file = Array.from(event.dataTransfer?.files ?? []).find((item) => item.type.startsWith('image/'))
        if (!file) return false
        event.preventDefault()
        void uploadImage(file)
        return true
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getJSON())
      const { $from } = currentEditor.state.selection
      const before = $from.parent.textBetween(0, $from.parentOffset, undefined, '\ufffc')
      const match = before.match(/(?:^|\s)\/([^\s/]*)$/)
      if (match) {
        slashRange.current = { from: $from.pos - match[0].trimStart().length, to: $from.pos }
        setBlockMenu({ open: true, query: match[1] })
      } else if (blockMenuOpenRef.current) {
        slashRange.current = null
        setBlockMenu({ open: false, query: '' })
      }
    },
  })

  editorRef.current = editor

  useEffect(() => {
    blockMenuOpenRef.current = blockMenu.open
  }, [blockMenu.open])

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ latex: string; apply: (latex: string) => void }>).detail
      setInputDialog({ kind: 'math', value: detail.latex, error: '', apply: detail.apply })
    }
    window.addEventListener('baaaam:edit-inline-math', handler)
    return () => window.removeEventListener('baaaam:edit-inline-math', handler)
  }, [])

  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    if (JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) editor.commands.setContent(content, { emitUpdate: false })
  }, [content, editor])

  if (!editor) return <div className="min-h-[360px] animate-pulse rounded-xl bg-section sm:min-h-[440px]" />

  function setLink() {
    const current = editor.getAttributes('link').href as string | undefined
    setInputDialog({ kind: 'link', value: current ?? 'https://', error: '' })
  }

  function insertInlineMath() {
    setInputDialog({ kind: 'math', value: '', error: '' })
  }

  function submitInputDialog() {
    if (!inputDialog) return
    const value = inputDialog.value.trim()
    if (inputDialog.kind === 'link') {
      if (!value || value === 'https://') {
        editor.chain().focus().unsetLink().run()
        setInputDialog(null)
        return
      }
      if (!/^https?:\/\//i.test(value)) {
        setInputDialog({ ...inputDialog, error: 'http:// 또는 https://로 시작하는 주소를 입력해주세요.' })
        return
      }
      editor.chain().focus().extendMarkRange('link').setLink({ href: value }).run()
      setInputDialog(null)
      return
    }
    if (!value) {
      setInputDialog({ ...inputDialog, error: 'LaTeX 수식을 입력해주세요.' })
      return
    }
    if (inputDialog.apply) inputDialog.apply(value)
    else {
      focusSafeInsertionPoint(editor)
      editor.chain().focus().insertContent({ type: 'mathInline', attrs: { latex: value } }).run()
    }
    setInputDialog(null)
  }

  function clearSlash() {
    if (slashRange.current) editor.chain().focus().deleteRange(slashRange.current).run()
    slashRange.current = null
  }

  const icon = 'h-4 w-4'
  const languages = ['plaintext', 'python', 'javascript', 'typescript', 'c', 'cpp', 'java', 'html', 'css']

  return (
    <div className="relative rounded-xl border border-border-subtle bg-white focus-within:border-brand/50">
      <div className="sticky top-[96px] z-20 border-b border-border-subtle bg-white/95 backdrop-blur sm:top-[64px]">
        <div className="responsive-scroll flex items-center gap-0.5 overflow-x-auto px-2 py-2 [scrollbar-width:none] sm:px-3">
          <ToolbarButton label="실행 취소" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 className={icon} /></ToolbarButton>
          <ToolbarButton label="다시 실행" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 className={icon} /></ToolbarButton>
          <span className="mx-1 h-5 w-px shrink-0 bg-border-subtle" />
          <select aria-label="문단 형식" value={editor.isActive('heading', { level: 1 }) ? 'h1' : editor.isActive('heading', { level: 2 }) ? 'h2' : editor.isActive('heading', { level: 3 }) ? 'h3' : 'p'} onChange={(event) => {
            const value = event.target.value
            if (value === 'p') editor.chain().focus().setParagraph().run()
            else editor.chain().focus().toggleHeading({ level: Number(value.slice(1)) as 1 | 2 | 3 }).run()
          }} className="mr-1 h-9 shrink-0 rounded-md border border-border-subtle bg-white px-2 text-sm font-semibold text-ink">
            <option value="p">본문</option><option value="h1">제목 1</option><option value="h2">제목 2</option><option value="h3">제목 3</option>
          </select>
          <ToolbarButton label="굵게" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className={icon} /></ToolbarButton>
          <ToolbarButton label="기울임" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className={icon} /></ToolbarButton>
          <ToolbarButton label="밑줄" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className={icon} /></ToolbarButton>
          <ToolbarButton label="취소선" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className={icon} /></ToolbarButton>
          <ToolbarButton label="강조" active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()}><Highlighter className={icon} /></ToolbarButton>
          <ToolbarButton label="링크" active={editor.isActive('link')} onClick={setLink}><Link2 className={icon} /></ToolbarButton>
          <span className="mx-1 h-5 w-px shrink-0 bg-border-subtle" />
          <ToolbarButton label="왼쪽 정렬" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft className={icon} /></ToolbarButton>
          <ToolbarButton label="가운데 정렬" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter className={icon} /></ToolbarButton>
          <ToolbarButton label="오른쪽 정렬" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight className={icon} /></ToolbarButton>
        </div>
        <div className="responsive-scroll flex items-center gap-1 overflow-x-auto border-t border-border-subtle/70 bg-section px-2 py-1.5 [scrollbar-width:none] sm:px-3">
          <span className="shrink-0 px-1 text-[11px] font-extrabold text-ink-soft">추가</span>
          <ToolbarButton showLabel label="목록" active={editor.isActive('bulletList')} onClick={() => { focusSafeInsertionPoint(editor); editor.chain().focus().toggleBulletList().run() }}><List className={icon} /></ToolbarButton>
          <ToolbarButton showLabel label="번호" active={editor.isActive('orderedList')} onClick={() => { focusSafeInsertionPoint(editor); editor.chain().focus().toggleOrderedList().run() }}><ListOrdered className={icon} /></ToolbarButton>
          <ToolbarButton showLabel label="체크" active={editor.isActive('taskList')} onClick={() => { focusSafeInsertionPoint(editor); editor.chain().focus().toggleTaskList().run() }}><CheckSquare className={icon} /></ToolbarButton>
          <ToolbarButton showLabel label="인용" active={editor.isActive('blockquote')} onClick={() => { focusSafeInsertionPoint(editor); editor.chain().focus().toggleBlockquote().run() }}><Quote className={icon} /></ToolbarButton>
          <ToolbarButton showLabel label="코드" active={editor.isActive('codeBlock')} onClick={() => { focusSafeInsertionPoint(editor); editor.chain().focus().toggleCodeBlock().run() }}><Code2 className={icon} /></ToolbarButton>
          <ToolbarButton showLabel label="구분선" onClick={() => { focusSafeInsertionPoint(editor); editor.chain().focus().setHorizontalRule().run() }}><Minus className={icon} /></ToolbarButton>
          <ToolbarButton showLabel label="사진" onClick={() => fileInputRef.current?.click()}><ImagePlus className={icon} /></ToolbarButton>
          <ToolbarButton showLabel label="표" onClick={() => { focusSafeInsertionPoint(editor); editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() }}><Table2 className={icon} /></ToolbarButton>
          <ToolbarButton showLabel label="짧은 수식" onClick={insertInlineMath}><Sigma className={icon} /></ToolbarButton>
          <ToolbarButton showLabel label="학습 블록" onClick={() => { focusSafeInsertionPoint(editor); setBlockMenu({ open: true, query: '' }) }}><Blocks className={icon} /></ToolbarButton>
        </div>
      </div>

      {editor.isActive('codeBlock') ? (
        <div className="flex flex-wrap items-center gap-2 border-b border-border-subtle bg-section px-4 py-2 text-xs text-ink-muted">
          <label htmlFor="code-language" className="font-bold">코드 언어</label>
          <select id="code-language" value={(editor.getAttributes('codeBlock').language as string | null) ?? 'plaintext'} onChange={(event) => editor.chain().focus().updateAttributes('codeBlock', { language: event.target.value }).run()} className="h-8 rounded-md border border-border-subtle bg-white px-2 text-xs font-semibold text-navy">
            {languages.map((language) => <option key={language} value={language}>{language === 'plaintext' ? 'Plain Text' : language}</option>)}
          </select>
        </div>
      ) : null}

      {editor.isActive('table') ? (
        <div role="toolbar" aria-label="표 행과 열 편집" className="responsive-scroll flex items-center gap-2 overflow-x-auto border-b border-border-subtle bg-section px-3 py-2 [scrollbar-width:none]">
          <span className="shrink-0 text-xs font-extrabold text-navy">표 편집</span>
          <span className="h-5 w-px shrink-0 bg-border-subtle" />
          <div className="flex shrink-0 items-center gap-1 rounded-lg border border-border-subtle bg-white p-1">
            <span className="inline-flex items-center gap-1 px-1.5 text-xs font-extrabold text-brand"><Rows3 className="h-4 w-4" />행</span>
            <button type="button" onClick={() => editor.chain().focus().addRowBefore().run()} disabled={!editor.can().addRowBefore()} className="min-h-8 rounded-md px-2.5 text-xs font-bold text-ink-muted hover:bg-section hover:text-brand disabled:opacity-35">위에 추가</button>
            <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} disabled={!editor.can().addRowAfter()} className="min-h-8 rounded-md px-2.5 text-xs font-bold text-ink-muted hover:bg-section hover:text-brand disabled:opacity-35">아래에 추가</button>
            <button type="button" onClick={() => editor.chain().focus().deleteRow().run()} disabled={!editor.can().deleteRow()} className="inline-flex min-h-8 items-center gap-1 rounded-md px-2.5 text-xs font-bold text-danger hover:bg-[#fff5f4] disabled:opacity-35"><Trash2 className="h-3.5 w-3.5" />삭제</button>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-lg border border-border-subtle bg-white p-1">
            <span className="inline-flex items-center gap-1 px-1.5 text-xs font-extrabold text-brand"><Columns3 className="h-4 w-4" />열</span>
            <button type="button" onClick={() => editor.chain().focus().addColumnBefore().run()} disabled={!editor.can().addColumnBefore()} className="min-h-8 rounded-md px-2.5 text-xs font-bold text-ink-muted hover:bg-section hover:text-brand disabled:opacity-35">왼쪽에 추가</button>
            <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} disabled={!editor.can().addColumnAfter()} className="min-h-8 rounded-md px-2.5 text-xs font-bold text-ink-muted hover:bg-section hover:text-brand disabled:opacity-35">오른쪽에 추가</button>
            <button type="button" onClick={() => editor.chain().focus().deleteColumn().run()} disabled={!editor.can().deleteColumn()} className="inline-flex min-h-8 items-center gap-1 rounded-md px-2.5 text-xs font-bold text-danger hover:bg-[#fff5f4] disabled:opacity-35"><Trash2 className="h-3.5 w-3.5" />삭제</button>
          </div>
          <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} disabled={!editor.can().deleteTable()} className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg border border-danger/25 bg-white px-3 text-xs font-bold text-danger hover:border-danger hover:bg-[#fff5f4] disabled:opacity-35"><Trash2 className="h-4 w-4" />표 삭제</button>
        </div>
      ) : null}

      <BubbleMenu editor={editor} shouldShow={({ editor: current }) => !current.state.selection.empty} className="flex items-center gap-0.5 rounded-lg border border-border-subtle bg-white p-1 shadow-lg">
        <ToolbarButton label="굵게" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className={icon} /></ToolbarButton>
        <ToolbarButton label="기울임" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className={icon} /></ToolbarButton>
        <ToolbarButton label="밑줄" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className={icon} /></ToolbarButton>
        <ToolbarButton label="취소선" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className={icon} /></ToolbarButton>
        <ToolbarButton label="강조" active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()}><Highlighter className={icon} /></ToolbarButton>
        <ToolbarButton label="링크" active={editor.isActive('link')} onClick={setLink}><Link2 className={icon} /></ToolbarButton>
      </BubbleMenu>

      <EditorContent editor={editor} />

      <div className="flex items-center justify-end border-t border-border-subtle px-4 py-3 text-xs text-ink-soft">
        <span>{editor.storage.characterCount.characters().toLocaleString()}자</span>
      </div>

      {uploadState.active ? <div role="status" className="absolute inset-x-4 bottom-16 flex items-center gap-2 rounded-lg border border-brand/20 bg-white px-4 py-3 text-sm font-semibold text-brand shadow-md"><LoaderCircle className="h-4 w-4 animate-spin" />사진을 최적화하고 업로드하는 중… {uploadState.progress}%</div> : null}
      {uploadState.error ? <p role="alert" className="border-t border-danger/15 bg-[#fff5f4] px-4 py-3 text-sm text-danger">{uploadState.error}</p> : null}

      <EditorBlockMenu editor={editor} open={blockMenu.open} query={blockMenu.query} onClose={() => setBlockMenu({ open: false, query: '' })} onPickImage={() => fileInputRef.current?.click()} clearSlash={clearSlash} />
      <EditorInputDialog
        open={Boolean(inputDialog)}
        title={inputDialog?.kind === 'link' ? '링크 연결' : inputDialog?.apply ? '수식 수정' : '짧은 수식 추가'}
        description={inputDialog?.kind === 'link' ? '선택한 글자에 연결할 웹 주소를 입력하세요.' : 'LaTeX 문법으로 입력하면 글 안에 수식이 표시됩니다.'}
        label={inputDialog?.kind === 'link' ? '웹 주소' : 'LaTeX 수식'}
        value={inputDialog?.value ?? ''}
        placeholder={inputDialog?.kind === 'link' ? 'https://example.com' : 'E = mc^2'}
        error={inputDialog?.error ?? ''}
        submitLabel={inputDialog?.apply ? '수정하기' : '추가하기'}
        onOpenChange={(open) => { if (!open) setInputDialog(null) }}
        onChange={(value) => setInputDialog((current) => current ? { ...current, value, error: '' } : current)}
        onSubmit={submitInputDialog}
      />
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(file); event.target.value = '' }} />

      <div className="sr-only" aria-live="polite">{uploadState.active ? `사진 업로드 ${uploadState.progress}%` : ''}</div>

    </div>
  )
}
