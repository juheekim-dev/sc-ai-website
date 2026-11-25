import type { Metadata } from "next";
import "../landing.css"; // 홈과 같은 섹션 스타일(SSOT) — 카드·단계·CTA를 그대로 쓴다
import ProductHero from "@/components/ProductHero";
import StepFlow from "@/components/StepFlow";
import TeamSection from "@/components/TeamSection";
import SecuritySection from "@/components/SecuritySection";
import FaqList from "@/components/FaqList";
import NextProductCard from "@/components/NextProductCard";
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
const WHY = [
  { label: "과정", big: "무엇을 맡겼나", body: "AI에 보낸 지시와 작업 과정이 그대로 남습니다." },
  { label: "검증", big: "어떻게 확인했나", body: "AI가 만든 결과를 직접 확인하고 고쳤는지 봅니다." },
  { label: "이해도", big: "설명할 수 있나", body: "제출 뒤 AI 인터뷰에서 자기 결과를 말로 설명합니다." },
];

const KINDS = [
  { icon: "fa-robot", title: "AI 개발 과제", body: "개발 직군용입니다. 기존 코드의 문제를 AI 에이전트와 함께 해결하고, 브라우저에서 코드를 고치고 테스트를 돌립니다." },
  { icon: "fa-file-lines", title: "AI 업무 과제", body: "비개발 직군용입니다. 자료를 분석해 AI와 함께 문서나 보고서를 쓰고, 궁금한 점은 가상의 이해관계자에게 묻습니다." },
  { icon: "fa-diagram-project", title: "코딩 테스트", body: "개발 기본기를 AI 없이 봅니다. AI와 검색 없이 함수를 구현하면 숨은 테스트로 자동 채점합니다." },
];

const ENV = [
  { icon: "fa-user-check", title: "얼굴 확인", body: "자리를 비우거나 다른 사람이 함께 보이면 그 순간을 기록합니다." },
  { icon: "fa-eye", title: "전체 화면 공유", body: "모니터 전체를 공유한 채로 응시하고, 보조 모니터가 있는지도 확인합니다." },
  { icon: "fa-arrow-up-right-from-square", title: "탭 이탈·붙여넣기", body: "다른 탭으로 나가거나 글을 붙여 넣으면 기록에 남습니다." },
];

// lucide 선 아이콘 경로
const ICON = {
  file: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></>,
  sparkles: <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />,
  send: <><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></>,
  fileCheck: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="m9 15 2 2 4-4" /></>,
  play: <><circle cx="12" cy="12" r="10" /><path d="m10 8 6 4-6 4z" /></>,
  laptop: <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />,
};

const START = [
  { title: "채용공고 입력", body: <>채용공고를 넣거나<br />문제 은행 템플릿을 고릅니다.</>, icon: ICON.file },
  { title: "AI가 과제 생성", body: <>AI가 과제와 채점 기준을 만들고<br />스스로 검증합니다.</>, icon: ICON.sparkles },
  { title: "확인 후 게시", body: <>채용팀이 확인하고 게시하면<br />지원자에게 링크를 보냅니다.</>, icon: ICON.send },
];

const CANDIDATE = [
  { title: "안내 확인과 동의", body: <>무엇이 기록되는지 읽고 동의한 뒤<br />카메라와 브라우저를 확인합니다.</>, icon: ICON.fileCheck },
  { title: "가상 체험", body: <>과제 화면과 인터뷰 방식을 미리 익힙니다.<br />이때 입력한 내용은 평가하지 않습니다.</>, icon: ICON.play },
  { title: "과제와 AI 인터뷰", body: <>AI 어시스턴트와 과제를 풀고<br />제출하면 AI 인터뷰로 설명합니다.</>, icon: ICON.laptop },
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
];

const plain = (s: string) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: plain(f.answer) } })),
};

