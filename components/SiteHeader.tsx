"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/track";
import { EVENTS } from "@/lib/events";

/**
 * '이벤트' 메뉴의 목적지.
 * 행사가 한 건뿐이면 /event 는 상세로 되돌려 보낸다(app/event/page.tsx 의 redirect).
 * 메뉴가 /event 를 거쳐 가면 그 사이 본문이 통째로 비어 푸터가 헤더 바로 밑까지 올라왔다가
 * 상세가 다시 그려진다 — 행사 상세에서 '이벤트'를 누르면 푸터가 먼저 보였다(2026-09-30).
 * 같은 조건으로 상세 주소를 바로 건다. 두 건 이상이 되면 자동으로 목록(/event)으로 돌아간다.
 */
const EVENT_HREF = EVENTS.length === 1 ? `/event/${EVENTS[0].slug}` : "/event";

/**
 * '로그인'(ai.supercoder.co)은 GA4 자동 아웃바운드 클릭으로 잡히지 않는다 —
 * Enhanced Measurement의 아웃바운드 판정이 호스트명이 아니라 등록 도메인(eTLD+1) 기준이라,
 * ai.supercoder.co와 www.supercoder.co는 둘 다 supercoder.co라 '외부 이동'으로 분류되지 않는다.
 * 기존 고객 트래픽 규모를 보려면 이 커스텀 이벤트가 유일한 수단이다.
 */
const LOGIN_URL = "https://ai.supercoder.co/recruiter";

/**
 * '제품' 메뉴 항목 — 데스크톱 펼침 메뉴(제품▾)와 모바일 메뉴의 '제품' 묶음이 함께 쓴다.
 * 아이콘은 app/fontawesome.css 에 있는 것만 쓸 수 있다(서브셋 폰트).
 */
const PRODUCTS = [
  { href: "/ai-interview", title: "슈퍼코더 AI 면접", desc: "AI가 질문하고, 검증 리포트까지 정리합니다", icon: "fa-comments", dark: false, isNew: false },
  { href: "/ai-assessment", title: "AI 역량검사", desc: "AI와 함께 일하는 실력을 실제 과제로 확인합니다", icon: "fa-file-lines", dark: true, isNew: true },
];

/**
 * 공유 GNB(헤더) — 제품▾(AI 면접·AI 역량검사) + 페이지 메뉴(블로그·서비스소개서·이벤트) + 로그인·도입문의 CTA.
 * 섹션 앵커(왜 AI 면접인가/작동 방식/…)는 제거(스크롤 점프 방식 폐기) — 부정행위 감지·보안도 메뉴가 아니라 본문에서 보여준다.
 * 데스크톱은 인라인 링크, 모바일은 햄버거 메뉴. 섹션 인지형 색상(nav-invert 등) 유지.
 * '서비스소개서'는 /brochure 페이지로 이동(추적용 — 모달에서 페이지로 전환됨).
 */
