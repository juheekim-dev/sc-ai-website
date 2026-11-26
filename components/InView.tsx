"use client";

import { useEffect, useRef, type ReactNode } from "react";

// 화면에 들어오면 한 번 .inview를 붙이는 상자 — 모션은 CSS가 맡는다(.inview 전에는 첫 장면에서 멈춤).
// 홈 깔때기(.fn-wrap, 2026-11-26 "위에서부터 내려오게"). PairGrid·DemoPanel과 같은 방식이고, 서버 컴포넌트의 SVG를 그대로 children으로 받는다.
export default function InView({ className, threshold = 0.3, children }: { className: string; threshold?: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      el.classList.add("inview");
      io.disconnect();
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return <div className={className} ref={ref}>{children}</div>;
}
