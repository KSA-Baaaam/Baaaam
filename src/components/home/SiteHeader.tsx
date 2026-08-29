import { Menu, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import brandMascot from '@/assets/brand-mascot.png'
import { SiteSearchForm } from '@/components/search/SiteSearchForm'
import { homeContent } from '@/content/home'

const navItems = [
  { to: '/', label: homeContent.header.navHome, kind: 'home' },
  { to: '/math', label: homeContent.header.navMath, kind: 'math' },
  { to: '/science', label: homeContent.header.navScience, kind: 'science' },
  { to: '/about', label: homeContent.header.navAbout, kind: 'about' },
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

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-white/95">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-4 px-5 md:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          aria-label="Baaaam 홈"
        >
          <img src={brandMascot} alt="" width={42} height={42} className="h-11 w-11 object-contain" />
          <span className="text-[1.35rem] font-extrabold tracking-[-0.04em] text-navy">
            {homeContent.brand.name}
          </span>
        </Link>

        <nav aria-label="주요 메뉴" className="mx-auto hidden h-full items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={() =>
                `relative flex h-full items-center px-1 text-[0.95rem] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  isItemActive(pathname, item.kind)
                    ? 'text-brand after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-brand'
                    : 'text-ink-muted hover:text-navy'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <SiteSearchForm size="compact" className="w-56 xl:w-64" />
          <Link
            to="/login"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-brand px-5 text-sm font-bold text-brand transition-colors hover:bg-brand-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {homeContent.header.loginCta}
          </Link>
        </div>

        <Link
          to="/search"
          aria-label={homeContent.header.searchLabel}
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-lg text-navy hover:bg-brand-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:hidden"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
        </Link>
        <button
          type="button"
          aria-label={menuOpen ? '메뉴 닫기' : homeContent.header.menuLabel}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-navy hover:bg-brand-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:hidden"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-border-subtle bg-white px-5 py-5 lg:hidden">
          <nav aria-label="모바일 메뉴" className="mx-auto flex max-w-7xl flex-col">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`border-b border-border-subtle px-1 py-3.5 text-base font-bold ${
                  isItemActive(pathname, item.kind) ? 'text-brand' : 'text-navy'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-5">
              <SiteSearchForm size="large" />
            </div>
            <Link
              to="/login"
              className="mt-4 inline-flex min-h-12 items-center justify-center rounded-lg bg-brand px-5 text-sm font-bold text-white"
            >
              {homeContent.header.loginCta}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
