import type { Metadata } from "next";
import "../landing.css"; // 홈과 같은 섹션 스타일(SSOT) — 카드·리포트·단계·CTA를 그대로 쓴다
import ProductHero from "@/components/ProductHero";
import ClientLogos from "@/components/ClientLogos";
import StepFlow from "@/components/StepFlow";
import PairGrid from "@/components/PairGrid";
import ReportRows from "@/components/ReportRows";
import IntegritySection from "@/components/IntegritySection";
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

// 03 · 문제 — 어두운 띠(AI 역량검사와 같은 C안, 11/25): 처음엔 문제 카드만, 흰 체크 박스가 차례로 올라와 덮는다(components/PairGrid.tsx).
// 예전 '이럴 때 씁니다' 세 장(지원자가 많을 때 · 경험 확인 · 같은 기준)을 문제 → 해결로 짝지었다. 문장은 한 줄에 들어가게 짧게.
const PAIRS = [
  { problem: "지원자가 많아 1차 면접을 다 못 봅니다", solution: "AI가 1차 면접을 한 번에 진행합니다" },
  { problem: "이력서의 경험이 사실인지 알 수 없습니다", solution: "꼬리질문으로 적힌 경험을 확인합니다" },
  { problem: "면접관마다 기준이 달라 비교가 어렵습니다", solution: "모든 지원자를 같은 기준으로 평가합니다" },
];

const TYPES = [
  { icon: "fa-file-lines", title: "채용공고 기반 면접", body: "직무 기술서에서 평가 항목을 뽑고, 항목마다 단계별 기준과 맞춤 질문을 만듭니다." },
  { icon: "fa-user-check", title: "이력서 기반 면접", body: "지원자의 이력서와 경력을 분석해, 적힌 경험을 확인하는 질문을 만듭니다." },
];

// 06 · 도입 3단계 — AI 역량검사 '과제 만들기'처럼 카드 아래 화면 이미지(아이콘 없음, 11/25).
// STEP 01은 AI 역량검사 STEP 1과 같은 채용공고 입력 이미지, 02·03은 캡처가 없어 같은 스타일로 그리고 정보를 최대한 줄임(질문은 회색 막대) — _docs/홈페이지 개편/도식/캡처가공
const START = [
  { title: "채용공고 등록", body: <>직무 기술서를 넣거나<br />이력서 기반 면접을 고릅니다.</>, img: "/assessment-step-jd.webp", alt: "채용공고 입력 화면: 직무 기술서의 요구사항을 넣는 칸" },
  { title: "AI가 기준·질문 생성", body: <>AI가 평가 기준과 질문을 만들고<br />채용팀이 고치거나 승인합니다.</>, img: "/interview-step-criteria.webp", alt: "평가 기준과 질문 화면: 평가 항목 탭과 질문 목록, 승인 버튼" },
  { title: "링크 보내고 리포트 받기", body: <>지원자에게 링크를 보내면<br />응시가 끝나는 대로 리포트가 옵니다.</>, img: "/interview-step-invite.webp", alt: "지원자 목록 화면: 응시를 마친 지원자의 리포트 보기" },
];

