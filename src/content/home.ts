/**
 * 사이트 공용 문구(브랜드/헤더/푸터) + 홈 화면 전용 편집성 콘텐츠(마케팅 카피, 섹션 라벨).
 *
 * 데이터가 아니라 문구이므로 표시용 데이터 모듈(`src/data`)이 아닌 여기에 둔다. `brand`/
 * `header`/`footer`는 `SiteHeader`/`SiteFooter`가 여러 화면에서 공유해 쓴다.
 */
export const homeContent = {
  brand: {
    name: 'Baaaam',
    tagline: '초중학생을 위한 수과학 이야기',
  },
  header: {
    navHome: '홈',
    navMath: '수학',
    navScience: '과학',
    navAbout: '소개',
    searchLabel: '사이트 검색',
    menuLabel: '메뉴 열기',
    loginCta: '로그인',
  },
  hero: {
    eyebrow: '초·중학생을 위한 수과학 블로그',
    headlineLead: '수학과 과학,',
    headlineAccent: '쉽고 재미있게!',
    sub: '어려운 개념도 학생의 눈높이에서 차근차근. Baaaam과 함께 “왜 그럴까?”를 이해해봐요.',
    scrollCta: '주제부터 골라보기',
  },
  topics: {
    eyebrow: '무엇부터 알아볼까요?',
    title: '주제별 개념 탐색',
    description: '관심 있는 분야에서 궁금했던 개념을 찾아보세요.',
    cta: '개념 보러가기',
  },
  recommended: {
    eyebrow: 'Baaaam의 선택',
    title: '이 글부터 읽어보세요',
    description: '처음 읽기 좋은 이야기를 골랐어요. 하나씩 천천히 이해해봐요.',
    badge: '먼저 읽기',
    loading: '추천 글을 불러오는 중이에요...',
  },
  latest: {
    eyebrow: '새로 도착한 이야기',
    title: '최근에 올라온 글',
    description: '부담 없는 짧은 글부터 한 편씩 읽어보세요.',
    allCategory: '전체',
    empty: '아직 이 주제의 글이 없어요. 다른 카테고리를 살펴보세요.',
    loading: '최신 글을 불러오는 중이에요...',
  },
  footer: {
    organization: '본 사이트는 한국과학영재학교 교내 연구회 Baaaam 단체의 웹사이트 입니다.',
    copyright: '© 2026 한국과학영재학교 Baaaam 연구회. ALL RIGHTS RESERVED. Created by 26 박현택',
    schoolLinkLabel: 'KAIST 부설 한국과학영재학교 바로가기',
    schoolUrl: 'https://ksa.hs.kr/',
  },
}
