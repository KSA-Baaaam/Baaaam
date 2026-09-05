import { Link } from 'react-router-dom'

import { SiteFooter } from '@/components/home/SiteFooter'
import { SiteHeader } from '@/components/home/SiteHeader'
import { homeContent } from '@/content/home'

const sectionClassName = 'border-t border-border-subtle pt-9 first:border-t-0 first:pt-0'
const headingClassName = 'text-xl font-extrabold tracking-[-0.025em] text-navy sm:text-2xl'
const paragraphClassName = 'mt-4 text-[0.95rem] leading-8 text-ink-muted sm:text-base'
const listClassName = 'mt-4 list-decimal space-y-2 pl-6 text-[0.95rem] leading-7 text-ink-muted sm:text-base'

type PrivacyProps = { embedded?: boolean }

export default function Privacy({ embedded = false }: PrivacyProps) {
  const ContentRoot = embedded ? 'div' : 'main'

  return (
    <div className={embedded ? '' : 'site-page bg-section'}>
      {embedded ? null : <SiteHeader />}
      <ContentRoot className={embedded ? '' : 'site-main'}>
        {embedded ? null : <header className="border-b border-hero-border bg-hero">
          <div className="mx-auto max-w-5xl px-4 py-10 min-[375px]:px-5 sm:py-12 md:px-8 md:py-14">
            <p className="text-sm font-extrabold tracking-[0.12em] text-brand">PRIVACY POLICY</p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.045em] text-navy sm:text-4xl md:text-5xl">
              BAAAAM 개인정보 처리방침
            </h1>
            <p className="mt-5 inline-flex rounded-full border border-hero-border bg-white px-4 py-2 text-sm font-bold text-ink-muted">
              시행일: 2026년 9월 3일
            </p>
          </div>
        </header>}

        <article className={embedded ? 'pb-2' : 'mx-auto max-w-5xl px-4 py-8 min-[375px]:px-5 sm:py-10 md:px-8 md:py-16'}>
          <div className={embedded ? '' : 'border border-border-subtle bg-white px-4 py-7 min-[375px]:px-5 sm:px-8 sm:py-10 md:px-12 md:py-14'}>
            <div className="space-y-5 text-[0.95rem] leading-8 text-ink-muted sm:text-base">
              <p>
                한국과학영재학교 소속 BAAAAM 연구회(이하 “BAAAAM”)는 이용자의 개인정보를 중요하게 생각하며, 「개인정보 보호법」 등 관련 법령을 준수하고 있습니다.
              </p>
              <p>
                BAAAAM은 중학생을 비롯한 청소년이 수학·과학 개념을 쉽고 흥미롭게 학습할 수 있도록 교육 콘텐츠를 제공하는 비영리 학생 연구회입니다. 본 개인정보 처리방침은 BAAAAM이 운영하는 웹사이트에서 이용자의 개인정보가 어떠한 목적으로 수집·이용되고 어떻게 보호되는지를 안내하기 위해 마련되었습니다.
              </p>
            </div>

            <div className="mt-12 space-y-10">
              <section className={sectionClassName}>
                <h2 className={headingClassName}>제1조 개인정보의 처리 목적</h2>
                <p className={paragraphClassName}>BAAAAM은 다음의 목적을 위하여 필요한 범위에서 개인정보를 처리합니다.</p>
                <ol className={listClassName}>
                  <li><strong className="font-bold text-navy">회원 관리</strong><ul className="mt-2 list-disc space-y-1 pl-5"><li>회원가입 의사 확인</li><li>이용자 식별 및 인증</li><li>회원자격 유지 및 관리</li><li>부정 이용 방지</li></ul></li>
                  <li><strong className="font-bold text-navy">웹사이트 서비스 제공</strong><ul className="mt-2 list-disc space-y-1 pl-5"><li>수학·과학 교육 콘텐츠 제공</li><li>이용자가 작성하거나 저장한 콘텐츠 관리</li><li>개인별 서비스 이용 내역 관리</li></ul></li>
                  <li><strong className="font-bold text-navy">문의 및 의견 처리</strong><ul className="mt-2 list-disc space-y-1 pl-5"><li>이용자의 문의사항 확인</li><li>서비스 관련 의견 및 신고 처리</li><li>처리 결과 안내</li></ul></li>
                  <li><strong className="font-bold text-navy">서비스 개선 및 안정적인 운영</strong><ul className="mt-2 list-disc space-y-1 pl-5"><li>웹사이트 이용 현황 분석</li><li>오류 및 장애 확인</li><li>서비스 품질 및 사용자 경험 개선</li><li>보안 및 부정 이용 방지</li></ul></li>
                </ol>
                <p className={paragraphClassName}>BAAAAM은 개인정보를 위 목적 이외의 용도로 이용하지 않으며, 이용 목적이 변경되는 경우 관련 법령에 따라 필요한 조치를 취합니다.</p>
              </section>

              <section className={sectionClassName}>
                <h2 className={headingClassName}>제2조 수집하는 개인정보의 항목</h2>
                <p className={paragraphClassName}>BAAAAM은 서비스 운영 방식에 따라 다음과 같은 개인정보를 수집할 수 있습니다.</p>
                <div className="responsive-scroll mt-5 overflow-x-auto rounded-xl border border-border-subtle" tabIndex={0} aria-label="수집하는 개인정보 항목 표, 좌우로 스크롤할 수 있습니다">
                  <table className="w-full min-w-[680px] border-collapse text-left text-sm leading-6">
                    <thead className="bg-surface-muted text-navy">
                      <tr><th className="px-5 py-4 font-extrabold">구분</th><th className="px-5 py-4 font-extrabold">수집 항목</th><th className="px-5 py-4 font-extrabold">이용 목적</th></tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle text-ink-muted">
                      <tr><th scope="row" className="whitespace-nowrap px-5 py-4 font-bold text-navy">회원가입</th><td className="px-5 py-4">이름 또는 닉네임, 이메일 주소, 비밀번호</td><td className="px-5 py-4">회원 식별 및 계정 관리</td></tr>
                      <tr><th scope="row" className="whitespace-nowrap px-5 py-4 font-bold text-navy">서비스 이용</th><td className="px-5 py-4">작성 콘텐츠, 서비스 이용 기록</td><td className="px-5 py-4">서비스 제공 및 이용자 활동 관리</td></tr>
                      <tr><th scope="row" className="whitespace-nowrap px-5 py-4 font-bold text-navy">문의</th><td className="px-5 py-4">이름 또는 닉네임, 이메일 주소, 문의 내용</td><td className="px-5 py-4">문의 확인 및 답변</td></tr>
                      <tr><th scope="row" className="whitespace-nowrap px-5 py-4 font-bold text-navy">자동 수집 정보</th><td className="px-5 py-4">IP 주소, 접속 일시, 브라우저 및 기기 정보, 서비스 이용 기록</td><td className="px-5 py-4">보안, 장애 대응 및 서비스 개선</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className={paragraphClassName}>BAAAAM은 주민등록번호, 건강정보, 생체정보 등 서비스 제공에 필요하지 않은 개인정보 및 민감정보를 원칙적으로 수집하지 않습니다.</p>
              </section>

              <section className={sectionClassName}>
                <h2 className={headingClassName}>제3조 개인정보의 처리 및 보유기간</h2>
                <p className={paragraphClassName}>BAAAAM은 개인정보의 수집·이용 목적이 달성될 때까지 개인정보를 보유하며, 해당 목적이 달성되거나 회원이 탈퇴한 경우 지체 없이 파기하는 것을 원칙으로 합니다.</p>
                <p className={paragraphClassName}>다만 관계 법령에 따라 일정 기간 보관할 필요가 있거나 서비스의 보안 및 분쟁 해결 등을 위하여 필요한 경우에는 관련 법령이 허용하는 범위에서 일정 기간 보관할 수 있습니다.</p>
                <p className={paragraphClassName}>회원 탈퇴 시 회원 계정과 직접 연결된 개인정보는 원칙적으로 삭제됩니다.</p>
              </section>

              <section className={sectionClassName}>
                <h2 className={headingClassName}>제4조 만 14세 미만 이용자의 개인정보 보호</h2>
                <p className={paragraphClassName}>BAAAAM은 중학생을 포함한 청소년이 이용할 수 있는 교육 서비스라는 특성을 고려하여 아동·청소년의 개인정보 보호를 중요하게 다룹니다.</p>
                <p className={paragraphClassName}>만 14세 미만 이용자의 개인정보를 수집·이용하면서 법령상 동의가 필요한 경우에는 해당 이용자의 법정대리인의 동의를 받습니다.</p>
                <p className={paragraphClassName}>법정대리인의 동의 확인을 위하여 필요한 최소한의 정보가 추가로 수집될 수 있으며, 해당 정보는 법정대리인의 동의 여부를 확인하기 위한 목적으로만 이용합니다.</p>
                <p className={paragraphClassName}>BAAAAM은 만 14세 미만 이용자가 개인정보 처리 내용을 쉽게 이해할 수 있도록 가능한 한 명확하고 쉬운 표현을 사용하여 관련 내용을 안내합니다.</p>
              </section>

              <section className={sectionClassName}>
                <h2 className={headingClassName}>제5조 개인정보의 제3자 제공</h2>
                <p className={paragraphClassName}>BAAAAM은 원칙적으로 이용자의 개인정보를 외부의 제3자에게 제공하지 않습니다.</p>
                <p className={paragraphClassName}>다만 다음과 같은 경우에는 예외적으로 개인정보를 제공할 수 있습니다.</p>
                <ol className={listClassName}><li>이용자가 사전에 동의한 경우</li><li>관련 법령에 특별한 규정이 있는 경우</li><li>법령에 따라 수사기관 등 관계기관의 적법한 요청이 있는 경우</li></ol>
                <p className={paragraphClassName}>향후 개인정보를 제3자에게 제공할 필요가 발생하는 경우 제공받는 자, 제공 목적, 제공 항목 및 보유기간 등을 이용자에게 안내하고 필요한 동의를 받습니다.</p>
              </section>

              <section className={sectionClassName}>
                <h2 className={headingClassName}>제6조 개인정보 처리업무의 위탁</h2>
                <p className={paragraphClassName}>BAAAAM은 안정적인 웹사이트 운영을 위해 서버, 데이터베이스, 이메일 전송 등 일부 기능에 외부 서비스를 이용할 수 있습니다.</p>
                <p className={paragraphClassName}>개인정보 처리업무를 외부 업체에 위탁하는 경우 BAAAAM은 관련 법령에 따라 개인정보가 안전하게 관리될 수 있도록 필요한 조치를 취합니다.</p>
                <p className={paragraphClassName}>구체적인 위탁업체와 위탁업무가 있는 경우 해당 내용을 본 개인정보 처리방침을 통해 공개합니다.</p>
              </section>

              <section className={sectionClassName}>
                <h2 className={headingClassName}>제7조 개인정보의 파기</h2>
                <p className={paragraphClassName}>BAAAAM은 개인정보의 보유기간이 경과하거나 처리 목적이 달성되는 등 개인정보가 더 이상 필요하지 않게 된 경우 지체 없이 해당 개인정보를 파기합니다.</p>
                <p className={paragraphClassName}>전자적 파일 형태의 개인정보는 복구 또는 재생하기 어렵도록 안전한 방법으로 삭제하며, 종이 등 문서 형태의 개인정보가 있는 경우 분쇄하거나 안전한 방법으로 폐기합니다.</p>
                <p className={paragraphClassName}>다른 법령에 따라 일정 기간 보존해야 하는 개인정보는 다른 개인정보와 분리하여 보관한 후 보존기간이 종료되면 파기합니다.</p>
              </section>

              <section className={sectionClassName}>
                <h2 className={headingClassName}>제8조 이용자 및 법정대리인의 권리</h2>
                <p className={paragraphClassName}>이용자는 자신의 개인정보에 대하여 다음의 권리를 행사할 수 있습니다.</p>
                <ol className={listClassName}><li>개인정보 열람 요구</li><li>개인정보 정정 또는 삭제 요구</li><li>개인정보 처리정지 요구</li><li>개인정보 수집·이용 동의 철회</li><li>회원 탈퇴 및 계정 삭제 요청</li></ol>
                <p className={paragraphClassName}>만 14세 미만 이용자의 경우 법정대리인이 해당 이용자의 개인정보에 관한 권리를 행사할 수 있습니다.</p>
                <p className={paragraphClassName}>개인정보와 관련된 요청은 BAAAAM의 개인정보 담당자에게 문의할 수 있으며, BAAAAM은 관련 법령에서 정하는 범위 내에서 필요한 조치를 취합니다.</p>
              </section>

              <section className={sectionClassName}>
                <h2 className={headingClassName}>제9조 개인정보의 안전성 확보조치</h2>
                <p className={paragraphClassName}>BAAAAM은 이용자의 개인정보가 분실, 도난, 유출, 변조 또는 훼손되지 않도록 합리적인 범위에서 다음과 같은 보호조치를 시행합니다.</p>
                <ol className={listClassName}><li>개인정보 접근 권한 최소화</li><li>관리자 계정 및 접근 권한 관리</li><li>비밀번호의 안전한 저장</li><li>HTTPS 등 암호화 통신 적용</li><li>데이터베이스 접근 통제</li><li>웹사이트 및 서버의 보안 취약점 관리</li><li>개인정보를 취급하는 연구회 구성원에 대한 관리</li></ol>
                <p className={paragraphClassName}>특히 BAAAAM은 연구회 운영에 필요한 최소한의 인원에게만 개인정보에 대한 접근 권한을 부여합니다.</p>
              </section>

              <section className={sectionClassName}>
                <h2 className={headingClassName}>제10조 개인정보 자동 수집 장치</h2>
                <p className={paragraphClassName}>BAAAAM 웹사이트는 안정적인 서비스 제공, 이용 현황 분석 및 보안을 위하여 쿠키(Cookie), 접속 로그 또는 이와 유사한 기술을 사용할 수 있습니다.</p>
                <p className={paragraphClassName}>쿠키는 이용자의 웹브라우저에 저장되는 소량의 정보이며 로그인 상태 유지, 서비스 환경 설정 등의 목적으로 활용될 수 있습니다.</p>
                <p className={paragraphClassName}>이용자는 웹브라우저 설정을 통해 쿠키의 저장을 허용하거나 거부할 수 있습니다. 다만 필수 쿠키를 차단하는 경우 로그인 등 웹사이트의 일부 기능이 정상적으로 작동하지 않을 수 있습니다.</p>
              </section>

              <section className={sectionClassName}>
                <h2 className={headingClassName}>제11조 개인정보 보호책임자</h2>
                <p className={paragraphClassName}>BAAAAM은 이용자의 개인정보 보호 및 관련 문의 처리를 위하여 개인정보 보호 담당자를 지정하여 운영합니다.</p>
                <dl className="mt-5 grid gap-3 rounded-xl bg-surface-muted p-5 text-sm leading-6 sm:grid-cols-[7rem_1fr] sm:p-6">
                  <dt className="font-extrabold text-navy">단체명</dt><dd className="text-ink-muted">한국과학영재학교 BAAAAM 연구회</dd>
                  <dt className="font-extrabold text-navy">담당</dt><dd className="text-ink-muted">BAAAAM 연구회 개인정보 보호 담당자</dd>
                  <dt className="font-extrabold text-navy">이메일</dt><dd><a className="font-bold text-brand underline decoration-brand/30 underline-offset-4 hover:text-brand-strong" href={`mailto:${homeContent.footer.contactEmail}`}>{homeContent.footer.contactEmail}</a></dd>
                  <dt className="font-extrabold text-navy">웹사이트</dt><dd><a className="font-bold text-brand underline decoration-brand/30 underline-offset-4 hover:text-brand-strong" href="https://baaaam.cloud">baaaam.cloud</a></dd>
                </dl>
                <p className={paragraphClassName}>개인정보의 열람, 정정, 삭제, 처리정지 또는 개인정보 침해와 관련된 문의는 위 담당자에게 연락할 수 있습니다.</p>
              </section>

              <section className={sectionClassName}>
                <h2 className={headingClassName}>제12조 개인정보 침해에 대한 구제</h2>
                <p className={paragraphClassName}>이용자는 개인정보 침해와 관련하여 BAAAAM 개인정보 보호 담당자에게 문의할 수 있습니다.</p>
                <p className={paragraphClassName}>또한 필요한 경우 개인정보침해 신고센터, 개인정보분쟁조정위원회 등 관계기관을 통해 상담 또는 분쟁 해결을 요청할 수 있습니다.</p>
              </section>

              <section className={sectionClassName}>
                <h2 className={headingClassName}>제13조 개인정보 처리방침의 변경</h2>
                <p className={paragraphClassName}>BAAAAM은 관련 법령, 웹사이트 기능 또는 개인정보 처리 방식의 변경 등에 따라 본 개인정보 처리방침을 수정할 수 있습니다.</p>
                <p className={paragraphClassName}>개인정보 처리방침이 변경되는 경우 웹사이트를 통해 변경 내용과 시행일을 공개합니다. 이용자의 권리에 중대한 영향을 미치는 변경이 있는 경우에는 이용자가 쉽게 확인할 수 있는 방법으로 별도로 안내합니다.</p>
              </section>

              <section className={sectionClassName}>
                <h2 className={headingClassName}>부칙</h2>
                <p className={paragraphClassName}>본 개인정보 처리방침은 <strong className="font-extrabold text-navy">2026년 9월 3일</strong>부터 시행합니다.</p>
                <p className="mt-6 font-extrabold text-navy">한국과학영재학교 BAAAAM 연구회</p>
              </section>
            </div>

            {embedded ? null : <div className="mt-12 border-t border-border-subtle pt-8">
              <Link to="/" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-brand px-5 text-sm font-bold text-brand transition-colors hover:bg-brand-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                홈으로 돌아가기
              </Link>
            </div>}
          </div>
        </article>
      </ContentRoot>
      {embedded ? null : <SiteFooter />}
    </div>
  )
}
