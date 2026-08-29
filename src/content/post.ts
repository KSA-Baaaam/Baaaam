/**
 * 글 상세 화면 전용 편집성 콘텐츠.
 *
 * `Post`/`Comment` 데이터 타입과 무관한 문자열 상수만 export한다.
 */
export const postContent = {
  detailLoading: '글을 불러오는 중이에요...',
  notFound: {
    title: '요청하신 글을 찾을 수 없어요',
    description: '주소가 바뀌었거나 삭제된 글일 수 있어요. 홈에서 다른 글을 찾아보세요.',
    homeLink: '홈으로 돌아가기',
  },
  backToCategorySuffix: '목록으로 돌아가기',
  comments: {
    eyebrow: '함께 나누는 이야기',
    title: '댓글',
    loading: '댓글을 불러오는 중이에요...',
    loadError: '댓글을 불러오지 못했어요. 잠시 후 새로고침 해주세요.',
    empty: '아직 댓글이 없어요. 첫 질문을 남겨보세요!',
    questionBadge: '질문',
  },
  question: {
    eyebrow: '궁금한 점이 있나요?',
    title: '질문 남기기',
    description: '이름과 궁금한 내용을 적어주시면 운영진 선생님이 댓글로 답해드려요.',
    nameLabel: '이름',
    namePlaceholder: '이름을 입력해주세요',
    contentLabel: '질문 내용',
    contentPlaceholder: '궁금한 점을 자유롭게 적어주세요',
    submit: '질문 남기기',
    submitting: '등록하는 중...',
    successToastTitle: '질문이 등록되었어요',
    successToastDescription: '운영진 선생님이 곧 답변을 남겨드릴게요.',
    errorInline: '질문 등록에 실패했어요. 잠시 후 다시 시도해주세요.',
    validation: {
      author: '이름을 입력해주세요.',
      content: '질문 내용을 입력해주세요.',
    },
  },
}
