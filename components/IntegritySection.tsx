import Link from "next/link";
import type { ReactNode } from "react";
import Tabs from "./Tabs";

// 부정행위 감지(AI 면접) — 홈·/ai-interview 공용(SSOT). 스타일은 app/landing.css(.integ·.ig-*·.ir-*), 탭은 공용 Tabs.
// 레이아웃(2026-11-26 — 사용자가 보낸 참고 화면): 가운데 제목 아래 탭 2개(공용 Tabs)로 하나씩 보여 준다.
// 실시간 감지(지원자 화면 + 감지 항목 4묶음) / 감지 리포트(HTML로 그린 '감지 내역' 카드 + 설명). 카드는 이미지가 아니라 글자가 선명하다.
// 항목은 SC-Platform에 실제로 있는 것만 쓴다: 휴대폰·이어폰 감지는 없고, 여러 얼굴(두 명 이상) 감지는 있다.
// 종합 위험도 등급·신분증 확인·유사도 검사처럼 없는 기능은 넣지 않는다. 감지 표시는 빨강 대신 블루.
// 근거·금지 표현: _docs/홈페이지 개편/AI면접_AI역량검사_차이_소개자료.md 6장.
// 'AI 안경 착용 확인'은 11/24에 뺐다가 11/26 '추가 고려할 부분' 메모(눈/머리·사이드 모니터링·AI 안경·확장 모니터·탭 전환)에 맞춰 다시 넣었다(6→7개).
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const ICON = {
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  monitor: <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></>,
  glasses: <><circle cx="6.5" cy="14" r="3.5" /><circle cx="17.5" cy="14" r="3.5" /><path d="M10 13.5c1.2-.8 2.8-.8 4 0" /><path d="M3 14 5 7h2M21 14l-2-7h-2" /></>,
  keyboard: <><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" /></>,
};
const Icon = ({ d }: { d: ReactNode }) => <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">{d}</svg>;

// 탭 1 '실시간 감지' — 감지 항목 7개를 얼굴·시선·안경 검사·손·키보드·화면·기기 5줄로(11/26 "내용은 많은데 정리되지 않은 느낌" → 참고 화면처럼 탭으로 나눠 하나씩.
// 같은 날 "안경 검사도 한다고 해야해" → AI 안경을 '안경 검사' 줄로 따로. "키보드와 손도 같이 감시한다는 것도" → 사이드 카메라(휴대폰 QR)가 보는 손·키보드를 따로 한 줄로,
// 화면 이탈·보조 모니터는 '화면·기기' 한 줄로 묶음. 소개자료 표기는 'AI 안경 착용 확인'·'휴대폰 사이드 카메라(QR 연결)').
// 문장은 예전 항목 7개의 설명을 묶은 것 — 새 기능을 더하지 않는다(손을 'AI가 감지'한다고 쓰지 않는다 — 사이드 카메라로 함께 '보는' 것).
const GROUPS = [
  { icon: ICON.users, title: "얼굴", body: "카메라에 다른 사람이 함께 보이면 기록합니다." },
  { icon: ICON.eye, title: "시선", body: "시선과 머리 움직임을 따라가며, 화면을 벗어나는 순간을 기록합니다." },
  { icon: ICON.glasses, title: "안경 검사", body: "화면에 답을 띄워 주는 AI 안경(스마트 안경)을 쓰고 있는지 확인합니다." },
  { icon: ICON.keyboard, title: "손·키보드", body: "휴대폰을 QR로 연결한 측면 카메라로 키보드 위 손과 책상 주변을 함께 봅니다." },
  { icon: ICON.monitor, title: "화면·기기", body: "다른 탭이나 창으로 가거나 보조 모니터를 연결하면 기록하고, 면접 중 지원자 화면을 녹화합니다." },
];

// 정면 아래 작은 녹화 화면 세 칸(640×480). box: 손 둘레 표시(손·키보드 칸)
const TILES = [
  { src: "/integrity-screen.webp", label: "화면 공유" },
  { src: "/integrity-side.webp", label: "측면" },
  { src: "/integrity-hands.webp", label: "손·키보드", box: true },
];

