import Link from "next/link";
import { PRODUCTS, HERO, type ProductHref } from "@/lib/products";
import HeroStage, { type HeroStageData } from "./HeroStage";

// 제품 페이지 끝 '다른 제품 안내' — 함께 쓰는 순서(2026-11-26 시안 1안 + 연결 2안, 옛 '두 제품 비교'를 바꿈). /ai-interview·/ai-assessment 공용.
// 권장 순서 예시(AI 면접으로 1차 검증 → AI 역량검사로 실무 확인 → 핵심 후보만 대면 면접, 차이 소개자료 '함께 쓰면')를 세 단계 카드로.
// 1·2단계 그림은 각 제품의 히어로 화면(HeroStage, 움직이는 오브 없이), 3단계도 같은 결의 '핵심 후보' 화면(대면 면접 확인 포인트 — AI 면접 리포트에 있는 항목).
// 지금 보는 제품에는 '지금 보는 제품' 표시만, 상대 제품 카드에만 블루 테두리와 버튼. 홈(current 없음)은 두 제품 카드 모두 버튼(2026-11-26, 옛 깔때기 자리). 카드 사이는 흰 원 안의 꺾쇠. 스타일은 app/landing.css(.pflow).
// 3단계 그림(11/26 시안 '나' 디벨롭): 히어로와 같은 구성 — '핵심 후보' 화면 + 흰 카드 2장(대면 면접 확인 포인트·검사 결과) + 칩 + 점선, 레이어마다 모션.
// 같은 날 "카드 배경을 어둡게(AI 면접·AI 역검이랑 반대로), 위 화면은 화이트로": 1·2단계(흰 카드)와 반대로 3단계 카드 전체를 어둡게(.pf-step.dark), 그림 속 화면은 흰색.
// 이름은 가상, 첫 후보 사진은 사용자가 준 목업 에셋. 원본은 _docs/홈페이지 개편/도식/캡처가공(f2f-l-*).
const F2F: { title: string; sub: string; grades: { name: string; grade: string }[]; stage: HeroStageData } = {
  title: "대면 면접",
  sub: "핵심 후보만 만납니다",
  // AI 면접 종합 등급 '적합', AI 역량검사 4단계 AI 추천 중 '추천' — 그림 속 검사 결과 카드(f2f-result)와 같은 값
  grades: [{ name: "AI 면접", grade: "적합" }, { name: "AI 역량검사", grade: "추천" }],
  stage: {
    img: "/f2f-base.webp",
    alt: "핵심 후보 화면: AI 면접 적합·AI 역량검사 추천을 받은 후보 세 명, 김지원 후보의 대면 면접 확인 포인트와 검사 결과",
    layers: [
      { src: "/f2f-points.webp", move: "down" },
      { src: "/f2f-result.webp", move: "up" },
      { src: "/f2f-chip.webp", move: "right" },
    ],
    lines: [{ d: "M200 258 V178", dot: [200, 176] }],
  },
};

export default function ProductFlow({ current }: { current?: ProductHref }) {
  return (
    <>
      <div className="head">
        {current && <span className="hr-eyebrow">함께 쓰면 좋은 제품</span>}
        <h2>두 제품을 함께 쓰면<br />대면 면접에는 <span className="blue">핵심 후보</span>만 남습니다</h2>
        <p className="lead">따로 써도 되고 함께 써도 됩니다. 아래는 권장 순서 예시이고, 실제 순서는 회사의 채용 방식에 맞추면 됩니다.</p>
      </div>
      <ol className="pflow">
        {PRODUCTS.map((p, i) => {
          const here = p.href === current;
          return (
            <li key={p.href} className={here ? "pf-step" : "pf-step go"}>
              <div className="pf-thumb"><HeroStage {...HERO[p.href]} live={false} /></div>
              <div className="pf-body">
                <span className="pf-no">{i + 1}단계</span>
                <h3>{p.title}</h3>
                <p>{p.when}</p>
                {here
                  ? <span className="pf-here">지금 보는 제품</span>
                  : <Link href={p.href} className="btn btn-blue">{p.title} 보기 <i className="fa-solid fa-arrow-right"></i></Link>}
              </div>
            </li>
          );
        })}
        <li className="pf-step dark">
          <div className="pf-thumb"><HeroStage {...F2F.stage} live={false} /></div>
          <div className="pf-body">
            <span className="pf-no">{PRODUCTS.length + 1}단계</span>
            <h3>{F2F.title}</h3>
            <p>{F2F.sub}</p>
            {/* 11/26 "대면 면접 카드 아래에 AI 면접·AI 역검 뱃지 등급, 아래가 허해" — 1·2단계 버튼 자리에 두 검사 결과 등급(그림 속 검사 결과 카드와 같은 값) */}
            <ul className="pf-grades" aria-label="두 검사 결과">
              {F2F.grades.map((g) => <li key={g.name}><span>{g.name}</span><b>{g.grade}</b></li>)}
            </ul>
          </div>
        </li>
      </ol>
    </>
  );
}
