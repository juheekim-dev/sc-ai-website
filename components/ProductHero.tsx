import Link from "next/link";
import type { ReactNode } from "react";
import LiveOrb, { type OrbSpot } from "./LiveOrb";

// 레이어 모션(2026-11-25): img(바탕) 위에 같은 크기(1200×840, 투명)의 레이어를 겹치고 레이어마다 움직인다.
// move — down: 위→아래, up: 아래→위, right: 왼쪽→오른쪽(모두 화면 쪽으로 모였다 돌아온다). 스타일·모션은 app/landing.css(.hero-stage).
// orb: 그 레이어 속 AI 면접관 오브 자리 — 레이어와 함께 움직이는 상자 안에 움직이는 오브(LiveOrb)를 겹친다(11/25 "말할 때마다 움직이거든")
export type HeroLayer = { src: string; move?: "down" | "up" | "right"; orb?: OrbSpot };
// 레이어 사이 점선(viewBox = size 좌표, 기본 600×420) — d는 카드 → 화면 방향으로 그린다(점선이 그 방향으로 흐른다), dot은 화면 위 끝점.
export type HeroLine = { d: string; dot: [number, number] };

/**
 * 제품 상세 페이지 히어로(2026-11-25) — /ai-interview·/ai-assessment 공용. 홈은 어두운 PageHero를 그대로 쓴다.
 * 밝은 바탕, 왼쪽 제품 이름·제목·설명·버튼, 오른쪽 제품 이미지(public/hero-*.webp, 1200×840 투명 배경).
 * 이미지 원본은 _docs/홈페이지 개편/도식/캡처가공/make.mjs — AI 역량검사는 실제 응시 화면을 가공한 레이어(hero-l-*: 화면·AI 어시스턴트·보고서·칩,
 * 글은 '파일 1, 2, 3' 같은 일반 내용), AI 면접은 AI 역량검사와 같은 어두운 화면을 캡처 배치대로 그린 레이어(iv3-l-*: 화면·AI 면접관 오브 카드·리포트·칩).
 * layers를 주면 img를 바탕으로 레이어를 겹쳐 그리고 움직인다(움직임 줄이기 설정이면 멈춤). 스타일은 app/landing.css(.phero).
 * data-nav를 두지 않는다 — 밝은 바탕이라 GNB를 반전하지 않는다(AI 면접에 어두운 바탕을 잠깐 썼다가 "답답하다"는 피드백으로 되돌림, 11/25).
 */
// size: 이미지 캔버스 크기(CSS px, 출력은 2배). 기본 600×420. AI 면접은 리포트 카드를 아래로 내리며 600×448(11/25). 점선 viewBox도 이 값을 따른다.
export default function ProductHero({ name, isNew = false, title, lead, img, alt, layers, lines, size = [600, 420] }: {
  name: string;
  isNew?: boolean;
  title: ReactNode;
  lead: ReactNode;
  img: string;
  alt: string;
  layers?: HeroLayer[];
  lines?: HeroLine[];
  size?: [number, number];
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
          {layers ? (
            <div className="hero-stage" role="img" aria-label={alt}>
              <img src={img} alt="" width={size[0] * 2} height={size[1] * 2} fetchPriority="high" />
              {lines && (
                <svg className="hs-lines" viewBox={`0 0 ${size[0]} ${size[1]}`} aria-hidden="true">
                  {lines.map((l) => (
                    <g key={l.d}>
                      <path d={l.d} />
                      <circle cx={l.dot[0]} cy={l.dot[1]} r={3.4} />
                    </g>
                  ))}
                </svg>
              )}
              {layers.map((l) => l.orb ? (
                <div key={l.src} className={l.move ? `hs-layer hs-${l.move}` : "hs-layer"}>
                  <img src={l.src} alt="" width={size[0] * 2} height={size[1] * 2} />
                  <LiveOrb spot={l.orb} />
                </div>
              ) : (
                <img key={l.src} className={l.move ? `hs-${l.move}` : undefined} src={l.src} alt="" width={size[0] * 2} height={size[1] * 2} />
              ))}
            </div>
          ) : (
            <img src={img} alt={alt} width={size[0] * 2} height={size[1] * 2} fetchPriority="high" />
          )}
        </div>
      </div>
    </section>
  );
}
