import type { Metadata } from "next";
import "../landing.css"; // 홈과 같은 섹션 스타일(SSOT) — 카드·단계·CTA를 그대로 쓴다
import ProductHero from "@/components/ProductHero";
import StepFlow from "@/components/StepFlow";
import PairGrid from "@/components/PairGrid";
import SecuritySection from "@/components/SecuritySection";
import FaqList from "@/components/FaqList";
import ProductCompare from "@/components/ProductCompare";
import FinalCta from "@/components/FinalCta";
import { buildPageMetadata } from "@/lib/pageSeo";

export const revalidate = 3600; // ISR 1시간 — 홈과 같은 주기. 분 단위로 줄이지 않는다(ISR Writes 한도, CLAUDE.md '렌더링·캐시')

// ⚠️ title 에는 사이트명을 넣지 않는다 — layout.tsx 의 template("%s · AI면접")이 붙인다.
const FALLBACK_METADATA: Metadata = {
  title: "AI 역량검사 — AI와 일하는 실력을 실제 과제로",
  description:
    "지원자가 AI 어시스턴트와 함께 실제 업무 과제를 풉니다. 결과물과 함께 AI에 무엇을 맡기고 어떻게 검증했는지까지 평가해 리포트로 정리합니다.",
  alternates: { canonical: "/ai-assessment" },
  openGraph: {
    title: "슈퍼코더 AI 역량검사 — AI와 일하는 실력을 실제 과제로",
    description: "결과물만이 아니라, AI를 쓰고 검증한 과정까지 평가합니다.",
    url: "/ai-assessment",
    images: [{ url: "/og-image.png?v=3", width: 1200, height: 630 }],
  },
};
export function generateMetadata() {
  return buildPageMetadata("/ai-assessment", FALLBACK_METADATA);
}

// 문구의 사실 근거: _docs/홈페이지 개편/AI면접_AI역량검사_차이_소개자료.md
// (응시 시간·요금·가중치 수치, 지원자 비교 대시보드, '언제든 응시 가능' 같은 표현은 쓰지 않는다 — 같은 문서 6장)
// 도입사 로고는 AI 면접 고객이라 이 페이지에는 넣지 않는다(기획 문서 4장).

// 과제 만들기 3단계 — 카드 아래 실제 화면을 가공한 이미지(원본·스크립트는 _docs/홈페이지 개편/도식/캡처가공).
// 이미지가 있으니 아이콘은 두지 않는다(아이콘+이미지는 과하다는 피드백, 11/25).
const START = [
  { title: "채용공고 입력", body: <>채용공고를 넣거나<br />문제 은행 템플릿을 고릅니다.</>, img: "/assessment-step-jd.webp", alt: "채용공고 입력 화면: 직무 기술서를 붙여 넣는 칸" },
  { title: "AI가 과제 생성", body: <>AI가 과제와 채점 기준을 만들고<br />스스로 검증합니다.</>, img: "/assessment-step-task.webp", alt: "문제 만들기 화면: 개발 과제, 업무 과제, 코딩 테스트 중 과제 유형 선택" },
  { title: "확인 후 게시", body: <>채용팀이 확인하고 게시하면<br />지원자에게 링크를 보냅니다.</>, img: "/assessment-step-review.webp", alt: "평가 기준 화면: 역량별 1점부터 단계별 기준 문장" },
];

// 02 · 문제 — 어두운 띠(A안, 11/25 "가독성이 떨어진다"로 C안에서 바꿈): 한 줄에 '문제 → 해결', 세 줄을 위아래로(components/PairGrid.tsx).
// 이미지 없이 글로만 가는 섹션이라 말을 정확히 — 그대로 냈는지 ↔ 맡긴 내용 기록, 검증했는지 ↔ 검증 평가, 이해하는지 ↔ AI 인터뷰.
// 아래 '진행 방식'이 자세히 보여 주므로 여기서는 한 줄씩만 쓴다.
const PAIRS = [
  { problem: "AI가 쓴 답을 그대로 냈는지 알 수 없습니다", solution: "AI에 무엇을 맡겼는지 기록에 남습니다" },
  { problem: "AI 결과를 검증했는지 알 수 없습니다", solution: "AI 결과를 검증했는지 평가합니다" },
  { problem: "제출한 내용을 이해하는지 알 수 없습니다", solution: "제출 뒤 AI 인터뷰로 이해도를 확인합니다" },
];

