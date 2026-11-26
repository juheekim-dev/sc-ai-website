import LiveOrb, { type OrbSpot } from "./LiveOrb";

// 제품 히어로 화면(바탕 + 점선 + 레이어) — ProductHero(크게, 움직이는 오브 포함)와 ProductFlow(함께 쓰는 순서 썸네일, live=false)가 같이 쓴다(2026-11-26).
// 레이어 모션(2026-11-25): img(바탕) 위에 같은 크기(투명)의 레이어를 겹치고 레이어마다 움직인다.
// move — down: 위→아래, up: 아래→위, right: 왼쪽→오른쪽(모두 화면 쪽으로 모였다 돌아온다). 스타일·모션은 app/landing.css(.hero-stage).
// orb: 그 레이어 속 AI 면접관 오브 자리 — 레이어와 함께 움직이는 상자 안에 움직이는 오브(LiveOrb)를 겹친다(11/25 "말할 때마다 움직이거든"). live=false면 겹치지 않는다.
export type HeroLayer = { src: string; move?: "down" | "up" | "right"; orb?: OrbSpot };
// 레이어 사이 점선(viewBox = size 좌표, 기본 600×420) — d는 카드 → 화면 방향으로 그린다(점선이 그 방향으로 흐른다), dot은 화면 위 끝점.
export type HeroLine = { d: string; dot: [number, number] };
// size: 이미지 캔버스 크기(CSS px, 출력은 2배). 기본 600×420. AI 면접은 리포트 카드를 아래로 내리며 600×448(11/25).
export type HeroStageData = { img: string; alt: string; layers?: HeroLayer[]; lines?: HeroLine[]; size?: [number, number] };

export default function HeroStage({ img, alt, layers, lines, size = [600, 420], live = true, priority = false }: HeroStageData & { live?: boolean; priority?: boolean }) {
  const w = size[0] * 2, h = size[1] * 2;
  const load = priority ? { fetchPriority: "high" as const } : { loading: "lazy" as const };
  if (!layers) return <img src={img} alt={alt} width={w} height={h} {...load} />;
  return (
    <div className="hero-stage" role="img" aria-label={alt}>
      <img src={img} alt="" width={w} height={h} {...load} />
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
      {layers.map((l) => l.orb && live ? (
        <div key={l.src} className={l.move ? `hs-layer hs-${l.move}` : "hs-layer"}>
          <img src={l.src} alt="" width={w} height={h} />
          <LiveOrb spot={l.orb} />
        </div>
      ) : (
        <img key={l.src} className={l.move ? `hs-${l.move}` : undefined} src={l.src} alt="" width={w} height={h} {...(priority ? {} : { loading: "lazy" as const })} />
      ))}
    </div>
  );
}
