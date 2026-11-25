import Link from "next/link";
import type { ReactNode } from "react";

// 부정행위 감지(AI 면접) — 홈·/ai-interview 공용(SSOT). 스타일은 app/landing.css(.integ·.integ-*·.ir-*).
// 레이아웃(2026-11-25 E안 — 사용자가 보낸 Codility 참고 구성): 왼쪽 제목·감지 항목(아이콘 + 제목 + 한 줄 설명),
// 오른쪽 HTML로 그린 '감지 내역' 카드(예시). 이미지가 아니라 글자가 선명하다.
// 항목은 SC-Platform에 실제로 있는 것만 쓴다: 휴대폰·이어폰 감지는 없고, 여러 얼굴(두 명 이상) 감지는 있다.
// 종합 위험도 등급·신분증 확인·유사도 검사처럼 없는 기능은 넣지 않는다. 감지 표시는 빨강 대신 블루.
// 근거·금지 표현: _docs/홈페이지 개편/AI면접_AI역량검사_차이_소개자료.md 6장.
// 'AI 안경 착용 확인'은 지원자 화면의 기기 확인 수준이라 이 목록에서는 뺐다(2026-11-24, 7→6개).
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const ICON = {
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  phone: <><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></>,
  monitor: <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></>,
  out: <><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
  rec: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" fill="currentColor" /></>,
};
const Icon = ({ d }: { d: ReactNode }) => <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">{d}</svg>;

const ITEMS = [
  { icon: ICON.eye, title: "시선·머리 움직임", body: "시선과 머리가 화면을 벗어나는 순간을 기록합니다." },
  { icon: ICON.users, title: "여러 얼굴 감지", body: "카메라에 다른 사람이 함께 보이면 기록합니다." },
  { icon: ICON.phone, title: "사이드 카메라", body: "휴대폰을 QR로 연결해 옆에서 모니터와 손을 함께 봅니다." },
  { icon: ICON.monitor, title: "보조 모니터 연결", body: "다른 모니터가 연결돼 있으면 기록합니다." },
  { icon: ICON.out, title: "다른 탭·창으로 이동", body: "면접 화면을 벗어나 다른 탭이나 창으로 가면 기록합니다." },
  { icon: ICON.rec, title: "면접 중 화면 녹화", body: "지원자 화면을 녹화해 영상과 함께 확인합니다." },
];

export default function IntegritySection({ withLink = false }: { withLink?: boolean }) {
  return (
    <section className="band soft" id="integrity">
      <div className="wrap integ">
        <div>
          <div className="head">
            <h2>AI로 대답하는 지원자,<br /><span className="blue">면접 중에</span> 가려냅니다</h2>
            <p className="lead">시선·화면·기기 신호를 면접 내내 함께 기록하고, 감지한 장면은 영상으로 바로 확인합니다.</p>
          </div>
          <ul className="integ-list">
            {ITEMS.map((t) => (
              <li key={t.title}>
                <span className="integ-ic"><Icon d={t.icon} /></span>
                <div><b>{t.title}</b><span>{t.body}</span></div>
              </li>
            ))}
          </ul>
          <p className="integ-note">항목은 프로젝트마다 골라 켭니다.</p>
          {withLink && (
            <Link href="/ai-interview" className="hr-link">AI 면접 자세히 보기 <i className="fa-solid fa-arrow-right"></i></Link>
          )}
        </div>

        {/* 감지 내역 카드(예시) — 시각은 예시 값. 타임라인 표시 위치는 시각에 맞춘다(03:12/15:00 = 21%, 08:40/15:00 = 58%) */}
        <div className="integ-frame">
          <div className="ir" role="img" aria-label="부정행위 감지 내역 예시: 시선 이탈 3분 12초, 탭 전환 8분 40초. 누르면 면접 영상의 그 장면으로 이동합니다.">
            <div className="ir-h">
              <svg viewBox="0 0 24 24" className="ir-shield" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5z" /></svg>
              <b>부정행위 감지 내역</b><span className="ir-smp">예시</span>
            </div>
            <div className="ir-sum"><span>감지</span><span className="ir-pill">2건</span><strong>눌러서 그 장면을 확인하세요</strong></div>
            <div className="ir-row"><Icon d={ICON.eye} />시선 이탈<span className="ir-t"><i></i>03:12</span></div>
            <div className="ir-row"><Icon d={ICON.out} />탭 전환<span className="ir-t"><i></i>08:40</span></div>
            <div className="ir-vid">
              <div className="ir-vh">면접 영상<span>시선 이탈 03:12</span></div>
              <div className="ir-screen"><span className="ir-person"></span><span className="ir-badge">● 시선 이탈</span></div>
              <div className="ir-bar"><span className="ir-play"></span><span className="ir-track"><b style={{ width: "21%" }}></b><i style={{ left: "21%" }}></i><i style={{ left: "58%" }}></i></span></div>
              <div className="ir-times"><span>0:00</span><span>15:00</span></div>
            </div>
            <div className="ir-chips"><span>여러 얼굴 없음</span><span>보조 모니터 없음</span></div>
            <p className="ir-foot">감지 내역은 판단을 돕는 자료이고, 최종 판단은 채용팀이 합니다.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
