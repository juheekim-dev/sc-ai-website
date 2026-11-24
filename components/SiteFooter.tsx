"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// 보안 인증(2026-11, GCC 발급). 인증 추가·갱신 시 public/certs/iso-<번호>.svg 와 여기만 고친다.
const CERT_CODES = ["27001", "27701", "27017", "27018"];

// 메뉴 카테고리 — 열 단위로 렌더. 외부 링크는 external.
const FOOT_COLS = [
  {
    title: "제품",
    links: [
      { href: "/ai-interview", label: "AI 면접" },
      { href: "/ai-assessment", label: "AI 역량검사" },
    ],
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
        <p className="foot-copy">© 2026 Second Team. All rights reserved.</p>
      </div>
    </footer>
  );
}
