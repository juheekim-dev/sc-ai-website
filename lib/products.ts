// 제품 2종 — GNB(제품▾)·푸터·홈 제품 카드·제품 페이지 끝 '두 제품 비교'(ProductCompare)가 같이 쓰는 이름·주소·한 줄 설명·도식 썸네일(SSOT).
// checks·does·when은 두 제품 비교의 세 줄 — 근거는 _docs/홈페이지 개편/AI면접_AI역량검사_차이_소개자료.md 2장 '한눈에 비교'(맞는 단계는 권장 예시).
// 두 제품을 나란히 놓는 자리는 이름을 같은 형식으로 맞춘다: 'AI 면접'·'AI 역량검사'(2026-11-24).
// AI 면접 도식(diagram-question, 1080×570) 속 오브 자리 — 그 위에 움직이는 오브(LiveOrb)를 겹친다. 바탕(#F4F8FE)으로 정지 오브를 덮는다.
// 도식 원본: _docs/홈페이지 개편/도식/벡터_만들기_make-svg.mjs의 orbImg(127, 171, 230)
export const ORB_QUESTION = { x: 127, y: 171, size: 230, w: 1080, h: 570, cover: "#F4F8FE" };

export const PRODUCTS = [
  {
    href: "/ai-interview",
    title: "AI 면접",
    desc: "AI가 질문하고, 검증 리포트까지 정리합니다",
    isNew: false,
    img: "/diagram-question.webp",
    alt: "AI 면접 도식: AI 면접관과 AI 질문·꼬리질문",
    checks: "직무 이해도, 이력서에 적힌 경험이 사실인지, 말로 설명하는 역량",
    does: "AI 면접관의 질문과 꼬리질문에 카메라를 켜고 답합니다",
    when: "지원자가 많은 1차 검증",
    orb: ORB_QUESTION,
  },
  {
    href: "/ai-assessment",
    title: "AI 역량검사",
    desc: "AI와 함께 일하는 실력을 실제 과제로 확인합니다",
    isNew: true,
    img: "/diagram-task.webp",
    alt: "AI 역량검사 도식: 개발 화면의 과제 코드와 AI 어시스턴트 대화",
    checks: "실제 과제를 푸는 실력, AI에 일을 맡기고 결과를 검증하는 방식",
    does: "AI 어시스턴트와 함께 과제를 풀어 제출하고, 이어지는 AI 인터뷰에서 결과를 설명합니다",
    when: "후보를 좁힌 뒤 실무 역량 확인",
    orb: null,
  },
] as const;

export type ProductHref = (typeof PRODUCTS)[number]["href"];
