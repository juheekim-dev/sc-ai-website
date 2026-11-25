import Link from "next/link";
import type { ReactNode } from "react";
import HeroParticles from "@/components/HeroParticles";

// 입자가 모여드는 강조어. 히어로 h1 안에서 한 번만 쓴다(HeroParticles targetId와 짝).
export function HeroWord({ children }: { children: ReactNode }) {
  return <span className="hl" id="real-word">{children}</span>;
}

/**
 * 다크 히어로 — 홈 전용(제품 상세 페이지는 밝은 ProductHero, 2026-11-25). 스타일은 app/landing.css(.hero-bg·.decl).
 * 다크 배경 래퍼(.hero-bg: 그라데이션·그레인·입자 캔버스)까지 포함한다.
 * data-nav="dark" → 이 위에서는 GNB가 반전된다(SiteHeader.syncHeader).
 */
export default function PageHero({ title, lead }: { title: ReactNode; lead: ReactNode }) {
  return (
    <div className="hero-bg" data-nav="dark">
      <HeroParticles canvasId="hero-particles" targetId="real-word" />
      <section className="decl" id="hero">
        <div className="wrap">
          <div>
            <h1>{title}</h1>
            <p>{lead}</p>
            <div className="decl-cta">
              <Link href="/apply" className="btn btn-blue">무료 상담 신청 <i className="fa-solid fa-arrow-right"></i></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
