import type { Editor } from '@tiptap/react'
import { NodeSelection, TextSelection } from '@tiptap/pm/state'

/**
 * Atom 형태의 이미지·수식·교육 블록을 선택한 채 새 블록을 추가해도
 * 기존 블록을 덮어쓰지 않고 바로 뒤의 편집 가능한 위치에 삽입한다.
 */
export function focusSafeInsertionPoint(editor: Editor) {
  const { selection, doc } = editor.state
  if (selection instanceof NodeSelection) {
    const next = TextSelection.near(doc.resolve(selection.to), 1)
    editor.commands.setTextSelection({ from: next.from, to: next.to })
  }
  editor.commands.focus()
}
