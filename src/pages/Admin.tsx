import { LogOut } from 'lucide-react'

import { CommentManagerTab } from '@/components/admin/CommentManagerTab'
import { PostManagerTab } from '@/components/admin/PostManagerTab'
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

const tabTriggerClassName =
  'rounded-full px-4 py-2 text-sm font-semibold text-ink-muted transition-colors data-[state=active]:bg-brand data-[state=active]:text-surface-card hover:text-brand-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong'

/**
 * 관리자 - 글 관리 화면(`/admin`).
 *
 * 실제 BaaS 계정 로그인 게이트를 통과해야 글 관리/댓글 관리 탭이 보인다.
 */
export default function Admin() {
  const { currentStaff, isSessionLoading, logout, isLoggingOut } = useOperatorSession()

  return (
    <div className="min-h-screen bg-surface text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-10 max-w-2xl">
          <p className="mb-2 text-sm font-semibold text-brand-strong">{adminContent.eyebrow}</p>
          <h1 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
            {adminContent.title}
          </h1>
          <p className="mt-3 text-base text-ink-muted">{adminContent.description}</p>
        </header>

        {isSessionLoading ? (
          <p className="text-sm text-ink-muted">{adminContent.loading}</p>
        ) : currentStaff ? (
          <ToastProvider>
            <div>
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-surface-card px-5 py-4">
                <p className="text-sm text-ink">
                  <span className="font-semibold">{currentStaff.name}</span>
                  {adminContent.session.activeSuffix}
                </p>
                <button
                  type="button"
                  onClick={() => logout()}
                  disabled={isLoggingOut}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle px-4 py-2 text-sm font-semibold text-ink-muted transition-colors hover:border-brand hover:text-brand-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  {adminContent.session.signOut}
                </button>
              </div>

              <Tabs defaultValue="posts">
                <TabsList className="mb-8 flex flex-wrap gap-2" aria-label={adminContent.tabsAriaLabel}>
                  <TabsTrigger value="posts" className={tabTriggerClassName}>
                    {adminContent.tabs.posts}
                  </TabsTrigger>
                  <TabsTrigger value="comments" className={tabTriggerClassName}>
                    {adminContent.tabs.comments}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="posts">
                  <PostManagerTab staffName={currentStaff.name} />
                </TabsContent>
                <TabsContent value="comments">
                  <CommentManagerTab staffName={currentStaff.name} />
                </TabsContent>
              </Tabs>
            </div>
            <ToastViewport className="fixed bottom-0 right-0 z-50 flex w-full max-w-sm flex-col gap-2 p-6 outline-none" />
          </ToastProvider>
        ) : (
          <OperatorAuthGate />
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
