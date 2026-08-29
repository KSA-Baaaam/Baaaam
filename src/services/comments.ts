import { comments as commentSeed } from '@/data/comments'
import type { Comment } from '@/data/comments'

export type { Comment }

export type AddCommentInput = {
  postId: string
  author: string
  content: string
  isQuestion: boolean
  inReplyTo: string | null
}

/** Promise 기반 어댑터 계약. BaaS 연동 시 이 인터페이스를 구현하는 파일만 추가하면 된다. */
export interface CommentsAdapter {
  listByPostId(postId: string): Promise<Comment[]>
  listAll(): Promise<Comment[]>
  addComment(input: AddCommentInput): Promise<Comment>
  deleteComment(id: string): Promise<void>
}

function sortByCreatedAtAscending(records: Comment[]): Comment[] {
  return [...records].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )
}

function sortByCreatedAtDescending(records: Comment[]): Comment[] {
  return [...records].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

/** 시드를 복제해 내부 상태로 쓰고, 바깥으로는 절대 노출하지 않는 메모리 어댑터. */
function createMemoryCommentsAdapter(): CommentsAdapter {
  let store: Comment[] = commentSeed.map((comment) => ({ ...comment }))
  let nextSequence = 1

  return {
    async listByPostId(postId) {
      return sortByCreatedAtAscending(store.filter((comment) => comment.postId === postId))
    },
    async listAll() {
      // 관리자 전용 조회: 최신 활동을 먼저 보여준다(공개 상세 화면의 오름차순 정렬과는 용도가
      // 달라 별도로 정렬한다).
      return sortByCreatedAtDescending(store)
    },
    async addComment(input) {
      const newComment: Comment = {
        id: `comment-${Date.now()}-${nextSequence++}`,
        postId: input.postId,
        author: input.author,
        content: input.content,
        createdAt: new Date().toISOString(),
        isQuestion: input.isQuestion,
        inReplyTo: input.inReplyTo,
      }
      store = [...store, newComment]
      return newComment
    },
    async deleteComment(id) {
      store = store.filter((comment) => comment.id !== id)
    },
  }
}

/** 합성 루트: 지금은 메모리 어댑터만 선택한다. BaaS 활성화 시 이 값만 교체한다. */
export const commentsService: CommentsAdapter = createMemoryCommentsAdapter()
