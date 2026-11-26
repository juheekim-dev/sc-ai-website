import type { Metadata } from "next";
import Link from "next/link";
import "./landing.css";
import PageHero, { HeroWord } from "@/components/PageHero";
import ClientLogos from "@/components/ClientLogos";
import FinalCta from "@/components/FinalCta";
import ReportRows from "@/components/ReportRows";
import IntegritySection from "@/components/IntegritySection";
import SecuritySection from "@/components/SecuritySection";
import FaqList from "@/components/FaqList";
import SoftCta from "@/components/SoftCta";
import { getFaqs } from "@/lib/faq";
import { PRODUCTS } from "@/lib/products";
import AskDemo from "@/components/AskDemo";
import AssistDemo from "@/components/AssistDemo";
import ProductFlow from "@/components/ProductFlow";
import MotionDiagram from "@/components/MotionDiagram";
import StepFlow from "@/components/StepFlow";
import { buildPageMetadata } from "@/lib/pageSeo";

// 04 해결 — 제품 카드. 이름·주소·한 줄 설명·도식 썸네일은 lib/products.ts(GNB·푸터·제품 페이지 끝 안내 카드와 공용), 기능 3개만 여기서 정한다.
const PRODUCT_POINTS: Record<string, string[]> = {
  "/ai-interview": ["평가 기준·질문 자동 생성", "답에 따라 꼬리질문", "등급·역량·강약점 리포트"],
  "/ai-assessment": ["AI 개발 과제 · AI 업무 과제 · 코딩 테스트", "AI 활용 과정과 결과 검증까지 채점", "제출 뒤 AI 인터뷰로 이해도 확인"],
};

// 06 · 도입 3단계 — 제품 페이지와 같은 화면 이미지(StepFlow img, 아이콘 없음). 두 제품을 함께 말하므로 STEP 02는 '질문·과제'.
// 이미지: 01 채용공고 입력(두 제품 공용) · 02 평가 기준과 질문(AI 면접 STEP 02) · 03 지원자 목록과 리포트(AI 면접 STEP 03)
const START = [
  { title: "채용공고 등록", body: <>채용공고를 넣으면<br />AI가 직무와 요구 역량을 읽습니다.</>, img: "/assessment-step-jd.webp", alt: "채용공고 입력 화면: 직무 기술서의 요구사항을 넣는 칸" },
  { title: "AI가 질문·과제 생성", body: <>AI가 평가 기준과 질문·과제를 만들고<br />채용팀이 확인합니다.</>, img: "/interview-step-criteria.webp", alt: "평가 기준과 질문 화면: 평가 항목 탭과 질문 목록, 승인 버튼" },
  { title: "링크 보내고 리포트 받기", body: <>지원자에게 링크를 보내면<br />응시가 끝나는 대로 리포트가 옵니다.</>, img: "/interview-step-invite.webp", alt: "지원자 목록 화면: 응시를 마친 지원자의 리포트 보기" },
];

// 홈 canonical (중복 색인 방지) — 공통 메타는 layout.tsx. 어드민 SEO 초안(적용 시) 덮어씀.
const FALLBACK_METADATA: Metadata = { alternates: { canonical: "/" } };
export function generateMetadata() {
  return buildPageMetadata("/", FALLBACK_METADATA);
}

