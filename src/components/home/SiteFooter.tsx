import { Link } from 'react-router-dom'

import { homeContent } from '@/content/home'

export function SiteFooter() {
  return (
    <footer className="border-t border-border-subtle bg-footer text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-8 min-[375px]:px-5 sm:grid-cols-3 sm:gap-x-10 md:px-8 lg:grid-cols-[minmax(15rem,1.25fr)_minmax(8rem,0.6fr)_minmax(8rem,0.6fr)_minmax(14rem,1fr)] lg:gap-x-12 lg:py-9">
          <div className="col-span-2 min-w-0 sm:col-span-3 lg:col-span-1">
            <Link
              to="/"
              aria-label="BAAAAM 홈"
              className="inline-flex rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <img
                src="/image/baaaam-footer-logo.png"
                alt="Project BAAAAM"
                width={1032}
                height={558}
                className="h-auto w-[160px] object-contain min-[375px]:w-[180px] sm:w-[200px]"
              />
            </Link>
            <p className="mt-4 max-w-sm text-xs leading-5 text-white/55">{homeContent.footer.copyright}</p>
          </div>

          <nav aria-labelledby="footer-baaaam-heading" className="min-w-0">
            <h2 id="footer-baaaam-heading" className="text-sm font-extrabold text-white">연구회</h2>
            <ul className="mt-2 space-y-0 text-sm text-white/70">
              <li>
                <Link to="/about" className="inline-flex min-h-8 items-center py-1 leading-5 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  소개
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="inline-flex min-h-8 items-center py-1 leading-5 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  개인정보 처리방침
                </Link>
              </li>
              <li>
                <Link to="/terms" className="inline-flex min-h-8 items-center py-1 leading-5 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  이용약관
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-content-heading" className="min-w-0">
            <h2 id="footer-content-heading" className="text-sm font-extrabold text-white">콘텐츠</h2>
            <ul className="mt-2 space-y-0 text-sm text-white/70">
              <li>
                <Link to="/math" className="inline-flex min-h-8 items-center py-1 leading-5 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  수학
                </Link>
              </li>
              <li>
                <Link to="/science" className="inline-flex min-h-8 items-center py-1 leading-5 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  과학
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-link-heading" className="col-span-2 min-w-0 sm:col-span-1">
            <h2 id="footer-link-heading" className="text-sm font-extrabold text-white">바로가기</h2>
            <ul className="mt-2 space-y-0 text-sm text-white/70">
              <li>
                <a
                  href={homeContent.footer.schoolUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-8 items-center py-1 leading-5 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {homeContent.footer.schoolLinkLabel}
                </a>
              </li>
            </ul>
          </nav>
      </div>
    </footer>
  )
}
