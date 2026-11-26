import Link from "next/link";
import type { ReactNode } from "react";
import HeroStage, { type HeroStageData } from "./HeroStage";

/**
 * 제품 상세 페이지 히어로(2026-11-25) — /ai-interview·/ai-assessment 공용. 홈은 어두운 PageHero를 그대로 쓴다.
 * 밝은 바탕, 왼쪽 제품 이름·제목·설명·버튼, 오른쪽 제품 화면(HeroStage — 바탕·점선·레이어, 데이터는 lib/products.ts의 HERO).
 * 이미지 원본은 _docs/홈페이지 개편/도식/캡처가공/make.mjs — AI 역량검사는 실제 응시 화면을 가공한 레이어(hero-l-*: 화면·AI 어시스턴트·보고서·칩,
 * 글은 '파일 1, 2, 3' 같은 일반 내용), AI 면접은 AI 역량검사와 같은 어두운 화면을 캡처 배치대로 그린 레이어(iv3-l-*: 화면·AI 면접관 오브 카드·리포트·칩).
 * 레이어는 움직이고(움직임 줄이기 설정이면 멈춤), AI 면접관 카드의 오브는 말하기 모드로 움직인다. 스타일은 app/landing.css(.phero·.hero-stage).
 * data-nav를 두지 않는다 — 밝은 바탕이라 GNB를 반전하지 않는다(AI 면접에 어두운 바탕을 잠깐 썼다가 "답답하다"는 피드백으로 되돌림, 11/25).
 */
export default function ProductHero({ name, isNew = false, title, lead, ...stage }: HeroStageData & {
  name: string;
  isNew?: boolean;
  title: ReactNode;
  lead: ReactNode;
}) {
  return (
    <section className="phero" id="hero">
      <div className="wrap phero-grid">
        <div className="phero-text">
          <span className="phero-name">{name}{isNew && <span className="prod-new">NEW</span>}</span>
          <h1>{title}</h1>
          <p>{lead}</p>
          <div className="phero-cta">
            <Link href="/apply" className="btn btn-blue">무료 상담 신청 <i className="fa-solid fa-arrow-right"></i></Link>
            <Link href="/brochure" className="phero-link">서비스소개서 받기 <i className="fa-solid fa-arrow-right"></i></Link>
          </div>
        </div>
        <div className="phero-media">
          <HeroStage {...stage} priority />
        </div>
      </div>
    </section>
  );
}
