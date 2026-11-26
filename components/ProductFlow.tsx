import Link from "next/link";
import { PRODUCTS, HERO, type ProductHref } from "@/lib/products";
import HeroStage from "./HeroStage";

// 제품 페이지 끝 '다른 제품 안내' — 함께 쓰는 순서(2026-11-26 시안 1안 + 연결 2안, 옛 '두 제품 비교'를 바꿈). /ai-interview·/ai-assessment 공용.
// 권장 순서 예시(AI 면접으로 1차 검증 → AI 역량검사로 실무 확인 → 핵심 후보만 대면 면접, 차이 소개자료 '함께 쓰면')를 세 단계 카드로.
// 1·2단계 그림은 각 제품의 히어로 화면(HeroStage, 움직이는 오브 없이), 3단계는 도입 단계 이미지와 같은 결의 그림(대면 면접 확인 포인트 — AI 면접 리포트에 있는 항목).
// 지금 보는 제품에는 '지금 보는 제품' 표시만, 상대 제품 카드에만 블루 테두리와 버튼. 카드 사이는 흰 원 안의 꺾쇠. 스타일은 app/landing.css(.pflow).
const F2F = {
  title: "대면 면접",
  sub: "핵심 후보만 만납니다",
  img: "/f2f-check.webp",
  alt: "대면 면접 확인 포인트 화면: AI 면접 리포트에서 가져온 확인할 점 세 가지",
};

export default function ProductFlow({ current }: { current: ProductHref }) {
  return (
    <>
      <div className="head">
        <span className="hr-eyebrow">함께 쓰면 좋은 제품</span>
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
        <li className="pf-step">
          <div className="pf-thumb shot"><img src={F2F.img} alt={F2F.alt} width={720} height={480} loading="lazy" /></div>
          <div className="pf-body">
            <span className="pf-no">{PRODUCTS.length + 1}단계</span>
            <h3>{F2F.title}</h3>
            <p>{F2F.sub}</p>
          </div>
        </li>
      </ol>
    </>
  );
}
