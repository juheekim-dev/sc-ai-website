import type { Metadata } from "next";
import "../landing.css"; // 홈과 같은 섹션 스타일(SSOT) — 카드·리포트·단계·CTA를 그대로 쓴다
import ProductHero from "@/components/ProductHero";
import ClientLogos from "@/components/ClientLogos";
import StepFlow from "@/components/StepFlow";
import ReportRows from "@/components/ReportRows";
import IntegritySection from "@/components/IntegritySection";
import TeamSection from "@/components/TeamSection";
import SecuritySection from "@/components/SecuritySection";
import FaqList from "@/components/FaqList";
import NextProductCard from "@/components/NextProductCard";
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
const WHEN = [
  { label: "지원자가 많을 때", big: "1차 면접을 한 번에", body: "사람이 다 보기 어려운 1차 면접을 AI가 진행합니다." },
  { label: "경험 확인", big: "이력서부터 검증", body: "이력서에 적힌 경험이 사실인지 질문으로 먼저 확인합니다." },
  { label: "같은 기준", big: "모두 같은 기준으로", body: "모든 지원자를 같은 평가 기준으로 비교합니다." },
];

const TYPES = [
  { icon: "fa-file-lines", title: "채용공고 기반 면접", body: "직무 기술서에서 평가 항목을 뽑고, 항목마다 단계별 기준과 맞춤 질문을 만듭니다." },
  { icon: "fa-user-check", title: "이력서 기반 면접", body: "지원자의 이력서와 경력을 분석해, 적힌 경험을 확인하는 질문을 만듭니다." },
];

// lucide 선 아이콘 경로
const ICON = {
  file: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></>,
  sparkles: <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />,
  send: <><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></>,
  camera: <><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" /><rect x="2" y="6" width="14" height="12" rx="2" /></>,
  play: <><circle cx="12" cy="12" r="10" /><path d="m10 8 6 4-6 4z" /></>,
  chat: <><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" /><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" /></>,
};

const START = [
  { title: "채용공고 등록", body: <>직무 기술서를 넣거나<br />이력서 기반 면접을 고릅니다.</>, icon: ICON.file },
  { title: "AI가 기준·질문 생성", body: <>AI가 평가 기준과 질문을 만들고<br />채용팀이 고치거나 승인합니다.</>, icon: ICON.sparkles },
  { title: "링크 보내고 리포트 받기", body: <>지원자에게 링크를 보내면<br />응시가 끝나는 대로 리포트가 옵니다.</>, icon: ICON.send },
];