// 04 · 과제 유형(아이콘 카드 — 이미지가 없으니 아이콘을 둔다)
const KINDS = [
  { icon: "fa-robot", title: "AI 개발 과제", body: "개발 직군용입니다. 기존 코드의 문제를 AI 에이전트와 함께 해결하고, 브라우저에서 코드를 고치고 테스트를 돌립니다." },
  { icon: "fa-file-lines", title: "AI 업무 과제", body: "비개발 직군용입니다. 자료를 분석해 AI와 함께 문서나 보고서를 쓰고, 궁금한 점은 가상의 이해관계자에게 묻습니다." },
  { icon: "fa-diagram-project", title: "코딩 테스트", body: "개발 기본기를 AI 없이 봅니다. AI와 검색 없이 함수를 구현하면 숨은 테스트로 자동 채점합니다." },
];

// 응시 환경 — B안(11/25): 왼쪽 큰 카드(전체 화면 공유) + 오른쪽 작은 카드 2장, 카드·이미지 바탕 모두 흰색.
// 이미지는 실제 응시 화면을 가공한 것(얼굴은 실루엣, 시간·사용량은 지움 — 원본·스크립트는 _docs/홈페이지 개편/도식/캡처가공). 아이콘은 두지 않는다.
const ENV = [
  { title: "전체 화면 공유", body: "모니터 전체를 공유한 채로 응시하고, 보조 모니터가 있는지도 확인합니다.", img: "/assessment-env-screen.webp", alt: "응시 화면 왼쪽 위의 화면 녹화 중 표시와 과제 설명", big: true },
  { title: "얼굴 확인", body: "자리를 비우거나 다른 사람이 함께 보이면 그 순간을 기록합니다.", img: "/assessment-env-face.webp", alt: "응시 화면의 카메라 창: 녹화 중 표시", big: false }, // 카메라 창을 이미지 왼쪽에 두어 세 장 모두 왼쪽 위 기준으로 잘린다(11/25, 둥근 모서리를 맞춤)
  { title: "탭 이탈·붙여넣기", body: "다른 탭으로 나가거나 글을 붙여 넣으면 기록에 남습니다.", img: "/assessment-env-paste.webp", alt: "AI 어시스턴트 입력창 위 안내 '직접 쓴 지시가 평가돼요'와 지원자가 직접 입력하는 지시", big: false },
];

// 제품 페이지 FAQ는 코드에 고정한다(어드민 FAQ는 홈 전용).
const FAQS = [
  {
    question: "AI 면접과 AI 역량검사는 어떻게 다른가요?",
    answer: "AI 면접은 AI가 묻고 지원자가 답하며 직무 이해도와 경험을 확인합니다. AI 역량검사는 지원자가 AI와 함께 실제 과제를 풀고, 결과물과 AI를 쓴 과정까지 평가합니다. 따로 써도 되고 함께 써도 됩니다.",
  },
  {
    question: "개발자가 아니어도 볼 수 있나요?",
    answer: "네. AI 업무 과제는 자료 분석과 문서 작성이 중심이라 기획·운영·사업 직군에 맞습니다.",
  },
  {
    question: "지원자가 AI를 쓰면 부정행위 아닌가요?",
    answer: "AI 역량검사는 처음부터 AI를 쓰며 푸는 검사이고, AI를 어떻게 쓰는지를 평가합니다. AI 없이 기본기를 보고 싶다면 코딩 테스트를 고르면 됩니다.",
  },
  {
    question: "AI 평가를 그대로 믿어도 되나요?",
    answer: "리포트는 판단을 돕는 자료이고, 결정은 채용팀이 합니다. 항목마다 검토하고 정정할 수도 있습니다.",
  },
  // 11/25 흐름 정리로 빠진 '지원자 응시 과정'·'채용팀 기능' 섹션의 내용
  {
    question: "지원자는 무엇을 준비하면 되나요?",
    answer: "노트북이나 데스크톱, 화면 공유가 되는 최신 Chrome이나 Edge, 카메라가 있으면 됩니다. 앱은 설치하지 않습니다. 시작 전에 가상 체험으로 과제 화면과 인터뷰 방식을 익힐 수 있고, 이때 입력한 내용은 평가하지 않습니다.",
  },
  {
    question: "지원자 초대와 리포트 공유는 어떻게 하나요?",
    answer: "메일로 여러 명을 한 번에 초대하거나, 공개 링크로 받습니다. 리포트는 PDF로 저장하고 현업 면접관과 링크로 공유합니다. 지금 쓰는 채용 시스템과는 API로 연동합니다.",
  },
];

const plain = (s: string) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: plain(f.answer) } })),
};

