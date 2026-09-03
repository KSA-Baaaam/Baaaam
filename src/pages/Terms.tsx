import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { SiteFooter } from '@/components/home/SiteFooter'
import { SiteHeader } from '@/components/home/SiteHeader'

const paragraphClassName = 'mt-4 text-[0.95rem] leading-8 text-ink-muted sm:text-base'
const listClassName = 'mt-4 list-decimal space-y-2 pl-6 text-[0.95rem] leading-7 text-ink-muted sm:text-base'

function TermsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border-subtle pt-9 first:border-t-0 first:pt-0">
      <h2 className="text-xl font-extrabold tracking-[-0.025em] text-navy sm:text-2xl">{title}</h2>
      {children}
    </section>
  )
}

export default function Terms() {
  return (
    <div className="min-h-screen bg-section text-ink">
      <SiteHeader />
      <main>
        <header className="border-b border-hero-border bg-hero">
          <div className="mx-auto max-w-5xl px-4 py-12 min-[375px]:px-5 sm:py-16 md:px-8 md:py-20">
            <p className="text-sm font-extrabold tracking-[0.12em] text-brand">TERMS OF SERVICE</p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.045em] text-navy sm:text-4xl md:text-5xl">BAAAAM 이용약관</h1>
            <p className="mt-5 inline-flex rounded-full border border-hero-border bg-white px-4 py-2 text-sm font-bold text-ink-muted">시행일: 2026년 9월 3일</p>
          </div>
        </header>

        <article className="mx-auto max-w-5xl px-4 py-8 min-[375px]:px-5 sm:py-10 md:px-8 md:py-16">
          <div className="rounded-2xl border border-border-subtle bg-white px-4 py-7 shadow-sm min-[375px]:px-5 sm:px-8 sm:py-10 md:px-12 md:py-14">
            <div className="space-y-10">
              <TermsSection title="제1조 목적">
                <p className={paragraphClassName}>본 약관은 한국과학영재학교 소속 BAAAAM 연구회(이하 “BAAAAM”)가 운영하는 BAAAAM 웹사이트 및 관련 서비스의 이용과 관련하여 BAAAAM과 이용자 간의 권리, 의무 및 책임사항을 정하는 것을 목적으로 합니다.</p>
                <p className={paragraphClassName}>BAAAAM은 수학·과학 개념을 중학생을 비롯한 청소년이 쉽고 흥미롭게 이해할 수 있도록 교육 콘텐츠를 제작하고 제공하는 비영리 학생 연구회입니다.</p>
              </TermsSection>

              <TermsSection title="제2조 용어의 정의">
                <p className={paragraphClassName}>본 약관에서 사용하는 용어의 의미는 다음과 같습니다.</p>
                <ol className={listClassName}>
                  <li><strong className="font-bold text-navy">“서비스”</strong>란 BAAAAM이 웹사이트를 통해 제공하는 수학·과학 교육 콘텐츠 및 이에 부수되는 모든 기능을 의미합니다.</li>
                  <li><strong className="font-bold text-navy">“이용자”</strong>란 BAAAAM 웹사이트에 접속하여 본 약관에 따라 서비스를 이용하는 사람을 의미합니다.</li>
                  <li><strong className="font-bold text-navy">“회원”</strong>이란 BAAAAM 웹사이트에 회원가입을 완료하고 계정을 이용하여 서비스를 이용하는 사람을 의미합니다.</li>
                  <li><strong className="font-bold text-navy">“콘텐츠”</strong>란 BAAAAM 웹사이트에서 제공되는 글, 설명, 그림, 이미지, 그래프, 문제, 해설, 영상, 자료 및 기타 정보 등을 의미합니다.</li>
                  <li><strong className="font-bold text-navy">“게시물”</strong>이란 이용자가 서비스를 이용하면서 작성하거나 등록하는 글, 댓글, 질문, 이미지 및 기타 자료를 의미합니다.</li>
                  <li>본 조에서 정의하지 않은 용어는 관련 법령 및 일반적인 관례에 따릅니다.</li>
                </ol>
              </TermsSection>

              <TermsSection title="제3조 약관의 게시 및 변경">
                <p className={paragraphClassName}>① BAAAAM은 이용자가 본 약관을 쉽게 확인할 수 있도록 웹사이트에 게시합니다.</p>
                <p className={paragraphClassName}>② BAAAAM은 관련 법령을 위반하지 않는 범위에서 필요한 경우 본 약관을 변경할 수 있습니다.</p>
                <p className={paragraphClassName}>③ 약관을 변경하는 경우 적용일과 주요 변경 내용을 웹사이트 등을 통해 사전에 안내합니다.</p>
                <p className={paragraphClassName}>④ 이용자의 권리 또는 의무에 중대한 영향을 미치는 내용이 변경되는 경우 이용자가 쉽게 확인할 수 있는 방법으로 별도로 안내합니다.</p>
                <p className={paragraphClassName}>⑤ 변경된 약관의 내용에 동의하지 않는 회원은 서비스 이용을 중단하고 회원 탈퇴를 요청할 수 있습니다.</p>
              </TermsSection>

              <TermsSection title="제4조 서비스의 목적">
                <p className={paragraphClassName}>BAAAAM은 다음과 같은 목적으로 서비스를 운영합니다.</p>
                <ol className={listClassName}><li>중학생을 비롯한 청소년을 위한 수학·과학 개념 설명</li><li>수학·과학 분야의 교육 콘텐츠 제공</li><li>과학적 사고와 탐구에 대한 관심 증진</li><li>학생들이 제작한 교육 콘텐츠의 공유</li><li>기타 BAAAAM의 연구 및 교육 목적에 부합하는 활동</li></ol>
                <p className={paragraphClassName}>BAAAAM은 상업적 이익보다는 교육 및 연구 활동을 목적으로 서비스를 운영하는 것을 원칙으로 합니다.</p>
              </TermsSection>

              <TermsSection title="제5조 회원가입">
                <p className={paragraphClassName}>① 이용자는 BAAAAM이 정한 회원가입 절차에 따라 필요한 정보를 입력하고 본 약관 및 개인정보 처리방침에 동의함으로써 회원가입을 신청할 수 있습니다.</p>
                <p className={paragraphClassName}>② 이용자는 회원가입 과정에서 정확한 정보를 제공해야 합니다.</p>
                <p className={paragraphClassName}>③ 다른 사람의 개인정보를 무단으로 이용하여 회원가입을 해서는 안 됩니다.</p>
                <p className={paragraphClassName}>④ 다음 각 호에 해당하는 경우 BAAAAM은 회원가입을 승인하지 않거나 추후 회원자격을 제한할 수 있습니다.</p>
                <ol className={listClassName}><li>다른 사람의 정보를 도용한 경우</li><li>허위 정보를 입력한 경우</li><li>서비스의 정상적인 운영을 방해할 목적으로 가입한 경우</li><li>이전에 중대한 이용규칙 위반으로 이용이 제한된 경우</li><li>관련 법령 또는 본 약관을 위반할 목적으로 가입한 것으로 판단되는 경우</li></ol>
              </TermsSection>

              <TermsSection title="제6조 만 14세 미만 이용자">
                <p className={paragraphClassName}>① BAAAAM은 중학생을 비롯한 청소년이 이용하는 서비스의 특성을 고려하여 아동·청소년 이용자의 권리와 안전을 중요하게 보호합니다.</p>
                <p className={paragraphClassName}>② 만 14세 미만 이용자의 개인정보 처리에 법정대리인의 동의가 필요한 경우 BAAAAM은 관련 법령 및 개인정보 처리방침에 따라 필요한 동의 절차를 진행합니다.</p>
                <p className={paragraphClassName}>③ BAAAAM은 아동·청소년 이용자가 서비스의 주요 내용과 이용규칙을 이해할 수 있도록 가능한 한 쉽고 명확한 표현으로 안내합니다.</p>
              </TermsSection>

              <TermsSection title="제7조 계정 관리">
                <p className={paragraphClassName}>① 회원은 자신의 계정 정보를 안전하게 관리해야 합니다.</p>
                <p className={paragraphClassName}>② 회원은 자신의 계정을 다른 사람에게 양도하거나 대여해서는 안 됩니다.</p>
                <p className={paragraphClassName}>③ 계정이 도용되거나 다른 사람이 무단으로 사용하고 있음을 확인한 경우 회원은 BAAAAM에 이를 알릴 수 있습니다.</p>
                <p className={paragraphClassName}>④ 회원의 고의 또는 과실로 계정정보가 노출되어 발생한 문제에 대해서는 관련 법령에서 허용하는 범위에서 회원에게 책임이 있을 수 있습니다.</p>
              </TermsSection>

              <TermsSection title="제8조 서비스의 제공">
                <p className={paragraphClassName}>BAAAAM은 다음과 같은 서비스를 제공할 수 있습니다.</p>
                <ol className={listClassName}><li>수학 개념 설명 콘텐츠</li><li>물리학 개념 설명 콘텐츠</li><li>화학 개념 설명 콘텐츠</li><li>생명과학 개념 설명 콘텐츠</li><li>지구과학 개념 설명 콘텐츠</li><li>기타 수학·과학 및 교육과 관련된 콘텐츠</li><li>회원 계정 및 콘텐츠 이용 기능</li><li>기타 BAAAAM이 추가로 개발하거나 제공하는 기능</li></ol>
                <p className={paragraphClassName}>서비스의 구체적인 구성과 기능은 연구회의 운영 및 개발 상황에 따라 변경될 수 있습니다.</p>
              </TermsSection>

              <TermsSection title="제9조 서비스의 변경 및 중단">
                <p className={paragraphClassName}>① BAAAAM은 웹사이트 개선, 시스템 점검, 서버 장애, 연구회 운영상의 사유 등으로 서비스의 일부 또는 전부를 변경하거나 일시적으로 중단할 수 있습니다.</p>
                <p className={paragraphClassName}>② 다음 각 호의 경우 사전 안내 없이 서비스가 일시적으로 중단될 수 있습니다.</p>
                <ol className={listClassName}><li>서버 또는 네트워크 장애가 발생한 경우</li><li>긴급한 보안 문제가 발생한 경우</li><li>천재지변 등 불가항력적인 사유가 발생한 경우</li><li>외부 서비스 또는 인프라의 장애가 발생한 경우</li><li>기타 서비스의 정상적인 제공이 어려운 긴급한 상황이 발생한 경우</li></ol>
                <p className={paragraphClassName}>③ BAAAAM은 학생 연구회가 운영하는 비영리 프로젝트의 특성상 연구회 운영 종료, 웹사이트 유지보수의 어려움 또는 기타 합리적인 사유가 있는 경우 서비스의 일부 또는 전부를 종료할 수 있습니다.</p>
                <p className={paragraphClassName}>④ 서비스 종료가 예정된 경우 가능한 범위에서 이용자에게 사전에 안내합니다.</p>
              </TermsSection>

              <TermsSection title="제10조 교육 콘텐츠의 성격">
                <p className={paragraphClassName}>① BAAAAM이 제공하는 콘텐츠는 수학·과학에 대한 이해를 돕기 위한 <strong className="font-bold text-navy">교육 및 학습 목적의 자료</strong>입니다.</p>
                <p className={paragraphClassName}>② BAAAAM은 콘텐츠의 정확성과 신뢰성을 높이기 위해 노력하지만 모든 콘텐츠가 오류 없이 완전하거나 특정 교육과정 및 시험의 기준과 항상 일치함을 보장하지는 않습니다.</p>
                <p className={paragraphClassName}>③ 이용자는 중요한 학업, 연구 또는 기타 판단을 내리는 경우 교과서, 전문서적, 논문, 교육기관 또는 해당 분야 전문가의 자료를 함께 확인하는 것이 권장됩니다.</p>
                <p className={paragraphClassName}>④ 콘텐츠에서 오류를 발견한 이용자는 BAAAAM에 수정을 요청하거나 의견을 전달할 수 있습니다.</p>
              </TermsSection>

              <TermsSection title="제11조 이용자의 의무">
                <p className={paragraphClassName}>이용자는 서비스를 이용할 때 다음 행위를 해서는 안 됩니다.</p>
                <ol className={listClassName}><li>다른 사람의 개인정보 또는 계정을 도용하는 행위</li><li>웹사이트의 정상적인 운영을 고의로 방해하는 행위</li><li>서버 또는 시스템에 허가 없이 접근하려는 행위</li><li>악성코드 등을 배포하는 행위</li><li>서비스에 과도한 트래픽을 발생시키는 행위</li><li>타인을 모욕·협박하거나 괴롭히는 행위</li><li>음란하거나 폭력적인 콘텐츠를 게시하는 행위</li><li>다른 사람의 저작권, 상표권 등 권리를 침해하는 행위</li><li>개인정보를 무단으로 수집하거나 공개하는 행위</li><li>관련 법령을 위반하는 행위</li><li>기타 서비스의 교육 목적 또는 정상적인 운영을 현저하게 방해하는 행위</li></ol>
              </TermsSection>

              <TermsSection title="제12조 게시물 관리">
                <p className={paragraphClassName}>① 이용자가 게시물을 작성할 수 있는 기능이 제공되는 경우 이용자는 자신이 작성한 게시물에 대한 책임을 부담합니다.</p>
                <p className={paragraphClassName}>② 다음에 해당하는 게시물은 사전 통지 없이 숨김 또는 삭제될 수 있습니다.</p>
                <ol className={listClassName}><li>다른 이용자를 모욕하거나 괴롭히는 내용</li><li>개인정보가 무단으로 포함된 내용</li><li>불법적인 내용</li><li>음란하거나 지나치게 폭력적인 내용</li><li>타인의 저작권 등 권리를 침해하는 내용</li><li>광고 또는 반복적인 스팸 게시물</li><li>악성코드나 위험한 외부 링크를 포함하는 내용</li><li>BAAAAM의 교육 목적과 현저하게 관련이 없는 내용</li><li>서비스의 정상적인 운영을 방해하는 내용</li></ol>
                <p className={paragraphClassName}>③ 게시물 삭제 또는 이용 제한이 필요한 경우 BAAAAM은 사안의 성격과 긴급성 등을 고려하여 필요한 조치를 취합니다.</p>
              </TermsSection>

              <TermsSection title="제13조 저작권">
                <p className={paragraphClassName}>① BAAAAM이 직접 제작한 글, 이미지, 도표, 디자인 및 기타 콘텐츠에 관한 저작권 등 권리는 해당 콘텐츠를 제작한 저작자 또는 정당한 권리자에게 있습니다.</p>
                <p className={paragraphClassName}>② 이용자는 BAAAAM 또는 해당 권리자의 허락 없이 콘텐츠를 상업적으로 이용하거나 무단 복제·배포하여서는 안 됩니다.</p>
                <p className={paragraphClassName}>③ 학교 수업, 개인 학습 등 비영리 교육 목적으로 콘텐츠를 활용하려는 경우에도 콘텐츠별 이용조건과 저작권 표시를 확인해야 합니다.</p>
                <p className={paragraphClassName}>④ BAAAAM이 외부 자료를 인용하거나 활용하는 경우 해당 자료의 저작권은 원저작자 또는 권리자에게 있습니다.</p>
                <p className={paragraphClassName}>⑤ 이용자가 자신의 저작권이 침해되었다고 판단하는 경우 BAAAAM에 해당 게시물의 삭제 또는 필요한 조치를 요청할 수 있습니다.</p>
              </TermsSection>

              <TermsSection title="제14조 이용자 게시물의 권리">
                <p className={paragraphClassName}>① 이용자가 직접 작성한 게시물의 저작권은 원칙적으로 해당 이용자에게 있습니다.</p>
                <p className={paragraphClassName}>② 이용자가 게시물을 서비스에 공개적으로 게시한 경우 BAAAAM은 해당 게시물을 서비스 내에서 표시하고 제공하기 위하여 필요한 범위에서 이용할 수 있습니다.</p>
                <p className={paragraphClassName}>③ BAAAAM이 이용자의 게시물을 서비스 제공 목적을 넘어 홍보자료, 연구자료 또는 별도의 콘텐츠 등에 이용하려는 경우에는 필요한 범위에서 별도의 동의를 받습니다.</p>
              </TermsSection>

              <TermsSection title="제15조 이용 제한">
                <p className={paragraphClassName}>① BAAAAM은 이용자가 본 약관을 위반한 경우 위반 정도에 따라 다음과 같은 조치를 취할 수 있습니다.</p>
                <ol className={listClassName}><li>경고</li><li>게시물 삭제 또는 숨김</li><li>일부 기능 이용 제한</li><li>일정 기간 계정 이용 정지</li><li>계정 이용의 영구 제한</li></ol>
                <p className={paragraphClassName}>② 이용 제한은 위반 행위의 내용, 반복 여부, 다른 이용자에게 미친 영향 등을 고려하여 합리적인 범위에서 결정합니다.</p>
                <p className={paragraphClassName}>③ 긴급한 보안 문제, 다른 이용자에 대한 중대한 피해 또는 불법행위가 의심되는 경우 우선 필요한 제한 조치를 취한 후 이용자에게 안내할 수 있습니다.</p>
              </TermsSection>

              <TermsSection title="제16조 회원 탈퇴">
                <p className={paragraphClassName}>① 회원은 언제든지 BAAAAM이 제공하는 방법을 통해 회원 탈퇴를 요청할 수 있습니다.</p>
                <p className={paragraphClassName}>② 회원 탈퇴가 완료되면 개인정보는 BAAAAM 개인정보 처리방침 및 관련 법령에 따라 처리됩니다.</p>
                <p className={paragraphClassName}>③ 탈퇴 후 삭제된 계정정보는 복구하기 어려울 수 있습니다.</p>
                <p className={paragraphClassName}>④ 회원이 작성한 공개 게시물은 회원 탈퇴만으로 자동 삭제되지 않을 수 있습니다. 삭제를 원하는 게시물이 있는 경우 탈퇴 전에 직접 삭제하거나 BAAAAM에 삭제를 요청할 수 있습니다.</p>
              </TermsSection>

              <TermsSection title="제17조 개인정보 보호">
                <p className={paragraphClassName}>① BAAAAM은 서비스 제공 과정에서 이용자의 개인정보를 관련 법령에 따라 보호합니다.</p>
                <p className={paragraphClassName}>② 개인정보의 수집, 이용, 보관, 파기 등에 관한 구체적인 사항은 별도로 공개하는 <Link to="/privacy" className="font-bold text-brand underline decoration-brand/30 underline-offset-4 hover:text-brand-strong">「BAAAAM 개인정보 처리방침」</Link>에 따릅니다.</p>
                <p className={paragraphClassName}>③ BAAAAM은 서비스 운영에 필요한 범위에서 최소한의 개인정보를 처리하도록 노력합니다.</p>
              </TermsSection>

              <TermsSection title="제18조 BAAAAM의 의무">
                <p className={paragraphClassName}>BAAAAM은 다음 사항을 준수하기 위해 노력합니다.</p>
                <ol className={listClassName}><li>관련 법령과 본 약관의 준수</li><li>안정적인 서비스 제공</li><li>이용자의 개인정보 보호</li><li>웹사이트의 보안 유지</li><li>교육 콘텐츠의 정확성 및 품질 향상</li><li>이용자의 정당한 문의 및 의견에 대한 처리</li></ol>
              </TermsSection>

              <TermsSection title="제19조 책임의 제한">
                <p className={paragraphClassName}>① BAAAAM은 학생 연구회가 비영리 교육 및 연구 목적으로 운영하는 서비스로서 서비스의 지속적인 제공을 위해 노력합니다.</p>
                <p className={paragraphClassName}>② 천재지변, 통신 장애, 외부 서버 장애 등 BAAAAM이 합리적으로 통제하기 어려운 사유로 서비스 제공이 불가능해진 경우에는 관련 법령이 허용하는 범위에서 책임이 제한될 수 있습니다.</p>
                <p className={paragraphClassName}>③ BAAAAM은 이용자의 귀책사유로 발생한 서비스 이용 장애에 대해서는 BAAAAM에 고의 또는 과실이 없는 한 책임을 부담하지 않습니다.</p>
                <p className={paragraphClassName}>④ 본 조는 관련 법령에 따라 BAAAAM이 부담해야 하는 책임을 부당하게 면제하거나 이용자의 법적 권리를 제한하는 것으로 해석되지 않습니다.</p>
              </TermsSection>

              <TermsSection title="제20조 의견 및 문의">
                <p className={paragraphClassName}>서비스 이용, 게시물, 계정 또는 본 약관에 관한 문의는 다음 연락처를 통해 할 수 있습니다.</p>
                <dl className="mt-5 grid gap-3 rounded-xl bg-surface-muted p-5 text-sm leading-6 sm:grid-cols-[7rem_1fr] sm:p-6">
                  <dt className="font-extrabold text-navy">운영단체</dt><dd className="text-ink-muted">한국과학영재학교 BAAAAM 연구회</dd>
                  <dt className="font-extrabold text-navy">문의 담당</dt><dd className="text-ink-muted">BAAAAM 연구회 운영진</dd>
                  <dt className="font-extrabold text-navy">이메일</dt><dd><a className="font-bold text-brand underline decoration-brand/30 underline-offset-4 hover:text-brand-strong" href="mailto:dev.baaaam@gmail.com">dev.baaaam@gmail.com</a></dd>
                  <dt className="font-extrabold text-navy">웹사이트</dt><dd><a className="font-bold text-brand underline decoration-brand/30 underline-offset-4 hover:text-brand-strong" href="https://baaaam.cloud">baaaam.cloud</a></dd>
                </dl>
              </TermsSection>

              <TermsSection title="제21조 준거법">
                <p className={paragraphClassName}>① 본 약관 및 BAAAAM 서비스와 관련된 사항에는 대한민국 법령을 적용합니다.</p>
                <p className={paragraphClassName}>② BAAAAM과 이용자 사이에 분쟁이 발생한 경우 당사자 간의 협의를 통해 해결하도록 노력합니다.</p>
                <p className={paragraphClassName}>③ 협의로 해결되지 않는 분쟁에 대해서는 대한민국의 관련 법령에서 정하는 절차에 따릅니다.</p>
              </TermsSection>

              <TermsSection title="부칙">
                <h3 className="mt-4 font-extrabold text-navy">제1조 시행일</h3>
                <p className={paragraphClassName}>본 이용약관은 <strong className="font-extrabold text-navy">2026년 9월 3일</strong>부터 시행합니다.</p>
                <p className="mt-6 font-extrabold text-navy">한국과학영재학교 BAAAAM 연구회</p>
              </TermsSection>
            </div>

            <div className="mt-12 border-t border-border-subtle pt-8">
              <Link to="/" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-brand px-5 text-sm font-bold text-brand transition-colors hover:bg-brand-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">홈으로 돌아가기</Link>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}
