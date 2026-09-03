import { GradeExplore } from '@/components/home/GradeExplore'
import { Hero } from '@/components/home/Hero'
import { LatestSection } from '@/components/home/LatestSection'
import { SiteFooter } from '@/components/home/SiteFooter'
import { SiteHeader } from '@/components/home/SiteHeader'
import { TopicExplore } from '@/components/home/TopicExplore'

/**
 * 홈 화면(단일 페이지). 히어로 다음 주제별 탐색, 학년별 탐색, 카테고리 필터를
 * 포함한 글 목록(페이지 탐색) 순으로 보여준다.
 */
export default function Home() {
  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <Hero />
        <TopicExplore />
        <GradeExplore />
        <LatestSection />
      </main>
      <SiteFooter />
    </div>
  )
}