const CANDIDATE = [
  { title: "링크 받고 기기 확인", body: <>메일 링크로 들어와<br />카메라·마이크·스피커를 점검합니다.</>, icon: ICON.camera },
  { title: "연습 질문으로 체험", body: <>진행 방식을 미리 익힙니다.<br />이 답변은 저장되지 않습니다.</>, icon: ICON.play },
  { title: "본 면접", body: <>AI 면접관의 질문에 답합니다.<br />나가도 같은 링크로 이어서 봅니다.</>, icon: ICON.chat },
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

// 섹션 흐름(2026-11-25 재구성 — AI 역량검사 페이지와 같은 순서):
// 01 히어로(밝은 바탕 + 제품 이미지) · 02 도입사 · 03 이럴 때 씁니다 · 04 도입 3단계 · 05 면접 유형 · 06 면접 진행 + 리포트
// · 07 부정행위 감지 · 08 지원자 응시 과정 · 09 채용팀 기능 · 10 보안 · 11 FAQ · 12 AI 역량검사 안내 · 13 마지막 CTA
// 배경은 흰색↔연한 블루가 번갈아: 03 연한 · 04 흰 · 05 연한 · 06 흰(.how) · 07 연한 · 08 흰 · 09 연한 · 10 흰 · 11 연한 · 12 흰
export default function AiInterviewPage() {
  return (
    <>
      {/* 01 · 히어로 */}
      <ProductHero
        name="AI 면접"
        dark // 어두운 바탕(AI 역량검사 문제 띠와 같은 남색→블랙) — 밝은 바탕에 어두운 화면인 AI 역량검사 히어로와 대비(11/25)
        title={<>1차 면접,<br />질문부터 리포트까지<br /><span className="blue">AI</span>가 진행합니다</>}
        lead="채용공고를 넣으면 평가 기준과 질문을 만들고, 지원자 답변에 꼬리질문을 이어 갑니다. 채용팀은 리포트를 보고 만날 사람을 정합니다."
        img="/hero-interview-base.webp"
        alt="AI 면접 화면: AI 면접관이 질문과 꼬리질문을 하고, 지원자 답변을 분석해 종합 등급과 역량 막대가 있는 AI 면접 리포트로 정리하는 모습"
        // 히어로(11/25 B안 3차): AI 역량검사(어두운 화면)와 구분되는 흰 화면 + AI 면접관 오브 카드 + 리포트 카드. 모션은 AI 역량검사와 같은 흐름 —
        // AI 면접관 카드 위→아래, 리포트 카드 아래→위, '답변 분석 중' 칩 왼쪽→오른쪽. 원본은 _docs/홈페이지 개편/도식/캡처가공(iv3-l-*)
        layers={[
          { src: "/hero-interview-ai.webp", move: "down" },
          { src: "/hero-interview-report.webp", move: "up" },
          { src: "/hero-interview-chip.webp", move: "right" },
        ]}
        lines={[
          { d: "M403 197 V225", dot: [403, 227] },
          { d: "M300 264 V232", dot: [300, 230] },
        ]}
      />

      {/* 02 · 고객사 로고 */}
      <ClientLogos />

      {/* 03 · 이럴 때 씁니다 */}
      <section className="band soft" id="when">
        <div className="wrap">
          <div className="head">
            <h2>이럴 때<br /><span className="blue">AI 면접</span>을 씁니다</h2>
          </div>
          <div className="proof-row">
            {WHEN.map((w) => (
              <div className="pc2" key={w.label}>
                <div className="vlabel">{w.label}</div>
                <div className="big big-phrase">{w.big}</div>
                <p>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 · 도입 3단계 */}
      <section className="band" id="start">
        <div className="wrap">
          <div className="head">
            <h2>채용공고만 등록하면<br /><span className="blue">리포트까지</span> 이어집니다</h2>
            <p className="lead">AI가 만든 기준과 질문은 채용팀이 승인해야 반영됩니다.</p>
          </div>
          <StepFlow steps={START} />
        </div>
      </section>

      {/* 05 · 면접 유형 */}
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

      {/* 06 · 면접 진행 + 리포트(공용) */}
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

      {/* 07 · 부정행위 감지(공용) */}
      <IntegritySection />

      {/* 08 · 지원자 응시 과정 */}
      <section className="band" id="candidate">
        <div className="wrap">
          <div className="head">
            <h2>지원자는 <span className="blue">링크 하나로</span><br />바로 면접을 봅니다</h2>
            <p className="lead">앱을 설치하지 않아도 되고, 노트북이나 데스크톱에서 봅니다.</p>
          </div>
          <StepFlow steps={CANDIDATE} />
        </div>
      </section>

      {/* 09 · 채용팀 기능(공용) */}
      <TeamSection />

      {/* 10 · 보안(공용) */}
      <SecuritySection />

      {/* 11 · FAQ */}
      <section className="faq" id="faq">
        <div className="wrap">
          <div className="head">
            <h2>자주 묻는 질문</h2>
          </div>
          <FaqList items={FAQS} />
        </div>
      </section>

      {/* 12 · AI 역량검사 안내 — 상대 제품 썸네일 카드(NextProductCard) */}
      <section className="band" id="next">
        <div className="wrap">
          <NextProductCard href="/ai-assessment" title="AI를 실무에 쓰는 실력까지 확인하고 싶다면" body="지원자가 AI와 함께 실제 과제를 풀고, 결과물과 AI를 쓴 과정까지 평가합니다." />
        </div>
      </section>

      {/* 13 · 마지막 CTA */}
      <FinalCta before={<>다음 채용은,<br /></>} word="AI 면접" after="으로 더 빠르게 시작하세요." />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </>
  );
}
