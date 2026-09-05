import type { PostDraft } from '@/types/blog'

const DATABASE_NAME = 'baaaam-editor'
const STORE_NAME = 'drafts'
const DATABASE_VERSION = 1
const fallbackPrefix = 'baaaam:draft:'

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is unavailable'))
      return
    }
    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) database.createObjectStore(STORE_NAME)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('임시 저장소를 열지 못했어요.'))
  })
}

async function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>) {
  const database = await openDatabase()
  return new Promise<T>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode)
    const request = run(transaction.objectStore(STORE_NAME))
    request.onerror = () => reject(request.error ?? new Error('임시 저장에 실패했어요.'))
    transaction.oncomplete = () => { database.close(); resolve(request.result) }
    transaction.onabort = () => { database.close(); reject(transaction.error ?? new Error('임시 저장이 중단되었어요.')) }
    transaction.onerror = () => reject(transaction.error ?? new Error('임시 저장에 실패했어요.'))
  })
}

function fallbackKey(key: string) {
  return `${fallbackPrefix}${key}`
}

export const draftStorage = {
  // Synchronous recovery journal survives route changes and tab closure before IDB finishes.
  checkpoint(key: string, draft: PostDraft): void {
    window.localStorage.setItem(fallbackKey(key), JSON.stringify(draft))
  },
  async get(key: string): Promise<PostDraft | null> {
    let local: PostDraft | null = null
    try {
      const raw = window.localStorage.getItem(fallbackKey(key))
      if (raw) local = JSON.parse(raw) as PostDraft
    } catch { /* IndexedDB remains available when localStorage is blocked. */ }
    try {
      const stored = await withStore<PostDraft | undefined>('readonly', (store) => store.get(key))
      return local && (!stored || local.updatedAt >= stored.updatedAt) ? local : stored ?? null
    } catch {
      return local
    }
  },

  async save(key: string, draft: PostDraft): Promise<void> {
    try {
      await withStore<IDBValidKey>('readwrite', (store) => store.put(draft, key))
    } catch {
      window.localStorage.setItem(fallbackKey(key), JSON.stringify(draft))
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await withStore<undefined>('readwrite', (store) => store.delete(key) as IDBRequest<undefined>)
    } catch { /* A fallback-only browser has no IndexedDB record to remove. */ }
    window.localStorage.removeItem(fallbackKey(key))
  },
}
