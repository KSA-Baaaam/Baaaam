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
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('임시 저장에 실패했어요.'))
    transaction.oncomplete = () => database.close()
    transaction.onerror = () => reject(transaction.error ?? new Error('임시 저장에 실패했어요.'))
  })
}

function fallbackKey(key: string) {
  return `${fallbackPrefix}${key}`
}

export const draftStorage = {
  async get(key: string): Promise<PostDraft | null> {
    try {
      return (await withStore<PostDraft | undefined>('readonly', (store) => store.get(key))) ?? null
    } catch {
      const raw = window.localStorage.getItem(fallbackKey(key))
      if (!raw) return null
      try {
        return JSON.parse(raw) as PostDraft
      } catch {
        return null
      }
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
    } finally {
      window.localStorage.removeItem(fallbackKey(key))
    }
  },
}
