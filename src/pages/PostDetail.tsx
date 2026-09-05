import { CalendarDays, ChevronRight, FileQuestion, Pencil } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { PostCard } from '@/components/home/PostCard'
import { SiteFooter } from '@/components/home/SiteFooter'
import { SiteHeader } from '@/components/home/SiteHeader'
import { CommentSection } from '@/components/post/CommentSection'
import { PostBody } from '@/components/post/PostBody'
import { ReadingProgress } from '@/components/post/ReadingProgress'
import { ToastProvider, ToastViewport } from '@/components/ui'
import { postContent } from '@/content/post'
import { categories } from '@/data/categories'
import { koDateFormatter } from '@/lib/format'
import { postsService } from '@/services/posts'
import { useOperatorSession } from '@/services/session'
import type { JSONContent } from '@tiptap/core'

const categoryLabelById = new Map(categories.map((category) => [category.id, category.label]))

type TocItem = { id: string; label: string }

function nodeText(node: JSONContent): string {
  return [node.text ?? '', ...(node.content?.map(nodeText) ?? [])].join('')
}

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
  const { postId, slug, postRef } = useParams<{ postId: string; slug: string; postRef: string }>()
  const { currentStaff } = useOperatorSession()
  const referencedId = postRef?.match(/^id=(\d+)$/)?.[1]
  const identity = slug ?? referencedId ?? postId
  const { data: post, isLoading } = useQuery({ queryKey: ['posts', 'detail', slug ? 'slug' : 'id', identity], queryFn: () => slug ? postsService.getBySlug(slug) : postsService.getById(identity as string), enabled: Boolean(identity) })
  const { data: allPosts = [] } = useQuery({ queryKey: ['posts', 'all'], queryFn: postsService.listAll })
  const relatedPosts = useMemo(() => allPosts.filter((candidate) => candidate.id !== post?.id && candidate.categoryId === post?.categoryId).slice(0, 3), [allPosts, post])

  if (isLoading) {
    return <div className="site-page"><SiteHeader /><main className="site-main mx-auto w-full max-w-2xl px-6 py-20 text-center"><p className="text-sm text-ink-muted">{postContent.detailLoading}</p></main><SiteFooter /></div>
  }

  if (!post) {
    return (
      <div className="site-page"><SiteHeader /><main className="site-main mx-auto w-full max-w-2xl px-5 py-16 text-center"><FileQuestion className="mx-auto h-11 w-11 text-brand" strokeWidth={1.6} aria-hidden="true" /><h1 className="mt-5 text-2xl font-extrabold text-navy">{postContent.notFound.title}</h1><p className="mt-3 text-sm leading-6 text-ink-muted">{postContent.notFound.description}</p><Link to="/" className="mt-7 inline-flex min-h-11 items-center rounded-lg bg-brand px-5 text-sm font-bold text-white">{postContent.notFound.homeLink}</Link></main><SiteFooter /></div>
    )
  }

  if (postRef !== `id=${post.id}`) return <Navigate to={`/id=${post.id}`} replace />

  const categoryLabel = categoryLabelById.get(post.categoryId) ?? post.categoryId
  const tocItems: TocItem[] = (post.content.content ?? []).flatMap((node, index) => node.type === 'heading' ? [{ id: `section-${index}`, label: nodeText(node) || `소제목 ${index + 1}` }] : [])
  const canEdit = Boolean(currentStaff && currentStaff.role !== 'general' && (currentStaff.role === 'admin' || currentStaff.role === 'developer' || currentStaff.id === post.authorId))

  return (
    <ToastProvider>
      <div className="site-page">
        <SiteHeader />
        <ReadingProgress />
        <main className="site-main">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-10 min-[375px]:px-5 md:px-8 md:py-16 lg:grid-cols-[minmax(0,760px)_220px] lg:justify-center">
            <article id="article-content" className="min-w-0">
              <nav aria-label="이동 경로" className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-ink-soft">
                <Link to="/" className="hover:text-brand">홈</Link><ChevronRight className="h-3.5 w-3.5" /><Link to={`/category/${post.categoryId}`} className="hover:text-brand">{categoryLabel}</Link>
              </nav>
              <p className="mt-8 text-sm font-extrabold text-brand">{categoryLabel}</p>
              <h1 className="mt-3 text-[1.85rem] font-extrabold leading-[1.24] tracking-[-0.045em] text-navy [overflow-wrap:anywhere] min-[375px]:text-[2.2rem] sm:text-5xl">{post.title}</h1>
              {post.subtitle ? <p className="mt-5 text-base leading-8 text-ink-muted sm:text-lg">{post.subtitle}</p> : null}
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border-subtle pb-8 text-sm text-ink-soft">
                <span className="font-bold text-navy">{post.author}</span>
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{koDateFormatter.format(new Date(post.publishedAt ?? post.updatedAt))}</span>
                {canEdit ? <Link to={`/write/${post.id}`} className="ml-auto inline-flex items-center gap-1.5 font-bold text-brand hover:text-brand-strong"><Pencil className="h-4 w-4" />수정</Link> : null}
              </div>
              {tocItems.length ? <ArticleToc items={tocItems} mobile /> : null}
              {post.imageUrl ? <img src={post.imageUrl} alt="" className="mt-10 aspect-[16/8] w-full rounded-xl object-cover" /> : null}
              <PostBody post={post} />
              {post.tags.length ? <ul aria-label="태그" className="mt-10 flex flex-wrap gap-2">{post.tags.map((tag) => <li key={tag} className="rounded-full bg-brand-soft px-3 py-1.5 text-xs font-bold text-brand-strong">#{tag}</li>)}</ul> : null}
              <div className="mt-12 border-t border-border-subtle pt-6"><Link to={`/category/${post.categoryId}`} className="text-sm font-bold text-brand hover:text-brand-strong">← {categoryLabel} {postContent.backToCategorySuffix}</Link></div>
            </article>
            {tocItems.length ? <ArticleToc items={tocItems} /> : <div />}
          </div>

          {relatedPosts.length ? (
            <section className="border-y border-border-subtle bg-section py-12 sm:py-16">
              <div className="mx-auto max-w-7xl px-4 min-[375px]:px-5 md:px-8"><h2 className="text-2xl font-extrabold tracking-[-0.03em] text-navy">다음에는 이것도 알아보세요</h2><ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{relatedPosts.map((related) => <li key={related.id}><PostCard post={related} categoryLabel={categoryLabel} /></li>)}</ul></div>
            </section>
          ) : null}

          <div className="mx-auto max-w-4xl px-4 py-12 min-[375px]:px-5 sm:py-14 md:px-8 md:py-16"><CommentSection postId={post.id} /></div>
        </main>
        <SiteFooter />
      </div>
      <ToastViewport className="fixed bottom-0 right-0 z-50 flex w-full max-w-sm flex-col gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] outline-none sm:p-6" />
    </ToastProvider>
  )
}
