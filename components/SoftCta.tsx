import Link from "next/link";

// 본문 중간의 가벼운 안내(제목 한 줄 + 버튼) — 지금은 홈 성과 섹션의 서비스소개서 안내에서 쓴다. 스타일은 app/landing.css(.soft-cta).
// 제품 페이지 끝의 다른 제품 안내는 ProductFlow(함께 쓰는 순서)로 바꿨다(2026-11-26).
export default function SoftCta({ title, href, label, outline = false }: { title: string; href: string; label: string; outline?: boolean }) {
  return (
    <div className="soft-cta">
      <h3>{title}</h3>
      <Link href={href} className={`btn ${outline ? "btn-out" : "btn-blue"} soft-cta-btn`}>{label} <i className="fa-solid fa-arrow-right"></i></Link>
    </div>
  );
}
