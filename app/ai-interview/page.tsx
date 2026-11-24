import type { Metadata } from "next";
import "../landing.css"; // 홈과 같은 섹션 스타일(SSOT) — 히어로·로고·카드·리포트·CTA를 그대로 쓴다
import PageHero, { HeroWord } from "@/components/PageHero";
import ClientLogos from "@/components/ClientLogos";
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

// 섹션 구성(홈페이지 개편 기획 4장): 01 히어로 · 02 고객사 로고 · 03 면접 유형 · 04 면접 진행 · 05 리포트
// · 06 부정행위 감지 · 07 지원자 응시 과정 · 08 채용팀 기능 · 09 보안 · 10 FAQ · 11 AI 역량검사 안내 · 12 마지막 CTA
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

      {/* 03~11 · 본문 섹션 — 11/25 구현. 도식 ①②는 public/diagram-question·integrity.webp */}

      {/* 12 · 마지막 CTA */}
      <FinalCta before={<>다음 채용은,<br /></>} word="AI 면접" after="으로 더 빠르게 시작하세요." />
    </>
  );
}
