import { Hero } from '@/components/home/Hero'
import { LatestSection } from '@/components/home/LatestSection'
import { RecommendedSection } from '@/components/home/RecommendedSection'
import { SiteFooter } from '@/components/home/SiteFooter'
import { SiteHeader } from '@/components/home/SiteHeader'
import { TopicExplore } from '@/components/home/TopicExplore'

/**
 * 홈 화면(단일 페이지). 히어로 다음 주제별 개념 탐색, 추천 글 목록, 전체 기준 최신 글
 * 목록(페이지 탐색) 순으로 보여주고, 카테고리 바로가기는 `/category/:categoryId` 화면으로
 * 이동하는 링크로 동작한다.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <SiteHeader />
      <main>
        <Hero />
        <TopicExplore />
        <RecommendedSection />
        <LatestSection />
      </main>
      <SiteFooter />
    </div>
  )
}
