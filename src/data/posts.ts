/**
 * 글(포스트) 표시용 데이터.
 *
 * PRD의 "글(포스트)" 엔티티(제목/카테고리/본문내용/이미지/영상링크/작성자/추천여부)를 그대로
 * 반영하고, 정렬·표시에 필요한 viewCount·publishedAt을 더했다. `imageUrl`은 완성된 URL이
 * 아니라 `post-images.ts`가 소비하는 안정적인 식별자(seed)만 담는다.
 */
export type Post = {
  id: string
  title: string
  categoryId: string
  content: string
  imageUrl: string
  videoUrl: string | null
  author: string
  isRecommended: boolean
  viewCount: number
  publishedAt: string
}

export const posts: readonly Post[] = [
  {
    id: 'p01',
    title: '분수의 덧셈, 그림으로 이해하기',
    categoryId: 'math',
    content:
      '분모가 다른 분수를 더할 땐 먼저 분모를 같게 맞춰야 해요. 피자 조각을 그려서 크기를 맞춰보면 왜 통분이 필요한지 한눈에 이해할 수 있어요. 오늘은 색칠한 그림으로 1/2와 1/3을 더하는 과정을 차근차근 따라가 봅시다.',
    imageUrl: 'baaaam-math-fractions',
    videoUrl: null,
    author: '김도현 선생님',
    isRecommended: true,
    viewCount: 1204,
    publishedAt: '2024-05-02',
  },
  {
    id: 'p02',
    title: '구구단을 빨리 외우는 나만의 방법',
    categoryId: 'math',
    content:
      '구구단은 무작정 외우기보다 규칙을 찾으면 훨씬 쉬워져요. 9단은 손가락을 접어서 확인할 수 있고, 곱셈은 순서를 바꿔도 같다는 사실만 알아도 절반은 저절로 외워져요. 규칙을 찾는 눈으로 구구단표를 다시 살펴봐요.',
    imageUrl: 'baaaam-math-times-table',
    videoUrl: null,
    author: '박서연 선생님',
    isRecommended: false,
    viewCount: 862,
    publishedAt: '2024-04-18',
  },
  {
    id: 'p03',
    title: '도형의 넓이, 쪼개서 구하기',
    categoryId: 'math',
    content:
      '복잡하게 생긴 도형도 삼각형이나 직사각형으로 쪼개면 넓이를 쉽게 구할 수 있어요. 오늘은 계단 모양 도형을 세 조각으로 나눠서 넓이를 더하는 방법을 알아보고, 왜 쪼개도 전체 넓이가 변하지 않는지 확인해요.',
    imageUrl: 'baaaam-math-area',
    videoUrl: null,
    author: '김도현 선생님',
    isRecommended: false,
    viewCount: 531,
    publishedAt: '2024-03-22',
  },
  {
    id: 'p04',
    title: '빛은 왜 무지개색으로 나뉠까?',
    categoryId: 'physics',
    content:
      '햇빛은 사실 여러 색이 섞인 빛이에요. 프리즘을 통과하면 색마다 꺾이는 정도가 달라서 무지개처럼 펼쳐져요. 빗방울도 작은 프리즘 역할을 해서 비가 갠 뒤 하늘에 무지개가 뜨는 거예요.',
    imageUrl: 'baaaam-physics-rainbow',
    videoUrl: 'https://www.youtube-nocookie.com/embed/lVDSvGz4iJs',
    author: '이하준 선생님',
    isRecommended: true,
    viewCount: 1532,
    publishedAt: '2024-05-10',
  },
  {
    id: 'p05',
    title: '자석은 왜 서로 붙거나 밀어낼까?',
    categoryId: 'physics',
    content:
      '자석에는 N극과 S극이 있는데, 다른 극끼리는 끌어당기고 같은 극끼리는 밀어내요. 이 힘은 눈에 보이지 않는 자기장 때문에 생기는데, 철가루를 뿌려보면 그 모양을 직접 볼 수 있어요.',
    imageUrl: 'baaaam-physics-magnet',
    videoUrl: null,
    author: '이하준 선생님',
    isRecommended: false,
    viewCount: 947,
    publishedAt: '2024-04-05',
  },
  {
    id: 'p06',
    title: '소리는 어떻게 귀까지 전달될까?',
    categoryId: 'physics',
    content:
      '소리는 공기 알갱이가 떨리면서 옆으로 전달되는 파동이에요. 실팩화통 실험을 해보면 실이 떨릴 때만 소리가 전달된다는 걸 느낄 수 있어요. 진공 속에서는 공기가 없어서 소리가 전혀 전달되지 않아요.',
    imageUrl: 'baaaam-physics-sound',
    videoUrl: null,
    author: '박서연 선생님',
    isRecommended: false,
    viewCount: 615,
    publishedAt: '2024-03-14',
  },
  {
    id: 'p07',
    title: '물이 얼음이 되면 왜 부피가 늘어날까?',
    categoryId: 'chemistry',
    content:
      '대부분의 물질은 얼면 부피가 줄지만 물은 반대예요. 물 분자가 얼면서 규칙적인 육각형 구조로 배열돼 오히려 사이 공간이 늘어나기 때문이에요. 그래서 얼음이 물에 뜨고, 겨울철 수도관이 얼면 터지기도 해요.',
    imageUrl: 'baaaam-chem-ice',
    videoUrl: null,
    author: '박서연 선생님',
    isRecommended: false,
    viewCount: 733,
    publishedAt: '2024-04-27',
  },
  {
    id: 'p08',
    title: '베이킹소다와 식초, 거품의 비밀',
    categoryId: 'chemistry',
    content:
      '베이킹소다와 식초를 섞으면 이산화탄소 기체가 만들어지면서 거품이 부글부글 올라와요. 두 물질이 만나 새로운 물질로 바뀌는 화학 반응의 대표적인 예로, 화산 모형 실험에도 자주 쓰여요.',
    imageUrl: 'baaaam-chem-baking-soda',
    videoUrl: 'https://www.youtube-nocookie.com/embed/uokHHArhQjc',
    author: '김도현 선생님',
    isRecommended: true,
    viewCount: 1108,
    publishedAt: '2024-05-06',
  },
  {
    id: 'p09',
    title: '식물도 숨을 쉴까? 광합성 이야기',
    categoryId: 'biology',
    content:
      '식물은 햇빛을 받아 이산화탄소와 물로 양분을 만드는 광합성을 해요. 이 과정에서 우리가 숨 쉬는 데 필요한 산소가 나와요. 그런데 밤에는 식물도 우리처럼 산소를 마시고 이산화탄소를 내보내는 호흡을 해요.',
    imageUrl: 'baaaam-bio-photosynthesis',
    videoUrl: 'https://www.youtube-nocookie.com/embed/D1Ymc311XS8',
    author: '이하준 선생님',
    isRecommended: false,
    viewCount: 890,
    publishedAt: '2024-04-12',
  },
  {
    id: 'p10',
    title: '우리 몸속 세포는 몇 개일까?',
    categoryId: 'biology',
    content:
      '우리 몸은 약 37조 개나 되는 아주 작은 세포로 이루어져 있어요. 세포마다 하는 일이 달라서 피부 세포, 근육 세포, 신경 세포처럼 모양과 역할이 제각각이에요. 세포 하나하나가 모여 우리 몸 전체를 이루는 거예요.',
    imageUrl: 'baaaam-bio-cell',
    videoUrl: null,
    author: '박서연 선생님',
    isRecommended: false,
    viewCount: 704,
    publishedAt: '2024-03-29',
  },
  {
    id: 'p11',
    title: '지진은 왜 일어날까?',
    categoryId: 'earth-science',
    content:
      '땅속 커다란 암반들은 조금씩 움직이는 판 위에 놓여 있어요. 판과 판이 부딪히다 쌓인 힘이 한꺼번에 풀리면서 땅이 흔들리는 게 지진이에요. 우리나라도 판의 경계 근처에 있어서 가끔 약한 지진이 발생해요.',
    imageUrl: 'baaaam-earth-quake',
    videoUrl: null,
    author: '이하준 선생님',
    isRecommended: false,
    viewCount: 668,
    publishedAt: '2024-03-08',
  },
  {
    id: 'p12',
    title: '태풍은 어떻게 이름이 붙을까?',
    categoryId: 'earth-science',
    content:
      '태풍은 따뜻한 바닷물이 증발하며 만든 수증기가 소용돌이치는 거대한 구름 덩어리예요. 태풍 이름은 아시아 14개국이 미리 정해둔 이름을 순서대로 돌아가며 사용하는데, 우리나라가 제안한 이름도 여럿 들어 있어요.',
    imageUrl: 'baaaam-earth-typhoon',
    videoUrl: 'https://www.youtube-nocookie.com/embed/wPDoIrGUrEc',
    author: '김도현 선생님',
    isRecommended: true,
    viewCount: 1341,
    publishedAt: '2024-05-14',
  },
]
