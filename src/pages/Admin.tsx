import { LogOut, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import { CommentManagerTab } from '@/components/admin/CommentManagerTab'
import { PostManagerTab } from '@/components/admin/PostManagerTab'
import { RoleManagerTab } from '@/components/admin/RoleManagerTab'
import { ServiceUsageTab } from '@/components/admin/ServiceUsageTab'
import { OperatorAuthGate } from '@/components/admin/OperatorAuthGate'
import { SiteFooter } from '@/components/home/SiteFooter'
import { SiteHeader } from '@/components/home/SiteHeader'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ToastProvider,
  ToastViewport,
} from '@/components/ui'
import { adminContent } from '@/content/admin'
import { useOperatorSession } from '@/services/session'
import { roleLabels } from '@/services/profiles'

const tabTriggerClassName =
  'min-h-11 border-b-2 border-transparent px-3 py-2 text-sm font-bold text-ink-muted transition-colors data-[state=active]:border-brand data-[state=active]:text-brand hover:border-brand/40 hover:text-brand-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong'

/**
 * 관리자 - 글 관리 화면(`/admin`).
 *
 * 실제 Supabase 로그인 세션이 있을 때 글 관리/댓글 관리 탭이 보인다.
 */
export default function Admin() {
  const { currentStaff, isSessionLoading, logout, isLoggingOut } = useOperatorSession()

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main mx-auto w-full max-w-5xl px-4 py-10 min-[375px]:px-5 sm:px-6 sm:py-14">
        <header className="mb-10 max-w-2xl">
          <p className="mb-2 text-sm font-semibold text-brand-strong">{adminContent.eyebrow}</p>
          <h1 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
            {adminContent.title}
          </h1>
          <p className="mt-3 text-base text-ink-muted">{adminContent.description}</p>
        </header>

        {isSessionLoading ? (
          <p className="text-sm text-ink-muted">{adminContent.loading}</p>
        ) : currentStaff && currentStaff.role !== 'general' ? (
          <ToastProvider>
            <div>
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-y border-border-subtle bg-section px-4 py-4 sm:px-5">
                <p className="text-sm text-ink">
                  <span className="font-semibold">{currentStaff.name}</span>
                  {adminContent.session.activeSuffix}
                  <span className="ml-2 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand-strong">
                    {roleLabels[currentStaff.role]}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => void logout()}
                  disabled={isLoggingOut}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle px-4 py-2 text-sm font-semibold text-ink-muted transition-colors hover:border-brand hover:text-brand-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  {adminContent.session.signOut}
                </button>
              </div>

              <Tabs defaultValue="posts">
                <div className="responsive-scroll -mx-4 mb-8 overflow-x-auto px-4 min-[375px]:-mx-5 min-[375px]:px-5 sm:mx-0 sm:px-0">
                <TabsList className="inline-flex min-w-max gap-1 border-b border-border-subtle" aria-label={adminContent.tabsAriaLabel}>
                  <TabsTrigger value="posts" className={tabTriggerClassName}>
                    {adminContent.tabs.posts}
                  </TabsTrigger>
                  <TabsTrigger value="comments" className={tabTriggerClassName}>
                    {adminContent.tabs.comments}
                  </TabsTrigger>
                  {currentStaff.role === 'admin' || currentStaff.role === 'developer' ? (
                    <TabsTrigger value="roles" className={tabTriggerClassName}>
                      {adminContent.tabs.roles}
                    </TabsTrigger>
                  ) : null}
                  {currentStaff.role === 'developer' ? (
                    <TabsTrigger value="services" className={tabTriggerClassName}>
                      {adminContent.tabs.services}
                    </TabsTrigger>
                  ) : null}
                </TabsList>
                </div>
                <TabsContent value="posts">
                  <PostManagerTab staffId={currentStaff.id} role={currentStaff.role} />
                </TabsContent>
                <TabsContent value="comments">
                  <CommentManagerTab staffId={currentStaff.id} staffName={currentStaff.name} role={currentStaff.role} />
                </TabsContent>
                {currentStaff.role === 'admin' || currentStaff.role === 'developer' ? (
                  <TabsContent value="roles">
                    <RoleManagerTab currentUserId={currentStaff.id} currentUserRole={currentStaff.role} />
                  </TabsContent>
                ) : null}
                {currentStaff.role === 'developer' ? (
                  <TabsContent value="services">
                    <ServiceUsageTab />
                  </TabsContent>
                ) : null}
              </Tabs>
            </div>
            <ToastViewport className="fixed bottom-0 right-0 z-50 flex w-full max-w-sm flex-col gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] outline-none sm:p-6" />
          </ToastProvider>
        ) : currentStaff ? (
          <section className="rounded-3xl border border-border-subtle bg-surface-card px-6 py-12 text-center sm:px-10">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="mt-5 text-sm font-bold text-brand-strong">{adminContent.accessDenied.badge}</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">{adminContent.accessDenied.title}</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-ink-muted">{adminContent.accessDenied.description}</p>
            <Link to="/" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-brand px-5 text-sm font-bold text-white hover:bg-brand-strong">
              {adminContent.accessDenied.homeCta}
            </Link>
          </section>
        ) : (
          <OperatorAuthGate />
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
