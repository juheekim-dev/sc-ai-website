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
import { buildPageMetadata } from "@/lib/pageSeo";

// 04 해결 — 제품 카드. 이름·주소·한 줄 설명·도식 썸네일은 lib/products.ts(GNB·푸터·제품 페이지 끝 안내 카드와 공용), 기능 3개만 여기서 정한다.
const PRODUCT_POINTS: Record<string, string[]> = {
  "/ai-interview": ["평가 기준·질문 자동 생성", "답에 따라 꼬리질문", "등급·역량·강약점 리포트"],
  "/ai-assessment": ["AI 개발 과제 · AI 업무 과제 · 코딩 테스트", "AI 활용 과정과 결과 검증까지 채점", "제출 뒤 AI 인터뷰로 이해도 확인"],
};

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

      {/* SECTION 05 · 함께 쓰는 순서 — 제품 페이지 끝 안내와 같은 ProductFlow(히어로 화면 썸네일). 옛 깔때기(AI 선별 → 사람 판단)를 같은 뜻의 세 단계로 바꿈(2026-11-26) */}
      <section className="band soft" id="flow">
        <div className="wrap">
          <ProductFlow />
        </div>
      </section>

      {/* SECTION 06 · 부정행위 감지 (공용, AI 면접 페이지로 연결) — 홈은 앞 '함께 쓰는 순서'(연한 블루)와 번갈아 흰 바탕 */}
      <IntegritySection withLink soft={false} />

      {/* SECTION 07 · 보안 (공용) — 홈은 연한 블루 바탕 */}
      <SecuritySection soft />

      {/* SECTION 08 · 성과·후기 — 옛 성과(PROOF) 섹션을 합침(2026-11-26): '역량 검증' 카드는 문제 섹션 통계와 겹쳐 빼고 속도·비용 두 장만 후기 위에 */}
      <section className="voices" id="voices">
        <div className="wrap">
          <div className="head">
            <h2>채용팀은 이렇게 활용하고 있습니다</h2>
            <p className="lead">반복 검토는 줄이고, <span className="blue" style={{ fontWeight: 700 }}>핵심 후보 판단</span>에 더 많은 시간을 쓰고 있습니다.</p>
          </div>
          <div className="proof-row two">
            <div className="pc2"><div className="vlabel">속도</div><div className="big big-phrase">만 명도 즉시 스크리닝</div><p>사람이 한 명당 10분씩 만 명을 보면 약 <strong>208일</strong>. AI는 동시에 진행해 <strong>당일</strong> 끝나, 검토가 밀려 좋은 후보를 놓치는 일이 없습니다.</p><p className="psrc">출처: 서류 10분 사람인·잡코리아 (208일=추산)</p></div>
            <div className="pc2"><div className="vlabel">비용 절감</div><div className="big big-phrase">면접관 시간 절약</div><p>핵심역량 미달자를 1차에서 걸러, 현업 면접관은 <strong>검증된 소수</strong>만 만납니다. 가장 비싼 자원인 면접관의 시간을 아낍니다.</p><p className="psrc">현업 면접관 시간 = 가장 비싼 채용 자원</p></div>
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

          {/* 저관여 오퍼 — 상담(고관여) 전에 소개서로 먼저 검토할 길을 본문 안에 둔다(옛 성과 섹션에서 옮김).
              /brochure 링크가 GNB·푸터에만 있으면 스크롤 흐름에서 노출되지 않는다. */}
          <SoftCta title="실제 검증 리포트가 어떻게 나오는지 먼저 확인해보세요" href="/brochure" label="서비스소개서 받기" />
        </div>
      </section>

      {/* SECTION 09 · FAQ (어드민 FAQ, DB) */}
      <section className="faq" id="faq">
        <div className="wrap">
          <div className="head">
            <h2>자주 묻는 질문</h2>
          </div>
          <FaqList items={faqs} />
        </div>
      </section>

      {/* SECTION 10 · 마지막 CTA — 두 제품을 함께 말하므로 강조어는 'AI'(11/26, 옛 'AI 면접') */}
      <FinalCta before={<>다음 채용은,<br /></>} word="AI" after="로 더 빠르게 시작하세요." />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    </>
  );
}
