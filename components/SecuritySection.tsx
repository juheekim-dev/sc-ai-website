import { CERT_CODES } from "@/lib/certs";

// 보안 — 홈·/ai-interview·/ai-assessment 공용(SSOT). 스타일은 app/landing.css(.band·.sec-marks·.valcard).
// '금융권·대기업 보안감사 통과' 문구는 근거를 확인하기 전에는 쓰지 않는다(2026-11 개편 기획).
const CARDS = [
  { icon: "fa-shield-halved", title: "데이터 보호", body: "보존 기간이 지나면 지원자 데이터를 자동으로 삭제합니다." },
  { icon: "fa-lock", title: "계정 보안", body: "Google·Microsoft 로그인과 2단계 인증, IP 허용 목록을 지원합니다." },
  // '접근 관리'는 뜻이 잘 와닿지 않아 근거(활동 로그)에 그대로 맞는 '활동 기록'으로(2026-11-24 사용자 선택, 시안 B안)
  { icon: "fa-clock-rotate-left", title: "활동 기록", body: "누가 언제 어떤 작업을 했는지 기록이 남습니다." },
];

export default function SecuritySection() {
  return (
    <section className="band" id="security">
      <div className="wrap">
        <div className="head">
          <h2>지원자 영상과 개인정보,<br /><span className="blue">국제 표준</span>으로 관리합니다</h2>
          <p className="lead">정보보호·개인정보보호·클라우드 보안 국제 표준 인증을 받았습니다.</p>
        </div>
        <ul className="sec-marks" aria-label="보안 인증">
          {CERT_CODES.map((c) => (
            <li key={c}><img src={`/certs/iso-${c}.svg`} alt={`ISO/IEC ${c} 인증`} width={86} height={36} loading="lazy" /></li>
          ))}
        </ul>
        <div className="value-grid">
          {CARDS.map((c) => (
            <div className="valcard" key={c.title}>
              <div className="ic"><i className={`fa-solid ${c.icon}`}></i></div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
