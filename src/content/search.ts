/**
 * 검색 결과 화면 + 헤더 검색창 전용 편집성 콘텐츠.
 *
 * `Post`/`Category` 데이터 타입과 무관한 문자열 상수만 export한다. 동적으로 들어가는 검색어·
 * 건수는 화면 컴포넌트에서 조합한다.
 */
export const searchContent = {
  inputLabel: '검색',
  inputPlaceholder: '궁금한 개념을 검색해보세요!',
  submitLabel: '검색',
  eyebrow: '검색',
  resultsLabel: '검색 결과',
  countUnit: '건',
  emptyQuery: {
    title: '어떤 이야기가 궁금하세요?',
    description: '제목, 본문, 카테고리로 검색할 수 있어요. 검색어를 입력하거나 아래에서 살펴보세요.',
  },
  noResults: {
    titleSuffix: '에 대한 결과를 찾지 못했어요',
    description: '철자가 정확한지 확인하거나 다른 검색어로 다시 시도해보세요.',
  },
  suggestions: {
    recommendedTitle: '이런 글은 어때요?',
    categoryTitle: '카테고리로 둘러보기',
    allCategoryChip: '전체',
  },
  loadMore: '더 보기',
  allLoaded: '모든 결과를 다 보여드렸어요',
  loading: '검색 결과를 불러오는 중이에요...',
}
