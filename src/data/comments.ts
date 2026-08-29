/**
 * 댓글/질문 표시용 시드 데이터.
 *
 * `src/services/comments.ts`의 메모리 어댑터가 이 배열을 복제해 초기 상태로 사용한다.
 * 일부 글에만 2~3건씩 배분했고, 학생의 질문(`isQuestion: true`)과 운영진의 답변을 흉내 낸
 * 일반 댓글(`isQuestion: false`)을 섞어 실제 서비스처럼 보이도록 구성했다. `inReplyTo`는
 * 답변 댓글이 어떤 질문을 가리키는지 연결하며, 질문이 아니거나 아직 답변되지 않은 질문은
 * `null`이다.
 */
export type Comment = {
  id: string
  postId: string
  author: string
  content: string
  createdAt: string
  isQuestion: boolean
  inReplyTo: string | null
}

export const comments: readonly Comment[] = [
  {
    id: 'c01',
    postId: 'p01',
    author: '지민',
    content: '선생님 그림으로 보니까 훨씬 이해가 잘 돼요! 근데 분모가 다른 대분수도 이렇게 그림으로 풀 수 있나요?',
    createdAt: '2024-05-03T09:12:00',
    isQuestion: true,
    inReplyTo: null,
  },
  {
    id: 'c02',
    postId: 'p01',
    author: '김도현 선생님',
    content:
      '네! 대분수도 먼저 자연수와 분수 부분을 나누고, 분수 부분만 통분해서 더하면 똑같은 방법으로 풀 수 있어요. 다음 글에서 자세히 다뤄볼게요.',
    createdAt: '2024-05-03T14:40:00',
    isQuestion: false,
    inReplyTo: 'c01',
  },
  {
    id: 'c03',
    postId: 'p01',
    author: '서준',
    content: '피자 그림 덕분에 통분이 왜 필요한지 완전히 이해했어요!',
    createdAt: '2024-05-04T08:05:00',
    isQuestion: false,
    inReplyTo: null,
  },
  {
    id: 'c04',
    postId: 'p04',
    author: '하은',
    content: '프리즘이 없으면 집에서도 무지개를 만들 수 있는 방법이 있을까요?',
    createdAt: '2024-05-11T10:02:00',
    isQuestion: true,
    inReplyTo: null,
  },
  {
    id: 'c05',
    postId: 'p04',
    author: '이하준 선생님',
    content:
      '네, 맑은 날 물뿌리개로 물을 뿌리고 해를 등지고 서면 작은 무지개를 볼 수 있어요. 물방울이 작은 프리즘 역할을 해주거든요!',
    createdAt: '2024-05-11T16:20:00',
    isQuestion: false,
    inReplyTo: 'c04',
  },
  {
    id: 'c06',
    postId: 'p05',
    author: '예린',
    content: '그럼 지구도 자석처럼 N극과 S극이 있다는 게 사실인가요?',
    createdAt: '2024-04-06T10:00:00',
    isQuestion: true,
    inReplyTo: null,
  },
  {
    id: 'c07',
    postId: 'p05',
    author: '이하준 선생님',
    content: '맞아요! 지구는 커다란 자석이라서 나침반이 항상 북쪽을 가리킬 수 있는 거예요.',
    createdAt: '2024-04-06T15:45:00',
    isQuestion: false,
    inReplyTo: 'c06',
  },
  {
    id: 'c08',
    postId: 'p08',
    author: '민준',
    content: '집에서 화산 모형을 만들 때 색소를 넣어도 반응이 똑같이 일어나나요?',
    createdAt: '2024-05-07T11:30:00',
    isQuestion: true,
    inReplyTo: null,
  },
  {
    id: 'c09',
    postId: 'p08',
    author: '김도현 선생님',
    content:
      '네! 색소는 반응 자체에는 영향을 주지 않고 색만 입혀줘요. 빨간 색소를 넣으면 진짜 용암처럼 보여서 실험할 때 인기가 많아요.',
    createdAt: '2024-05-07T18:00:00',
    isQuestion: false,
    inReplyTo: 'c08',
  },
  {
    id: 'c10',
    postId: 'p08',
    author: '소율',
    content: '학교 과학의 날에 이 실험을 해봤는데 정말 신기했어요!',
    createdAt: '2024-05-08T09:15:00',
    isQuestion: false,
    inReplyTo: null,
  },
  {
    id: 'c11',
    postId: 'p11',
    author: '시우',
    content: '지진이 일어나기 전에 미리 알 수 있는 방법은 없나요?',
    createdAt: '2024-03-09T09:20:00',
    isQuestion: true,
    inReplyTo: null,
  },
  {
    id: 'c12',
    postId: 'p11',
    author: '이하준 선생님',
    content:
      '아직 정확한 예측은 어렵지만, 지진 감지 센서로 흔들림이 시작되자마자 몇 초라도 빨리 경보를 보낼 수는 있어요.',
    createdAt: '2024-03-09T17:05:00',
    isQuestion: false,
    inReplyTo: 'c11',
  },
  {
    id: 'c13',
    postId: 'p12',
    author: '도윤',
    content: '태풍이랑 허리케인은 다른 건가요? 이름만 다른 건지 궁금해요.',
    createdAt: '2024-05-15T09:40:00',
    isQuestion: true,
    inReplyTo: null,
  },
  {
    id: 'c14',
    postId: 'p12',
    author: '김도현 선생님',
    content:
      '좋은 질문이에요! 발생하는 바다 위치에 따라 이름이 달라요. 태평양 서쪽은 태풍, 대서양·동태평양은 허리케인, 인도양 쪽은 사이클론이라고 불러요. 사실 다 같은 현상이랍니다.',
    createdAt: '2024-05-15T13:10:00',
    isQuestion: false,
    inReplyTo: 'c13',
  },
]
