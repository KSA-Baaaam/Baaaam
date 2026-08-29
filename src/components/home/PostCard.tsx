import type { LucideIcon } from 'lucide-react'
import { Atom, Braces, CalendarDays, Clock3, Compass, FlaskConical, Globe2, Leaf, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Post } from '@/data/posts'
import { koDateFormatter } from '@/lib/format'
import { homeContent } from '@/content/home'

const artworkByCategory: Record<string, { icon: LucideIcon; notation: string; className: string }> = {
  math: { icon: Compass, notation: 'a² + b²', className: 'bg-[#edf4ff] text-[#2767d6]' },
  physics: { icon: Atom, notation: 'F = ma', className: 'bg-[#f2effb] text-[#7253bd]' },
  chemistry: { icon: FlaskConical, notation: 'H₂O', className: 'bg-[#fff3e9] text-[#c86119]' },
  biology: { icon: Leaf, notation: 'CELL', className: 'bg-[#edf8f1] text-[#247a4d]' },
  'earth-science': { icon: Globe2, notation: 'EARTH', className: 'bg-[#eaf7fb] text-[#147b9d]' },
  other: { icon: Braces, notation: '0101', className: 'bg-[#f0f1f7] text-[#4f5e8b]' },
}

function getSummary(content: string): string {
  const boundary = content.indexOf('. ')
  return boundary === -1 ? content : content.slice(0, boundary + 1)
}

function getReadingMinutes(content: string) {
  return Math.max(2, Math.ceil(content.replace(/\s/g, '').length / 250))
}

type TopicArtworkProps = {
  categoryId: string
  compact?: boolean
  className?: string
}

export function TopicArtwork({ categoryId, compact = false, className = '' }: TopicArtworkProps) {
  const artwork = artworkByCategory[categoryId] ?? artworkByCategory.other
  const Icon = artwork.icon

  return (
    <div className={`relative flex overflow-hidden ${artwork.className} ${className}`} aria-hidden="true">
      <span className={`absolute font-black tracking-[-0.06em] opacity-[0.12] ${compact ? '-right-1 bottom-1 text-4xl' : 'bottom-4 right-5 text-6xl'}`}>
        {artwork.notation}
      </span>
      <span className={`relative flex items-center justify-center rounded-[1.1rem] bg-white/72 ${compact ? 'm-4 h-11 w-11' : 'm-6 h-16 w-16'}`}>
        <Icon className={compact ? 'h-5 w-5' : 'h-7 w-7'} strokeWidth={1.8} />
      </span>
    </div>
  )
}

type PostCardProps = {
  post: Post
  categoryLabel: string
  imageRenderWidth?: number
  eager?: boolean
  variant?: 'grid' | 'row' | 'feature'
}

export function PostCard({ post, categoryLabel, variant = 'grid' }: PostCardProps) {
  const summary = getSummary(post.content)
  const minutes = getReadingMinutes(post.content)
  const isRow = variant === 'row'
  const isFeature = variant === 'feature'

  return (
    <article className={`group relative h-full overflow-hidden border border-border-subtle bg-white transition-colors hover:border-brand/45 ${
      isRow ? 'flex min-h-[156px] rounded-xl' : 'flex flex-col rounded-2xl'
    }`}>
      <TopicArtwork
        categoryId={post.categoryId}
        compact={isRow}
        className={isRow ? 'hidden w-[34%] min-w-32 shrink-0 sm:flex' : isFeature ? 'aspect-[16/7] w-full' : 'aspect-[16/8] w-full'}
      />

      <div className={`flex min-w-0 flex-1 flex-col ${isRow ? 'p-5' : isFeature ? 'p-7 sm:p-8' : 'p-5'}`}>
        <div className="flex items-center gap-2 text-xs font-bold text-brand">
          <span>{categoryLabel}</span>
          {post.isRecommended ? (
            <span className="inline-flex items-center gap-1 text-spark-strong">
              <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              {homeContent.recommended.badge}
            </span>
          ) : null}
        </div>

        <h3 className={`mt-2 font-extrabold leading-snug tracking-[-0.025em] text-navy ${isFeature ? 'text-2xl sm:text-[1.8rem]' : isRow ? 'text-lg' : 'text-xl'}`}>
          <Link
            to={`/article/${post.id}`}
            className="rounded-sm after:absolute after:inset-0 after:content-[''] group-hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {post.title}
          </Link>
        </h3>

        <p className={`mt-3 text-sm leading-6 text-ink-muted ${isRow ? 'line-clamp-2' : isFeature ? 'max-w-2xl text-[0.98rem] sm:leading-7' : 'line-clamp-2'}`}>
          {summary}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-5 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {koDateFormatter.format(new Date(post.publishedAt))}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            약 {minutes}분
          </span>
        </div>
      </div>
    </article>
  )
}
