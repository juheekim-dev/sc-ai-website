import type { Metadata } from "next";
import "../landing.css"; // 홈과 같은 섹션 스타일(SSOT) — 히어로·로고·카드·리포트·CTA를 그대로 쓴다
import PageHero, { HeroWord } from "@/components/PageHero";
import ClientLogos from "@/components/ClientLogos";
import ReportRows from "@/components/ReportRows";
import IntegritySection from "@/components/IntegritySection";
import SecuritySection from "@/components/SecuritySection";
import FaqList from "@/components/FaqList";
import SoftCta from "@/components/SoftCta";
import FinalCta from "@/components/FinalCta";
import { buildPageMetadata } from "@/lib/pageSeo";

export const revalidate = 3600; // ISR 1시간 — 홈과 같은 주기. 분 단위로 줄이지 않는다(ISR Writes 한도, CLAUDE.md '렌더링·캐시')

// ⚠️ title 에는 사이트명을 넣지 않는다 — layout.tsx 의 template("%s · AI면접")이 붙인다.
const FALLBACK_METADATA: Metadata = {
  title: "AI 면접 — 질문부터 검증 리포트까지",
  description:
    "채용공고를 넣으면 AI가 평가 기준과 질문을 만들고, 지원자 답변에 꼬리질문을 이어 갑니다. 채용팀은 검증 리포트를 보고 만날 사람을 정합니다.",
  alternates: { canonical: "/ai-interview" },
  openGraph: {
    title: "슈퍼코더 AI 면접 — 질문부터 검증 리포트까지",
    description: "AI가 질문하고, 지원자 답변을 분석해 검증 리포트 한 장으로 정리합니다.",
    url: "/ai-interview",
    images: [{ url: "/og-image.png?v=3", width: 1200, height: 630 }],
  },
};
export function generateMetadata() {
  return buildPageMetadata("/ai-interview", FALLBACK_METADATA);
}

// 문구의 사실 근거: _docs/홈페이지 개편/AI면접_AI역량검사_차이_소개자료.md (회사별로 켜는 기능·수치는 싣지 않는다)
const TYPES = [
  { icon: "fa-file-lines", title: "채용공고 기반 면접", body: "직무 기술서에서 평가 항목을 뽑고, 항목마다 단계별 기준과 맞춤 질문을 만듭니다." },
  { icon: "fa-user-check", title: "이력서 기반 면접", body: "지원자의 이력서와 경력을 분석해, 적힌 경험을 확인하는 질문을 만듭니다." },
];

const TEAM = [
  { icon: "fa-envelope", title: "초대·지원자 관리", body: "메일로 여러 명을 한 번에 초대하거나, 공개 링크로 받습니다." },
  { icon: "fa-file-pdf", title: "리포트 공유", body: "리포트를 PDF로 저장하고, 현업 면접관과 링크로 공유합니다." },
  { icon: "fa-plug", title: "채용 시스템 연동", body: "지금 쓰는 채용 시스템과 API로 연동합니다." },
];

// 제품 페이지 FAQ는 코드에 고정한다(어드민 FAQ는 홈 전용).
const FAQS = [
  {
    question: "질문은 누가 만드나요?",
    answer: "채용공고나 이력서를 넣으면 AI가 평가 항목과 기준, 질문을 만듭니다. 채용팀이 직접 고치거나 설정 채팅으로 원하는 방향을 말할 수 있고, 채용팀이 승인해야 반영됩니다.",
  },
  {
    question: "지원자는 어디서 응시하나요?",
    answer: "메일이나 공고의 링크로 들어와 노트북이나 데스크톱에서 봅니다. 앱은 설치하지 않아도 됩니다. 면접 마감 전이라면 중간에 나가도 같은 링크로 하던 단계부터 이어서 볼 수 있습니다.",
  },
  {
    question: "부정행위는 어떻게 확인하나요?",
    answer: "시선·머리 움직임, 여러 얼굴 감지, 탭 전환, 보조 모니터 연결 같은 항목을 프로젝트마다 골라 켭니다. 감지 내역은 리포트에 남고 영상의 그 장면으로 바로 이동할 수 있습니다. 최종 판단은 채용팀이 합니다.",
  },
  {
    question: "지금 쓰는 채용 시스템과 연결되나요?",
    answer: "API로 연동합니다. 연동 방식은 도입 상담에서 안내해 드립니다.",
  },
];

const plain = (s: string) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: plain(f.answer) } })),
};

