import Link from "next/link";
import Tabs from "./Tabs";

// 부정행위 감지(AI 면접) — 홈·/ai-interview 공용(SSOT). 스타일은 app/landing.css(.integ·.ig-*·.lv-*·.rp-*·.ir-bar), 탭은 공용 Tabs.
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

// 탭 2 '실시간 모니터링'(11/26 "우리도 실시간 감시가 되는데", "실시간 감시 화면도 넣어줘") — SC-Platform 채용팀 메뉴 '실시간 모니터링'(/recruiter/home/live-proctoring)을 HTML로 그린 예시.
// 제품 화면 그대로: 진행 중인 AI 면접·AI 역량검사 지원자를 칸으로(칸마다 위 화면 공유, 아래 정면·측면 카메라, 맨 아래 '번호. 이름'과 프로젝트),
// 감지가 있는 칸은 'AI 감지'로 표시하고 맨 앞으로, 누르면 'AI 감독 리포트'. 응시 중 바로 잡히는 건 시선 이탈·여러 얼굴·얼굴 미감지·시험 화면 이탈(약 10초 간격 갱신).
// 회사별로 켜는 베타 기능이라 그렇게 밝힌다. 휴대폰·이어폰·가상 머신 감지는 제품 목록에만 있고 감지 코드가 없어 쓰지 않는다. 감지 표시는 사이트 규칙대로 블루(제품은 노랑).
// 이름은 가상. 11/26 M2안(포커스 + 목록): 왼쪽 진행 중 목록(감지된 지원자가 맨 위), 오른쪽에 그 지원자를 크게(제품의 '칸을 누르면 크게 보기').
// 사진은 목업 인물 한 명뿐이라 목록의 나머지는 이름 첫 글자로.
const LIVE_CELLS = [
  { name: "김서연", project: "서비스 기획자", flag: true },
  { name: "이도윤", project: "백엔드 개발자", flag: false },
  { name: "박지후", project: "마케터", flag: false },
  { name: "최하린", project: "서비스 기획자", flag: false },
];
const LIVE_POINTS = [
  "진행 중인 AI 면접·AI 역량검사를 한 화면에",
  "지원자마다 화면 공유·정면·측면 카메라를 실시간으로",
  "시선 이탈·여러 얼굴·자리 비움·화면 이탈은 응시 중에 바로 표시",
  "감지된 지원자는 맨 앞으로 — 누르면 크게 보고 AI 감독 리포트로",
];

// 탭 3 '감지 리포트' = 벤토(11/26 R3 — 감지 항목 탭과 같은 결). 큰 카드 = 면접 영상의 시선 이탈 장면(목업 '실 측면-2'에서 고개 돌린 얼굴 쪽을 16:9로, 모니터는 빠지게)
// + 두 눈 측정 박스·시선 방향 화살표·'시선 이탈' 배지 + 타임라인. 작은 카드 3장 = 종류·시각 기록 → 그 장면으로 이동 → 판단은 채용팀이.
// 감지 종류·시각·경고/정보는 예시 값(제품 'AI 감독 리포트'의 전체 감지 내역·심각/경고/정보 구분을 따름). 타임라인 표시 위치는 시각에 맞춘다(03:12/15:00 = 21%, 08:40 = 58%, 12:05 = 80%).
const EVENTS = [
  { sev: "경고", label: "시선 이탈", t: "03:12" },
  { sev: "경고", label: "화면 이탈", t: "08:40" },
  { sev: "정보", label: "보조 모니터", t: "12:05" },
];
const REPORT_SHOTS = [
  { title: "그 장면으로 이동", body: "누르면 면접 영상의 그 장면부터 재생합니다.", img: "/integrity-screen.webp", h: 480, tag: "화면 이탈 · 08:40" },
  { title: "판단은 채용팀이", body: "리포트는 판단을 돕는 자료이고, 최종 판단은 채용팀이 합니다.", img: "/integrity-side.webp", h: 400, tag: "보조 모니터 · 12:05" },
];

