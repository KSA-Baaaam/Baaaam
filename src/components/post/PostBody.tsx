import { Lightbulb, PauseCircle } from 'lucide-react'

import { TopicArtwork } from '@/components/home/PostCard'
import type { Post } from '@/data/posts'

type PostBodyProps = { post: Post }

function splitSentences(content: string) {
  return (content.match(/[^.!?]+[.!?]?/g) ?? [content]).map((sentence) => sentence.trim()).filter(Boolean)
}

export function PostBody({ post }: PostBodyProps) {
  const sentences = splitSentences(post.content)
  const concept = sentences[0]
  const thinkAbout = sentences[1]
  const remaining = sentences.slice(2, -1)
  const summary = sentences.length > 1 ? sentences.at(-1) : sentences[0]

  return (
    <div className="mt-10">
      <TopicArtwork categoryId={post.categoryId} className="aspect-[16/7] w-full rounded-2xl" />

      <section id="concept" className="scroll-mt-28 pt-12">
        <p className="text-sm font-bold text-brand">핵심 개념</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-navy md:text-3xl">먼저 이것부터 알아봐요</h2>
        <p className="mt-6 text-[1.08rem] font-semibold leading-9 text-navy">{concept}</p>
      </section>

      {thinkAbout ? (
        <section id="think" className="scroll-mt-28 pt-10">
          <div className="border-l-4 border-brand bg-brand-soft px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2 text-sm font-extrabold text-brand"><Lightbulb className="h-4 w-4" aria-hidden="true" /> 쉽게 생각해보기</div>
            <p className="mt-3 text-base leading-8 text-navy">{thinkAbout}</p>
          </div>
        </section>
      ) : null}

      {remaining.length ? (
        <section id="details" className="scroll-mt-28 pt-12">
          <p className="text-sm font-bold text-brand">조금 더 자세히</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-navy md:text-3xl">왜 그런 걸까요?</h2>
          <div className="mt-6 space-y-5">
            {remaining.map((sentence, index) => <p key={`${sentence}-${index}`} className="text-[1.05rem] leading-9 text-ink-muted">{sentence}</p>)}
          </div>
        </section>
      ) : null}

      {post.videoUrl ? (
        <section id="video" className="scroll-mt-28 pt-12">
          <p className="mb-3 text-sm font-bold text-brand">영상으로 확인하기</p>
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-navy">
            <iframe src={post.videoUrl} title={`${post.title} 영상`} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" />
          </div>
        </section>
      ) : null}

      <section id="summary" className="scroll-mt-28 pt-12">
        <div className="border-y border-border-subtle py-7">
          <div className="flex items-center gap-2 text-sm font-extrabold text-brand"><PauseCircle className="h-4 w-4" aria-hidden="true" /> 한 줄 정리</div>
          <p className="mt-3 text-lg font-extrabold leading-8 text-navy">{summary}</p>
        </div>
      </section>
    </div>
  )
}