// 탭 2 '감지 리포트' 오른쪽 설명
const REPORT_POINTS = ["감지한 순간을 종류·시각과 함께 기록", "누르면 면접 영상의 그 장면으로 이동", "판단을 돕는 자료 — 최종 판단은 채용팀이"];

// 면접 영상의 감지 장면 3칸 — 위 감지 내역 줄과 같은 종류·시각
const CLIPS = [
  { label: "시선 이탈", t: "03:12" },
  { label: "탭 전환", t: "08:40" },
  { label: "여러 얼굴", t: "12:05" },
];

// 얼굴·시선 표시(SVG). 좌표는 integrity-face.webp(1120×630, 가로로 긴 화면 비율 — 11/26 "화면 비율로") 기준.
// 11/26 "얼굴 감지는 사각형 모서리 4개만", "눈의 시선 감지 그래픽은 과해, 덜어줘" → 얼굴은 모서리 4개, 시선은 오른쪽 눈 (610, 215) 둘레 가는 링 하나 + 태그까지 점선.
// 눈 자체는 가리지 않는다. 박스 범위 x 435~691, y 120~391 — 태그 자리(.ig-box)와 같은 값.
const FACE = { x1: 435, y1: 120, x2: 691, y2: 391, len: 30 };
function GazeHud() {
  const { x1, y1, x2, y2, len: l } = FACE;
  return (
    <svg className="ig-hud" viewBox="0 0 1120 630" aria-hidden="true">
      <path className="ig-hud-corner" d={`M${x1} ${y1 + l}V${y1}H${x1 + l}M${x2 - l} ${y1}H${x2}V${y1 + l}M${x2} ${y2 - l}V${y2}H${x2 - l}M${x1 + l} ${y2}H${x1}V${y2 - l}`} />
      <circle cx="610" cy="215" r="25" className="ig-hud-ring" />
      <line x1="635" y1="215" x2="706" y2="215" className="ig-hud-line" />
    </svg>
  );
}

