import type { ReactNode } from "react";
import MotionDiagram from "./MotionDiagram";
import SummaryDemo from "./SummaryDemo";
import { GradeDemo, CompetencyDemo, StrengthDemo } from "./ReportDemos";
import type { MotionKey } from "./motionDiagrams";

// 리포트 4종(인터뷰 요약·종합평가·역량평가·강점·약점) — 홈·/ai-interview 공용(SSOT).
// 스타일은 app/landing.css(.how-rows·.how-row). 도식은 페이지에 바로 넣는 SVG(MotionDiagram — 11/26 도식마다 모션 하나씩, 원본 _docs/홈페이지 개편/도식).
const ROWS: { tag: string; title: string; body: ReactNode; svg: MotionKey; alt: string }[] = [
  { tag: "리포트 01", title: "인터뷰 요약", body: <>긴 영상을 다시 볼 필요 없이, 대화의 핵심만 자동 <strong>요약</strong>합니다.</>, svg: "interview", alt: "인터뷰 요약 도식: 면접 영상 옆에 요약이 한 줄씩 정리되는 모습" },
  { tag: "리포트 02", title: "종합평가", body: <>복잡한 점수 대신 <strong>등급</strong>으로, 후보자 판단 기준을 빠르게 확인합니다.</>, svg: "grade", alt: "종합 등급 도식: 원 그래프에 종합 등급 양호와 항목별 점수 막대" },
  { tag: "리포트 03", title: "역량평가", body: <><strong>핵심 역량</strong>의 강점과 약점을 차트로 한눈에 비교합니다.</>, svg: "competency", alt: "역량 평가 도식: 여섯 가지 역량에서 평균과 지원자를 비교한 육각형 차트" },
  { tag: "리포트 04", title: "강점·약점 분석", body: <><strong>강점과 약점</strong>을 구분해, 대면 면접에서 확인할 포인트까지 짚어줍니다.</>, svg: "strength", alt: "강점·약점 분석 도식: 강점 카드와 약점 카드" },
];

const DEMO: Partial<Record<MotionKey, ReactNode>> = { interview: <SummaryDemo />, grade: <GradeDemo />, competency: <CompetencyDemo />, strength: <StrengthDemo /> };

// before: 리포트 행 앞에 붙일 행(.how-row) — 같은 .how-rows 안에 넣어야 지그재그(짝수 행 뒤집기)가 이어진다. AI 면접의 '면접 진행' 행(2026-11-25).
export default function ReportRows({ before }: { before?: ReactNode }) {
  return (
    <div className="how-rows">
      {before}
      {ROWS.map((r) => (
        <div className="how-row" key={r.tag}>
          <div className="hr-info">
            <span className="hr-eyebrow">{r.tag}</span>
            <h3>{r.title}</h3>
            <p>{r.body}</p>
          </div>
          {/* 11/27 리포트 4종 모두 HTML 그림(같은 판 + 흰 카드): 01 인터뷰 요약(실제 정면 영상 + 요약이 써짐)·02 종합평가·03 역량평가·04 강점·약점(글이 써짐) */}
          <div className="hr-media">{DEMO[r.svg] ?? <MotionDiagram name={r.svg} label={r.alt} />}</div>
        </div>
      ))}
    </div>
  );
}
