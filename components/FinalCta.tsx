import Link from "next/link";
import type { ReactNode } from "react";
import FlutedGlassBg from "@/components/FlutedGlassBg";

/**
 * 마지막 CTA — 홈·/ai-interview·/ai-assessment 공용(SSOT). 스타일은 app/landing.css(.final).
 * 바탕은 홈 히어로와 같은 유리 배경(FlutedGlassBg — 키컬러 #3A6FFF·#2144A5, 물결, 11/26). 예전 어두운 바탕 + 입자 수렴 모션(HeroParticles)은 뺐다.
 * 바탕이 밝아 버튼은 흰색(btn-white). 제목은 before + word + after 로 이어 붙인다.
 * points를 주면 버튼 아래에 차별점 띠(세 칸, .final-points)를 붙인다 — AI 역량검사(2026-11-25, 히어로 아래에서 옮김).
 */
export default function FinalCta({
  before,
  word,
  after,
  lead = "간단한 문의를 남겨주시면, 담당자가 도입 방안을 안내해드립니다.",
  points,
}: {
  before: ReactNode;
  word: string;
  after: ReactNode;
  lead?: string;
  points?: { title: string; body: string }[];
}) {
  return (
    <section className="final" id="final" data-nav="dark">
      <FlutedGlassBg canvasId="final-glass" />
      <div className="wrap">
        <h2>{before}<span className="real-cta" id="real-cta">{word}</span>{after}</h2>
        <p>{lead}</p>
        <Link href="/apply" className="btn btn-white">무료 상담 신청 <i className="fa-solid fa-arrow-right"></i></Link>
        {points && (
          <ul className="final-points">
            {points.map((p) => (
              <li key={p.title}><b><i aria-hidden="true"></i>{p.title}</b><span>{p.body}</span></li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
