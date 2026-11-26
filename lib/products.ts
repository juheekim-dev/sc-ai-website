import type { HeroStageData } from "@/components/HeroStage";

// 제품 2종 — GNB(제품▾)·푸터·홈 제품 카드·'함께 쓰는 순서'(ProductFlow — 제품 페이지 끝·홈)가 같이 쓰는 이름·주소·한 줄 설명(SSOT).
// 홈 제품 카드 그림은 도식 썸네일에서 제품 페이지의 움직이는 카드(AskDemo·AssistDemo)로 바꿨다(2026-11-26).
// when은 함께 쓰는 순서의 단계 설명(권장 예시) — 근거는 _docs/홈페이지 개편/AI면접_AI역량검사_차이_소개자료.md 2장 '한눈에 비교'·'함께 쓰면'.
// 두 제품을 나란히 놓는 자리는 이름을 같은 형식으로 맞춘다: 'AI 면접'·'AI 역량검사'(2026-11-24).

export const PRODUCTS = [
  {
    href: "/ai-interview",
    title: "AI 면접",
    desc: "AI가 질문하고, 검증 리포트까지 정리합니다",
    isNew: false,
    when: "지원자가 많은 1차 검증",
  },
  {
    href: "/ai-assessment",
    title: "AI 역량검사",
    desc: "AI와 함께 일하는 실력을 실제 과제로 확인합니다",
    isNew: true,
    when: "후보를 좁힌 뒤 실무 역량 확인",
  },
] as const;

export type ProductHref = (typeof PRODUCTS)[number]["href"];

// 제품 히어로 화면(HeroStage 데이터) — 제품 페이지 히어로(ProductHero)와 함께 쓰는 순서 썸네일(ProductFlow)이 같이 쓴다(2026-11-26 SSOT로 옮김).
export const HERO: Record<ProductHref, HeroStageData> = {
  // AI 면접(11/25 B안 3차): 화면 + AI 면접관 오브 카드 + 리포트 카드. 화면은 AI 역량검사와 같은 어두운 색(#181818, 11/25 4차 — 흰 화면에서 바꿈).
  // 모션은 AI 역량검사와 같은 흐름 — AI 면접관 카드 위→아래, 리포트 카드 아래→위, '답변 분석 중' 칩 왼쪽→오른쪽. 원본은 _docs/홈페이지 개편/도식/캡처가공(iv3-l-*)
  // 11/25 "리포트 카드 지금보다 아래로": 카드 top 266 → 294, 캔버스 600×420 → 600×448(레이어 4장 모두)
  "/ai-interview": {
    img: "/hero-interview-base.webp",
    alt: "AI 면접 화면: AI 면접관이 질문과 꼬리질문을 하고, 지원자 답변을 분석해 종합 등급과 역량 막대가 있는 AI 면접 리포트로 정리하는 모습",
    layers: [
      // AI 면접관 카드의 오브는 움직이는 오브(LiveOrb)를 겹친다 — 자리는 레이어 캔버스(600×448) 좌표, 이미지와 같은 흐림(투명도 .62)
      { src: "/hero-interview-ai.webp", move: "down", orb: { x: 325, y: 59, size: 64, w: 600, h: 448, cover: "#FFFFFF", opacity: 0.62 } },
      { src: "/hero-interview-report.webp", move: "up" },
      { src: "/hero-interview-chip.webp", move: "right" },
    ],
    lines: [
      { d: "M315 197 V221", dot: [315, 223] },
      { d: "M250 292 V234", dot: [250, 232] },
    ],
    size: [600, 448],
  },
  // AI 역량검사(11/25, 시안 M-1 수정): AI 어시스턴트 카드는 위→아래, 보고서 카드는 아래→위, '작업 과정 기록 중' 칩은 왼쪽→오른쪽.
  // 레이어 원본은 _docs/홈페이지 개편/도식/캡처가공(hero-l-*). 점선 좌표도 같은 파일의 HB.dash와 같다.
  "/ai-assessment": {
    img: "/hero-assessment-base.webp",
    alt: "AI 역량검사 응시 화면: 지원자가 AI 어시스턴트에게 파일 비교를 맡기고 보고서를 작성하는 모습",
    layers: [
      { src: "/hero-assessment-ai.webp", move: "down" },
      { src: "/hero-assessment-doc.webp", move: "up" },
      { src: "/hero-assessment-chip.webp", move: "right" },
    ],
    lines: [
      { d: "M512 132 V196", dot: [512, 198] },
      { d: "M318 232 V200", dot: [318, 198] },
    ],
  },
};
