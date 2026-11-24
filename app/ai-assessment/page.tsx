import type { Metadata } from "next";
import "../landing.css"; // 홈과 같은 섹션 스타일(SSOT) — 히어로·카드·단계·CTA를 그대로 쓴다
import PageHero, { HeroWord } from "@/components/PageHero";
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

// 섹션 구성(홈페이지 개편 기획 4장): 01 히어로 · 02 왜 과정을 보나 · 03 과제 유형 · 04 과제 화면 · 05 과정 평가
// · 06 AI 인터뷰 · 07 평가와 리포트 · 08 과제 만들기 · 09 응시 환경 · 10 보안 · 11 FAQ · 12 AI 면접 안내 · 13 마지막 CTA
export default function AiAssessmentPage() {
  return (
    <>
      {/* 01 · 히어로 */}
      <PageHero
        title={
          <>
            <span className="sky">AI와 함께 일하는 실력을,</span><br />
            <HeroWord>실제 과제</HeroWord><span className="sky">로 확인합니다</span>
          </>
        }
        lead="지원자는 AI 어시스턴트와 함께 업무 과제를 풉니다. 결과물과 함께, AI에 무엇을 맡기고 어떻게 검증했는지까지 평가합니다."
      />

      {/* 02~12 · 본문 섹션 — 11/26 구현. 도식 ③~⑥은 public/diagram-task·process·debrief·scorecard.webp */}

      {/* 13 · 마지막 CTA */}
      <FinalCta before={<>AI 시대의 실력,<br /></>} word="과제" after="로 확인하세요." />
    </>
  );
}
