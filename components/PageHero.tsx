import Link from "next/link";
import type { ReactNode } from "react";
import FlutedGlassBg from "@/components/FlutedGlassBg";

// 히어로 h1의 강조어(흰색 볼드). 입자 수렴 모션의 목표점이었으나 11/26 홈 히어로에서 입자를 뺐다 — id는 남겨 둔다.
export function HeroWord({ children }: { children: ReactNode }) {
  return <span className="hl" id="real-word">{children}</span>;
}

/**
 * 다크 히어로 — 홈 전용(제품 상세 페이지는 밝은 ProductHero, 2026-11-25). 스타일은 app/landing.css(.hero-bg·.decl).
 * 다크 배경 래퍼(.hero-bg: 그라데이션·그레인·입자 캔버스)까지 포함한다.
 * data-nav="dark" → 이 위에서는 GNB가 반전된다(SiteHeader.syncHeader).
 * 바탕은 플루티드 글래스(FlutedGlassBg) — 11/26 브랜드 배경 이미지(SNS 대문)와 같은 밝은 블루·남색. 바탕이 밝아 버튼은 흰색(btn-white). 입자 수렴 모션(HeroParticles)은 11/26 "점들 삭제"로 뺐다(마지막 CTA에는 남아 있다).
 */
export default function PageHero({ title, lead }: { title: ReactNode; lead: ReactNode }) {
  return (
    <div className="hero-bg" data-nav="dark">
      <FlutedGlassBg canvasId="hero-glass" />
      <section className="decl" id="hero">
        <div className="wrap">
          <div>
            <h1>{title}</h1>
            <p>{lead}</p>
            <div className="decl-cta">
              <Link href="/apply" className="btn btn-white">무료 상담 신청 <i className="fa-solid fa-arrow-right"></i></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
