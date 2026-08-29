import type { Post } from './posts'

/**
 * 외부 이미지 URL 구성 유틸.
 *
 * `picsum.photos`는 `/seed/<seed>/<width>/<height>` 경로에 실제로 존재하는 크기의 이미지를
 * 반환하는 것을 확인했다(원본을 그대로 내려받는 방식이 아니라 요청한 크기로 생성된다).
 * 렌더 지점은 카드가 그려지는 실제 폭의 약 2배를 `width`로 넘겨야 한다. 이 모듈은 URL 조합만
 * 담당하고, 폭 결정은 항상 호출하는 컴포넌트 쪽 책임으로 둔다.
 */
const PICSUM_BASE = 'https://picsum.photos/seed'

/** 글 카드 썸네일에 사용하는 4:3 비율 이미지 URL을 만든다. */
export function buildPostImageUrl(post: Post, width: number): string {
  const height = Math.round(width * 0.75)
  return `${PICSUM_BASE}/${encodeURIComponent(post.imageUrl)}/${width}/${height}`
}

/** 주어진 렌더 폭에 맞춰 2배 요청 폭과 이미지 높이를 함께 계산한다. */
export function getPostImageDimensions(renderWidth: number) {
  const requestWidth = renderWidth * 2
  const requestHeight = Math.round(requestWidth * 0.75)
  return { requestWidth, requestHeight, renderWidth, renderHeight: Math.round(renderWidth * 0.75) }
}