// soft: 연한 블루 바탕(기본). 홈은 앞 섹션과 번갈아 오게 흰 바탕(soft={false}, 2026-11-26).
export default function IntegritySection({ withLink = false, soft = true }: { withLink?: boolean; soft?: boolean }) {
  // 탭 1 — 왼쪽은 녹화 화면 네 장(11/26 "여러 이미지가 배치되어야 해", "화면공유 이미지도"): 위에 정면 카메라를 크게, 아래에 작은 세 칸
  // (화면 공유 = AI 면접 히어로 화면 hero-interview-base의 창 부분, 측면 = 목업 '실 측면-2', 손·키보드 = 목업 '키보드와 손')을 정면 아래쪽에 겹쳐 한 줄로.
  // 정면 카메라에는 얼굴 박스·시선 추적 링(GazeHud)·안경 검사 표시. 11/26 "눈에 이상한 거 하지 말고 시선을 추적한다는 느낌" → 눈 위 파란 점을 빼고 눈을 가리지 않는 링 + 시선 선으로.
  // 같은 날 "측면 이미지에서 모니터 화면은 크롭" → 측면·손 사진 모두 모니터가 빠지게 잘랐다(흐림이 아니라 자르기).
  const live = (
    <>
      <div className="ig-cams" role="img" aria-label="면접 중 녹화 화면 예시: 정면 카메라로 얼굴 1명과 시선을 따라가고 AI 안경 착용을 검사하며, 지원자 화면 공유와 측면 카메라로 키보드 위 손과 책상 주변을 함께 봅니다.">
        <div className="ig-face">
          <img src="/integrity-face.webp" alt="" width={1120} height={630} loading="lazy" />
          <GazeHud />
          <span className="ig-box"><span className="ig-tag">얼굴 1명</span><span className="ig-tag ig-tag-b">안경 검사 · AI 안경 없음</span></span>
          <span className="ig-gaze">시선 추적 · 정면</span>
          <span className="ig-cam"><i></i>정면 · 녹화 중</span>
        </div>
        <div className="ig-tiles">
          {TILES.map((t) => (
            <div key={t.label} className="ig-tile">
              <img src={t.src} alt="" width={640} height={480} loading="lazy" />
              {t.box && <span className="ig-hbox"></span>}
              <span className="ig-cam"><i></i>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <ul className="ig-list">
          {GROUPS.map((g) => (
            <li key={g.title}>
              <span className="ig-ic"><Icon d={g.icon} /></span>
              <div><b>{g.title}</b><span>{g.body}</span></div>
            </li>
          ))}
        </ul>
        <p className="ig-note">항목은 프로젝트마다 골라 켭니다.</p>
      </div>
    </>
  );

  // 탭 2 — 왼쪽 감지 내역 카드(예시), 오른쪽 설명. 감지 3건은 영상 칸 3개가 종류·시각을 함께 보여 줘서 위에 따로 줄을 두지 않는다(11/26 중복 제거)
  const report = (
    <>
      {/* 시각은 예시 값. 타임라인 표시 위치는 시각에 맞춘다(03:12/15:00 = 21%, 08:40/15:00 = 58%, 12:05/15:00 = 80%). 지금 재생 중인 첫 칸은 블루 테두리 */}
      <div className="ir" role="img" aria-label="부정행위 감지 내역 예시: 시선 이탈 3분 12초, 탭 전환 8분 40초, 여러 얼굴 12분 5초. 누르면 면접 영상의 그 장면으로 이동합니다.">
        <div className="ir-h">
          <svg viewBox="0 0 24 24" className="ir-shield" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5z" /></svg>
          <b>부정행위 감지 내역</b><span className="ir-smp">예시</span>
        </div>
        <div className="ir-sum"><span>감지</span><span className="ir-pill">3건</span><strong>눌러서 그 장면을 확인하세요</strong></div>
        <div className="ir-vid">
          <div className="ir-vh">면접 영상<span>시선 이탈 03:12</span></div>
          <div className="ir-clips">
            {CLIPS.map((c, i) => (
              <div key={c.label} className={i === 0 ? "ir-clip on" : "ir-clip"}><span className="ir-clip-tag">{c.label}</span><span className="ir-clip-play" aria-hidden="true"></span><span className="ir-clip-t">{c.t}</span></div>
            ))}
          </div>
          <div className="ir-bar"><span className="ir-play"></span><span className="ir-track"><b style={{ width: "21%" }}></b><i style={{ left: "21%" }}></i><i style={{ left: "58%" }}></i><i style={{ left: "80%" }}></i></span></div>
          <div className="ir-times"><span>0:00</span><span>15:00</span></div>
        </div>
        <div className="ir-chips"><span>보조 모니터 없음</span></div>
      </div>
      <div>
        <p className="ig-lead">감지한 장면은 리포트에 모이고, 채용팀이 면접 영상과 함께 하나씩 확인합니다.</p>
        <ul className="ig-checks">
          {REPORT_POINTS.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </div>
    </>
  );

  return (
    <section className={soft ? "band soft" : "band"} id="integrity">
      <div className="wrap integ">
        <div className="head">
          <h2>AI로 대답하는 지원자,<br /><span className="blue">면접 중에</span> 가려냅니다</h2>
          <p className="lead">얼굴·시선부터 안경·손·화면까지 면접 내내 함께 기록하고, 감지한 장면은 영상으로 바로 확인합니다.</p>
        </div>
        <Tabs
          label="부정행위 감지"
          panelClass="ig-panel"
          items={[
            { label: "실시간 감지", panel: live },
            { label: "감지 리포트", panel: report },
          ]}
        />
        {withLink && (
          <Link href="/ai-interview" className="hr-link ig-link">AI 면접 자세히 보기 <i className="fa-solid fa-arrow-right"></i></Link>
        )}
      </div>
    </section>
  );
}
