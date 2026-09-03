import { CalendarDays, ChevronRight, Clock3, Eye } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import brandMascot from '@/assets/brand-mascot.png'
import { PostCard } from '@/components/home/PostCard'
import { SiteFooter } from '@/components/home/SiteFooter'
import { SiteHeader } from '@/components/home/SiteHeader'
import { CommentList } from '@/components/post/CommentList'
import { PostBody } from '@/components/post/PostBody'
import { QuestionForm } from '@/components/post/QuestionForm'
import { ReadingProgress } from '@/components/post/ReadingProgress'
import { ToastProvider, ToastViewport } from '@/components/ui'
import { postContent } from '@/content/post'
import { categories } from '@/data/categories'
import { koDateFormatter, koNumberFormatter } from '@/lib/format'
import { postsService } from '@/services/posts'

const categoryLabelById = new Map(categories.map((category) => [category.id, category.label]))

type TocItem = { id: string; label: string }

function ArticleToc({ items, mobile = false }: { items: TocItem[]; mobile?: boolean }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')

  useEffect(() => {
    const elements = items.map((item) => document.getElementById(item.id)).filter((element): element is HTMLElement => Boolean(element))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-18% 0px -68% 0px', threshold: 0 },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [items])

  const list = (
    <ol className="space-y-1.5">
      {items.map((item, index) => (
        <li key={item.id}>
          <a href={`#${item.id}`} className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold ${activeId === item.id ? 'bg-brand-soft text-brand' : 'text-ink-muted hover:text-navy'}`}>
            <span className="text-xs text-ink-soft">0{index + 1}</span>{item.label}
          </a>
        </li>
      ))}
    </ol>
  )

  if (mobile) return <details className="mt-7 rounded-xl border border-border-subtle bg-white p-4 lg:hidden"><summary className="cursor-pointer text-sm font-extrabold text-navy">이 글의 목차</summary><div className="mt-3">{list}</div></details>
  return <aside className="sticky top-28 hidden self-start lg:block"><p className="mb-3 px-2 text-xs font-black tracking-[0.12em] text-ink-soft">CONTENTS</p>{list}</aside>
}

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>()
  const { data: post, isLoading } = useQuery({ queryKey: ['posts', 'detail', postId], queryFn: () => postsService.getById(postId as string), enabled: Boolean(postId) })
  const { data: allPosts = [] } = useQuery({ queryKey: ['posts', 'all'], queryFn: postsService.listAll })
  const relatedPosts = useMemo(() => allPosts.filter((candidate) => candidate.id !== post?.id && candidate.categoryId === post?.categoryId).slice(0, 3), [allPosts, post])

  if (isLoading) {
    return <div className="min-h-screen bg-surface text-ink"><SiteHeader /><main className="mx-auto max-w-2xl px-6 py-24 text-center"><p className="text-sm text-ink-muted">{postContent.detailLoading}</p></main><SiteFooter /></div>
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-surface text-ink"><SiteHeader /><main className="mx-auto max-w-2xl px-5 py-20 text-center"><img src={brandMascot} alt="" width={100} height={96} className="mx-auto h-24 w-24 object-contain" /><h1 className="mt-5 text-2xl font-extrabold text-navy">{postContent.notFound.title}</h1><p className="mt-3 text-sm leading-6 text-ink-muted">{postContent.notFound.description}</p><Link to="/" className="mt-7 inline-flex min-h-11 items-center rounded-lg bg-brand px-5 text-sm font-bold text-white">{postContent.notFound.homeLink}</Link></main><SiteFooter /></div>
    )
  }

  const categoryLabel = categoryLabelById.get(post.categoryId) ?? post.categoryId
  const readingMinutes = Math.max(2, Math.ceil(post.content.replace(/\s/g, '').length / 250))
  const tocItems: TocItem[] = [
    { id: 'concept', label: '핵심 개념' },
    ...(post.content.match(/[^.!?]+[.!?]?/g)?.length ?? 0) > 1 ? [{ id: 'think', label: '쉽게 생각해보기' }] : [],
    ...(post.content.match(/[^.!?]+[.!?]?/g)?.length ?? 0) > 3 ? [{ id: 'details', label: '왜 그런 걸까요?' }] : [],
    ...(post.videoUrl ? [{ id: 'video', label: '영상으로 확인하기' }] : []),
    { id: 'summary', label: '한 줄 정리' },
  ]

  return (
    <ToastProvider>
      <div className="min-h-screen bg-surface text-ink">
        <SiteHeader />
        <ReadingProgress />
        <main>
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-10 min-[375px]:px-5 md:px-8 md:py-16 lg:grid-cols-[minmax(0,760px)_220px] lg:justify-center">
            <article id="article-content" className="min-w-0">
              <nav aria-label="이동 경로" className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-ink-soft">
                <Link to="/" className="hover:text-brand">홈</Link><ChevronRight className="h-3.5 w-3.5" /><Link to={`/category/${post.categoryId}`} className="hover:text-brand">{categoryLabel}</Link>
              </nav>
              <p className="mt-8 text-sm font-extrabold text-brand">{categoryLabel}</p>
              <h1 className="mt-3 text-[1.85rem] font-extrabold leading-[1.24] tracking-[-0.045em] text-navy [overflow-wrap:anywhere] min-[375px]:text-[2.2rem] sm:text-5xl">{post.title}</h1>
              <p className="mt-5 text-base leading-8 text-ink-muted sm:text-lg">{post.content.split('. ')[0]}.</p>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border-subtle pb-8 text-sm text-ink-soft">
                <span className="font-bold text-navy">{post.author}</span>
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{koDateFormatter.format(new Date(post.publishedAt))}</span>
                <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" />약 {readingMinutes}분</span>
                <span className="inline-flex items-center gap-1.5"><Eye className="h-4 w-4" />{koNumberFormatter.format(post.viewCount)}</span>
              </div>
              <ArticleToc items={tocItems} mobile />
              <PostBody post={post} />
              <div className="mt-12 border-t border-border-subtle pt-6"><Link to={`/category/${post.categoryId}`} className="text-sm font-bold text-brand hover:text-brand-strong">← {categoryLabel} {postContent.backToCategorySuffix}</Link></div>
            </article>
            <ArticleToc items={tocItems} />
          </div>

          {relatedPosts.length ? (
            <section className="border-y border-border-subtle bg-section py-12 sm:py-16">
              <div className="mx-auto max-w-7xl px-4 min-[375px]:px-5 md:px-8"><h2 className="text-2xl font-extrabold tracking-[-0.03em] text-navy">다음에는 이것도 알아보세요</h2><ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{relatedPosts.map((related) => <li key={related.id}><PostCard post={related} categoryLabel={categoryLabel} /></li>)}</ul></div>
            </section>
          ) : null}

          <div className="mx-auto flex max-w-3xl flex-col gap-12 px-4 py-12 min-[375px]:px-5 sm:py-16 md:px-8 md:py-20"><CommentList postId={post.id} /><QuestionForm postId={post.id} /></div>
        </main>
        <SiteFooter />
      </div>
      <ToastViewport className="fixed bottom-0 right-0 z-50 flex w-full max-w-sm flex-col gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] outline-none sm:p-6" />
    </ToastProvider>
  )
}
