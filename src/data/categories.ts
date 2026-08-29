/**
 * 카테고리 표시용 데이터.
 *
 * 읽기 전용 목업으로, 실제 서비스에서는 운영진이 관리하는 카테고리 체계로 대체될 수 있다.
 * `accent`는 "주제별 개념 탐색" 섹션에서만 쓰는 카테고리 전용 강조색이며(흰 배경 대비
 * 4.5:1 이상 확보), 다른 화면의 기본 톤은 계속 브랜드 블루를 쓴다.
 */
export type Category = {
  id: string
  label: string
  description: string
  accent: string
}

export const categories: readonly Category[] = [
  {
    id: 'math',
    label: '수학',
    description: '수와 연산, 도형 속 규칙을 발견해요',
    accent: '#2563EB',
  },
  {
    id: 'physics',
    label: '물리',
    description: '힘과 에너지가 움직이는 원리를 살펴봐요',
    accent: '#7654C6',
  },
  {
    id: 'chemistry',
    label: '화학',
    description: '물질이 만나 달라지는 과정을 관찰해요',
    accent: '#D26A1B',
  },
  {
    id: 'biology',
    label: '생물',
    description: '세포부터 생태계까지 생명의 비밀을 찾아요',
    accent: '#278354',
  },
  {
    id: 'earth-science',
    label: '지구과학',
    description: '지구와 날씨, 더 넓은 우주를 탐험해요',
    accent: '#1885A8',
  },
  {
    id: 'other',
    label: '기타',
    description: '컴퓨터·공학·기술을 수과학으로 연결해요',
    accent: '#4F5E8B',
  },
]
