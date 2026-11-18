"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// 보안 인증(2026-11, GCC 발급). 인증 추가·갱신 시 public/certs/iso-<번호>.svg 와 여기만 고친다.
const CERT_GROUPS = [
  { label: "정보보호·개인정보보호 국제 표준", codes: ["27001", "27701"] },
  { label: "클라우드 서비스 정보보호·개인정보보호 국제 표준", codes: ["27017", "27018"] },
];

// 공유 푸터 — 기존 partials.js <site-footer> 포팅. theme.css(footer) 셀렉터 적용.
export default function SiteFooter() {
  const pathname = usePathname();
  // 어드민 콘솔에서는 공개 푸터 숨김(자체 레이아웃)
  if (pathname?.startsWith("/admin")) return null;
  return (
    <footer>
      <div className="wrap">
        {/* 1) 로고 — 클릭 시 홈으로 전체 새로고침(일반 앵커) */}
        <a href="/" className="foot-logo-link" aria-label="홈으로 새로고침">
          <img src="/supercoder-footer.svg" className="foot-logo-img" alt="Supercoder" />
        </a>

        {/* 2) 상품정보 — 서비스 + 약관 */}
        <nav className="foot-nav">
          <Link href="/apply">도입 문의</Link>
          <Link href="/brochure">서비스소개서</Link>
          <Link href="/blog">블로그</Link>
          <a href="https://ai.supercoder.co/recruiter" target="_blank" rel="noopener noreferrer">로그인</a>
        </nav>
        <div className="foot-legal">
          <Link href="/privacy">개인정보처리방침</Link>
          <Link href="/terms">기업용 서비스 이용약관</Link>
          <Link href="/terms-applicant">지원자용 서비스 이용약관</Link>
        </div>

        {/* 3) 보안 인증 마크 — 그룹별 마크 + 2줄 설명(파일: public/certs) */}
        <ul className="foot-cert" aria-label="보안 인증">
          {CERT_GROUPS.map((g) => (
            <li key={g.label} className="foot-cert-item">
              <span className="foot-cert-marks">
                {g.codes.map((c) => (
                  <img key={c} src={`/certs/iso-${c}.svg`} alt={`ISO/IEC ${c} 인증`} width={86} height={36} loading="lazy" />
                ))}
              </span>
              <span className="foot-cert-text">
                {g.label}
                <br />[ISO/IEC {g.codes.join(", ")}] 인증 획득
              </span>
            </li>
          ))}
        </ul>

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
