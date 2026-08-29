import { posts as postSeed } from '@/data/posts'
import type { Post } from '@/data/posts'

export type { Post }

/** 글 생성·수정 시 입력값. `id`·`viewCount`·`publishedAt`은 서비스가 채운다. */
export type PostInput = Omit<Post, 'id' | 'viewCount' | 'publishedAt'>

/** Promise 기반 어댑터 계약. BaaS 연동 시 이 인터페이스를 구현하는 파일만 추가하면 된다. */
export interface PostsAdapter {
  listAll(): Promise<Post[]>
  getById(id: string): Promise<Post | undefined>
  create(input: PostInput): Promise<Post>
  update(id: string, input: PostInput): Promise<Post>
  setRecommended(id: string, isRecommended: boolean): Promise<Post>
}

/** 시드를 복제해 내부 상태로 쓰고, 바깥으로는 절대 노출하지 않는 메모리 어댑터. */
function createMemoryPostsAdapter(): PostsAdapter {
  let store: Post[] = postSeed.map((post) => ({ ...post }))
  let nextSequence = 1

  function requireUpdated(id: string, updater: (post: Post) => Post): Post {
    let updated: Post | undefined
    store = store.map((post) => {
      if (post.id !== id) {
        return post
      }
      updated = updater(post)
      return updated
    })
    if (!updated) {
      throw new Error(`글을 찾을 수 없어요: ${id}`)
    }
    return updated
  }

  return {
    async listAll() {
      return store.map((post) => ({ ...post }))
    },
    async getById(id) {
      const found = store.find((post) => post.id === id)
      return found ? { ...found } : undefined
    },
    async create(input) {
      const newPost: Post = {
        ...input,
        id: `post-${Date.now()}-${nextSequence++}`,
        viewCount: 0,
        publishedAt: new Date().toISOString(),
      }
      store = [...store, newPost]
      return newPost
    },
    async update(id, input) {
      // publishedAt·viewCount는 건드리지 않고 나머지 필드만 병합한다.
      return requireUpdated(id, (post) => ({ ...post, ...input }))
    },
    async setRecommended(id, isRecommended) {
      return requireUpdated(id, (post) => ({ ...post, isRecommended }))
    },
  }
}

/** 합성 루트: 지금은 메모리 어댑터만 선택한다. BaaS 활성화 시 이 값만 교체한다. */
export const postsService: PostsAdapter = createMemoryPostsAdapter()
