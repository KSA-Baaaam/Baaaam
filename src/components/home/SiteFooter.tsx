import { Link } from 'react-router-dom'

import { homeContent } from '@/content/home'

export function SiteFooter() {
  return (
    <footer className="border-t border-border-subtle bg-footer text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-10 px-5 py-12 sm:grid-cols-3 md:px-8 lg:grid-cols-[minmax(320px,1.45fr)_repeat(3,minmax(120px,0.55fr))] lg:gap-x-16 lg:py-16">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
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
                className="h-auto w-[200px] object-contain sm:w-[250px]"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/58">{homeContent.footer.organization}</p>
            <p className="mt-5 text-xs leading-5 text-white/38">{homeContent.footer.copyright}</p>
          </div>

          <nav aria-labelledby="footer-baaaam-heading">
            <h2 id="footer-baaaam-heading" className="text-sm font-extrabold text-white">Baaaam</h2>
            <ul className="mt-5 space-y-3 text-sm text-white/55">
              <li>
                <Link to="/about" className="inline-flex min-h-8 items-center transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  소개
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-content-heading">
            <h2 id="footer-content-heading" className="text-sm font-extrabold text-white">콘텐츠</h2>
            <ul className="mt-5 space-y-3 text-sm text-white/55">
              <li>
                <Link to="/math" className="inline-flex min-h-8 items-center transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  수학
                </Link>
              </li>
              <li>
                <Link to="/science" className="inline-flex min-h-8 items-center transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  과학
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-link-heading">
            <h2 id="footer-link-heading" className="text-sm font-extrabold text-white">바로가기</h2>
            <ul className="mt-5 space-y-3 text-sm text-white/55">
              <li>
                <a
                  href={homeContent.footer.schoolUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-8 items-center leading-6 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
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
