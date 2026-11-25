import Link from "next/link";
import type { ReactNode } from "react";

// 레이어 모션(2026-11-25): img(바탕) 위에 같은 크기(1200×840, 투명)의 레이어를 겹치고 레이어마다 움직인다.
// move — down: 위→아래, up: 아래→위, right: 왼쪽→오른쪽(모두 화면 쪽으로 모였다 돌아온다). 스타일·모션은 app/landing.css(.hero-stage).
export type HeroLayer = { src: string; move?: "down" | "up" | "right" };
// 레이어 사이 점선(viewBox 600×420 좌표) — d는 카드 → 화면 방향으로 그린다(점선이 그 방향으로 흐른다), dot은 화면 위 끝점.
export type HeroLine = { d: string; dot: [number, number] };

/**
 * 제품 상세 페이지 히어로(2026-11-25) — /ai-interview·/ai-assessment 공용. 홈은 어두운 PageHero를 그대로 쓴다.
 * 밝은 바탕, 왼쪽 제품 이름·제목·설명·버튼, 오른쪽 제품 이미지(public/hero-*.webp, 1200×840 투명 배경).
 * 이미지 원본: AI 면접은 그림(_docs/홈페이지 개편/도식/히어로_만들기_make-hero.mjs, 한 장), AI 역량검사는 실제 응시 화면을 가공한 것
 * (_docs/홈페이지 개편/도식/캡처가공/make.mjs의 hero-l-* — 화면·AI 어시스턴트·보고서·칩 레이어, 글은 '파일 1, 2, 3' 같은 일반 내용).
 * layers를 주면 img를 바탕으로 레이어를 겹쳐 그리고 움직인다(움직임 줄이기 설정이면 멈춤). 스타일은 app/landing.css(.phero).
 * data-nav를 두지 않는다 — 밝은 바탕이라 GNB를 반전하지 않는다.
 */
export default function ProductHero({ name, isNew = false, title, lead, img, alt, layers, lines }: {
  name: string;
  isNew?: boolean;
  title: ReactNode;
  lead: ReactNode;
  img: string;
  alt: string;
  layers?: HeroLayer[];
  lines?: HeroLine[];
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
              <img src={img} alt="" width={1200} height={840} fetchPriority="high" />
              {lines && (
                <svg className="hs-lines" viewBox="0 0 600 420" aria-hidden="true">
                  {lines.map((l) => (
                    <g key={l.d}>
                      <path d={l.d} />
                      <circle cx={l.dot[0]} cy={l.dot[1]} r={3.4} />
                    </g>
                  ))}
                </svg>
              )}
              {layers.map((l) => (
                <img key={l.src} className={l.move ? `hs-${l.move}` : undefined} src={l.src} alt="" width={1200} height={840} />
              ))}
            </div>
          ) : (
            <img src={img} alt={alt} width={1200} height={840} fetchPriority="high" />
          )}
        </div>
      </div>
    </section>
  );
}