export default function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  // 데스크톱 '제품▾' 펼침 메뉴 — 마우스를 올리면 열리고, 키보드(Enter·Space)로도 열고 닫는다
  const [productsOpen, setProductsOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);
  const productsBtnRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const lastYRef = useRef(0);
  const menuOpenRef = useRef(false);
  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  // 섹션 인지형 GNB 색상 — 헤더 중앙선 아래 섹션에 맞춰 테마 토글
  useEffect(() => {
    function syncHeader() {
      const header = headerRef.current;
      if (!header) return;
      const y = window.scrollY;
      // 이벤트 공지 배너(.evb)가 헤더 위에 있으면 헤더가 그만큼 내려가 있다.
      // 배너는 흐름에 놓여 스크롤과 함께 올라가므로, 화면에 남은 높이만큼만 판정선을 내린다.
      // (배너가 없거나 이미 지나갔으면 0 — 기존과 동일)
      const evb = document.querySelector(".evb");
      const evbPush = evb ? Math.max(0, evb.getBoundingClientRect().bottom) : 0;
      const navLine = y + evbPush + 33;
      function over(sel: string) {
        const els = document.querySelectorAll(sel);
        for (let i = 0; i < els.length; i++) {
          const r = els[i].getBoundingClientRect();
          const top = r.top + y;
          const bottom = top + r.height;
          if (navLine >= top && navLine < bottom) return true;
        }
        return false;
      }
      const overHide = over('[data-nav="hide"]');
      const overDark = over('[data-nav="dark"]');

      // 모바일: 스크롤 방향 기반 자동 숨김(아래로 내리면 숨김, 위로 올리면 표시).
      // 데스크톱은 항상 표시. 메뉴 열림 중엔 숨기지 않음. 상단(≤80px)에선 항상 표시.
      const isMobile = window.matchMedia("(max-width: 760px)").matches;
      const delta = y - lastYRef.current;
      let autoHide = header.classList.contains("nav-hidden");
      if (!isMobile || menuOpenRef.current || y <= 80) {
        autoHide = false;
      } else if (Math.abs(delta) > 4) {
        if (delta > 0) autoHide = true;
        else autoHide = false;
      }
      lastYRef.current = y;

      const hidden = (overHide && y < 40) || autoHide;
      header.classList.toggle("nav-hidden", hidden);
      header.classList.toggle("nav-invert", overDark && !hidden);
      header.classList.toggle("nav-solid", !hidden && !overDark && y > 8);
    }
    window.addEventListener("scroll", syncHeader, { passive: true });
    window.addEventListener("resize", syncHeader, { passive: true });
    syncHeader();
    return () => {
      window.removeEventListener("scroll", syncHeader);
      window.removeEventListener("resize", syncHeader);
    };
    // pathname 변경(클라이언트 라우팅) 시 재실행 — 페이지마다 헤더 색상(로고 반전) 재계산
  }, [pathname]);

  // 메뉴 바깥 클릭 / ESC 로 닫기
  useEffect(() => {
    if (!menuOpen) return;
    function onClick(e: MouseEvent) {
      const t = e.target as HTMLElement;
      if (!t.closest(".nav-menu") && !t.closest(".nav-menu-btn")) setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // '제품▾' 펼침 메뉴 바깥 클릭 / ESC 로 닫기 — ESC는 버튼으로 포커스를 돌려준다
  useEffect(() => {
    if (!productsOpen) return;
    function onClick(e: MouseEvent) {
      if (!productsRef.current?.contains(e.target as Node)) setProductsOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setProductsOpen(false);
      productsBtnRef.current?.focus();
    }
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [productsOpen]);

  // 모바일 메뉴 열림 동안 body 스크롤 잠금 + 챗봇 숨김(겹침 방지)
  useEffect(() => {
    document.body.classList.toggle("nav-menu-open", menuOpen);
    return () => document.body.classList.remove("nav-menu-open");
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  // 이미 그 페이지에 있으면 맨 위로 바로 올린다. globals.css 의 html{scroll-behavior:smooth} 때문에
  // 그냥 두면 긴 페이지를 위로 훑으며 올라간다 — 메뉴를 누른 사람은 첫 화면을 바로 보고 싶어 한다.
  const onEventClick = () => {
    if (pathname === EVENT_HREF) window.scrollTo({ top: 0, behavior: "instant" });
  };

  // 어드민 콘솔은 자체 사이드바 내비를 쓰므로 공개 GNB 숨김
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header ref={headerRef}>
      <nav className="wrap">
        {/* 로고: 항상 홈 최상단(히어로)으로 + 전체 새로고침 → Next Link 대신 일반 a */}
        <a href="/" className="logo">
          <img src="/supercoder-nav.svg" alt="Supercoder" className="nav-logo-img nav-logo--base" />
          <img src="/supercoder-nav-white.svg" alt="Supercoder" className="nav-logo-img nav-logo--invert" />
        </a>

        {/* 우측: 페이지 메뉴 + 로그인 + 도입 문의 + (모바일)햄버거 */}
        <div className="navlinks">
          <div className="nav-center">
            {/* 제품▾ — 마우스 클릭은 열기만(호버로 이미 열려 있으므로 닫히지 않게), 키보드(detail 0)는 열고 닫기 */}
            <div
              ref={productsRef}
              className={`nav-dd${productsOpen ? " open" : ""}`}
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setProductsOpen(false);
              }}
            >
              <button
                ref={productsBtnRef}
                type="button"
                className="nav-dd-btn"
                aria-expanded={productsOpen}
                aria-controls="navProducts"
                onClick={(e) => setProductsOpen((v) => (e.detail === 0 ? !v : true))}
              >
                제품 <i className="fa-solid fa-chevron-down" aria-hidden="true"></i>
              </button>
              <div className="nav-dd-panel" id="navProducts">
                {PRODUCTS.map((p) => (
                  <Link key={p.href} href={p.href} className="nav-dd-item" onClick={() => setProductsOpen(false)}>
                    <span className={`nav-dd-ic${p.dark ? " dark" : ""}`} aria-hidden="true">
                      <i className={`fa-solid ${p.icon}`}></i>
                    </span>
                    <span className="nav-dd-txt">
                      <span className="nav-dd-title">
                        {p.title}
                        {p.isNew && <span className="nav-dd-new">NEW</span>}
                      </span>
                      <span className="nav-dd-desc">{p.desc}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/blog">블로그</Link>
            <Link href="/brochure">서비스소개서</Link>
            <Link href={EVENT_HREF} onClick={onEventClick}>이벤트</Link>
          </div>
          <a
            href={LOGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-out nav-login"
            onClick={() => trackEvent("login_click", { location: "gnb" })}
          >로그인</a>
          <Link href="/apply" className="btn btn-blue nav-btn">도입 문의</Link>

          {/* 모바일: 햄버거 메뉴 */}
          <div className="nav-menu-wrap">
            <button
              type="button"
              className={`nav-menu-btn${menuOpen ? " open" : ""}`}
              aria-label="메뉴"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-controls="navMenu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="nav-burger"><span></span><span></span><span></span></span>
            </button>
            <div className={`nav-menu${menuOpen ? " open" : ""}`} id="navMenu" aria-hidden={!menuOpen}>
              <div className="nav-menu-links">
                {/* 제품 묶음 — 항목이 둘뿐이라 접지 않고 펼쳐 둔다 */}
                <p className="nav-menu-group">제품</p>
                {PRODUCTS.map((p) => (
                  <Link key={p.href} href={p.href} className="nav-menu-sub" onClick={close}>{p.title}</Link>
                ))}
                <Link href="/blog" onClick={close}>블로그</Link>
                <Link href="/brochure" onClick={close}>서비스소개서</Link>
                <Link href={EVENT_HREF} onClick={() => { close(); onEventClick(); }}>이벤트</Link>
                <Link href="/apply" className="nav-menu-item-cta" onClick={close}>도입 문의</Link>
                <a
                  href={LOGIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { trackEvent("login_click", { location: "mobile_menu" }); close(); }}
                >로그인</a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
