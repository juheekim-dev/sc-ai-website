"use client";

import { useEffect, useRef, type ReactNode } from "react";

// 진행 방식 그림 자리의 '움직이는 카드' 판(2026-11-26) — AI 면접 AskDemo·AI 역량검사 AssistDemo 공용.
// 도식과 같은 연한 판(1080:570) 가운데에 카드를 두고, 화면에 들어오면(.play) 카드 안의 .ad-1 → .ad-2가 차례로 떠오른 뒤
// 잠시 머물다 사라졌다 다시(9초 반복). 움직임 줄이기 설정이면 처음부터 다 보여 준다. 스타일은 app/landing.css(.ask-demo).
export default function DemoPanel({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      el.classList.add("play");
      io.disconnect();
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="ask-demo" ref={ref} role="img" aria-label={label}>
      {children}
    </div>
  );
}
