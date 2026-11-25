"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

// 움직이는 AI 면접관 오브(2026-11-25 "말할 때마다 움직이거든") — 이미지 속 오브 자리에 겹쳐 실제로 일렁이게 한다.
// 이미지에는 같은 오브가 정지 상태로 그려져 있다(스크립트를 불러오기 전 대비). 불러온 뒤 그 자리를 바탕색(cover)으로 덮고 위에 그린다.
// 모양·색·움직임은 제품과 같은 lib/interviewerOrb.js. 말하기(speak) 모드라 말하는 흉내(초당 약 4음절, 구절 사이 쉼)로 움직인다.
// 화면 밖이면 그리지 않고, 움직임 줄이기 설정이면 한 장만 그린다(interviewerOrb가 처리).
// 자리는 이미지 캔버스 좌표(x·y·size, 캔버스 w×h)로 주고 부모(position:relative, 이미지와 같은 크기) 기준 %로 놓는다. 스타일은 app/landing.css(.live-orb).
export type OrbSpot = { x: number; y: number; size: number; w: number; h: number; cover: string; opacity?: number };

export default function LiveOrb({ spot }: { spot: OrbSpot }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    let orb: { destroy: () => void } | null = null;
    let raf = 0;
    let dead = false;
    import("@/lib/interviewerOrb").then(({ mount }) => {
      if (dead || !cv.parentElement) return;
      const px = Math.max(24, Math.round(cv.parentElement.getBoundingClientRect().width));
      orb = mount(cv, { size: px, palette: "light", mode: "speak" });
      // 첫 장면이 그려진 뒤에 정지 오브를 덮는다(빈 칸이 잠깐 보이지 않게)
      raf = requestAnimationFrame(() => { raf = requestAnimationFrame(() => setOn(true)); });
    });
    return () => { dead = true; cancelAnimationFrame(raf); orb?.destroy(); };
  }, []);

  const style = {
    left: `${(spot.x / spot.w) * 100}%`,
    top: `${(spot.y / spot.h) * 100}%`,
    width: `${(spot.size / spot.w) * 100}%`,
    "--cover": spot.cover,
  } as CSSProperties;

  return (
    <span className="live-orb" data-on={on || undefined} style={style} aria-hidden="true">
      <canvas ref={ref} style={spot.opacity ? { opacity: spot.opacity } : undefined} />
    </span>
  );
}