// 섹션 흐름(2026-11-25 재구성 — AI 면접 페이지와 같은 순서):
// 01 히어로(밝은 바탕 + 제품 이미지) · 02 왜 과정을 보나 · 03 도입 3단계(과제 만들기) · 04 과제 유형 · 05 과제 화면·과정 평가·AI 인터뷰·평가와 리포트
// · 06 응시 환경 · 07 지원자 응시 과정 · 08 채용팀 기능 · 09 보안 · 10 FAQ · 11 AI 면접 안내 · 12 마지막 CTA
// 배경은 흰색↔연한 블루가 번갈아: 02 연한 · 03 흰 · 04 연한 · 05 흰(.how) · 06 연한 · 07 흰 · 08 연한 · 09 흰 · 10 연한 · 11 흰
export default function AiAssessmentPage() {
  return (
    <>
      {/* 01 · 히어로 */}
      <ProductHero
        name="AI 역량검사"
        isNew
        title={<>AI와 함께 일하는 실력을,<br /><span className="blue">실제 과제</span>로 확인합니다</>}
        lead="지원자는 AI 어시스턴트와 함께 업무 과제를 풉니다. 결과물과 함께, AI에 무엇을 맡기고 어떻게 검증했는지까지 평가합니다."
        img="/hero-assessment.webp"
        alt="AI 역량검사 제품 화면: 과제 코드와 AI 어시스턴트 대화, 그 위에 AI 추천과 항목별 점수·근거가 있는 AI 역량검사 리포트"
      />

      {/* 02 · 왜 과정을 보나 */}
      <section className="band soft" id="why">
        <div className="wrap">
          <div className="head">
            <h2>결과물만 봐서는<br /><span className="blue">누가 했는지</span> 모릅니다</h2>
            <p className="lead">점수가 같아도, AI가 쓴 답을 그대로 냈는지 직접 이해하고 고쳤는지는 결과물에 드러나지 않습니다.</p>
          </div>
          <div className="proof-row">
            {WHY.map((w) => (
              <div className="pc2" key={w.label}>
                <div className="vlabel">{w.label}</div>
                <div className="big big-phrase">{w.big}</div>
                <p>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 · 도입 3단계(과제 만들기) */}
      <section className="band" id="start">
        <div className="wrap">
          <div className="head">
            <h2>채용공고를 넣으면<br /><span className="blue">과제가 만들어집니다</span></h2>
            <p className="lead">문제 은행 템플릿으로 시작할 수도 있습니다.</p>
          </div>
          <StepFlow steps={START} />
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

      {/* 05 · 과제 화면 · 과정 평가 · AI 인터뷰 · 평가와 리포트 */}
      <section className="how" id="how">
        <div className="wrap">
          <div className="head">
            <h2>AI와 함께 풀고,<br /><span className="blue">과정까지</span> 평가합니다</h2>
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
                <p>문제 설명이나 AI 답변을 그대로 붙여 넣은 지시는 기록되고, 본인이 쓴 지시로 평가하지 않습니다.</p>
              </div>
              <div className="hr-media">
                <img className="hr-img" src="/diagram-process.webp" alt="과정 평가 도식: AI에게 지시, AI가 코드 변경, 직접 수정, 테스트 실행 네 단계와 작업 리플레이" width={1080} height={570} loading="lazy" />
              </div>
            </div>
            <div className="how-row">
              <div className="hr-info">
                <span className="hr-eyebrow">AI 인터뷰</span>
                <h3>제출 뒤, 자기 결과를 직접 설명합니다</h3>
                <p>과제를 제출하면 AI 인터뷰가 이어집니다. AI가 결과에 대해 묻고, 지원자의 답으로 이해도를 평가합니다.</p>
              </div>
              <div className="hr-media">
                <img className="hr-img" src="/diagram-debrief.webp" alt="AI 인터뷰 도식: 제출한 코드와, AI 질문과 지원자 음성 답변이 오가는 대화" width={1080} height={570} loading="lazy" />
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
                <img className="hr-img" src="/diagram-scorecard.webp" alt="평가와 리포트 도식: AI 추천 등급과 항목별 점수, 근거" width={1080} height={570} loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06 · 응시 환경 — AI 역량검사는 기본으로 켜져 있다(AI 면접의 부정행위 감지 섹션과 달리 프로젝트별 선택이 아님) */}
      <section className="band soft" id="environment">
        <div className="wrap">
          <div className="head">
            <h2>따로 설정하지 않아도<br /><span className="blue">응시 환경을 확인</span>합니다</h2>
            <p className="lead">의심스러운 순간은 리포트에 모이고, 채용팀이 영상과 함께 하나씩 확인합니다.</p>
          </div>
          <div className="value-grid">
            {ENV.map((e) => (
              <div className="valcard" key={e.title}>
                <div className="ic"><i className={`fa-solid ${e.icon}`}></i></div>
                <h3>{e.title}</h3>
                <p>{e.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07 · 지원자 응시 과정 */}
      <section className="band" id="candidate">
        <div className="wrap">
          <div className="head">
            <h2>지원자는 <span className="blue">브라우저에서</span><br />바로 응시합니다</h2>
            <p className="lead">앱 설치 없이, 화면 공유가 되는 최신 Chrome이나 Edge로 노트북이나 데스크톱에서 봅니다.</p>
          </div>
          <StepFlow steps={CANDIDATE} />
        </div>
      </section>

      {/* 08 · 채용팀 기능(공용) */}
      <TeamSection />

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

      {/* 11 · AI 면접 안내 — 상대 제품 썸네일 카드(NextProductCard). 권장 순서 예시: AI 면접으로 1차 검증 → AI 역량검사로 실무 확인 */}
      <section className="band" id="next">
        <div className="wrap">
          <NextProductCard href="/ai-interview" title="지원자가 많은 1차 검증은 AI 면접으로" body="AI가 묻고 답에 따라 꼬리질문을 이어 가며, 검증 리포트 한 장으로 정리합니다." />
        </div>
      </section>

      {/* 12 · 마지막 CTA */}
      <FinalCta before={<>AI 시대의 실력,<br /></>} word="과제" after="로 확인하세요." />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </>
  );
}
