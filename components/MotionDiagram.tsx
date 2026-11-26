"use client";

import { useEffect, useRef } from "react";
import { MOTION_SVG, type MotionKey } from "./motionDiagrams";

// 모션 도식(2026-11-26) — AI 면접 리포트 4종(줄 써짐·원 그래프/막대·육각형 모양 변화·강점·약점 카드 동시 등장)과
// AI 역량검사 진행 방식 3장(과정 평가 리플레이·AI 인터뷰 대화·평가와 근거). 화면에 들어오면(.play) 반복하고, 그 전에는 첫 장면에서 멈춘다.
// 움직임 줄이기 설정이면(.still) 완성된 모습 그대로. SVG를 페이지에 바로 넣어 글자는 사이트 글꼴(Pretendard)로 그린다. 스타일은 app/landing.css(.rd).
export default function MotionDiagram({ name, label }: { name: MotionKey; label: string }) {
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

  return <div ref={ref} className="rd" role="img" aria-label={label} dangerouslySetInnerHTML={{ __html: MOTION_SVG[name] }} />;
}