// JSON-LD·검색용 태그 제거 텍스트
const plain = (s: string) => String(s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

// FAQ가 어드민(DB)에서 바뀌면 일정 주기로 자동 반영(ISR). 그 외엔 정적으로 빠르게 서빙.
export const revalidate = 3600; // ISR 1시간 — FAQ·SEO 등 어드민 저장은 /api/revalidate 가 즉시 반영. 2분이던 주기가 ISR Writes 무료 한도를 넘긴 원인 중 하나(2026-11-18)

export default async function HomePage() {
  const faqs = await getFaqs();
  const JSON_LD = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "AI면접",
        url: "https://www.supercoder.co/",
        logo: "https://www.supercoder.co/apple-touch-icon.png",
        description:
          "AI 면접으로 지원자를 자동 검증하고 채용팀에 검증된 핵심 인재 리포트를 전달하는 B2B 채용 SaaS",
        sameAs: [],
      },
      { "@type": "WebSite", name: "AI면접", url: "https://www.supercoder.co/", inLanguage: "ko-KR" },
      // SoftwareApplication 스키마 제거(2026-08-07 SEO 진단): Google 리치 결과가
      // aggregateRating/review를 요구하나 실데이터 없이 넣는 건 가이드라인 위반.
      // 고객 평점 데이터 확보 시 aggregateRating과 함께 복원.
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          
          acceptedAnswer: { "@type": "Answer", text: plain(f.answer) },
        })),
      },
    ],
  };
  return (
    <>
      {/* SECTION 01 · DECLARATION (히어로) — 다크 배경 래퍼(.hero-bg)까지 PageHero가 그린다 */}
      <PageHero
        title={
          <>
            <span className="sky">지원자 검증은 </span><HeroWord>AI</HeroWord><span className="sky">가,</span><br />
            <span className="sky">채용 결정은 </span><span className="hl">사람</span><span className="sky">이 더 빠르게</span>
          </>
        }
        lead={
          <>
            <span style={{ color: "#fff" }}>AI 면접·AI 역량검사</span>로 1차 검토를 줄이고,<br />
            <span style={{ color: "#fff" }}>핵심 후보 판단</span>에 집중하세요.
          </>
        }
      />

      {/* SECTION 02 · CLIENTS (도입사 로고 마퀴) */}
      <ClientLogos />

      {/* SECTION 03 · 문제 (FLOOD) */}
      <section className="flood" id="flood">
        <div className="wrap">
          <div className="head">
            <h2>AI로 쓴 이력서는 좋아졌는데,<br />지원자의 <span className="blue">실력</span>도 좋아졌을까요?</h2>
            <p className="lead">진짜를 못 거르는 1차 검토는<br />결국 채용 비용과 미스매치로 이어집니다.</p>
          </div>
          <ul className="flood-stats">
            <li>
              <div className="stat"><span className="lbl">지원자 거짓·과장 적발 경험</span><span className="num">84%</span></div>
              <p className="src">출처: 사람인, 기업 927개사</p>
            </li>
            <li>
              <div className="stat"><span className="lbl">기준 미달도 통과시킨 경험</span><span className="num">59%</span></div>
              <p className="src">출처: 잡코리아, 인사담당자 794명</p>
            </li>
            <li>
              <div className="stat"><span className="lbl">잘못 뽑아 후회한 경험</span><span className="num">81%</span></div>
              <p className="src">출처: 사람인, 인사담당자 377명</p>
            </li>
            <li>
              <div className="stat"><span className="lbl">채용 1명당 평균 비용</span><span className="num">1,272<span>만원</span></span></div>
              <p className="src">출처: 사람인, 기업 499개사</p>
            </li>
          </ul>
        </div>
      </section>

      {/* SECTION 04 · 해결 — 제품 2종. 카드 위 그림은 제품 페이지 '진행 방식'의 움직이는 카드(AskDemo·AssistDemo, 2026-11-26 옛 도식 썸네일에서 바꿈) */}
      <section className="value" id="products">
        <div className="wrap">
          <div className="head">
            <h2>그래서, 사람을 만나기 전에<br /><span className="blue">AI가 먼저 검증</span>합니다</h2>
            <p className="lead">AI 면접은 질문으로, AI 역량검사는 실제 과제로 지원자를 확인합니다.</p>
          </div>
          <div className="value-grid two">
            {PRODUCTS.map((p) => (
              <div className="valcard prod" key={p.href}>
                <div className="prod-shot">{p.href === "/ai-interview" ? <AskDemo /> : <AssistDemo />}</div>
                <h3>{p.title}{p.isNew && <span className="prod-new">NEW</span>}</h3>
                <p>{p.desc}</p>
                <ul className="hr-points">
                  {PRODUCT_POINTS[p.href].map((t) => <li key={t}>{t}</li>)}
                </ul>
                <Link href={p.href} className="prod-link">자세히 보기 <i className="fa-solid fa-arrow-right"></i></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 05 · 함께 쓰는 순서 — 제품 페이지 끝 안내와 같은 ProductFlow(히어로 화면 썸네일). 옛 깔때기(AI 선별 → 사람 판단)를 같은 뜻의 세 단계로 바꿈(2026-11-26) */}
      <section className="band soft" id="flow">
        <div className="wrap">
          <ProductFlow />
        </div>
      </section>

      {/* SECTION 06 · 작동 방식 — 리포트(AI 면접 4종 + AI 역량검사 1, 공용 ReportRows) + 도입 3단계(제품 페이지와 같은 화면 이미지 StepFlow) */}
      <section className="how" id="how">
        <div className="wrap">
          <div className="head">
            <h2>핵심 후보 판단에 필요한 내용을<br /><span className="blue">리포트 한 장</span>에 담았습니다</h2>
            <p className="lead">요약, 등급, 역량, 면접 포인트까지 한눈에 확인하세요.</p>
          </div>

          <ReportRows
            after={
              <div className="how-row">
                <div className="hr-info">
                  <span className="hr-eyebrow">AI 역량검사 리포트</span>
                  <h3>점수마다 근거가 붙습니다</h3>
                  <p>AI 추천 등급과 항목별 점수, 근거를 함께 봅니다. AI에 보낸 지시와 작업 리플레이도 리포트에 남습니다.</p>
                  <Link href="/ai-assessment" className="hr-link">AI 역량검사 자세히 보기 <i className="fa-solid fa-arrow-right"></i></Link>
                </div>
                <div className="hr-media">
                  <MotionDiagram name="scorecard" label="AI 역량검사 리포트 도식: AI 추천 등급과 항목별 점수, 근거" />
                </div>
              </div>
            }
          />

          <div className="head" style={{ paddingTop: "clamp(112px,15vw,190px)" }}>
            <h2>채용공고만 등록하면, 검증 리포트까지<br /><span className="blue">AI가 진행</span>합니다</h2>
            <p className="lead">AI가 만든 기준과 질문·과제는 채용팀이 확인해야 반영됩니다.</p>
          </div>
          <StepFlow steps={START} />
        </div>
      </section>

      {/* SECTION 07 · 부정행위 감지 (공용, AI 면접 페이지로 연결) */}
      <IntegritySection withLink />

      {/* SECTION 08 · 보안 (공용) */}
      <SecuritySection />

      {/* SECTION 09 · 성과 (PROOF) */}
      <section className="proof2" id="proof">
        <div className="wrap">
          <div className="head">
            <h2 className="proof-h2">만 명이 몰려도, 검증된 핵심인재만 <span className="blue">남깁니다</span></h2>
            <p className="lead">인력은 못 늘리고, 뽑은 사람은 쉽게 나가지 않습니다. 1명을 뽑아도 확실한 핵심인재여야 합니다.</p>
          </div>
          <div className="proof-row">
            <div className="pc2"><div className="vlabel">역량 검증</div><div className="big big-phrase">서류 너머 핵심역량</div><p>지원서 <strong>48.5%</strong>가 AI 작성 의심, 인사담당 <strong>73%</strong>는 진짜를 못 가려냅니다. AI 면접은 핵심역량 기준으로 실제 실력을 검증합니다.</p><p className="psrc">출처: 고용노동부</p></div>
            <div className="pc2"><div className="vlabel">속도</div><div className="big big-phrase">만 명도 즉시 스크리닝</div><p>사람이 한 명당 10분씩 만 명을 보면 약 <strong>208일</strong>. AI는 동시에 진행해 <strong>당일</strong> 끝나, 검토가 밀려 좋은 후보를 놓치는 일이 없습니다.</p><p className="psrc">출처: 서류 10분 사람인·잡코리아 (208일=추산)</p></div>
            <div className="pc2"><div className="vlabel">비용 절감</div><div className="big big-phrase">면접관 시간 절약</div><p>핵심역량 미달자를 1차에서 걸러, 현업 면접관은 <strong>검증된 소수</strong>만 만납니다. 가장 비싼 자원인 면접관의 시간을 아낍니다.</p><p className="psrc">현업 면접관 시간 = 가장 비싼 채용 자원</p></div>
          </div>

          {/* 저관여 오퍼 — 상담(고관여) 전에 소개서로 먼저 검토할 길을 본문 안에 둔다.
              기존에는 /brochure 링크가 GNB·푸터에만 있어 스크롤 흐름에서 노출되지 않았다. */}
          <SoftCta title="실제 검증 리포트가 어떻게 나오는지 먼저 확인해보세요" href="/brochure" label="서비스소개서 받기" />
        </div>
      </section>

      {/* SECTION 10 · 후기 (VOICES) */}
      <section className="voices" id="voices">
        <div className="wrap">
          <div className="head">
            <h2>채용팀은 이렇게 활용하고 있습니다</h2>
            <p className="lead">반복 검토는 줄이고, <span className="blue" style={{ fontWeight: 700 }}>핵심 후보 판단</span>에 더 많은 시간을 쓰고 있습니다.</p>
          </div>
          <div className="v-grid">
            <div className="vc">
              <div className="bubble">
                <div className="qm"><i className="fa-solid fa-quote-left"></i></div>
                <blockquote>“AI 면접으로 1차 면접을 대체해, 개발자들이 본업에 집중하면서도 좋은 인재를 놓치지 않게 됐어요.”</blockquote>
              </div>
              <div className="who"><div className="ava">A</div><div><div className="nm">테크기업 채용 총괄</div><div className="ro">개발 직군 채용 담당</div></div></div>
            </div>
            <div className="vc">
              <div className="bubble">
                <div className="qm"><i className="fa-solid fa-quote-left"></i></div>
                <blockquote>“표준화된 질문으로 직무 적합성과 의지를 객관적으로 파악할 수 있었습니다.”</blockquote>
              </div>
              <div className="who"><div className="ava">B</div><div><div className="nm">국내 금융 플랫폼 채용담당자</div><div className="ro">대규모 채용 운영 담당</div></div></div>
            </div>
            <div className="vc">
              <div className="bubble">
                <div className="qm"><i className="fa-solid fa-quote-left"></i></div>
                <blockquote>“AI 면접 리포트 덕분에 후보자의 강점과 우려점을 빠르게 파악할 수 있었습니다.”</blockquote>
              </div>
              <div className="who"><div className="ava">C</div><div><div className="nm">국내 모빌리티 IT 기업 채용담당자</div><div className="ro">기술 직군 채용 담당</div></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11 · FAQ (어드민 FAQ, DB) */}
      <section className="faq" id="faq">
        <div className="wrap">
          <div className="head">
            <h2>자주 묻는 질문</h2>
          </div>
          <FaqList items={faqs} />
        </div>
      </section>

      {/* SECTION 12 · 마지막 CTA — 두 제품을 함께 말하므로 강조어는 'AI'(11/26, 옛 'AI 면접') */}
      <FinalCta before={<>다음 채용은,<br /></>} word="AI" after="로 더 빠르게 시작하세요." />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </>
  );
}