const stepIcon = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export default function AiInterviewPage() {
  return (
    <>
      {/* 01 · 히어로 */}
      <PageHero
        title={
          <>
            <span className="sky">1차 면접, 질문부터 리포트까지</span><br />
            <HeroWord>AI</HeroWord><span className="sky">가 진행합니다</span>
          </>
        }
        lead="채용공고를 넣으면 평가 기준과 질문을 만들고, 지원자 답변에 꼬리질문을 이어 갑니다. 채용팀은 리포트를 보고 만날 사람을 정합니다."
      />

      {/* 02 · 고객사 로고 */}
      <ClientLogos />

      {/* 03 · 면접 유형 */}
      <section className="band soft" id="types">
        <div className="wrap">
          <div className="head">
            <h2>확인하고 싶은 것에 맞춰<br /><span className="blue">면접 유형</span>을 고르세요</h2>
          </div>
          <div className="value-grid two">
            {TYPES.map((t) => (
              <div className="valcard" key={t.title}>
                <div className="ic"><i className={`fa-solid ${t.icon}`}></i></div>
                <h3>{t.title}</h3>
                <p>{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 · 면접 진행 + 05 · 리포트(공용) */}
      <section className="how" id="how">
        <div className="wrap">
          <div className="head">
            <h2>면접 준비는 AI가,<br /><span className="blue">확인은 채용팀</span>이</h2>
          </div>
          <div className="how-rows">
            <div className="how-row">
              <div className="hr-info">
                <span className="hr-eyebrow">면접 진행</span>
                <h3>AI가 묻고, 답에 따라 꼬리질문을 이어 갑니다</h3>
                <p>채용공고를 넣으면 AI가 평가 기준과 질문을 만듭니다. 채용팀이 직접 고치거나 설정 채팅으로 방향을 말할 수 있고, 승인해야 반영됩니다.</p>
              </div>
              <div className="hr-media">
                <img className="hr-img" src="/diagram-question.webp" alt="면접 진행 도식: 지원자 영상과 AI 질문·꼬리질문" width={1080} height={570} loading="lazy" />
              </div>
            </div>
          </div>

          <div className="head" style={{ paddingTop: "clamp(96px,12vw,160px)" }}>
            <h2>리포트 한 장으로<br /><span className="blue">바로 판단</span>합니다</h2>
            <p className="lead">질문별 답변 요약과 면접 영상까지 함께 남습니다.</p>
          </div>
          <ReportRows />
        </div>
      </section>

      {/* 06 · 부정행위 감지(공용) */}
      <IntegritySection />

      {/* 07 · 지원자 응시 과정 */}
      <section className="band" id="candidate">
        <div className="wrap">
          <div className="head">
            <h2>지원자는 <span className="blue">링크 하나로</span><br />바로 면접을 봅니다</h2>
            <p className="lead">앱을 설치하지 않아도 되고, 노트북이나 데스크톱에서 봅니다.</p>
          </div>
          <div className="flow2">
            <div className="pstep">
              <div className="pic"><svg viewBox="0 0 24 24" {...stepIcon}><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" /><rect x="2" y="6" width="14" height="12" rx="2" /></svg></div>
              <span className="pstep-tag">STEP 01</span>
              <h3>링크 받고 기기 확인</h3>
              <p>메일 링크로 들어와<br />카메라·마이크·스피커를 점검합니다.</p>
            </div>
            <div className="pstep">
              <div className="pic"><svg viewBox="0 0 24 24" {...stepIcon}><circle cx="12" cy="12" r="10" /><path d="m10 8 6 4-6 4z" /></svg></div>
              <span className="pstep-tag">STEP 02</span>
              <h3>연습 질문으로 체험</h3>
              <p>진행 방식을 미리 익힙니다.<br />이 답변은 저장되지 않습니다.</p>
            </div>
            <div className="pstep">
              <div className="pic"><svg viewBox="0 0 24 24" {...stepIcon}><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" /><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" /></svg></div>
              <span className="pstep-tag">STEP 03</span>
              <h3>본 면접</h3>
              <p>AI 면접관의 질문에 답합니다.<br />나가도 같은 링크로 이어서 봅니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 08 · 채용팀 기능 */}
      <section className="band soft" id="team">
        <div className="wrap">
          <div className="head">
            <h2>초대부터 검토까지<br /><span className="blue">한곳에서</span></h2>
          </div>
          <div className="value-grid">
            {TEAM.map((t) => (
              <div className="valcard" key={t.title}>
                <div className="ic"><i className={`fa-solid ${t.icon}`}></i></div>
                <h3>{t.title}</h3>
                <p>{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 09 · 보안(공용) */}
      <SecuritySection />

      {/* 10 · FAQ */}
      <section className="faq" id="faq">
        <div className="wrap">
          <div className="head">
            <h2>자주 묻는 질문</h2>
          </div>
          <FaqList items={FAQS} />
        </div>
      </section>

      {/* 11 · AI 역량검사 안내 */}
      <section className="band" id="next">
        <div className="wrap">
          <SoftCta title="AI를 실무에 쓰는 실력까지 확인하고 싶다면" href="/ai-assessment" label="AI 역량검사 보기" outline />
        </div>
      </section>

      {/* 12 · 마지막 CTA */}
      <FinalCta before={<>다음 채용은,<br /></>} word="AI 면접" after="으로 더 빠르게 시작하세요." />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </>
  );
}
