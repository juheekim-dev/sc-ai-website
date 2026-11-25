// 제품 2종 — GNB(제품▾)·푸터·홈 제품 카드·제품 페이지 끝 '다른 제품 안내' 카드가 같이 쓰는 이름·주소·한 줄 설명·도식 썸네일(SSOT).
// 두 제품을 나란히 놓는 자리는 이름을 같은 형식으로 맞춘다: 'AI 면접'·'AI 역량검사'(2026-11-24).
export const PRODUCTS = [
  {
    href: "/ai-interview",
    title: "AI 면접",
    desc: "AI가 질문하고, 검증 리포트까지 정리합니다",
    isNew: false,
    img: "/diagram-question.webp",
    alt: "AI 면접 도식: 지원자 영상과 AI 질문·꼬리질문",
  },
  {
    href: "/ai-assessment",
    title: "AI 역량검사",
    desc: "AI와 함께 일하는 실력을 실제 과제로 확인합니다",
    isNew: true,
    img: "/diagram-task.webp",
    alt: "AI 역량검사 도식: 개발 화면의 과제 코드와 AI 어시스턴트 대화",
  },
] as const;

export type ProductHref = (typeof PRODUCTS)[number]["href"];
