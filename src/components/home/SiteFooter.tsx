import { X } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui'
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
                <Link to="/about" className="inline-flex min-h-11 items-center py-1 leading-5 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-8">
                  소개
                </Link>
              </li>
              <li>
                <Link to="/team" className="inline-flex min-h-11 items-center py-1 leading-5 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-8">
                  Team
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-content-heading" className="min-w-0">
            <h2 id="footer-content-heading" className="text-sm font-extrabold text-white">콘텐츠</h2>
            <ul className="mt-2 space-y-0 text-sm text-white/70">
              <li>
                <Link to="/math" className="inline-flex min-h-11 items-center py-1 leading-5 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-8">
                  수학
                </Link>
              </li>
              <li>
                <Link to="/science" className="inline-flex min-h-11 items-center py-1 leading-5 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-8">
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
                  className="inline-flex min-h-11 items-center py-1 leading-5 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-8"
                >
                  {homeContent.footer.schoolLinkLabel}
                </a>
              </li>
              <li>
                <Link to="/privacy" className="inline-flex min-h-11 items-center py-1 leading-5 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-8">
                  개인정보 처리방침
                </Link>
              </li>
              <li>
                <Link to="/terms" className="inline-flex min-h-11 items-center py-1 leading-5 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-8">
                  이용약관
                </Link>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger className="inline-flex min-h-11 items-center py-1 text-left leading-5 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-8">
                    이메일 무단수집 거부
                  </DialogTrigger>
                  <DialogContent
                    overlayProps={{ className: 'fixed inset-0 z-50 bg-navy/55 backdrop-blur-[2px]' }}
                    className="fixed bottom-0 left-0 right-0 z-[60] rounded-t-2xl border border-border-subtle bg-white p-5 text-navy shadow-2xl sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-1/2 sm:w-[min(34rem,calc(100%-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:p-7"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <DialogTitle className="text-xl font-extrabold tracking-[-0.025em]">이메일 무단수집 거부</DialogTitle>
                        <DialogDescription className="mt-2 text-sm leading-6 text-ink-muted">웹사이트에 게시된 이메일 주소를 보호하기 위한 안내입니다.</DialogDescription>
                      </div>
                      <DialogClose className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-section hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" aria-label="안내 창 닫기">
                        <X className="h-5 w-5" aria-hidden="true" />
                      </DialogClose>
                    </div>
                    <div className="mt-6 rounded-xl bg-surface-muted p-5 text-sm leading-7 text-ink-muted sm:text-base">
                      <p>본 웹사이트에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부합니다.</p>
                      <p className="mt-3">수집된 주소를 이용한 영리 목적의 광고성 이메일 발송을 허용하지 않습니다.</p>
                    </div>
                    <DialogClose className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-brand px-5 text-sm font-bold text-white transition-colors hover:bg-brand-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                      확인
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </nav>
      </div>
    </footer>
  )
}
