// 채용팀 기능 — /ai-interview·/ai-assessment 공용(SSOT). 두 제품 공통 기능만 쓴다
// (근거: _docs/홈페이지 개편/AI면접_AI역량검사_차이_소개자료.md '두 제품 공통'). 스타일은 app/landing.css(.band·.valcard).
const TEAM = [
  { icon: "fa-envelope", title: "초대·지원자 관리", body: "메일로 여러 명을 한 번에 초대하거나, 공개 링크로 받습니다." },
  { icon: "fa-file-pdf", title: "리포트 공유", body: "리포트를 PDF로 저장하고, 현업 면접관과 링크로 공유합니다." },
  { icon: "fa-plug", title: "채용 시스템 연동", body: "지금 쓰는 채용 시스템과 API로 연동합니다." },
];

export default function TeamSection() {
  return (
    <section className="band soft" id="team">
      <div className="wrap">
        <div className="head">
          <h2>초대부터 검토까지<br /><span className="blue">한곳에서</span></h2>
        </div>
        <div className="value-grid">
          {TEAM.map((t) => (
            <div className="valcard" key={t.title}>
              <div className="ic"><i className={`fa-solid ${t.icon}`}></i></div>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
