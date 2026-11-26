import Link from "next/link";
import Tabs from "./Tabs";

// 부정행위 감지(AI 면접) — 홈·/ai-interview 공용(SSOT). 스타일은 app/landing.css(.integ·.ig-*·.ir-*), 탭은 공용 Tabs.
// 레이아웃(2026-11-26 — 사용자가 보낸 참고 화면): 가운데 제목 아래 탭 2개(공용 Tabs)로 하나씩 보여 준다.
// 실시간 감지(지원자 화면 + 감지 항목 4묶음) / 감지 리포트(HTML로 그린 '감지 내역' 카드 + 설명). 카드는 이미지가 아니라 글자가 선명하다.
// 항목은 SC-Platform에 실제로 있는 것만 쓴다: 휴대폰·이어폰 감지는 없고, 여러 얼굴(두 명 이상) 감지는 있다.
// 종합 위험도 등급·신분증 확인·유사도 검사처럼 없는 기능은 넣지 않는다. 감지 표시는 빨강 대신 블루.
// 근거·금지 표현: _docs/홈페이지 개편/AI면접_AI역량검사_차이_소개자료.md 6장.
// 'AI 안경 착용 확인'은 11/24에 뺐다가 11/26 '추가 고려할 부분' 메모(눈/머리·사이드 모니터링·AI 안경·확장 모니터·탭 전환)에 맞춰 다시 넣었다(6→7개).
// 탭 1 '실시간 감지' = 벤토(11/26 E안 — AI 역량검사 '응시 환경'의 .env-bento·.eb-card를 그대로 재사용): 왼쪽 큰 카드 = 정면 카메라(얼굴·시선·안경 검사),
// 오른쪽 작은 카드 3장 = 화면 공유·측면·손·키보드. 카드마다 제목·설명이 붙어 예전 오른쪽 항목 목록(5줄)을 대신한다.
// 문장은 예전 항목 7개의 설명을 나눠 담은 것 — 새 기능을 더하지 않는다(손을 'AI가 감지'한다고 쓰지 않는다 — 사이드 카메라로 함께 '보는' 것).
// 사진은 사용자가 준 목업('실 정면-2'·'실 측면-2'·'키보드와 손'). 측면은 모니터 끝만 살짝 걸리게(16:10, 11/26 "살짝 모니터도 보이게"), 손은 모니터가 빠지게 잘랐고, 화면 공유는 AI 면접 히어로 화면의 창 부분(AI 면접관 카드는 지움).
const SHOTS = [
  { title: "탭 이탈·보조 모니터", body: "다른 탭이나 창으로 가거나 보조 모니터를 연결하면 기록하고, 지원자 화면을 녹화합니다.", img: "/integrity-screen.webp", h: 480, label: "화면 공유", alt: "녹화 중인 지원자 화면: AI 면접 응시 화면", box: false },
  { title: "측면 카메라", body: "휴대폰을 QR로 연결해 옆에서 책상 주변까지 함께 봅니다.", img: "/integrity-side.webp", h: 400, label: "측면", alt: "측면 카메라 화면: 옆에서 본 지원자와 책상, 모니터 끝", box: false },
  { title: "손·키보드", body: "측면 카메라로 키보드 위 손도 함께 봅니다.", img: "/integrity-hands.webp", h: 480, label: "손·키보드", alt: "측면 카메라 화면: 키보드 위 두 손", box: true },
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
// 11/26 "얼굴 감지는 사각형 모서리 4개만", "눈의 시선 감지 그래픽은 과해, 덜어줘" → 얼굴은 모서리 4개. 시선은 "두 눈을 직사각형으로 잡아서" → 두 눈 (510, 215)·(610, 215)을 함께 감싸는 가는 직사각형 하나.
// 같은 날 "배지 3개가 얼굴에 몰려 있다, 사방으로 넓혀" → 배지를 왼쪽 위(얼굴 1명)·오른쪽(시선)·아래(안경 검사)로 펼치고 점선으로 얼굴과 잇는다.
// 배지 자리는 app/landing.css .ig-tag-face·.ig-gaze·.ig-tag-glass — 아래 점선 끝 좌표와 같은 값(%). 눈 자체는 가리지 않는다.
const FACE = { x1: 435, y1: 120, x2: 691, y2: 391, len: 30 };
function GazeHud() {
  const { x1, y1, x2, y2, len: l } = FACE;
  return (
    <svg className="ig-hud" viewBox="0 0 1120 630" aria-hidden="true">
      <path className="ig-hud-corner" d={`M${x1} ${y1 + l}V${y1}H${x1 + l}M${x2 - l} ${y1}H${x2}V${y1 + l}M${x2} ${y2 - l}V${y2}H${x2 - l}M${x1 + l} ${y2}H${x1}V${y2 - l}`} />
      <rect x="474" y="193" width="172" height="44" rx="8" className="ig-hud-ring" />
      <path className="ig-hud-line" d="M646 215H760M435 120L380 78M563 391V446" />
    </svg>
  );
}

// soft: 연한 블루 바탕(기본). 홈은 앞 섹션과 번갈아 오게 흰 바탕(soft={false}, 2026-11-26).
export default function IntegritySection({ withLink = false, soft = true }: { withLink?: boolean; soft?: boolean }) {
  // 탭 1 — 벤토 + 안내 한 줄을 한 덩어리(.ig-live)로 묶어 패널 두 칸을 다 쓴다. 정면 카메라에는 얼굴 모서리 4개·시선 링(GazeHud)·안경 검사 표시
  const live = (
    <div className="ig-live">
      <div className="env-bento ig-bento">
        <div className="eb-card big">
          <div className="eb-txt">
            <h3>얼굴·시선·안경 검사</h3>
            <p>다른 사람이 함께 보이거나 시선이 화면을 벗어나는 순간을 기록하고, AI 안경을 쓰고 있는지 확인합니다.</p>
          </div>
          <div className="ig-face" role="img" aria-label="정면 카메라 화면 예시: 얼굴 1명, 시선 정면, AI 안경 없음">
            <img src="/integrity-face.webp" alt="" width={1120} height={630} loading="lazy" />
            <GazeHud />
            <span className="ig-tag ig-tag-face">얼굴 1명</span>
            <span className="ig-tag ig-gaze">시선 추적 · 정면</span>
            <span className="ig-tag ig-tag-glass">안경 검사 · AI 안경 없음</span>
            <span className="ig-cam"><i></i>정면 · 녹화 중</span>
          </div>
        </div>
        {SHOTS.map((c) => (
          <div className="eb-card" key={c.title}>
            <div className="eb-txt">
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
            <div className="eb-shot">
              <img src={c.img} alt={c.alt} width={640} height={c.h} loading="lazy" />
              {c.box && <span className="ig-hbox"></span>}
              <span className="ig-cam"><i></i>{c.label}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="ig-note">항목은 프로젝트마다 골라 켭니다.</p>
    </div>
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
