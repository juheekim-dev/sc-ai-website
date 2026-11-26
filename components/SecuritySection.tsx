import { CERT_CODES } from "@/lib/certs";

// 보안 — 홈·/ai-interview·/ai-assessment 공용(SSOT). 스타일은 app/landing.css(.band·.sec-split·.sec-marks·.sec-list).
// '금융권·대기업 보안감사 통과'는 11/26 사용자 확인으로 넣었다(고객사 보안감사 통과 — 회사명은 쓰지 않는다).
// 레이아웃(2026-11-25 B안): 다른 섹션과 같은 '카드 3장 한 줄'이 반복된다는 피드백으로 좌우 분할 —
// 왼쪽 제목·인증 마크(2×2), 오른쪽 보안 항목 목록(카드 없이 선으로 나눔).
const ITEMS = [
  { icon: "fa-shield-halved", title: "데이터 보호", body: "보존 기간이 지나면 지원자 데이터를 자동으로 삭제합니다." },
  { icon: "fa-lock", title: "계정 보안", body: "Google·Microsoft 로그인과 2단계 인증, IP 허용 목록을 지원합니다." },
  // '접근 관리'는 뜻이 잘 와닿지 않아 근거(활동 로그)에 그대로 맞는 '활동 기록'으로(2026-11-24 사용자 선택, 시안 B안)
  { icon: "fa-clock-rotate-left", title: "활동 기록", body: "누가 언제 어떤 작업을 했는지 기록이 남습니다." },
];

// soft: 연한 블루 바탕. 기본은 흰 바탕, 홈만 앞 섹션과 번갈아 오게 soft(2026-11-26).
export default function SecuritySection({ soft = false }: { soft?: boolean }) {
  return (
    <section className={soft ? "band soft" : "band"} id="security">
      <div className="wrap sec-split">
        <div>
          <div className="head">
            <h2>지원자 영상과 개인정보,<br /><span className="blue">국제 표준</span>으로 관리합니다</h2>
            <p className="lead">금융권·대기업 보안감사를 통과했고,<br />정보보호·개인정보보호·클라우드 보안 국제 표준 인증을 받았습니다.</p>
          </div>
          <ul className="sec-marks" aria-label="보안 인증">
            {CERT_CODES.map((c) => (
              <li key={c}><img src={`/certs/iso-${c}.svg`} alt={`ISO/IEC ${c} 인증`} width={86} height={36} loading="lazy" /></li>
            ))}
          </ul>
        </div>
        <ul className="sec-list">
          {ITEMS.map((c) => (
            <li key={c.title}>
              <span className="ic" aria-hidden="true"><i className={`fa-solid ${c.icon}`}></i></span>
              <div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
