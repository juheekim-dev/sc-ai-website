import type { Metadata } from "next";
import Link from "next/link";
import "./landing.css";
import PageHero, { HeroWord } from "@/components/PageHero";
import ClientLogos from "@/components/ClientLogos";
import FinalCta from "@/components/FinalCta";
import IntegritySection from "@/components/IntegritySection";
import SecuritySection from "@/components/SecuritySection";
import FaqList from "@/components/FaqList";
import SoftCta from "@/components/SoftCta";
import { getFaqs } from "@/lib/faq";
import { PRODUCTS } from "@/lib/products";
import AskDemo from "@/components/AskDemo";
import AssistDemo from "@/components/AssistDemo";
import ProductFlow from "@/components/ProductFlow";
import PairGrid from "@/components/PairGrid";
import InView from "@/components/InView";
import { buildPageMetadata } from "@/lib/pageSeo";

// 04 해결 — 제품 카드. 이름·주소·한 줄 설명·도식 썸네일은 lib/products.ts(GNB·푸터·제품 페이지 끝 안내 카드와 공용), 기능 3개만 여기서 정한다.
const PRODUCT_POINTS: Record<string, string[]> = {
  "/ai-interview": ["평가 기준·질문 자동 생성", "답에 따라 꼬리질문", "등급·역량·강약점 리포트"],
  "/ai-assessment": ["AI 개발 과제 · AI 업무 과제 · 코딩 테스트", "AI 활용 과정과 결과 검증까지 채점", "제출 뒤 AI 인터뷰로 이해도 확인"],
};

// 09 · 케이스 스터디(2026-11-26) — 블로그에 공개된 도입 사례 두 편. 처음엔 회사명을 빼고 유형으로만 불렀으나,
// 블로그 썸네일을 넣기로 하면서(사용자 결정) 회사명을 공개하고 카드를 누르면 원문 글로 간다.
// 썸네일은 블로그 cover를 webp로 줄여 public/cases/에 둔다(next/image 변환 한도를 쓰지 않으려고). 블로그 cover를 바꾸면 여기도 다시 뽑는다.
// 사실 근거: _docs/홈페이지 개편/케이스스터디_정리.md. 넥슨 케이스에서 슈퍼코더가 공급한 건 AI 면접뿐 — 'AI 활용 역량평가'를 우리 AI 역량검사로 쓰지 않는다.
// 카드 구성은 라운드HR 고객 사례 카드 참고(11/26 사용자 공유): 썸네일 → 회사명·유형 → 굵은 인용 → 설명 → 해시태그 칩, 두 장 높이를 어긋나게.
const CASES = [
  {
    company: "넥슨",
    tag: "대기업 · 대량 채용",
    img: "/cases/nexon.webp",
    alt: "넥토리얼 for game programmer — NEXON × Supercoder",
    href: "/blog/coding-test-to-ai-interview",
    quote: "일하는 방식에 많은 변화가 있는 만큼, 채용 방식 또한 변화가 필요하다고 판단했습니다.",
    body: "게임 프로그래머 채용형 인턴십 '넥토리얼'에서 코딩테스트를 없애고 1차 검증을 AI 면접으로 바꿨습니다. 서류를 통과한 수천 명이 같은 날 1:1 원격으로 약 50분씩 응시했습니다.",
    chips: ["코딩테스트 대체", "대규모 원격 면접", "AI 면접"],
    who: "넥슨 채용팀장",
    src: "언론 보도(2026-08), 슈퍼코더 발표(2026-09)",
  },
  {
    company: "디피니트",
    tag: "스타트업 · 경력직 채용",
    img: "/cases/definite.webp",
    alt: "디피니트 AI 면접 도입 전후 — 전형 2단계, 채용 기간 3일 이내, 담당자 투입 시간 주 2시간",
    href: "/blog/ai-interview-case-definite",
    quote: "지금은 AI 면접 보고 나서 바로 채용 보고까지, 3일도 안 걸리죠.",
    body: "CTO가 직접 보던 5단계 전형을 AI 면접 → 대면 면접 2단계로 줄여, 2~3주 걸리던 채용이 3일 안에 끝납니다. 채용에 쓰는 시간도 주 20시간에서 2시간이 됐습니다.",
    chips: ["채용 기간 단축", "면접관 시간 절약", "AI 면접"],
    who: "디피니트 CTO",
    src: "고객사 CTO 인터뷰(2026-09), 자체 체감 기준",
  },
];

