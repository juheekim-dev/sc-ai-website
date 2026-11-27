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
  // 11/27 시안 A안 — 응시 준비 '화면 공유' 단계(실제 제품: 전체 화면만 공유, "보조 모니터는 채용 담당자에게 표시됩니다")를 일반 공유 창 모양으로(share).
  // '탭'·'창'은 막히고 '전체 화면'만, 화면 1(면접)·화면 2(보조 모니터, 블루 점선). 시안: _docs/홈페이지 개편/감지항목_탭이탈보조모니터_이미지_시안.html
  { title: "탭 이탈·보조 모니터", body: "다른 탭이나 창으로 가거나 보조 모니터를 연결하면 기록하고, 지원자 화면을 녹화합니다.", img: "/integrity-screen.webp", h: 480, label: "화면 공유", alt: "화면 공유 선택 예시: 탭과 창은 고를 수 없고 전체 화면만 공유하며, 화면 1은 면접 화면, 화면 2는 보조 모니터로 표시", box: false, share: true },
  { title: "측면 카메라", body: "휴대폰을 QR로 연결해 옆에서 책상 주변까지 함께 봅니다.", img: "/integrity-side.webp", h: 400, label: "측면", alt: "측면 카메라 화면: 옆에서 본 지원자와 책상, 모니터 끝", box: false, share: false },
  { title: "손·키보드", body: "측면 카메라로 키보드 위 손도 함께 봅니다.", img: "/integrity-hands.webp", h: 480, label: "손·키보드", alt: "측면 카메라 화면: 키보드 위 두 손", box: true, share: false },
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
// 11/27 "텍스트에서 AI 티 안 나게" — 명사로 끊는 나열·줄표(—)를 빼고 완결된 문장으로(말투는 사이트 다른 섹션과 같은 '~합니다'). 사실 범위는 그대로
// (응시 중 바로 잡히는 건 시선 이탈·여러 얼굴·얼굴 미감지(자리 비움)·시험 화면 이탈, 감지된 지원자는 목록 맨 위, 누르면 AI 감독 리포트)
const LIVE_POINTS = [
  "AI 면접과 AI 역량검사 응시자를 한곳에서 봅니다.",
  "지원자를 고르면 화면 공유와 정면·측면 카메라가 함께 나옵니다.",
  "시선이 벗어나거나 얼굴이 둘 이상 보이면 응시 도중에 표시합니다. 자리를 비우거나 시험 화면을 떠나도 마찬가지입니다.",
  "표시가 뜬 지원자는 목록 맨 위로 올라오고, 누르면 AI 감독 리포트로 넘어갑니다.",
];

