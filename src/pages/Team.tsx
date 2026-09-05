import {
  Atom,
  BadgeCheck,
  Calculator,
  Dna,
  FlaskConical,
  Headphones,
  Mail,
  Palette,
  Settings2,
  Sparkles,
  Telescope,
  UsersRound,
} from 'lucide-react'

import { SiteFooter } from '@/components/home/SiteFooter'
import { SiteHeader } from '@/components/home/SiteHeader'

const operationTeams = [
  {
    name: '총괄팀',
    icon: Sparkles,
    accent: 'bg-[#fff1f1] text-[#9d4646]',
    description: '전체톡 관리, 연구회 일지 작성, 일정 관리, 외부활동 컨택, 시수와 생기부 관리, 대외활동 관리, 신입 멤버 선발 기준 관리, OT 진행, 전체 부서 관리',
    members: [
      { role: '연구회장', name: '조유나' },
      { role: '연구부회장', name: '김지민' },
    ],
  },
  {
    name: '운영팀',
    icon: Settings2,
    accent: 'bg-[#fff4e7] text-[#956126]',
    description: '멤버 관리(명단 취합, 활동 확인), 신입 멤버 평가 및 안내, 글 관리, 회의 개최·진행·기록, 글 및 영상 업로드',
    members: [
      { role: '팀장', name: '김태희' },
      { role: '부팀장', name: '김하영' },
    ],
  },
  {
    name: '미디어팀',
    icon: Palette,
    accent: 'bg-[#fff8dc] text-[#8a6b16]',
    description: '인스타그램 게시글 및 숏폼 제작, 로고 디자인, 각종 디자인',
    members: [
      { role: '팀장', name: '임채린' },
      { role: '부팀장', name: '유연' },
      { role: '부팀장', name: '한유주' },
      { role: '부팀장', name: '김채원' },
    ],
  },
  {
    name: '검수팀',
    icon: BadgeCheck,
    accent: 'bg-brand-soft text-brand-strong',
    description: '글 검수, 글 가이드라인 제작, 영상 검수',
    members: [
      { role: '팀장', name: '유서윤' },
      { role: '부팀장', name: '김선오' },
      { role: '부팀장', name: '이유림' },
    ],
  },
  {
    name: 'CS팀',
    icon: Headphones,
    accent: 'bg-[#eaf3ff] text-[#33679e]',
    description: '웹사이트 이용 문의와 사용자 의견을 확인하고 대응합니다.',
    members: [
      { role: '팀장', name: '박현택' },
    ],
  },
] as const

const subjectTeams = [
  {
    name: '수학',
    icon: Calculator,
    members: ['김시현', '김지민', '류민혁', '조재민', '여준구', '한승현'],
    highlighted: '김지민',
  },
  {
    name: '물리',
    icon: Atom,
    members: ['김은유', '임채린', '한유주', '현동빈', '김채원'],
    highlighted: '임채린',
  },
  {
    name: '화학',
    icon: FlaskConical,
    members: ['유서윤', '유연', '김예준', '김태희'],
    highlighted: '유서윤',
  },
  {
    name: '생물',
    icon: Dna,
    members: ['김민재', '김하영', '조유나', '테라예'],
    highlighted: '조유나',
  },
  {
    name: '지구과학/천문학',
    icon: Telescope,
    members: ['안주호', '김선오', '이유림', '박현택'],
    highlighted: '김선오',
  },
] as const

const memberCount = subjectTeams.reduce((total, subject) => total + subject.members.length, 0)