// 03 · 문제 — 통계 네 개를 문제 줄로, 두 제품이 하는 일을 해결 줄로(카드 한 장에 한 쌍). 수치·출처는 옛 통계 카드 그대로. 문장은 한 줄에 들어가게 짧게.
const PAIRS = [
  { problem: "기업 84%가 지원자의 거짓·과장을 적발한 적이 있습니다", solution: "AI 면접이 꼬리질문으로 적힌 경험을 확인합니다" },
  { problem: "인사담당자 59%가 기준 미달 지원자를 통과시킨 적이 있습니다", solution: "모든 지원자를 같은 기준으로 먼저 검증합니다" },
  { problem: "인사담당자 81%가 잘못 뽑아 후회한 적이 있습니다", solution: "AI 역량검사가 실제 과제로 실무 역량을 확인합니다" },
  { problem: "채용 1명당 평균 비용은 1,272만원입니다", solution: "면접관은 검증된 핵심 후보만 만납니다" },
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

      {/* SECTION 03 · 문제 — 제품 페이지 문제 띠와 같은 구성(가운데 제목 + 문제(x) → 해결(체크) 카드, PairGrid). 바탕은 그대로 연한 하늘색(11/26).
          옛 통계 카드(84%·59%·81%·1,272만원)는 문제 줄로 옮기고 출처는 아래 한 줄로 */}
      <section className="band soft" id="flood">
        <div className="wrap">
          <div className="head">
            <h2>AI로 쓴 이력서는 좋아졌는데,<br />지원자의 <span className="blue">실력</span>도 좋아졌을까요?</h2>
            <p className="lead">진짜를 못 거르는 1차 검토는<br />결국 채용 비용과 미스매치로 이어집니다.</p>
          </div>
          <PairGrid light pairs={PAIRS} />
          <p className="pair-src">출처: 사람인(기업 927개사 · 인사담당자 377명 · 기업 499개사), 잡코리아(인사담당자 794명)</p>
        </div>
      </section>

      {/* SECTION 04 · 역할(깔때기) — 11/26 "깔때기는 문제 섹션 다음에, 나머지는 살려" — AI가 거르고 사람이 판단한다는 큰 그림을 먼저, 그 뒤 해결(제품 2종)·함께 쓰는 순서.
          섹션이 하나 늘어 배경 교차가 밀렸다: 깔때기 흰 → 해결 연한 → 함께 쓰는 순서 흰 → 부정행위 연한 → 보안 흰 → 성과·후기 연한 → FAQ 흰 */}
      <section className="role-funnel" id="role">
        <div className="wrap">
          <div className="head">
            <h2>지원자 선별은 <span className="blue">AI</span>가,<br />최종 판단은 <span className="blue">사람</span>이</h2>
            <p className="lead">AI가 전체 지원자를 먼저 선별하고, 채용팀은 최종 의사결정에 집중합니다.</p>
          </div>
          <div className="funnel3">
            {/* 화면에 들어오면 위에서부터 한 단씩 내려온다(InView → .inview, 모션은 landing.css .fn-wrap.inview) */}
            <InView className="fn-wrap">
              <svg className="fn-svg" viewBox="0 48 1140 636" role="img" aria-label="지원자 전체를 AI가 자동 검증·필터링해 핵심 인재 리포트로 좁히고, 최종 판단만 채용팀이 내리는 깔때기">
                <defs>
                  <linearGradient id="fnGrad" gradientUnits="userSpaceOnUse" x1="540" y1="62" x2="610" y2="496">
                    <stop offset="0" stopColor="#4577FF" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#3A6FFF" />
                  </linearGradient>
                </defs>
                <g className="fn-guides">
                  <path d="M925 135 H990 Q1000 135 1000 145 V425 Q1000 435 990 435 H730" fill="none" stroke="#5382FF" strokeWidth="1.5" strokeDasharray="6 6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M950 580 H650" fill="none" stroke="#2144a5" strokeWidth="1.5" strokeDasharray="6 6" strokeLinecap="round" />
                </g>
                <path className="seg" d="M215.2 71.7 Q210 62 221 62 L919 62 Q930 62 924.8 71.7 L857.2 198.3 Q852 208 841 208 L299 208 Q288 208 282.8 198.3 Z" fill="url(#fnGrad)" />
                <path className="seg" d="M311.3 233.7 Q306 224 317 224 L823 224 Q834 224 828.7 233.7 L767.3 346.3 Q762 356 751 356 L389 356 Q378 356 372.7 346.3 Z" fill="url(#fnGrad)" />
                <path className="seg" d="M401.2 383.7 Q396 374 407 374 L733 374 Q744 374 738.8 383.7 L683.2 486.3 Q678 496 667 496 L473 496 Q462 496 456.8 486.3 Z" fill="url(#fnGrad)" />
                <path className="tip" d="M483.6 523.4 Q478 514 489 514 L651 514 Q662 514 656.4 523.4 L575.6 658.6 Q570 668 564.4 658.6 Z" fill="#2144a5" />
                <text className="fl" x="570" y="135">지원자 전체 - AI 자동 검증</text>
                <text className="fl" x="570" y="290">핵심 역량 기준으로 지원자 선별</text>
                <text className="fl" x="570" y="435">핵심 인재 리포트</text>
                <text className="fl ft" x="570" y="552">최종</text>
                <text className="fl ft" x="570" y="586">판단</text>
              </svg>
              <span className="fn-tag tag-ai"><i className="fa-solid fa-robot"></i> AI</span>
              <span className="fn-tag tag-team"><i className="fa-solid fa-user"></i> 채용팀</span>
            </InView>
          </div>
        </div>
      </section>

      {/* SECTION 05 · 해결 — 제품 2종(연한 블루, 깔때기 뒤). 카드 위 그림은 제품 페이지 '진행 방식'의 움직이는 카드(AskDemo·AssistDemo, 2026-11-26 옛 도식 썸네일에서 바꿈) */}
      <section className="value" id="products">
        <div className="wrap">
          <div className="head">
            <h2>그래서, 사람을 만나기 전에<br /><span className="blue">AI가 먼저 검증</span>합니다</h2>
            <p className="lead">AI 면접은 질문으로, AI 역량검사는 실제 과제로 지원자를 확인합니다.<br />채용공고만 등록하면 리포트까지 AI가 진행합니다.</p>
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

      {/* SECTION 06 · 함께 쓰는 순서 — 제품 페이지 끝 안내와 같은 ProductFlow(히어로 화면 썸네일). 깔때기의 큰 그림을 실제 제품 순서로(흰 바탕) */}
      <section className="band" id="flow">
        <div className="wrap">
          <ProductFlow />
        </div>
      </section>

      {/* SECTION 07 · 부정행위 감지 (공용, AI 면접 페이지로 연결) — 연한 블루(기본값) */}
      <IntegritySection withLink />

      {/* SECTION 08 · 보안 (공용) — 흰 바탕(기본값) */}
      <SecuritySection />

      {/* SECTION 09 · 성과·후기(연한 블루) — 옛 성과(PROOF) 섹션을 합침(2026-11-26). 케이스 카드 두 장(넥슨·디피니트, 블로그 썸네일 + 원문 링크, 11/26 후기 말풍선 3개를 대체)이 위, 성과 카드 두 장(속도·비용)이 아래.
          성과 카드는 시안 C안(11/26): 긴 설명 대신 그래프(시간 축·도넛) + 한 줄. 시안 https://claude.ai/artifact/Kaktqy6Xv1YVS2MyDzJLuD */}
      <section className="voices" id="voices">
        <div className="wrap">
          <div className="head">
            <h2>채용팀은 이렇게 활용하고 있습니다</h2>
            <p className="lead">반복 검토는 줄이고, <span className="blue" style={{ fontWeight: 700 }}>핵심 후보 판단</span>에 더 많은 시간을 쓰고 있습니다.</p>
          </div>
          <div className="case-grid">
            {CASES.map((c) => (
              <Link key={c.company} href={c.href} className="case">
                <span className="case-thumb"><img src={c.img} alt={c.alt} width={1120} height={630} loading="lazy" /></span>
                <span className="case-txt">
                  <span className="case-tag"><b>{c.company}</b>{c.tag}</span>
                  <h3>“{c.quote}”</h3>
                  <span className="case-body">{c.body}</span>
                  <span className="case-chips">
                    {c.chips.map((t) => <span key={t}>#{t}</span>)}
                  </span>
                  <span className="case-foot">
                    <span className="case-who">{c.who}<small>출처: {c.src}</small></span>
                    <span className="case-more">사례 자세히 보기 <i className="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <div className="proof-row two">
            {/* 속도 — 0~208일 시간 축 위에 AI(당일) 위치. 눈금은 값에 비례(일 ÷ 208) */}
            <div className="pc2">
              <div className="vlabel">속도</div>
              <div className="big big-phrase">만 명도 즉시 스크리닝</div>
              <div className="pg-axis" role="img" aria-label="지원자 만 명 1차 검토: 사람이 한 명당 10분씩 보면 약 208일, AI는 동시에 진행해 당일">
                <div className="pg-flags"><b>AI 당일</b><span>사람 208일</span></div>
                <div className="pg-track"><i></i></div>
                <div className="pg-ticks">
                  {[0, 50, 100, 150, 208].map((d) => <span key={d} style={{ left: `${(d / 208) * 100}%` }}>{d}일</span>)}
                </div>
              </div>
              <p>AI가 동시에 진행해 <strong>당일</strong> 끝납니다.</p>
              <p className="psrc">출처: 서류 10분 사람인·잡코리아 (208일=추산)</p>
            </div>
            {/* 비용 절감 — 면접관 시간 중 줄어든 비율 도넛. 실제 고객 수치가 없어 예시 계산(500시간 → 25시간)이고, 카드에 '예시 계산'을 밝힌다 */}
            <div className="pc2">
              <div className="vlabel">비용 절감</div>
              <div className="big big-phrase">면접관 시간 절약</div>
              <div className="pg-donut">
                <svg viewBox="0 0 120 120" role="img" aria-label="예시 계산: 1차 면접에 쓰던 면접관 시간 500시간 중 475시간(95%)을 줄이고 25시간만 사용">
                  <circle cx="60" cy="60" r="46" className="pg-ring" />
                  <circle cx="60" cy="60" r="46" className="pg-arc" strokeDasharray="274.6 289.03" transform="rotate(-90 60 60)" />
                  <text x="60" y="60" className="pg-pct">95%</text>
                  <text x="60" y="78" className="pg-cap">줄어든 시간</text>
                </svg>
                <ul>
                  <li><i className="on"></i>줄어든 시간 475시간</li>
                  <li><i></i>면접관 시간 25시간</li>
                </ul>
              </div>
              <p>현업 면접관은 <strong>검증된 소수</strong>만 만납니다.</p>
              <p className="psrc">예시 계산: 지원자 1,000명 · 1차 면접 30분 · 대면 면접 후보 50명</p>
            </div>
          </div>

          {/* 저관여 오퍼 — 상담(고관여) 전에 소개서로 먼저 검토할 길을 본문 안에 둔다(옛 성과 섹션에서 옮김).
              /brochure 링크가 GNB·푸터에만 있으면 스크롤 흐름에서 노출되지 않는다. */}
          <SoftCta title="실제 검증 리포트가 어떻게 나오는지 먼저 확인해보세요" href="/brochure" label="서비스소개서 받기" />
        </div>
      </section>

      {/* SECTION 10 · FAQ (어드민 FAQ, DB) — 홈만 흰 바탕(.faq.white, 제품 페이지 FAQ는 연한 블루 그대로) */}
      <section className="faq white" id="faq">
        <div className="wrap">
          <div className="head">
            <h2>자주 묻는 질문</h2>
          </div>
          <FaqList items={faqs} />
        </div>
      </section>

      {/* SECTION 11 · 마지막 CTA — 두 제품을 함께 말하므로 강조어는 'AI'(11/26, 옛 'AI 면접') */}
      <FinalCta before={<>다음 채용은,<br /></>} word="AI" after="로 더 빠르게 시작하세요." />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </>
  );
}
