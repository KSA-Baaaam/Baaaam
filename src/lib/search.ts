import type { Category } from '@/data/categories'
import type { Post } from '@/types/blog'

/**
 * 검색(core). `query`를 제목·본문·카테고리 라벨에 대해 부분 문자열로 매칭한다.
 *
 * 제목에 매칭된 글을 본문에만 매칭된 글보다 우선 정렬하고, 같은 그룹 안에서는 최신순으로
 * 정렬한다. 빈 검색어는 빈 배열을 반환한다(빈 검색어 안내는 화면이 별도로 처리).
 */
export function searchPosts(
  query: string,
  posts: readonly Post[],
  categories: readonly Category[],
): Post[] {
  const trimmedQuery = query.trim().toLowerCase()
  if (!trimmedQuery) {
    return []
  }

  const categoryLabelById = new Map(categories.map((category) => [category.id, category.label]))
  const matchesTitle = (post: Post) => post.title.toLowerCase().includes(trimmedQuery)
  const matchesAnyField = (post: Post) => {
    const categoryLabel = categoryLabelById.get(post.categoryId) ?? ''
    return (
      matchesTitle(post) ||
      post.content.toLowerCase().includes(trimmedQuery) ||
      categoryLabel.toLowerCase().includes(trimmedQuery)
    )
  }

  return posts
    .filter(matchesAnyField)
    .sort((a, b) => {
      const titleRank = Number(matchesTitle(b)) - Number(matchesTitle(a))
      if (titleRank !== 0) {
        return titleRank
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
}