// 탭 3 '감지 리포트' = 벤토(11/26 R3 — 감지 항목 탭과 같은 결). 큰 카드 = 면접 영상의 시선 이탈 장면(사용자가 준 목업 '실 정면-시선 아래로' — 같은 인물이 시선만 아래로 내린 사진, 16:9)
// + 두 눈 측정 박스·아래로 꺾이는 시선 화살표·'시선 이탈' 배지 + 타임라인. 작은 카드 3장 = 종류·시각 기록 → 그 장면으로 이동 → 판단은 채용팀이.
// 감지 종류·시각·경고/정보는 예시 값(제품 'AI 감독 리포트'의 전체 감지 내역·심각/경고/정보 구분을 따름). 타임라인 표시 위치는 시각에 맞춘다(03:12/15:00 = 21%, 08:40 = 58%, 12:05 = 80%).
const EVENTS = [
  { sev: "경고", label: "시선 이탈", t: "03:12" },
  { sev: "경고", label: "화면 이탈", t: "08:40" },
  { sev: "정보", label: "보조 모니터", t: "12:05" },
];
const REPORT_SHOTS = [
  // 11/27 "화면 이탈하면 어떤 이미지야?" → 시안 D안: 면접 창을 벗어났을 때 실제로 뜨는 경고창(SC-Platform QC 화면)을 핵심만 HTML로 얹는다(leave).
  // 아이콘·'면접 창을 벗어났어요'·'이탈 1회 기록'·파란 '면접으로 돌아가기'. 크기는 실제 화면 비율(화면 폭의 약 1/3). 시안: _docs/홈페이지 개편/감지리포트_화면이탈_이미지_시안.html
  { title: "그 장면으로 이동", body: "누르면 면접 영상의 그 장면부터 재생합니다.", img: "/integrity-screen.webp", h: 480, tag: "화면 이탈 · 08:40", leave: true, mon: false },
  // 11/27 "보조 모니터 감지 이미지" — 사용자 에셋 '보조 모니터 감지_'(주 모니터 옆 노트북)를 16:10으로 잘라(public/integrity-monitor.webp, 800×500)
  // 노트북 화면에 블루 감지 박스(mon). 박스 좌표는 그 이미지 기준 %(x 7.3~24, y 41.6~77.8). 시안: _docs/홈페이지 개편/감지리포트_보조모니터_이미지_시안.html
  { title: "판단은 채용팀이", body: "리포트는 판단을 돕는 자료이고, 최종 판단은 채용팀이 합니다.", img: "/integrity-monitor.webp", h: 500, tag: "보조 모니터 · 12:05", leave: false, mon: true },
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
            {c.share ? (
              <div className="eb-shot ig-share" role="img" aria-label={c.alt}>
                <div className="ig-dlg">
                  <span className="ig-dlg-hd">공유할 화면을 선택하세요</span>
                  <div className="ig-dlg-tabs"><span className="no">탭</span><span className="no">창</span><span className="on">전체 화면</span></div>
                  <div className="ig-dlg-scrs">
                    <div className="ig-dlg-sc"><div className="th"><img src={c.img} alt="" width={640} height={c.h} loading="lazy" /></div><b>화면 1</b></div>
                    <div className="ig-dlg-sc sub"><div className="th"><i style={{ width: "50%" }}></i><i></i></div><b>보조 모니터</b></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="eb-shot">
                <img src={c.img} alt={c.alt} width={640} height={c.h} loading="lazy" />
                {c.box && <span className="ig-hbox"></span>}
                <span className="ig-cam"><i></i>{c.label}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="ig-note">항목은 프로젝트마다 골라 켭니다.</p>
    </div>
  );

  // 탭 2 — 왼쪽 실시간 모니터링 화면(예시), 오른쪽 설명. 크게 보는 정면 카메라에는 감지 항목 탭과 같은 얼굴 모서리 4개
  // 모션(11/26 "실시간 모니터링에서도 모션을", CSS만 8초 반복): 김서연이 둘째 줄 '진행 중' → AI 감지가 뜨면 테두리·'AI 감지'로 바뀌며 맨 위로 올라오고(이도윤과 자리 바꿈),
  // 오른쪽 위 표시가 '진행 중' → 'AI 감지 · 시선 이탈', 정면 카메라에 얼굴 모서리가 좁혀 들어온다. 순서가 바뀌는 동안 어긋나지 않게 목록엔 번호를 붙이지 않는다
  const monitor = (
    <>
      <div className="lv" role="img" aria-label="실시간 모니터링 화면 예시: 진행 중인 지원자 4명 중 AI 감지가 있는 첫 번째 지원자가 목록 맨 위에 있고, 그 지원자의 화면 공유·정면·측면 카메라를 크게 보고 있습니다.">
        <div className="lv-h"><b>실시간 모니터링</b><span className="lv-n">진행 중 {LIVE_CELLS.length}</span><span className="lv-q">지원자 이메일로 검색</span></div>
        <div className="lv-body">
          <ul className="lv-list">
            {LIVE_CELLS.map((c) => (
              <li key={c.name} className={c.flag ? "on" : undefined}>
                <span className="lv-av">{c.flag ? <img src="/integrity-face.webp" alt="" width={1120} height={630} loading="lazy" /> : c.name[0]}</span>
                <span className="lv-who">{c.name}<small>{c.project}</small></span>
                {c.flag ? <span className="lv-st sw"><span className="lv-s1">AI 감지</span><span className="lv-s0">진행 중</span></span> : <span className="lv-st">진행 중</span>}
              </li>
            ))}
          </ul>
          <div className="lv-focus">
            <div className="lv-top"><span className="lv-t1"><i></i>AI 감지 · 시선 이탈</span><span className="lv-t0"><i></i>진행 중</span></div>
            <div className="lv-v"><img src="/integrity-screen.webp" alt="" width={640} height={480} loading="lazy" /><span className="lv-chip">화면 공유</span></div>
            <div className="lv-cams">
              <div className="lv-v">
                {/* 11/27 "시선 이탈하는 이미지로" — 위 'AI 감지 · 시선 이탈'과 맞게 시선을 아래로 내린 사진(감지 리포트와 같은 파일). 얼굴 모서리·두 눈 박스는 이 사진 기준 */}
                <img src="/integrity-report-down.webp" alt="" width={1120} height={630} loading="lazy" />
                <svg className="ig-hud" viewBox="0 0 1120 630" aria-hidden="true"><path className="lv-corner" d="M435 180V150H465M661 150H691V180M691 391V421H661M465 421H435V391" /><rect className="lv-eye" x="470" y="214" width="180" height="60" rx="10" /></svg>
                <span className="lv-chip">정면</span>
              </div>
              <div className="lv-v"><img src="/integrity-side.webp" alt="" width={640} height={400} loading="lazy" /><span className="lv-chip">측면</span></div>
            </div>
            <div className="lv-name"><b>{LIVE_CELLS[0].name}</b>{LIVE_CELLS[0].project}</div>
          </div>
        </div>
      </div>
      <div>
        <p className="ig-lead">지원자가 응시하는 동안 채용팀도 같은 화면을 지켜볼 수 있습니다.</p>
        <ul className="ig-checks">
          {LIVE_POINTS.map((t) => <li key={t}>{t}</li>)}
        </ul>
        <p className="ig-note">아직 베타 기능이라 필요한 회사만 켜서 씁니다.</p>
      </div>
    </>
  );

  // 탭 3 — 감지 리포트 벤토. 영상은 같은 구도의 사진 두 장(11/26 사용자 에셋 '실 정면-2'·'실 정면 아래-2'를 1120×630으로 가운데 자름 —
  // public/integrity-report-front.webp·integrity-report-down.webp). 표시 좌표는 아래 사진 기준: 두 눈 (509, 244)·(613, 244), 시선은 아래로
  // 11/26 "정면을 보다가 눈을 아래로 내리는 모습을 모션으로": 정면 사진(integrity-face.webp, 감지 항목 탭과 같은 파일)을 위에 겹쳐
  // 정면 → 시선 아래로 → 두 눈 박스·화살표·배지가 뜨고 → 다시 정면, 5초 반복("모션을 빠르게"). 두 사진을 그대로 한 번에 바꾼다(.rp-front, app/landing.css)
  const report = (
    <div className="ig-live">
      <div className="env-bento ig-bento">
        <div className="eb-card big">
          <div className="eb-txt">
            <h3>감지 장면을 영상으로</h3>
            <p>감지한 장면은 리포트에 모이고, 채용팀이 면접 영상과 함께 하나씩 확인합니다.</p>
          </div>
          <div className="ig-face rp-vid" role="img" aria-label="감지 리포트 예시: 면접 영상 3분 12초에 지원자가 시선을 아래로 내리자 시선 이탈 표시가 뜨고, 8분 40초에는 면접 창을 벗어나 '면접 창을 벗어났어요' 경고창이, 12분 5초에는 주 모니터 옆 노트북(보조 모니터)에 감지 표시가 뜨는 장면">
            <img src="/integrity-report-down.webp" alt="" width={1120} height={630} loading="lazy" />
            <img className="rp-front" src="/integrity-report-front.webp" alt="" width={1120} height={630} loading="lazy" />
            <svg className="ig-hud rp-hud" viewBox="0 0 1120 630" aria-hidden="true">
              <rect x="476" y="221" width="168" height="44" rx="8" className="rp-eye" />
              <path d="M648 243H760V318" className="rp-arrow" />
              <path d="M750 304L760 320L770 304" className="rp-head" />
            </svg>
            <span className="rp-tag">시선 이탈 · 03:12</span>
            {/* 두 번째 지점(08:40 화면 이탈, 11/27) — 실제 제품 경고창(핵심만)을 어둡게 누른 영상 위에. 작은 카드 .rp-modal과 같은 모양 */}
            <div className="rp-leave2" aria-hidden="true">
              <div className="rp-modal">
                <span className="rp-m-ic"><i>!</i></span>
                <b>면접 창을 벗어났어요</b>
                <span className="rp-m-cnt">이탈 1회 기록</span>
                <span className="rp-m-btn">면접으로 돌아가기</span>
              </div>
              <span className="rp-tag2">화면 이탈 · 08:40</span>
            </div>
            {/* 세 번째 지점(12:05 보조 모니터, 11/27) — 주 모니터 옆 노트북 장면(integrity-monitor-wide.webp, 16:9)에 블루 감지 박스. 좌표는 그 이미지 기준 % */}
            <div className="rp-mon3" aria-hidden="true">
              <img src="/integrity-monitor-wide.webp" alt="" width={1120} height={630} loading="lazy" />
              <svg className="rp-mon" viewBox="0 0 100 100" preserveAspectRatio="none"><rect x="6.6" y="41.6" width="15" height="36.2" rx="1" /></svg>
              <span className="rp-tag3">보조 모니터 · 12:05</span>
            </div>
            <span className="ig-cam"><i></i>면접 영상</span>
          </div>
          <div className="ir-bar rp-bar">
            {/* 11/26 "영상 밑에 플레이가 되는 모션" — 재생 → 03:12 시선 이탈(21%)에서 멈춤 → 재생 → 08:40 화면 이탈(58%, 경고창)에서 멈춤 → 재생 → 12:05 보조 모니터(80%, 노트북 장면)에서 멈춤 → 처음으로, 12초 반복(위 영상·감지 내역과 같은 주기, 11/27) */}
            <span className="ir-play rp-play"></span>
            <span className="ir-track"><b className="rp-prog" style={{ width: "21%" }}></b><i className="rp-mark" style={{ left: "21%" }}></i><i className="rp-mark2" style={{ left: "58%" }}></i><i className="rp-mark3" style={{ left: "80%" }}></i></span>
            <span className="rp-t"><span className="rp-nows"><span className="rp-now">03:12 / </span><span className="rp-now2">08:40 / </span><span className="rp-now3">12:05 / </span></span>15:00</span>
          </div>
        </div>
        <div className="eb-card">
          <div className="eb-txt">
            <h3>종류·시각 기록</h3>
            <p>감지한 순간을 종류와 시각으로 남깁니다.</p>
          </div>
          <ul className="rp-list" aria-label="감지 내역 예시">
            {/* 11/27 "면접 영상에 맞춰 모션" — 영상이 03:12·08:40·12:05에서 멈출 때마다 그 줄이 켜진다(.rp-list li 애니메이션, 같은 12초 주기) */}
            {EVENTS.map((e) => (
              <li key={e.label}><span className={e.sev === "경고" ? "rp-sev" : "rp-sev info"}>{e.sev}</span>{e.label}<em>{e.t}</em></li>
            ))}
          </ul>
        </div>
        {REPORT_SHOTS.map((c) => (
          <div className="eb-card" key={c.title}>
            <div className="eb-txt">
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
            <div className={c.leave ? "eb-shot rp-leave" : "eb-shot"}>
              <img src={c.img} alt="" width={640} height={c.h} loading="lazy" />
              {c.leave && (
                <div className="rp-modal" aria-hidden="true">
                  <span className="rp-m-ic"><i>!</i></span>
                  <b>면접 창을 벗어났어요</b>
                  <span className="rp-m-cnt">이탈 1회 기록</span>
                  <span className="rp-m-btn">면접으로 돌아가기</span>
                </div>
              )}
              {c.mon && (
                <svg className="rp-mon" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <rect x="7.3" y="41.6" width="16.7" height="36.2" rx="1" />
                </svg>
              )}
              <span className="rp-chip">{c.tag}</span>
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
