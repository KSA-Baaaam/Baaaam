import { useQuery } from '@tanstack/react-query'

import { PostCard } from '@/components/home/PostCard'
import { homeContent } from '@/content/home'
import { categories } from '@/data/categories'
import { postsService } from '@/services/posts'

const categoryLabelById = new Map(categories.map((category) => [category.id, category.label]))

export function RecommendedSection() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts', 'all'],
    queryFn: postsService.listAll,
  })
  const recommendedPosts = posts.filter((post) => post.isRecommended)

  if (!isLoading && recommendedPosts.length === 0) return null

  return (
    <section aria-labelledby="recommended-heading" className="bg-section py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <header className="mb-9 max-w-2xl">
          <p className="mb-3 text-sm font-bold text-brand">{homeContent.recommended.eyebrow}</p>
          <h2 id="recommended-heading" className="text-3xl font-extrabold tracking-[-0.035em] text-navy md:text-[2.35rem]">
            {homeContent.recommended.title}
          </h2>
          <p className="mt-3 text-base leading-7 text-ink-muted">{homeContent.recommended.description}</p>
        </header>

        {isLoading ? (
          <p className="text-sm text-ink-muted">{homeContent.recommended.loading}</p>
        ) : (
          <ul className="grid gap-5 lg:grid-cols-2">
            {recommendedPosts.map((post, index) => (
              <li key={post.id} className={index === 0 ? 'lg:row-span-3' : ''}>
                <PostCard
                  post={post}
                  categoryLabel={categoryLabelById.get(post.categoryId) ?? post.categoryId}
                  variant={index === 0 ? 'feature' : 'row'}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
