import type { LucideIcon } from 'lucide-react'
import { Cloud, Database, ExternalLink, GitBranch, Mail, RefreshCw } from 'lucide-react'

type ServiceLimit = {
  label: string
  value: string
}

type Service = {
  name: string
  plan: string
  description: string
  icon: LucideIcon
  limits: ServiceLimit[]
  dashboardUrl: string
  docsUrl: string
}

const services: Service[] = [
  {
    name: 'Supabase',
    plan: 'Free',
    description: '데이터베이스, 인증, 파일 저장소와 Edge Functions',
    icon: Database,
    limits: [
      { label: '데이터베이스', value: '프로젝트당 500 MB' },
      { label: '파일 저장소', value: '1 GB' },
      { label: '전송량', value: '월 5 GB' },
      { label: '월간 활성 사용자', value: '50,000명' },
      { label: 'Edge Function', value: '월 500,000회' },
      { label: 'Realtime 메시지', value: '월 2,000,000건' },
    ],
    dashboardUrl: 'https://supabase.com/dashboard/org/jqhhhtsmnsoouvzdjoir/usage',
    docsUrl: 'https://supabase.com/pricing',
  },
  {
    name: 'Resend',
    plan: 'Free',
    description: '회원가입 인증 및 서비스 이메일 전송',
    icon: Mail,
    limits: [
      { label: '이메일', value: '월 3,000건' },
      { label: '일일 발송', value: '하루 100건' },
      { label: '발송 도메인', value: '3개' },
      { label: '자동화 실행', value: '월 10,000회' },
      { label: '데이터 보관', value: '30일' },
    ],
    dashboardUrl: 'https://resend.com/overview',
    docsUrl: 'https://resend.com/pricing',
  },
  {
    name: 'Vercel',
    plan: 'Hobby',
    description: 'BAAAAM 웹사이트 호스팅 및 배포',
    icon: Cloud,
    limits: [
      { label: 'Fast Data Transfer', value: '월 100 GB' },
      { label: 'Edge Requests', value: '월 1,000,000회' },
      { label: 'Function 호출', value: '월 1,000,000회' },
      { label: 'Active CPU', value: '월 4시간' },
      { label: '메모리 사용', value: '월 360 GB-시간' },
      { label: 'Web Analytics', value: '이벤트 50,000건' },
    ],
    dashboardUrl: 'https://vercel.com/baaaam/~/usage',
    docsUrl: 'https://vercel.com/docs/plans/hobby',
  },
  {
    name: 'GitHub',
    plan: 'Free for organizations',
    description: '소스 코드와 자동화 작업 관리',
    icon: GitBranch,
    limits: [
      { label: '공개 저장소', value: '무제한' },
      { label: '공개 저장소 Actions', value: '표준 실행기 무료·무제한' },
      { label: '비공개 저장소 Actions', value: '월 2,000분' },
      { label: 'Actions·Packages 저장공간', value: '500 MB' },
      { label: 'Actions 캐시', value: '10 GB' },
    ],
    dashboardUrl: 'https://github.com/organizations/KSA-Baaaam/settings/billing/usage',
    docsUrl: 'https://docs.github.com/en/billing/reference/product-usage-included',
  },
]

function ExternalButton({ href, children, primary = false }: { href: string; children: string; primary?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong ${
        primary
          ? 'bg-brand text-white hover:bg-brand-strong'
          : 'border border-border-subtle text-ink-muted hover:border-brand hover:text-brand-strong'
      }`}
    >
      {children}
      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  )
}

export function ServiceUsageTab() {
  return (
    <section aria-labelledby="service-usage-title">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-sm font-semibold text-brand-strong">개발자 전용</p>
          <h2 id="service-usage-title" className="text-2xl font-bold text-ink">서비스 무료 사용량 한도</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
            BAAAAM이 사용하는 외부 서비스의 무료 플랜 기준입니다. 실제 사용량은 각 서비스 대시보드에서 확인할 수 있어요.
          </p>
        </div>
        <p className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-ink-soft">
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          2026년 9월 3일 공식 정책 기준
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {services.map((service) => {
          const Icon = service.icon
          return (
            <article key={service.name} className="flex min-w-0 flex-col rounded-xl border border-border-subtle bg-surface-card p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-strong">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-ink">{service.name}</h3>
                    <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-bold text-ink-muted">{service.plan}</span>
                  </div>
                  <p className="mt-1 text-sm leading-5 text-ink-muted">{service.description}</p>
                </div>
              </div>

              <dl className="mt-6 divide-y divide-border-subtle border-y border-border-subtle">
                {service.limits.map((limit) => (
                  <div key={limit.label} className="flex items-start justify-between gap-4 py-3 text-sm">
                    <dt className="text-ink-muted">{limit.label}</dt>
                    <dd className="text-right font-bold text-ink">{limit.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                <ExternalButton href={service.dashboardUrl} primary>현재 사용량 확인</ExternalButton>
                <ExternalButton href={service.docsUrl}>공식 한도 보기</ExternalButton>
              </div>
            </article>
          )
        })}
      </div>

      <p className="mt-6 border-y border-hero-border bg-brand-soft/60 px-5 py-4 text-sm leading-6 text-ink-muted">
        무료 한도와 집계 주기는 공급자 정책에 따라 바뀔 수 있습니다. 정확한 현재 사용량과 초기화 날짜는 각 카드의 대시보드에서 확인해주세요.
      </p>
    </section>
  )
}
