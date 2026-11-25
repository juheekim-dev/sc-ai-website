import Link from "next/link";
import { PRODUCTS, type ProductHref } from "@/lib/products";

// 제품 페이지 끝의 '다른 제품 안내' — 상대 제품 도식 썸네일 + 제목·설명 + 버튼(2026-11-25 시안 A안).
// 홈의 서비스소개서 안내(SoftCta, 가운데 한 줄 + 버튼)와 일부러 다른 모양. 썸네일·이름·주소는 lib/products.ts, 스타일은 app/landing.css(.next-card).
export default function NextProductCard({ href, title, body }: { href: ProductHref; title: string; body: string }) {
  const p = PRODUCTS.find((x) => x.href === href)!;
  return (
    <div className="next-card">
      <img className="nc-shot" src={p.img} alt={p.alt} width={1080} height={570} loading="lazy" />
      <div className="nc-body">
        <span className="hr-eyebrow">함께 쓰면 좋은 제품 · {p.title}</span>
        <h3>{title}</h3>
        <p>{body}</p>
        <Link href={p.href} className="btn btn-blue">{p.title} 보기 <i className="fa-solid fa-arrow-right"></i></Link>
      </div>
    </div>
  );
}
