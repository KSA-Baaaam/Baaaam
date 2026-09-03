import { Calculator, FlaskConical, House, Info, LogOut, Menu, Search, UserRound, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { BrandLogo } from '@/components/home/BrandLogo'
import { SiteSearchForm } from '@/components/search/SiteSearchForm'
import { homeContent } from '@/content/home'
import { useOperatorSession } from '@/services/session'

const navItems = [
  { to: '/', label: homeContent.header.navHome, kind: 'home', icon: House },
  { to: '/math', label: homeContent.header.navMath, kind: 'math', icon: Calculator },
  { to: '/science', label: homeContent.header.navScience, kind: 'science', icon: FlaskConical },
  { to: '/about', label: homeContent.header.navAbout, kind: 'about', icon: Info },
] as const

function isItemActive(pathname: string, kind: (typeof navItems)[number]['kind']) {
  if (kind === 'home') return pathname === '/'
  if (kind === 'math') return pathname === '/math' || pathname === '/category/math'
  if (kind === 'science') {
    return (
      pathname === '/science' ||
      (pathname.startsWith('/category/') && pathname !== '/category/math')
    )
  }
  return pathname === '/about'
}

export function SiteHeader() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { currentStaff, isSessionLoading, logout, isLoggingOut } = useOperatorSession()

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-1.5 px-3 min-[375px]:gap-2 min-[375px]:px-4 sm:h-16 sm:gap-4 sm:px-5 md:px-8 lg:grid lg:h-16 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-5 xl:gap-8">
        <Link
          to="/"
          className="flex shrink-0 items-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          aria-label="BAAAAM 홈"
        >
          <BrandLogo variant="header" className="w-[5.5rem] min-[375px]:w-24 sm:w-[6.5rem]" />
        </Link>

        <nav aria-label="주요 메뉴" className="hidden h-full items-center justify-self-center gap-0.5 lg:flex xl:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={() =>
                  `relative flex h-full items-center gap-1.5 px-2.5 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand xl:gap-2 xl:px-4 xl:text-base ${
                    isItemActive(pathname, item.kind)
                      ? 'text-brand after:absolute after:inset-x-2 after:bottom-0 after:h-[3px] after:rounded-t-full after:bg-brand'
                      : 'text-navy hover:text-brand'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" strokeWidth={2.2} aria-hidden="true" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/search"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-input-border px-3.5 text-sm font-bold text-navy transition-colors hover:border-brand hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand xl:px-4"
          >
            <Search className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
            검색
          </Link>
          {!isSessionLoading && currentStaff ? (
            <>
              {currentStaff.role !== 'general' ? (
                <Link to="/admin" className="inline-flex h-10 items-center justify-center rounded-lg border border-brand px-3.5 text-sm font-bold text-brand transition-colors hover:bg-brand-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand xl:px-4">
                  {currentStaff.role === 'developer' ? '개발자' : currentStaff.role === 'admin' ? '관리자' : '글 관리'}
                </Link>
              ) : null}
              <Link to="/account" aria-label="계정 관리" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-input-border px-3.5 text-sm font-bold text-navy transition-colors hover:border-brand hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand xl:px-4">
                <UserRound className="h-5 w-5" aria-hidden="true" />
                <span className="max-w-24 truncate">{currentStaff.name}</span>
              </Link>
              <button type="button" onClick={() => void logout()} disabled={isLoggingOut} aria-label="로그아웃" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-input-border text-ink-muted transition-colors hover:border-brand hover:text-brand disabled:opacity-60">
                <LogOut className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-input-border px-3.5 text-sm font-bold text-navy transition-colors hover:border-brand hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand xl:px-4"
            >
              <UserRound className="h-5 w-5" aria-hidden="true" />
              {homeContent.header.loginCta}
            </Link>
          )}
        </div>

        <Link
          to="/search"
          aria-label={homeContent.header.searchLabel}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg text-navy hover:bg-brand-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:h-11 sm:w-11 lg:hidden"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
        </Link>
        <button
          type="button"
          aria-label={menuOpen ? '메뉴 닫기' : homeContent.header.menuLabel}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-navy hover:bg-brand-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:h-11 sm:w-11 lg:hidden"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen ? (
        <div className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-border-subtle bg-white px-4 py-3 sm:max-h-[calc(100dvh-4rem)] sm:px-5 sm:py-4 lg:hidden">
          <nav aria-label="모바일 메뉴" className="mx-auto flex max-w-7xl flex-col">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 border-b border-border-subtle px-1 py-3.5 text-base font-bold ${
                    isItemActive(pathname, item.kind) ? 'text-brand' : 'text-navy'
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {item.label}
                </Link>
              )
            })}
            <div className="pt-5">
              <SiteSearchForm size="large" />
            </div>
            {!isSessionLoading && currentStaff ? (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {currentStaff.role !== 'general' ? (
                  <Link to="/admin" className="col-span-2 inline-flex min-h-12 items-center justify-center rounded-lg bg-brand px-5 text-sm font-bold text-white">
                    {currentStaff.role === 'developer' ? '개발자' : currentStaff.role === 'admin' ? '관리자' : '글 관리'}
                  </Link>
                ) : null}
                <Link to="/account" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border-subtle px-4 text-sm font-bold text-navy"><UserRound className="h-5 w-5" aria-hidden="true" />계정 관리</Link>
                <button type="button" onClick={() => void logout()} disabled={isLoggingOut} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border-subtle px-4 text-sm font-bold text-ink-muted" aria-label="로그아웃"><LogOut className="h-5 w-5" aria-hidden="true" />로그아웃</button>
              </div>
            ) : (
              <Link
                to="/login"
                className="mt-4 inline-flex min-h-12 items-center justify-center rounded-lg bg-brand px-5 text-sm font-bold text-white"
              >
                {homeContent.header.loginCta}
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
