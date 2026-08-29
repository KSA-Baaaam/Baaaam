import { Link } from 'react-router-dom'

import { BrandLogo } from '@/components/home/BrandLogo'
import { homeContent } from '@/content/home'

export function SiteFooter() {
  return (
    <footer className="border-t border-border-subtle bg-footer text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1fr_auto] md:items-end md:px-8">
        <div>
          <Link
            to="/"
            aria-label="Baaaam 홈"
            className="inline-flex rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <BrandLogo className="h-[76px] w-[150px] rounded-xl ring-1 ring-white/15" />
          </Link>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/68">{homeContent.footer.note}</p>
        </div>

        <nav aria-label="하단 메뉴" className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/78">
          <Link to="/category/all" className="hover:text-white">{homeContent.footer.explore}</Link>
          <Link to="/about" className="hover:text-white">{homeContent.footer.about}</Link>
          <Link to="/login" className="hover:text-white">{homeContent.footer.adminLink}</Link>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-5 text-xs text-white/45 md:px-8">© 2026 Baaaam. 어려운 개념을 이해의 순간으로.</p>
      </div>
    </footer>
  )
}