// 섹션 흐름(2026-11-25 정리 — "중복되고 길다"는 피드백, 프로그래머스 AI 역량평가 페이지 흐름 참고: 비교 → 진행 방식 → 유형 → 운영 → CTA)
// 01 히어로(실제 응시 화면) · 02 문제(어두운 띠, 문제→해결 세 쌍) · 03 진행 방식(과제 화면·과정 평가·AI 인터뷰·평가와 리포트)
// · 04 과제 유형 · 05 과제 만들기 · 06 응시 환경 · 07 보안 · 08 FAQ · 09 AI 면접 안내 · 10 마지막 CTA  (12개 → 10개)
// 뺀 것: '지원자 응시 과정'(진행 방식·응시 환경과 겹침 → 준비물·가상 체험은 FAQ로), '채용팀 기능'(FAQ로 — AI 면접 페이지에는 그대로),
// 과정 평가의 붙여넣기 문장(응시 환경 카드와 같은 내용). '왜 과정을 보나' 3카드는 문제→해결 세 쌍(어두운 띠)으로 바꿨다.
// 배경: 02는 어두운 띠로 끊고, 그 뒤는 흰색↔연한 블루가 번갈아: 03 흰(.how) · 04 연한 · 05 흰 · 06 연한 · 07 흰 · 08 연한(.faq) · 09 흰
export default function AiAssessmentPage() {
  return (
    <>
      {/* 01 · 히어로 */}
      <ProductHero
        name="AI 역량검사"
        isNew
        title={<>AI와 함께 일하는 실력을,<br /><span className="blue">실제 과제</span>로 확인합니다</>}
        lead="지원자는 AI 어시스턴트와 함께 업무 과제를 풉니다. 결과물과 함께, AI에 무엇을 맡기고 어떻게 검증했는지까지 평가합니다."
        img="/hero-assessment-base.webp"
        alt="AI 역량검사 응시 화면: 지원자가 AI 어시스턴트에게 파일 비교를 맡기고 보고서를 작성하는 모습"
        // 히어로 모션(11/25, 시안 M-1 수정): AI 어시스턴트 카드는 위→아래, 보고서 카드는 아래→위, '작업 과정 기록 중' 칩은 왼쪽→오른쪽.
        // 레이어 원본은 _docs/홈페이지 개편/도식/캡처가공(hero-l-*). 점선 좌표도 같은 파일의 HB.dash와 같다.
        layers={[
          { src: "/hero-assessment-ai.webp", move: "down" },
          { src: "/hero-assessment-doc.webp", move: "up" },
          { src: "/hero-assessment-chip.webp", move: "right" },
        ]}
        lines={[
          { d: "M512 132 V196", dot: [512, 198] },
          { d: "M318 232 V200", dot: [318, 198] },
        ]}
      />

      {/* 02 · 문제 — 어두운 띠(남색→블랙). 위를 지날 때 GNB가 흰 로고로 바뀌게 data-nav="dark" */}
      <section className="band dark" id="why" data-nav="dark">
        <div className="wrap">
          <div className="head">
            <h2>결과물만으로는<br /><span className="blue">AI와 일하는 실력</span>이 보이지 않습니다</h2>
          </div>
          <PairGrid pairs={PAIRS} />
        </div>
      </section>

      {/* 03 · 진행 방식: 과제 화면 · 과정 평가 · AI 인터뷰 · 평가와 리포트 */}
      <section className="how" id="how">
        <div className="wrap">
          <div className="head">
            <h2>응시부터 리포트까지<br /><span className="blue">이렇게 진행됩니다</span></h2>
          </div>
          <div className="how-rows">
            <div className="how-row">
              <div className="hr-info">
                <span className="hr-eyebrow">과제 화면</span>
                <h3>AI 어시스턴트와 함께 실제 과제를 풉니다</h3>
                <p>지원자는 브라우저에서 바로 응시합니다. AI에게 직접 쓴 글로 지시하고, AI가 만든 결과를 확인하며 과제를 완성합니다.</p>
              </div>
              <div className="hr-media">
                <img className="hr-img" src="/diagram-task.webp" alt="과제 화면 도식: 개발 화면의 과제 코드와 AI 어시스턴트 대화" width={1080} height={570} loading="lazy" />
              </div>
            </div>
            <div className="how-row">
              <div className="hr-info">
                <span className="hr-eyebrow">과정 평가</span>
                <h3>지시부터 테스트까지, 과정이 모두 남습니다</h3>
                <ul className="hr-points">
                  <li>AI에 보낸 지시 이력과 작업 리플레이</li>
                  <li>AI가 만든 결과를 확인하고 고쳤는지</li>
                  <li>직접 실행한 명령과 그 결과</li>
                </ul>
              </div>
              <div className="hr-media">
                <img className="hr-img" src="/diagram-process.webp" alt="과정 평가 도식: 작업 기록 화면에 AI에게 지시, AI가 코드 변경, 직접 수정, 테스트 실행 네 단계를 원으로 잇고 아래에 작업 리플레이" width={1080} height={570} loading="lazy" />
              </div>
            </div>
            <div className="how-row">
              <div className="hr-info">
                <span className="hr-eyebrow">AI 인터뷰</span>
                <h3>제출 뒤, 자기 결과를 직접 설명합니다</h3>
                <p>과제를 제출하면 AI 인터뷰가 이어집니다. AI가 결과에 대해 묻고, 지원자의 답으로 이해도를 평가합니다.</p>
              </div>
              <div className="hr-media">
                <img className="hr-img" src="/diagram-debrief.webp" alt="AI 인터뷰 도식: 제출한 코드와, AI 질문과 지원자 답변이 말풍선으로 오가는 대화" width={1080} height={570} loading="lazy" />
              </div>
            </div>
            <div className="how-row">
              <div className="hr-info">
                <span className="hr-eyebrow">평가와 리포트</span>
                <h3>점수마다 근거가 붙습니다</h3>
                <ul className="hr-points">
                  <li>4단계 AI 추천: 적극 추천 · 추천 · 비추천 · 강력 비추천</li>
                  <li>항목별 점수와 근거, 강점·약점, 면접 참고 포인트</li>
                  <li>지시 이력, 작업 리플레이, AI 인터뷰 녹음, 최종 결과물</li>
                </ul>
                <p>채용팀은 항목마다 검토 완료나 이의를 표시하고, 정정한 평가를 공식 결과로 고를 수 있습니다. 원래 평가는 남습니다.</p>
              </div>
              <div className="hr-media">
                <img className="hr-img" src="/diagram-scorecard.webp" alt="평가와 리포트 도식: AI 역량검사 리포트 화면에 AI 추천 등급과 항목별 점수, 근거" width={1080} height={570} loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 · 과제 유형 */}
      <section className="band soft" id="kinds">
        <div className="wrap">
          <div className="head">
            <h2>직무에 맞는<br /><span className="blue">과제 유형</span>을 고르세요</h2>
            <p className="lead">개발 직군과 기획·운영 같은 비개발 직군 모두 볼 수 있습니다.</p>
          </div>
          <div className="value-grid">
            {KINDS.map((k) => (
              <div className="valcard" key={k.title}>
                <div className="ic"><i className={`fa-solid ${k.icon}`}></i></div>
                <h3>{k.title}</h3>
                <p>{k.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 · 과제 만들기(도입 3단계) */}
      <section className="band" id="start">
        <div className="wrap">
          <div className="head">
            <h2>채용공고를 넣으면<br /><span className="blue">과제가 만들어집니다</span></h2>
            <p className="lead">문제 은행 템플릿으로 시작할 수도 있습니다.</p>
          </div>
          <StepFlow steps={START} />
        </div>
      </section>

      {/* 06 · 응시 환경 — AI 역량검사는 기본으로 켜져 있다(AI 면접의 부정행위 감지 섹션과 달리 프로젝트별 선택이 아님) */}
      <section className="band soft" id="environment">
        <div className="wrap">
          <div className="head">
            <h2>따로 설정하지 않아도<br /><span className="blue">응시 환경을 확인</span>합니다</h2>
            <p className="lead">의심스러운 순간은 리포트에 모이고, 채용팀이 영상과 함께 하나씩 확인합니다.</p>
          </div>
          <div className="env-bento">
            {ENV.map((e) => (
              <div className={e.big ? "eb-card big" : "eb-card"} key={e.title}>
                <div className="eb-txt">
                  <h3>{e.title}</h3>
                  <p>{e.body}</p>
                </div>
                <img src={e.img} alt={e.alt} width={720} height={400} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07 · 보안(공용) */}
      <SecuritySection />

      {/* 08 · FAQ */}
      <section className="faq" id="faq">
        <div className="wrap">
          <div className="head">
            <h2>자주 묻는 질문</h2>
          </div>
          <FaqList items={FAQS} />
        </div>
      </section>

      {/* 09 · 다른 제품 안내 — 두 제품 비교(ProductCompare, 11/25 시안 2안). 권장 순서 예시: AI 면접으로 1차 검증 → AI 역량검사로 실무 확인 */}
      <section className="band" id="next">
        <div className="wrap">
          <ProductCompare current="/ai-assessment" />
        </div>
      </section>

      {/* 10 · 마지막 CTA */}
      <FinalCta
        before={<>AI 시대의 실력,<br /></>}
        word="과제"
        after="로 확인하세요."
        // 차별점 띠(11/25, 히어로 아래에서 옮김). 근거: _docs/홈페이지 개편/AI면접_AI역량검사_차이_소개자료.md — 다른 회사 이름·'유일한' 같은 비교는 쓰지 않는다
        points={[
          { title: "채용공고로 만드는 맞춤 과제", body: "공고를 넣으면 AI가 직무에 맞는 과제와 채점 기준을 만듭니다." },
          { title: "결과물과 과정을 함께 평가", body: "AI에 맡긴 지시, 검증, 직접 수정까지 기록하고 평가합니다." },
          { title: "제출 뒤 AI 인터뷰로 검증", body: "자기 결과를 말로 설명하게 해, 이해했는지 확인합니다." },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </>
  );
}
