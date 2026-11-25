import Link from "next/link";
import { PRODUCTS, type ProductHref } from "@/lib/products";

// 제품 페이지 끝 '다른 제품 안내' — 두 제품 비교(2026-11-25 시안 2안, 옛 NextProductCard를 바꿈). /ai-interview·/ai-assessment 공용.
// 두 제품을 늘 같은 순서(AI 면접 → AI 역량검사, 권장 순서와 같음)로 나란히 놓고 확인하는 것·지원자가 하는 일·권장 단계 세 줄만 비교한다.
// 지금 보는 제품에는 '지금 보는 제품' 표시만, 상대 제품 카드에만 블루 테두리와 버튼을 둔다.
// 문구는 lib/products.ts(checks·does·when, 근거는 차이 소개자료 2장), 스타일은 app/landing.css(.pcmp).
export default function ProductCompare({ current }: { current: ProductHref }) {
  return (
    <>
      <div className="head">
        <span className="hr-eyebrow">함께 쓰면 좋은 제품</span>
        <h2>두 제품, <span className="blue">무엇이 다른가요?</span></h2>
        <p className="lead">따로 써도 되고 함께 써도 됩니다.</p>
      </div>
      <div className="pcmp">
        {PRODUCTS.map((p) => {
          const here = p.href === current;
          return (
            <article key={p.href} className={here ? "pcmp-card" : "pcmp-card go"}>
              <img src={p.img} alt={p.alt} width={1080} height={570} loading="lazy" />
              <div className="pcmp-body">
                <div className="pcmp-top">
                  <h3>{p.title}</h3>
                  {here && <span className="pcmp-here">지금 보는 제품</span>}
                </div>
                <dl>
                  <dt>확인하는 것</dt><dd>{p.checks}</dd>
                  <dt>지원자가 하는 일</dt><dd>{p.does}</dd>
                  <dt>권장 단계</dt><dd>{p.when}</dd>
                </dl>
                {!here && <Link href={p.href} className="btn btn-blue">{p.title} 보기 <i className="fa-solid fa-arrow-right"></i></Link>}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