// 제품 페이지 FAQ는 코드에 고정한다(어드민 FAQ는 홈 전용).
const FAQS = [
  {
    question: "질문은 누가 만드나요?",
    answer: "채용공고나 이력서를 넣으면 AI가 평가 항목과 기준, 질문을 만듭니다. 채용팀이 직접 고치거나 설정 채팅으로 원하는 방향을 말할 수 있고, 채용팀이 승인해야 반영됩니다.",
  },
  {
    question: "지원자는 어디서 응시하나요?",
    answer: "메일이나 공고의 링크로 들어와 노트북이나 데스크톱에서 봅니다. 앱은 설치하지 않아도 됩니다. 시작 전에 카메라·마이크·스피커를 점검하고, 연습 질문으로 진행 방식을 익힐 수 있습니다(연습 답변은 저장되지 않습니다). 면접 마감 전이라면 중간에 나가도 같은 링크로 하던 단계부터 이어서 볼 수 있습니다.",
  },
  {
    question: "부정행위는 어떻게 확인하나요?",
    answer: "시선·머리 움직임, 여러 얼굴 감지, 탭 전환, 보조 모니터 연결 같은 항목을 프로젝트마다 골라 켭니다. 감지 내역은 리포트에 남고 영상의 그 장면으로 바로 이동할 수 있습니다. 최종 판단은 채용팀이 합니다.",
  },
  // 11/25 흐름 정리로 빠진 '채용팀 기능' 섹션의 내용
  {
    question: "지원자 초대와 리포트 공유는 어떻게 하나요?",
    answer: "메일로 여러 명을 한 번에 초대하거나, 공개 링크로 받습니다. 리포트는 PDF로 저장하고 현업 면접관과 링크로 공유합니다.",
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

// 섹션 흐름(2026-11-25 정리 — "길다"는 피드백으로 AI 역량검사와 같은 흐름에 맞춤, 13개 → 11개):
// 01 히어로(어두운 바탕 + 흰 화면) · 02 고객사 로고(AI 면접에만) · 03 문제(어두운 띠, 문제→해결 세 쌍) · 04 진행 방식(면접 진행 + 리포트 4종, 한 지그재그)
// · 05 면접 유형 · 06 도입 3단계(화면 이미지) · 07 부정행위 감지 · 08 보안 · 09 FAQ · 10 AI 역량검사 안내 · 11 마지막 CTA(+ 차별점 띠)
// 뺀 것: '이럴 때 씁니다'(문제 띠로), '지원자 응시 과정'·'채용팀 기능'(FAQ로). 순서: 면접 유형 → 도입 3단계(역량검사의 과제 유형 → 과제 만들기와 같게)
// 배경: 03 어두운 띠 · 04 흰(.how) · 05 연한 · 06 흰 · 07 연한 · 08 흰 · 09 연한(.faq) · 10 흰
export default function AiInterviewPage() {
  return (
    <>
      {/* 01 · 히어로 */}
      <ProductHero
        name="AI 면접"
        // 헤드카피 두 줄(11/25) — "1차 면접, 질문부터 리포트까지 / AI가 진행합니다"는 첫 줄이 글 칸(약 520px)보다 길어 세 줄이 되어 문구를 다듬음
        title={<>1차 면접은 <span className="blue">AI</span>에게,<br />질문부터 리포트까지</>}
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
          { d: "M315 197 V221", dot: [315, 223] },
          { d: "M250 264 V234", dot: [250, 232] },
        ]}
      />

      {/* 02 · 고객사 로고 */}
      <ClientLogos />

      {/* 03 · 문제 — 어두운 띠(남색→블랙). 위를 지날 때 GNB가 흰 로고로 바뀌게 data-nav="dark" */}
      <section className="band dark" id="why" data-nav="dark">
        <div className="wrap">
          <div className="head">
            <h2>지원자가 많을수록<br /><span className="blue">1차 검증</span>이 어려워집니다</h2>
          </div>
          <PairGrid pairs={PAIRS} />
        </div>
      </section>

      {/* 04 · 진행 방식: 면접 진행 + 리포트 4종(공용) — 한 .how-rows 안에서 지그재그가 이어지게 ReportRows의 before로 넣는다 */}
      <section className="how" id="how">
        <div className="wrap">
          <div className="head">
            <h2>면접부터 리포트까지<br /><span className="blue">이렇게 진행됩니다</span></h2>
            <p className="lead">질문별 답변 요약과 면접 영상까지 리포트에 함께 남습니다.</p>
          </div>
          <ReportRows
            before={
              <div className="how-row">
                <div className="hr-info">
                  <span className="hr-eyebrow">면접 진행</span>
                  <h3>AI가 묻고, 답에 따라 꼬리질문을 이어 갑니다</h3>
                  <p>AI 면접관이 질문하고, 지원자의 답변을 들은 뒤 부족한 부분은 꼬리질문으로 한 번 더 확인합니다.</p>
                </div>
                <div className="hr-media">
                  <img className="hr-img" src="/diagram-question.webp" alt="면접 진행 도식: 지원자 영상과 AI 질문·꼬리질문" width={1080} height={570} loading="lazy" />
                </div>
              </div>
            }
          />
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

      {/* 06 · 도입 3단계(화면 이미지) */}
      <section className="band" id="start">
        <div className="wrap">
          <div className="head">
            <h2>채용공고만 등록하면<br /><span className="blue">리포트까지</span> 이어집니다</h2>
            <p className="lead">AI가 만든 기준과 질문은 채용팀이 승인해야 반영됩니다.</p>
          </div>
          <StepFlow steps={START} />
        </div>
      </section>

      {/* 07 · 부정행위 감지(공용) */}
      <IntegritySection />

      {/* 08 · 보안(공용) */}
      <SecuritySection />

      {/* 09 · FAQ */}
      <section className="faq" id="faq">
        <div className="wrap">
          <div className="head">
            <h2>자주 묻는 질문</h2>
          </div>
          <FaqList items={FAQS} />
        </div>
      </section>

      {/* 10 · AI 역량검사 안내 — 상대 제품 썸네일 카드(NextProductCard) */}
      <section className="band" id="next">
        <div className="wrap">
          <NextProductCard href="/ai-assessment" title="AI를 실무에 쓰는 실력까지 확인하고 싶다면" body="지원자가 AI와 함께 실제 과제를 풀고, 결과물과 AI를 쓴 과정까지 평가합니다." />
        </div>
      </section>

      {/* 11 · 마지막 CTA */}
      <FinalCta
        before={<>다음 채용은,<br /></>}
        word="AI 면접"
        after="으로 더 빠르게 시작하세요."
        // 차별점 띠(11/25, AI 역량검사와 같은 틀). 근거: _docs/홈페이지 개편/AI면접_AI역량검사_차이_소개자료.md — 다른 회사 이름·'유일한' 같은 비교는 쓰지 않는다
        points={[
          { title: "공고·이력서로 만드는 질문", body: "공고나 이력서를 넣으면 AI가 평가 기준과 맞춤 질문을 만듭니다." },
          { title: "답변에 따라 이어지는 꼬리질문", body: "지원자 답변을 듣고 꼬리질문으로 한 번 더 확인합니다." },
          { title: "근거가 붙는 검증 리포트", body: "항목별 등급과 근거, 강점·약점을 리포트 한 장으로 받습니다." },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </>
  );
}
