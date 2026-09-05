import assert from 'node:assert/strict'
import { createRequire, registerHooks } from 'node:module'
import { JSDOM } from 'jsdom'
registerHooks({ load(url, context, next) { if (/\.(png|jpg|jpeg|webp|svg|css)$/.test(url)) return { format: 'module', source: `export default ${JSON.stringify(url)}`, shortCircuit: true }; return next(url, context) } })
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://localhost', pretendToBeVisual: true })
for (const key of ['window','document','navigator','Node','NodeFilter','Element','HTMLElement','HTMLInputElement','HTMLTextAreaElement','HTMLSelectElement','MutationObserver','DOMParser','CustomEvent','Event','KeyboardEvent','MouseEvent','getComputedStyle','localStorage']) Object.defineProperty(globalThis, key, { value: dom.window[key], configurable: true })
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window)
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window)
globalThis.IS_REACT_ACT_ENVIRONMENT = true
dom.window.scrollBy = () => {}
dom.window.Range.prototype.getBoundingClientRect = () => ({ x:0,y:0,left:0,top:0,right:100,bottom:24,width:100,height:24 })
dom.window.Range.prototype.getClientRects = () => []
globalThis.fetch = async () => { throw new Error('Network disabled for audit') }
const base = new URL('../../', import.meta.url).href
const require = createRequire(new URL('package.json', base))
const { createElement: h, useState, act } = require('react')
const { createRoot } = require('react-dom/client')
const { renderToStaticMarkup } = require('react-dom/server')
const { BaaaamEditor } = await import(base+'src/components/editor/BaaaamEditor.tsx')
const { PostContentRenderer } = await import(base+'src/components/post/PostContentRenderer.tsx')
const { draftStorage } = await import(base+'src/services/draftStorage.ts')
const { useLocalDraft } = await import(base+'src/hooks/useLocalDraft.ts')
let root, captured
const results = []
const plain = text => ({type:'doc', content:[{type:'paragraph',content:[{type:'text',text}]}]})
async function mount(component) { root = createRoot(document.getElementById('root')); await act(async()=>{root.render(component)}); await act(async()=>{await new Promise(r=>setTimeout(r,30))}) }
async function unmount() {await act(async()=>{root.unmount();await new Promise(r=>setTimeout(r,30))})}
function record(kind, name, detail='') {results.push({kind,name,detail});console.log(kind, name, detail)}
function Harness() {const [content,setContent]=useState(plain('본문 테스트'));return h(BaaaamEditor,{content,onChange:next=>{captured=next;setContent(next)},onUploadImage:async()=>({publicUrl:'https://example.com/test.webp',width:800,height:400})})}
await mount(h(Harness))
let ed = document.querySelector('.baaaam-prosemirror').editor
const click = async label => {const btn=document.querySelector(`button[aria-label="${label}"]`);assert.ok(btn,label);await act(async()=>{btn.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,cancelable:true,button:0}));btn.click();await new Promise(r=>setTimeout(r,30))})}
for (const [label,type] of [['목록','bulletList'],['번호','orderedList'],['체크','taskList'],['인용','blockquote'],['코드','codeBlock']]) {
  await act(async()=>{ed.commands.setContent(plain('본문 테스트'));ed.commands.setTextSelection(2)})
  await click(label);assert.ok(ed.isActive(type));await click(label);assert.ok(!ed.isActive(type));record('PASS',label+' 적용/해제')
}
await act(async()=>{ed.commands.setContent(plain('표 앞 본문'));ed.commands.setTextSelection(2)})
await click('표')
assert.equal(ed.getJSON().content.find(n=>n.type==='table').content.length,3)
await act(async()=>{ed.chain().addRowAfter().addColumnAfter().run()})
let table=ed.getJSON().content.find(n=>n.type==='table');assert.equal(table.content.length,4);assert.equal(table.content[0].content.length,4)
await act(async()=>{ed.chain().deleteRow().deleteColumn().run()})
table=ed.getJSON().content.find(n=>n.type==='table');assert.equal(table.content.length,3);assert.equal(table.content[0].content.length,3);record('PASS','표 삽입 및 행/열 추가·삭제')
const cell={type:'tableCell',attrs:{colspan:2,rowspan:1,colwidth:[120,260]},content:[{type:'paragraph',content:[{type:'text',text:'합친 셀'}]}]}
let rendered=renderToStaticMarkup(h(PostContentRenderer,{content:{type:'doc',content:[{type:'table',content:[{type:'tableRow',content:[cell]}]}]}}))
assert.ok(rendered.includes('colSpan="2"')&&rendered.includes('260'))
record('PASS','발행 표 열 너비·병합 정보 보존')
rendered=renderToStaticMarkup(h(PostContentRenderer,{content:{type:'doc',content:[{type:'orderedList',attrs:{start:5},content:[{type:'listItem',content:[{type:'paragraph',content:[{type:'text',text:'다섯 번째'}]}]}]}]}}))
assert.ok(rendered.includes('start="5"'));record('PASS','번호 목록 시작 번호 보존')
await act(async()=>{ed.commands.setContent({type:'doc',content:[{type:'imageBlock',attrs:{src:'https://example.com/test.webp',caption:'한글 캡션',displayWidth:50,width:800,height:400}},{type:'paragraph'}]});ed.commands.setTextSelection(ed.state.doc.content.size-1)})
assert.equal(document.querySelector('input[aria-label="이미지 캡션"]').value,'한글 캡션')
rendered=renderToStaticMarkup(h(PostContentRenderer,{content:ed.getJSON()}));assert.ok(rendered.includes('width:50%'));assert.ok(rendered.includes('한글 캡션'));record('PASS','본문 이미지 크기·캡션의 편집/발행 렌더링')
await act(async()=>{ed.commands.setContent(plain('학습'));ed.commands.setTextSelection(2)})
await click('학습 블록')
assert.ok(document.querySelector('[aria-label="블록 추가"]'))
await act(async()=>{document.getElementById('editor-block-search').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',keyCode:229,isComposing:true,bubbles:true,cancelable:true}))})
assert.ok(document.querySelector('[aria-label="블록 추가"]'));record('PASS','블록 검색 한글 조합 Enter 무시')
await unmount()
const draft={id:null,localId:'audit',title:'지워지면 안 되는 초안',content:plain('아직 저장되기 전 입력'),categoryId:'math',imageUrl:'',subtitle:'',tags:[],status:'draft',updatedAt:Date.now()}
function LocalDraftHarness(){useLocalDraft('audit-fast-navigation',draft,true);return null}
await mount(h(LocalDraftHarness));await unmount();await new Promise(r=>setTimeout(r,750))
assert.equal((await draftStorage.get('audit-fast-navigation')).title,draft.title);record('PASS','즉시 페이지 이동해도 입력 보존')
await draftStorage.save('audit-fallback',draft)
let removeFailed=false;try{await draftStorage.remove('audit-fallback')}catch{removeFailed=true}
assert.equal(removeFailed,false);record('PASS','IndexedDB 불가 환경에서 삭제 성공')

const {supabase}=await import(base+'src/lib/supabase.ts')
const {postsService}=await import(base+'src/services/posts.ts')
const originalFrom=supabase.from.bind(supabase)
const originalGetUser=supabase.auth.getUser.bind(supabase.auth)
let updates=[];let conditions=[]
supabase.from=()=>({update:patch=>{
  updates.push(patch)
  const single=async()=>({data:{id:99,status:'published',content:plain('live'),tags:[],updated_at:new Date().toISOString()},error:null})
  const chain={eq:(key,value)=>{conditions.push([key,value]);return chain},select:()=>({single})};return chain
}})
await postsService.updateDraft('99',{content:plain('수정 중인 비공개 내용')})
assert.ok(updates[0].content);assert.equal(updates[0].status,undefined)
assert.ok(conditions.some(([key,value])=>key==='status'&&value==='draft'))
record('PASS','공개 글은 임시저장 UPDATE 대상에서 제외')
let inserts=0
supabase.auth.getUser=async()=>({data:{user:{id:'audit-user',email:'audit@example.com',user_metadata:{}}},error:null})
supabase.from=()=>({
  insert:()=>({select:()=>({single:async()=>({data:{id:++inserts},error:null})})}),
  update:()=>({eq:()=>({select:()=>({single:async()=>({data:null,error:{message:'Simulated network failure'}})})})}),
})
for(let i=0;i<2;i++){await postsService.publish(null,{title:'test',subtitle:'',categoryId:'math',imageUrl:'',content:plain('test'),tags:[]}).catch(()=>{})}
assert.equal(inserts,0);record('PASS','ID 없는 발행은 새 글을 생성하지 않음')
supabase.from=originalFrom;supabase.auth.getUser=originalGetUser
const {AuthSessionProvider}=await import(base+'src/services/session.ts')
const {profilesService}=await import(base+'src/services/profiles.ts')
const {default:WritePost}=await import(base+'src/pages/WritePost.tsx')
const {MemoryRouter, Routes, Route}=await import(base+'node_modules/react-router-dom/dist/index.mjs')
const {QueryClient,QueryClientProvider}=await import(base+'node_modules/@tanstack/react-query/build/modern/index.js')
let activeUser='audit-user-a'
supabase.auth.getSession=async()=>({data:{session:{user:{id:activeUser,email:'audit@example.com',email_confirmed_at:'2026-01-01',user_metadata:{}}}},error:null})
supabase.auth.onAuthStateChange=()=>({data:{subscription:{unsubscribe(){}}}})
profilesService.getById=async id=>({id,email:'audit@example.com',displayName:id,role:'author',createdAt:'2026-01-01'})
const local=new Map()
draftStorage.get=async key=>local.get(key)??null
draftStorage.save=async(key,value)=>{local.set(key,structuredClone(value))}
draftStorage.checkpoint=(key,value)=>{local.set(key,structuredClone(value))}
draftStorage.remove=async key=>{local.delete(key)}
const originalPost={id:'99',authorId:'audit-user-a',title:'서버 원본',subtitle:'',categoryId:'math',imageUrl:'',content:plain('원본 본문'),tags:[],status:'draft',updatedAt:'2026-01-01T00:00:00Z',publishedAt:null}
postsService.getById=async()=>originalPost
function WriteHarness({path='/write'}) {
  const client=new QueryClient({defaultOptions:{queries:{retry:false,gcTime:0}}})
  return h(QueryClientProvider,{client},h(AuthSessionProvider,null,h(MemoryRouter,{initialEntries:[path]},h(Routes,null,h(Route,{path:'/write',element:h(WritePost)}),h(Route,{path:'/write/:postId',element:h(WritePost)}),h(Route,{path:'*',element:h('p',null,'PUBLISHED')}),h(Route,{path:'/admin',element:h('p',null,'ADMIN')})))))
}
local.set('new',{...draft,title:'A 계정의 비공개 초안'})
local.set('audit-user-a:new',{...draft,title:'A 계정의 비공개 초안'})
activeUser='audit-user-b'
await mount(h(WriteHarness,{}))
assert.equal(document.querySelector('input[maxlength="100"]').value,'')
record('PASS','계정 간 초안 분리 및 소유자 없는 레거시 초안 자동복원 차단')
await unmount()
activeUser='audit-user-a'
local.set('audit-user-a:99',{...draft,id:'99',title:'아직 복구하지 않은 최신 로컬 초안'})
await mount(h(WriteHarness,{path:'/write/99'}))
await act(async()=>{await new Promise(r=>setTimeout(r,100))})
assert.ok(document.body.textContent.includes('기기 내용 복구'))
await act(async()=>{await new Promise(r=>setTimeout(r,750))})
assert.equal(local.get('audit-user-a:99').title,'아직 복구하지 않은 최신 로컬 초안')
record('PASS','복구 선택 전 최신 기기 초안 보존')
await unmount()
local.clear()
originalPost.status='published'
let updateCalls=0
postsService.updateDraft=async()=>{updateCalls++;return originalPost}
await mount(h(WriteHarness,{path:'/write/99'}))
await act(async()=>{
  const title=document.querySelector('input[maxlength="100"]')
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(title,'발행 전 비공개 수정')
  title.dispatchEvent(new Event('input',{bubbles:true}))
})
await act(async()=>{[...document.querySelectorAll('button')].find(b=>b.textContent==='임시저장').click()})
assert.equal(updateCalls,0)
assert.equal(local.get('audit-user-a:99').title,'발행 전 비공개 수정')
record('PASS','공개 글 편집 임시저장은 서버 요청 없이 기기에 보관')
await unmount()
local.clear()
local.set('audit-user-a:new',{...draft})
let createdCount=0;const publishedIds=[]
postsService.createDraft=async()=>{createdCount++;return {...originalPost,id:'101',status:'draft'}}
postsService.publish=async(id)=>{publishedIds.push(id);throw new Error('발행 요청 실패 테스트')}
await mount(h(WriteHarness,{}))
await act(async()=>{[...document.querySelectorAll('button')].find(b=>b.textContent==='발행').click()})
for(let retry=0;retry<2;retry++) {
  await act(async()=>{const submit=[...document.querySelectorAll('button')].find(b=>b.textContent==='발행하기');submit.click();submit.click();await new Promise(r=>setTimeout(r,50))})
  assert.ok(document.body.textContent.includes('발행 요청 실패 테스트'))
}
assert.equal(createdCount,1)
assert.deepEqual(publishedIds,['101','101'])
assert.equal(local.get('audit-user-a:new').id,'101')
record('PASS','발행 실패 후 재시도에서 초안 ID 유지 및 중복 생성 방지')
postsService.publish=async(id)=>({...originalPost,id,status:'published'})
const normalRemove=draftStorage.remove
draftStorage.remove=async()=>{throw new Error('기기 정리 실패 테스트')}
await act(async()=>{[...document.querySelectorAll('button')].find(b=>b.textContent==='발행하기').click();await new Promise(r=>setTimeout(r,50))})
assert.ok(document.body.textContent.includes('PUBLISHED'))
record('PASS','로컬 정리 실패에도 발행 성공 처리 및 읽기 화면 이동')
draftStorage.remove=normalRemove
await unmount()
const {CoverImageCropDialog}=await import(base+'src/components/editor/CoverImageCropDialog.tsx')
globalThis.Image=class {naturalWidth=1600;naturalHeight=700;set src(value){queueMicrotask(()=>this.onload?.())}}
URL.createObjectURL=()=> 'blob:audit-image'
URL.revokeObjectURL=()=>{}
dom.window.HTMLCanvasElement.prototype.getContext=()=>({drawImage(){}})
dom.window.HTMLCanvasElement.prototype.toBlob=function(callback){callback(new Blob(['audit'],{type:'image/webp'}))}
await mount(h(CoverImageCropDialog,{file:new File(['image'],'audit.webp',{type:'image/webp'}),saving:false,onCancel(){},onSave:async()=>{throw new Error('임시 네트워크 오류')}}))
const cropSave=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('선택 영역 저장'))
assert.ok(cropSave&&!cropSave.disabled)
await act(async()=>{cropSave.click();await new Promise(r=>setTimeout(r,30))})
assert.ok(!cropSave.disabled)
await act(async()=>{[...document.querySelectorAll('button')].find(b=>b.textContent.includes('선택 영역 초기화')).click()})
assert.ok(!cropSave.disabled);record('PASS','대표 이미지 업로드 실패 후 재시도 가능')
await unmount()
const {TagInput}=await import(base+'src/components/editor/TagInput.tsx')
let tags=[]
function TagsHarness(){const [value,setValue]=useState([]);return h(TagInput,{tags:value,onChange:next=>{tags=next;setValue(next)}})}
await mount(h(TagsHarness))
async function enterTag(value,isComposing=false){const input=document.querySelector('input');await act(async()=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,value);input.dispatchEvent(new Event('input',{bubbles:true}))});await act(async()=>{input.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',isComposing,bubbles:true,cancelable:true}))})}
await enterTag('안녕',true);assert.equal(tags.length,0)
await enterTag('안녕');await enterTag('안녕');assert.deepEqual(tags,['안녕'])
for(let i=0;i<12;i++)await enterTag('태그'+i)
assert.equal(tags.length,10);record('PASS','태그 한글 조합·중복 방지·10개 제한')
await unmount()
console.log(JSON.stringify(results,null,2))
dom.window.close()
process.exit(0)
