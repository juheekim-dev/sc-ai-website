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
  out: <><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
};
const Icon = ({ d }: { d: ReactNode }) => <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">{d}</svg>;

// 탭 1 '실시간 감지' — 감지 항목 7개를 얼굴·시선·스마트 안경·화면·기기 5줄로(11/26 "내용은 많은데 정리되지 않은 느낌" → 참고 화면처럼 탭으로 나눠 하나씩.
// 같은 날 "스마트 안경도 검사한다는 것도 넣어야지" → 얼굴 줄에 묻혀 있던 AI 안경을 따로 뺌. 소개자료 표기는 'AI 안경 착용 확인').
// 문장은 예전 항목 7개의 설명을 묶은 것 — 새 기능을 더하지 않는다.
const GROUPS = [
  { icon: ICON.users, title: "얼굴", body: "카메라에 다른 사람이 함께 보이면 기록합니다." },
  { icon: ICON.eye, title: "시선", body: "시선과 머리가 화면을 벗어나는 순간을 기록합니다." },
  { icon: ICON.glasses, title: "스마트 안경", body: "화면에 답을 띄워 주는 AI 안경을 쓰고 있는지 확인합니다." },
  { icon: ICON.out, title: "화면", body: "다른 탭이나 창으로 가면 기록하고, 면접 중 지원자 화면을 녹화합니다." },
  { icon: ICON.monitor, title: "기기", body: "보조 모니터 연결을 기록하고, 휴대폰을 QR로 연결한 사이드 카메라로 모니터와 손을 함께 봅니다." },
];

// 탭 2 '감지 리포트' 오른쪽 설명
const REPORT_POINTS = ["감지한 순간을 종류·시각과 함께 기록", "누르면 면접 영상의 그 장면으로 이동", "판단을 돕는 자료 — 최종 판단은 채용팀이"];

// 면접 영상의 감지 장면 3칸 — 위 감지 내역 줄과 같은 종류·시각
const CLIPS = [
  { label: "시선 이탈", t: "03:12" },
  { label: "탭 전환", t: "08:40" },
  { label: "여러 얼굴", t: "12:05" },
];

// soft: 연한 블루 바탕(기본). 홈은 앞 섹션과 번갈아 오게 흰 바탕(soft={false}, 2026-11-26).
export default function IntegritySection({ withLink = false, soft = true }: { withLink?: boolean; soft?: boolean }) {
  // 탭 1 — 왼쪽 카메라 두 화면(사용자가 준 목업 사진 '실 정면-2'·'실 측면-2'를 4:3으로 자름): 정면 카메라에 얼굴·시선·스마트 안경 표시,
  // 오른쪽 아래에 겹친 사이드 카메라(휴대폰)는 모니터와 손이 함께 보인다(11/26 "정면 측면 화면도 넣어줘", "얼굴, 시선도 강조"). 오른쪽은 5줄
  const live = (
    <>
      <div className="ig-cams" role="img" aria-label="면접 중 카메라 화면 예시: 정면 카메라에서 얼굴 1명, 시선 정면, 스마트 안경 없음을 확인하고, 사이드 카메라로 모니터와 손을 함께 봅니다.">
        <div className="ig-face">
          <img src="/integrity-face.webp" alt="" width={840} height={630} loading="lazy" />
          <span className="ig-box"><span className="ig-tag">얼굴 1명</span><span className="ig-tag ig-tag-b">스마트 안경 없음</span></span>
          <span className="ig-eye" style={{ left: "43.5%" }}></span><span className="ig-eye" style={{ left: "55.4%" }}></span>
          <span className="ig-gaze">시선 정면</span>
          <span className="ig-cam"><i></i>정면 카메라 · 녹화 중</span>
        </div>
        <div className="ig-side">
          <img src="/integrity-side.webp" alt="" width={640} height={480} loading="lazy" />
          <span className="ig-cam">사이드 카메라</span>
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
          <p className="lead">얼굴·시선·화면·기기 신호를 면접 내내 함께 기록하고, 감지한 장면은 영상으로 바로 확인합니다.</p>
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
