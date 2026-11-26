"use client";

import { useEffect, useRef } from "react";
import { REPORT_SVG, type ReportKey } from "./reportDiagrams";

// 리포트 4종 도식에 모션 하나씩(2026-11-26) — 01 회색 줄이 차례로 써짐, 02 파란 원 그래프·막대가 차오름, 03 지원자 육각형 모양이 바뀜,
// 04 강점·약점 아이콘이 움직임. 화면에 들어오면(.play) 6초 주기로 반복하고, 그 전에는 첫 장면에서 멈춘다.
// 움직임 줄이기 설정이면(.still) 완성된 모습 그대로. SVG를 페이지에 바로 넣어 글자는 사이트 글꼴(Pretendard)로 그린다. 스타일은 app/landing.css(.rd).
export default function ReportDiagram({ name, label }: { name: ReportKey; label: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("still");
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      el.classList.add("play");
      el.querySelectorAll("animate").forEach((a) => (a as SVGAnimationElement).beginElement());
      io.disconnect();
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref} className="rd" role="img" aria-label={label} dangerouslySetInnerHTML={{ __html: REPORT_SVG[name] }} />;
}
