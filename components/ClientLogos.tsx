// 도입사 로고 마퀴 — 홈·AI 면접 페이지 공용(SSOT). 스타일은 app/landing.css(.herostrip·.marquee-track).
// 로고별 시각 크기 보정 — 기준은 NEXON. 보정값 산출 근거는 app/globals.css의 --logo-* 주석 참고
const LOGOS: { src: string; alt: string; className?: string }[] = [
  { src: "/logos/nexon.svg", alt: "NEXON" },
  { src: "/logos/hyundai-autoever.svg", alt: "Hyundai AutoEver", className: "logo-autoever" },
  { src: "/logos/woongjin.webp", alt: "Woongjin", className: "logo-woongjin" },
  { src: "/logos/skonec.webp", alt: "SKONEC entertainment", className: "logo-skonec" },
  { src: "/logos/markany.webp", alt: "MarkAny", className: "logo-markany" },
];

export default function ClientLogos() {
  return (
    <div className="herostrip" id="clients">
      {/* 라벨만 .wrap으로 감싼다 — 마퀴는 화면 끝까지 흘러야 하므로 밖에 둔다 */}
      <div className="wrap">
        <p className="hs-label">이미 500개 이상의 기업이 Supercoder와 함께하고 있습니다</p>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {Array.from({ length: 6 }).map((_, block) =>
            // 반복 블록 로고에도 alt를 채운다(SEO 진단 alt 누락 대응) — 중복 낭독은 aria-hidden으로 차단
            LOGOS.map((l, i) => (
              <img
                key={`${block}-${i}`}
                src={l.src}
                alt={l.alt}
                className={l.className}
                aria-hidden={block === 0 ? undefined : true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