// 얼굴·시선 표시(SVG). 좌표는 integrity-face.webp(1120×630, 가로로 긴 화면 비율 — 11/26 "화면 비율로") 기준.
// 11/26 "얼굴 감지는 사각형 모서리 4개만", "눈의 시선 감지 그래픽은 과해, 덜어줘" → 얼굴은 모서리 4개. 시선은 "두 눈을 직사각형으로 잡아서" → 두 눈 (510, 215)·(610, 215)을 함께 감싸는 가는 직사각형 하나.
// 같은 날 "배지 3개가 얼굴에 몰려 있다, 사방으로 넓혀" → 배지를 왼쪽 위(얼굴 1명)·오른쪽(시선)·아래(안경 검사)로 펼치고 점선으로 얼굴과 잇는다.
// 배지 자리는 app/landing.css .ig-tag-face·.ig-gaze·.ig-tag-glass — 아래 점선 끝 좌표와 같은 값(%). 눈 자체는 가리지 않는다.
// 모션(11/26 "여기에 모션 넣어줘", CSS만): 모서리가 좁혀 들어와 얼굴을 잡고 → 두 눈 직사각형이 그려지고 → 점선·배지 3개가 차례로 → 잠시 머문 뒤 사라지고 반복(7초).
const FACE = { x1: 435, y1: 120, x2: 691, y2: 391, len: 30 };
function GazeHud() {
  const { x1, y1, x2, y2, len: l } = FACE;
  return (
    <svg className="ig-hud" viewBox="0 0 1120 630" aria-hidden="true">
      <path className="ig-hud-corner" d={`M${x1} ${y1 + l}V${y1}H${x1 + l}M${x2 - l} ${y1}H${x2}V${y1 + l}M${x2} ${y2 - l}V${y2}H${x2 - l}M${x1 + l} ${y2}H${x1}V${y2 - l}`} />
      <rect x="474" y="193" width="172" height="44" rx="8" className="ig-hud-ring" pathLength={1} />
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

  // 탭 2 — 왼쪽 실시간 모니터링 화면(예시), 오른쪽 설명. 크게 보는 정면 카메라에는 감지 항목 탭과 같은 얼굴 모서리 4개
  const monitor = (
    <>
      <div className="lv" role="img" aria-label="실시간 모니터링 화면 예시: 진행 중인 지원자 4명 중 AI 감지가 있는 첫 번째 지원자가 목록 맨 위에 있고, 그 지원자의 화면 공유·정면·측면 카메라를 크게 보고 있습니다.">
        <div className="lv-h"><b>실시간 모니터링</b><span className="lv-n">진행 중 {LIVE_CELLS.length}</span><span className="lv-q">지원자 이메일로 검색</span></div>
        <div className="lv-body">
          <ul className="lv-list">
            {LIVE_CELLS.map((c, i) => (
              <li key={c.name} className={c.flag ? "on" : undefined}>
                <span className="lv-av">{c.flag ? <img src="/integrity-face.webp" alt="" width={1120} height={630} loading="lazy" /> : c.name[0]}</span>
                <span className="lv-who">{i + 1}. {c.name}<small>{c.project}</small></span>
                <span className="lv-st">{c.flag ? "AI 감지" : "진행 중"}</span>
              </li>
            ))}
          </ul>
          <div className="lv-focus">
            <div className="lv-top"><i></i>AI 감지 · 시선 이탈</div>
            <div className="lv-v"><img src="/integrity-screen.webp" alt="" width={640} height={480} loading="lazy" /><span className="lv-chip">화면 공유</span></div>
            <div className="lv-cams">
              <div className="lv-v">
                <img src="/integrity-face.webp" alt="" width={1120} height={630} loading="lazy" />
                <svg className="ig-hud" viewBox="0 0 1120 630" aria-hidden="true"><path className="lv-corner" d="M435 150V120H465M661 120H691V150M691 361V391H661M465 391H435V361" /></svg>
                <span className="lv-chip">정면</span>
              </div>
              <div className="lv-v"><img src="/integrity-side.webp" alt="" width={640} height={400} loading="lazy" /><span className="lv-chip">측면</span></div>
            </div>
            <div className="lv-name"><b>1. {LIVE_CELLS[0].name}</b>{LIVE_CELLS[0].project}</div>
          </div>
        </div>
      </div>
      <div>
        <p className="ig-lead">지원자가 응시하는 동안, 채용팀은 실시간 모니터링 화면에서 진행 중인 면접을 바로 지켜봅니다.</p>
        <ul className="ig-checks">
          {LIVE_POINTS.map((t) => <li key={t}>{t}</li>)}
        </ul>
        <p className="ig-note">베타 기능으로, 회사별로 켜서 씁니다.</p>
      </div>
    </>
  );

  // 탭 3 — 감지 리포트 벤토. 영상 위 표시 좌표는 integrity-away.webp(1120×630) 기준: 두 눈 (438, 250)·(505, 245), 시선은 왼쪽으로
  const report = (
    <div className="ig-live">
      <div className="env-bento ig-bento">
        <div className="eb-card big">
          <div className="eb-txt">
            <h3>감지 장면을 영상으로</h3>
            <p>감지한 장면은 리포트에 모이고, 채용팀이 면접 영상과 함께 하나씩 확인합니다.</p>
          </div>
          <div className="ig-face rp-vid" role="img" aria-label="감지 리포트 예시: 면접 영상 3분 12초, 지원자가 고개를 돌려 시선이 화면 밖으로 벗어난 장면에 두 눈 측정 박스와 시선 이탈 표시">
            <img src="/integrity-away.webp" alt="" width={1120} height={630} loading="lazy" />
            <svg className="ig-hud rp-hud" viewBox="0 0 1120 630" aria-hidden="true">
              <rect x="414" y="225" width="120" height="46" rx="8" className="rp-eye" />
              <path d="M410 248H262" className="rp-arrow" />
              <path d="M276 238L260 248L276 258" className="rp-head" />
            </svg>
            <span className="rp-tag">시선 이탈 · 03:12</span>
            <span className="ig-cam"><i></i>면접 영상</span>
          </div>
          <div className="ir-bar rp-bar">
            <span className="ir-play"></span>
            <span className="ir-track"><b style={{ width: "21%" }}></b><i style={{ left: "21%" }}></i><i style={{ left: "58%" }}></i><i style={{ left: "80%" }}></i></span>
            <span className="rp-t">15:00</span>
          </div>
        </div>
        <div className="eb-card">
          <div className="eb-txt">
            <h3>종류·시각 기록</h3>
            <p>감지한 순간을 종류와 시각으로 남깁니다.</p>
          </div>
          <ul className="rp-list" aria-label="감지 내역 예시">
            {EVENTS.map((e, i) => (
              <li key={e.label} className={i === 0 ? "on" : undefined}><span className={e.sev === "경고" ? "rp-sev" : "rp-sev info"}>{e.sev}</span>{e.label}<em>{e.t}</em></li>
            ))}
          </ul>
        </div>
        {REPORT_SHOTS.map((c) => (
          <div className="eb-card" key={c.title}>
            <div className="eb-txt">
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
            <div className="eb-shot">
              <img src={c.img} alt="" width={640} height={c.h} loading="lazy" />
              <span className="rp-chip">{c.tag}</span>
              <span className="rp-pl" aria-hidden="true"></span>
            </div>
          </div>
        ))}
      </div>
    </div>
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
            { label: "감지 항목", panel: live },
            { label: "실시간 모니터링", panel: monitor },
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
