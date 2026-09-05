import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body><div id="test-root"></div></body></html>', { url: 'http://localhost', pretendToBeVisual: true })
for (const key of ['window', 'document', 'navigator', 'Node', 'Element', 'HTMLElement', 'HTMLInputElement', 'MutationObserver', 'DOMParser', 'CustomEvent', 'Event', 'KeyboardEvent', 'MouseEvent', 'getComputedStyle']) {
  Object.defineProperty(globalThis, key, { value: dom.window[key], configurable: true })
}
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window)
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window)
globalThis.IS_REACT_ACT_ENVIRONMENT = true
dom.window.scrollBy = () => {}
dom.window.Range.prototype.getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, right: 100, bottom: 24, width: 100, height: 24 })
dom.window.Range.prototype.getClientRects = () => []
const base = new URL('../../', import.meta.url).href
const require = createRequire(new URL('package.json', base))
const { createElement, useState, act } = require('react')
const { createRoot } = require('react-dom/client')
const { renderToStaticMarkup } = require('react-dom/server')
const { BaaaamEditor } = await import(base+'src/components/editor/BaaaamEditor.tsx')
const { PostContentRenderer } = await import(base+'src/components/post/PostContentRenderer.tsx')
const warnings = []
const originalWarn = console.warn
console.warn = (...args) => { warnings.push(args.join(' ')); originalWarn(...args) }
let saved
function Harness() {
  const [content, setContent] = useState({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '서식 테스트 plain' }] }] })
  return createElement(BaaaamEditor, { content, onChange: (next) => { saved = next; setContent(next) }, onUploadImage: async () => { throw new Error('Unexpected upload') } })
}
const root = createRoot(document.getElementById('test-root'))
await act(async () => { root.render(createElement(Harness)); await new Promise(r => setTimeout(r, 50)) })
const editor = document.querySelector('.baaaam-prosemirror').editor
assert.ok(editor)
const button = (label, bubble = false) => [...document.querySelectorAll(`button[aria-label="${label}"]`)].find(el => Boolean(el.closest('.z-30')) === bubble)
async function click(label, bubble = false) {
  const el = button(label, bubble)
  assert.ok(el, `${label}: button exists`)
  await act(async () => {
    const down = new dom.window.MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 })
    el.dispatchEvent(down)
    assert.equal(down.defaultPrevented, true, 'Mouse down must preserve editor selection')
    el.click()
    await new Promise(r => setTimeout(r, 40))
  })
}
for (const [label, mark, tag] of [['기울임', 'italic', 'em'], ['밑줄', 'underline', 'u'], ['취소선', 'strike', 's'], ['강조', 'highlight', 'mark']]) {
  await act(async () => { editor.chain().focus().setTextSelection(1).unsetAllMarks().run() })
  await click(label)
  assert.equal(button(label).getAttribute('aria-pressed'), 'true', `${label}: empty cursor toggle updates toolbar`)
  assert.ok(editor.state.storedMarks?.some(m => m.type.name === mark))
  await act(async () => { editor.commands.insertContent('입력') })
  assert.ok(saved.content[0].content[0].marks.some(m => m.type === mark), `${label}: typed text retains chosen format`)
  await click(label)
  assert.equal(button(label).getAttribute('aria-pressed'), 'false')
  await act(async () => { editor.commands.setContent({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '서식 테스트 plain' }] }] }) })
  await act(async () => { editor.chain().focus().setTextSelection({ from: 1, to: 3 }).run() })
  await click(label)
  assert.deepEqual([editor.state.selection.from, editor.state.selection.to], [1, 3])
  assert.ok(saved.content[0].content[0].marks.some(m => m.type === mark), `${label}: saved JSON contains mark`)
  assert.ok(renderToStaticMarkup(createElement(PostContentRenderer, { content: saved })).includes(`<${tag}>`), `${label}: reader/preview preserves mark`)
  await act(async () => { editor.commands.setTextSelection(10) })
  assert.equal(button(label).getAttribute('aria-pressed'), 'false', `${label}: plain cursor clears active indicator`)
  await act(async () => { editor.chain().focus().setTextSelection({ from: 1, to: 3 }).run(); await new Promise(r => setTimeout(r, 300)) })
  assert.equal(button(label).getAttribute('aria-pressed'), 'true')
  await click(label, true)
  assert.equal(editor.isActive(mark), false, `${label}: floating toolbar removes mark`)
  await click(label, true)
  assert.equal(editor.isActive(mark), true, `${label}: floating toolbar reapplies mark`)
  await click(label)
  console.log(`PASS ${label}: cursor toggles, selection retained, both toolbars, save/reader rendering`)
}
assert.ok(!warnings.some(w => w.includes('Duplicate extension')))
await act(async () => { root.unmount(); await new Promise(r => setTimeout(r, 50)) })
dom.window.close()
console.log('PASS no duplicate extensions or render loop')
