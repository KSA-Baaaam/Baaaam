/**
 * 사이트 공용 문구(브랜드/헤더/푸터) + 홈 화면 전용 편집성 콘텐츠(마케팅 카피, 섹션 라벨).
 *
 * 데이터가 아니라 문구이므로 표시용 데이터 모듈(`src/data`)이 아닌 여기에 둔다. `brand`/
 * `header`/`footer`는 `SiteHeader`/`SiteFooter`가 여러 화면에서 공유해 쓴다.
 */
export const homeContent = {
  brand: {
    name: 'BAAAAM',
    tagline: '중학생을 위한 수과학 블로그',
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
    eyebrow: '중학생을 위한 수과학 블로그',
    headlineLead: '수학과 과학,',
    headlineAccent: '쉽고 재미있게!',
    sub: '어려운 개념도 학생의 눈높이에서 차근차근.\nBAAAAM과 함께 “왜 그럴까?”를 이해해봐요.',
  },
  topics: {
    eyebrow: '자신이 좋아하는 분야의 글을 찾아보세요!',
    title: '주제별로 알아보기',
    description: '관심 있는 분야를 탐색해보세요!',
    cta: '개념 보러가기',
  },
  grades: {
    eyebrow: '나에게 맞는 글부터 차근차근 읽어보세요!',
    title: '학년별로 알아보기',
    description: '현재 학년을 선택해 알맞은 글을 찾아보세요.',
  },
  latest: {
    allCategory: '전체',
    empty: '아직 이 주제의 글이 없어요. 다른 카테고리를 살펴보세요.',
    loading: '최신 글을 불러오는 중이에요...',
  },
  footer: {
    copyright: '© 2026 한국과학영재학교 BAAAAM 연구회. ALL RIGHTS RESERVED. Created by 26 박현택',
    contactEmail: '26-048@ksa.hs.kr',
    schoolLinkLabel: 'KAIST 부설 한국과학영재학교 바로가기',
    schoolUrl: 'https://ksa.hs.kr/',
  },
}
