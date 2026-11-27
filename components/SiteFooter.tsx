"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CERT_CODES } from "@/lib/certs"; // 보안 인증 목록 — 보안 섹션과 공용
import { PRODUCTS } from "@/lib/products"; // 제품 이름 — GNB·홈 카드와 공용

// 메뉴 카테고리 — 열 단위로 렌더. 외부 링크는 external.
const FOOT_COLS = [
  {
    title: "제품",
    links: PRODUCTS.map((p) => ({ href: p.href, label: p.title })),
  },
  {
    title: "서비스",
    links: [
      { href: "/apply", label: "도입 문의" },
      { href: "https://ai.supercoder.co/recruiter", label: "로그인", external: true },
    ],
  },
  {
    title: "리소스",
    links: [
      { href: "/brochure", label: "서비스소개서" },
      { href: "/blog", label: "블로그" },
    ],
  },
  {
    title: "약관·정책",
    links: [
      { href: "/privacy", label: "개인정보처리방침" },
      { href: "/terms", label: "기업용 서비스 이용약관" },
      { href: "/terms-applicant", label: "지원자용 서비스 이용약관" },
    ],
  },
];

// 공유 푸터 — 순서: 로고 > 보안 인증 > 메뉴 카테고리 > 회사 정보 > Copyright
// 푸터 SNS(2026-11-26) — 네 채널 모두 사용자가 준 주소. 빈 url은 그리지 않는다(채널을 잠시 내릴 때는 url만 비우면 된다).
// 링크드인은 관리자 화면 주소(/admin/dashboard/)가 아니라 공개 회사 페이지 주소로 넣는다.
const SOCIAL: { name: string; url: string; icon: ReactNode }[] = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/74284643/",
    icon: <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/supercoder_kr/",
    icon: <><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4.3" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.6" cy="6.4" r="1.3" /></>,
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@supercoder7974",
    icon: <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />,
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/supercoder.kr/",
    icon: <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07" />,
  },
];

export default function SiteFooter() {
  const pathname = usePathname();
  // 어드민 콘솔에서는 공개 푸터 숨김(자체 레이아웃)
  if (pathname?.startsWith("/admin")) return null;
  return (
    <footer>
      <div className="wrap">
        {/* 상단 2단: 왼쪽 브랜드(로고·인증) / 오른쪽 메뉴 카테고리. 좁으면 세로로 쌓임 */}
        <div className="foot-top">
          <div className="foot-brand">
            {/* 1) 로고 — 클릭 시 홈으로 전체 새로고침(일반 앵커) */}
            <a href="/" className="foot-logo-link" aria-label="홈으로 새로고침">
              <img src="/supercoder-footer.svg" className="foot-logo-img" alt="Supercoder" />
            </a>

            {/* 2) 보안 인증 마크 — 4개 한 줄 + 2줄 설명(파일: public/certs) */}
            <div className="foot-cert">
              <ul className="foot-cert-marks" aria-label="보안 인증">
                {CERT_CODES.map((c) => (
                  <li key={c}>
                    <img src={`/certs/iso-${c}.svg`} alt={`ISO/IEC ${c} 인증`} width={86} height={36} loading="lazy" />
                  </li>
                ))}
              </ul>
              <p className="foot-cert-text">
                ISO/IEC 27001 · 27701 · 27017 · 27018 인증
                <br />
                정보보호·개인정보보호·클라우드 보안 국제 표준
              </p>
            </div>
          </div>

          {/* 3) 메뉴 카테고리 */}
          <nav className="foot-cols" aria-label="푸터 메뉴">
            {FOOT_COLS.map((col) => (
              <div key={col.title} className="foot-col">
                <p className="foot-col-title">{col.title}</p>
                {col.links.map((l) =>
                  "external" in l ? (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
                  ) : (
                    <Link key={l.href} href={l.href}>{l.label}</Link>
                  ),
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* 4) 기업정보 — 맨 하단 */}
        <hr className="foot-divider" />
        <div className="foot-biz">
          <span>주식회사 세컨드팀</span>
          <span>대표 최재웅</span>
          <span>서울시 서초구 효령로55길 19 5층</span>
          <span>사업자등록번호 212-88-02079</span>
          <span>대표번호 1544-3160</span>
          <span>support@supercoder.co</span>
        </div>
        {/* 5) 저작권 + SNS(11/26) — 주소가 있는 채널만 그린다(SOCIAL). 아이콘은 인라인 SVG — Font Awesome 서브셋에 브랜드 아이콘이 없어서 */}
        <div className="foot-bottom">
          <p className="foot-copy">© 2026 Second Team. All rights reserved.</p>
          <ul className="foot-sns" aria-label="Supercoder SNS">
            {SOCIAL.filter((s) => s.url).map((s) => (
              <li key={s.name}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`Supercoder ${s.name}`}>
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{s.icon}</svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
