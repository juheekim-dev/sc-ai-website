import Link from "next/link";
import type { ReactNode } from "react";

/**
 * 제품 상세 페이지 히어로(2026-11-25) — /ai-interview·/ai-assessment 공용. 홈은 어두운 PageHero를 그대로 쓴다.
 * 밝은 바탕, 왼쪽 제품 이름·제목·설명·버튼, 오른쪽 제품 이미지(제품 화면 위에 리포트 카드를 겹친 그림, public/hero-*.webp).
 * 이미지 원본은 _docs/홈페이지 개편/도식/히어로_만들기_make-hero.mjs. 스타일은 app/landing.css(.phero).
 * data-nav를 두지 않는다 — 밝은 바탕이라 GNB를 반전하지 않는다.
 */
export default function ProductHero({ name, isNew = false, title, lead, img, alt }: {
  name: string;
  isNew?: boolean;
  title: ReactNode;
  lead: ReactNode;
  img: string;
  alt: string;
}) {
  return (
    <section className="phero" id="hero">
      <div className="wrap phero-grid">
        <div className="phero-text">
          <span className="phero-name">{name}{isNew && <span className="prod-new">NEW</span>}</span>
          <h1>{title}</h1>
          <p>{lead}</p>
          <div className="phero-cta">
            <Link href="/apply" className="btn btn-blue">무료 상담 신청 <i className="fa-solid fa-arrow-right"></i></Link>
            <Link href="/brochure" className="phero-link">서비스소개서 받기 <i className="fa-solid fa-arrow-right"></i></Link>
          </div>
        </div>
        <div className="phero-media">
          <img src={img} alt={alt} width={1200} height={840} fetchPriority="high" />
        </div>
      </div>
    </section>
  );
}