export default function Team() {
  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <section className="border-b border-hero-border bg-hero">
          <div className="mx-auto grid max-w-7xl gap-9 px-5 py-12 sm:py-14 md:grid-cols-[1fr_auto] md:items-end md:px-8 md:py-16">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 text-sm font-extrabold text-brand"><UsersRound className="h-5 w-5" aria-hidden="true" />BAAAAM Team</p>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-0.045em] text-navy min-[375px]:text-4xl md:text-5xl">
                함께 만들고,<br className="hidden sm:block" /> 함께 확인합니다.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted md:text-lg">
                BAAAAM은 한국과학영재학교 학생들이 운영하는 교내 연구회입니다. 운영 조직과 분야별 글쓰기 팀이 함께 중학생을 위한 수학·과학 콘텐츠를 만듭니다.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-3 sm:w-72">
              <div className="rounded-xl border border-hero-border bg-white/75 p-4"><dt className="text-xs font-bold text-ink-muted">구성원</dt><dd className="mt-1 text-2xl font-extrabold text-brand">{memberCount}명</dd></div>
              <div className="rounded-xl border border-hero-border bg-white/75 p-4"><dt className="text-xs font-bold text-ink-muted">글 분야</dt><dd className="mt-1 text-2xl font-extrabold text-brand">{subjectTeams.length}개</dd></div>
            </dl>
          </div>
        </section>

        <section aria-labelledby="operation-team-heading" className="mx-auto max-w-7xl px-5 py-12 sm:py-14 md:px-8 md:py-16">
          <header className="max-w-2xl">
            <p className="text-sm font-bold text-brand">Organization</p>
            <h2 id="operation-team-heading" className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-navy md:text-[2.35rem]">운영 조직</h2>
            <p className="mt-4 text-base leading-7 text-ink-muted">연구회의 운영부터 콘텐츠 제작, 검수와 이용자 지원까지 다섯 팀이 역할을 나누어 맡습니다.</p>
          </header>

          <div className="mt-9 grid gap-4 lg:grid-cols-2">
            {operationTeams.map((team) => {
              const Icon = team.icon
              return (
                <article key={team.name} className="overflow-hidden rounded-2xl border border-border-subtle bg-white">
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${team.accent}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
                      <h3 className="text-xl font-extrabold text-navy">{team.name}</h3>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-ink-muted">{team.description}</p>
                  </div>
                  <dl className="border-t border-border-subtle bg-surface-muted/55 px-5 py-2 sm:px-6">
                    {team.members.map((member, index) => (
                      <div key={`${member.role}-${member.name}`} className={`grid grid-cols-[minmax(5.5rem,0.75fr)_1fr] items-center gap-4 py-3 ${index > 0 ? 'border-t border-border-subtle/70' : ''}`}>
                        <dt className="text-sm font-bold text-ink-muted">{member.role}</dt>
                        <dd className="text-sm font-extrabold text-navy">{member.name}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              )
            })}
            <aside className="relative hidden min-h-[260px] items-center justify-center overflow-hidden rounded-2xl bg-[#12372d] px-10 lg:flex" aria-label="Project BAAAAM 로고">
              <span className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand/35 blur-3xl" aria-hidden="true" />
              <span className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#8dcbaa]/20 blur-3xl" aria-hidden="true" />
              <img
                src="/image/baaaam-footer-logo.png"
                alt="Project BAAAAM"
                width={1032}
                height={558}
                className="relative w-full max-w-[290px] object-contain"
              />
            </aside>
          </div>
        </section>

        <section aria-labelledby="subject-team-heading" className="border-y border-border-subtle bg-surface-muted">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:py-14 md:px-8 md:py-16">
            <header className="max-w-2xl">
              <p className="text-sm font-bold text-brand">Subjects</p>
              <h2 id="subject-team-heading" className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-navy md:text-[2.35rem]">글 주제 배정</h2>
              <p className="mt-4 text-base leading-7 text-ink-muted">관심 분야와 전문성을 바탕으로 다섯 분야의 글을 나누어 작성합니다.</p>
            </header>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {subjectTeams.map((subject) => {
                const Icon = subject.icon
                return (
                  <article key={subject.name} className="rounded-2xl border border-border-subtle bg-white p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                      <span className="rounded-full bg-section px-2.5 py-1 text-xs font-bold text-ink-muted">{subject.members.length}명</span>
                    </div>
                    <h3 className="mt-4 text-lg font-extrabold leading-6 text-navy">{subject.name}</h3>
                    <ul className="mt-4 border-t border-border-subtle pt-2">
                      {subject.members.map((member) => (
                        <li key={member} className={`flex min-h-9 items-center border-b border-border-subtle/65 py-1.5 text-sm last:border-b-0 ${member === subject.highlighted ? 'font-extrabold text-brand-strong' : 'font-medium text-ink-muted'}`}>{member}</li>
                      ))}
                    </ul>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[1fr_auto] md:items-center md:px-8 md:py-14">
            <div>
              <p className="text-sm font-bold text-brand">Contact</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-navy">BAAAAM에 궁금한 점이 있나요?</h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-ink-muted">연구회와 웹사이트에 관한 의견 및 문의를 이메일로 보내주세요.</p>
            </div>
            <a href="mailto:26-048@ksa.hs.kr" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-sm font-extrabold text-white hover:bg-brand-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
              <Mail className="h-4 w-4" aria-hidden="true" />26-048@ksa.hs.kr
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
