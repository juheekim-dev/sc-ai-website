import Link from "next/link";
import type { ReactNode } from "react";
import HeroParticles from "@/components/HeroParticles";

/**
 * 마지막 CTA(다크) — 홈·/ai-interview·/ai-assessment 공용(SSOT). 스타일은 app/landing.css(.final).
 * 입자가 강조어(word)로 모인다. 제목은 before + word + after 로 이어 붙인다.
 */
export default function FinalCta({
  before,
  word,
  after,
  lead = "간단한 문의를 남겨주시면, 담당자가 도입 방안을 안내해드립니다.",
}: {
  before: ReactNode;
  word: string;
  after: ReactNode;
  lead?: string;
}) {
  return (
    <section className="final" id="final" data-nav="dark">
      <HeroParticles canvasId="final-particles" targetId="real-cta" />
      <div className="wrap">
        <h2>{before}<span className="real-cta" id="real-cta">{word}</span>{after}</h2>
        <p>{lead}</p>
        <Link href="/apply" className="btn btn-blue">무료 상담 신청 <i className="fa-solid fa-arrow-right"></i></Link>
      </div>
    </section>
  );
}
