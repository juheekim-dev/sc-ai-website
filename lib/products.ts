// 제품 2종 — GNB(제품▾)·푸터·홈 제품 카드가 같이 쓰는 이름·주소·한 줄 설명(SSOT).
// 두 제품을 나란히 놓는 자리는 이름을 같은 형식으로 맞춘다: 'AI 면접'·'AI 역량검사'(2026-11-24).
export const PRODUCTS = [
  { href: "/ai-interview", title: "AI 면접", desc: "AI가 질문하고, 검증 리포트까지 정리합니다", isNew: false },
  { href: "/ai-assessment", title: "AI 역량검사", desc: "AI와 함께 일하는 실력을 실제 과제로 확인합니다", isNew: true },
] as const;
