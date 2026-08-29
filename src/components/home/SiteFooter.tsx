import { Link } from 'react-router-dom'

import { homeContent } from '@/content/home'

export function SiteFooter() {
  return (
    <footer className="border-t border-border-subtle bg-footer text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div>
          <Link
            to="/"
            aria-label="Baaaam 홈"
            className="inline-flex rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <img
              src="/image/baaaam-footer-logo.png"
              alt="Project Baaaam"
              width={1032}
              height={558}
              className="h-auto w-[215px] object-contain sm:w-[250px]"
            />
          </Link>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/68">{homeContent.footer.note}</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-5 text-xs text-white/45 md:px-8">© 2026 Baaaam. 어려운 개념을 이해의 순간으로.</p>
      </div>
    </footer>
  )
}
