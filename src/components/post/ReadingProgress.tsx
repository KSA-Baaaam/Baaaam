import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function updateProgress() {
      const article = document.getElementById('article-content')
      if (!article) return
      const start = article.offsetTop
      const end = start + article.offsetHeight - window.innerHeight
      const current = window.scrollY - start
      setProgress(Math.min(100, Math.max(0, (current / Math.max(end - start, 1)) * 100)))
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div className="fixed inset-x-0 top-[71px] z-40 h-[3px] bg-transparent" aria-hidden="true">
      <div className="h-full bg-brand transition-[width] duration-150" style={{ width: `${progress}%` }} />
    </div>
  )
}
