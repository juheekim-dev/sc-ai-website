import Link from "next/link";

// 부정행위 감지(AI 면접) — 홈·/ai-interview 공용(SSOT). 스타일은 app/landing.css(.band·.how-row·.hr-points).
// 항목은 SC-Platform에 실제로 있는 것만 쓴다: 휴대폰·이어폰 감지는 없고, 여러 얼굴(두 명 이상) 감지는 있다.
// 근거·금지 표현: _docs/홈페이지 개편/AI면접_AI역량검사_차이_소개자료.md 6장.
const ITEMS = [
  "시선·머리 움직임",
  "여러 얼굴(두 명 이상) 감지",
  "사이드 카메라(휴대폰 QR 연결)",
  "AI 안경 착용 확인",
  "보조 모니터 연결",
  "다른 탭·창으로 이동",
  "면접 중 화면 녹화",
];

export default function IntegritySection({ withLink = false }: { withLink?: boolean }) {
  return (
    <section className="band soft" id="integrity">
      <div className="wrap">
        <div className="head">
          <h2>AI로 대답하는 지원자,<br /><span className="blue">면접 중에</span> 가려냅니다</h2>
          <p className="lead">시선·화면·기기 신호를 면접 내내 함께 기록합니다.</p>
        </div>
        <div className="how-rows">
          <div className="how-row">
            <div className="hr-info">
              <span className="hr-eyebrow">부정행위 감지</span>
              <h3>감지한 장면을 영상으로 바로 확인합니다</h3>
              <ul className="hr-points two">
                {ITEMS.map((t) => <li key={t}>{t}</li>)}
              </ul>
              <p>항목은 프로젝트마다 골라 켭니다. 감지 내역은 리포트에 남고, 누르면 영상의 그 장면으로 이동합니다. 최종 판단은 채용팀이 합니다.</p>
              {withLink && (
                <Link href="/ai-interview" className="hr-link">AI 면접 자세히 보기 <i className="fa-solid fa-arrow-right"></i></Link>
              )}
            </div>
            <div className="hr-media">
              <img className="hr-img" src="/diagram-integrity.webp" alt="부정행위 감지 도식: 영상의 감지 지점과 감지 내역" width={1080} height={570} loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
