import { ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { PostCard } from '@/components/home/PostCard'
import { SiteFooter } from '@/components/home/SiteFooter'
import { SiteHeader } from '@/components/home/SiteHeader'
import { categories } from '@/data/categories'
import { postsService } from '@/services/posts'

type SubjectHubProps = { subject: 'math' | 'science' }

export default function SubjectHub({ subject }: SubjectHubProps) {
  const isMath = subject === 'math'
  const subjectCategories = categories.filter((category) => isMath ? category.id === 'math' : category.id !== 'math')
  const allowedIds = new Set(subjectCategories.map((category) => category.id))
  const categoryLabelById = new Map(categories.map((category) => [category.id, category.label]))
  const { data: posts = [], isLoading } = useQuery({ queryKey: ['posts', 'all'], queryFn: postsService.listAll })
  const subjectPosts = [...posts].filter((post) => allowedIds.has(post.categoryId)).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  return (
    <div className="min-h-screen bg-surface text-ink">
      <SiteHeader />
      <main>
        <section className="border-b border-border-subtle bg-hero">
          <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
            <p className="text-sm font-bold text-brand">{isMath ? '숫자와 도형의 규칙' : '세상을 움직이는 원리'}</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-navy min-[375px]:text-4xl md:text-5xl">{isMath ? '수학을 이해하는 즐거움' : '과학으로 세상을 바라보기'}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-ink-muted md:text-lg">{isMath ? '답을 외우기보다 어떻게 그 답에 도착하는지 차근차근 살펴봐요.' : '익숙한 현상 속에 숨어 있는 물리·화학·생물·지구과학의 원리를 만나봐요.'}</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjectCategories.map((category) => (
              <Link key={category.id} to={`/category/${category.id}`} className="group flex min-h-28 items-center justify-between rounded-xl border border-border-subtle bg-white p-5 hover:border-brand/50">
                <span><strong className="block text-lg font-extrabold" style={{ color: category.accent }}>{category.label}</strong><span className="mt-1 block text-sm leading-6 text-ink-muted">{category.description}</span></span>
                <ArrowRight className="ml-4 h-5 w-5 shrink-0 text-ink-soft transition-transform group-hover:translate-x-1 group-hover:text-brand" />
              </Link>
            ))}
          </div>

          <header className="mb-8 mt-16 border-b border-border-subtle pb-5">
            <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-navy">{isMath ? '수학 이야기' : '과학 이야기'}</h2>
            <p className="mt-2 text-sm text-ink-muted">최근에 등록된 글부터 보여드려요.</p>
          </header>
          {isLoading ? <p className="empty-panel">글을 불러오는 중이에요...</p> : subjectPosts.length ? (
            <ul className="grid gap-5 lg:grid-cols-2">
              {subjectPosts.map((post) => <li key={post.id}><PostCard post={post} categoryLabel={categoryLabelById.get(post.categoryId) ?? post.categoryId} variant="row" /></li>)}
            </ul>
          ) : <p className="empty-panel">아직 등록된 글이 없습니다.</p>}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
