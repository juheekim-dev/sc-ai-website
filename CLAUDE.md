# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Supercoder AI 웹사이트 — **AIVIEW** 제품 랜딩 + 블로그/도입문의. AI 면접으로 지원자를 자동 검증하고, 채용팀에는 검증된 핵심 인재 리포트만 전달하는 B2B 채용 SaaS의 마케팅 웹앱이다. 카피·UI는 전부 한국어.

- Remote: https://github.com/juheekim-dev/sc-ai-website.git
- **브랜치 전략:** `dev` = 작업 기본(GitHub default branch), `main` = 운영(Vercel Production Branch). 별도 지시가 없으면 **`dev`에서 작업·커밋·push**하고, 테스트 후 PR(`dev`→`main`) 머지로 운영 반영.
- 운영 도메인: https://www.supercoder.co (Vercel Production = `main` 브랜치). `supercoder.co`는 www로 308 리다이렉트. 옛 `sc-ai-website.vercel.app`은 2026-07-01 제거되어 404 — 링크로 쓰지 않는다.
- **DB는 dev·운영 공유** — 같은 Supabase 프로젝트(`supercoder-aiview`)를 쓴다. dev에서의 admin 설정·DB 변경(GA·약관·SEO·도입문의 등)은 운영에도 즉시 반영됨에 유의.

## Architecture

**Next.js 15 (App Router) + React 19 + TypeScript.** 정적 HTML 멀티페이지에서 마이그레이션됨(2026-06). Vercel 배포, Supabase 백엔드.

- **라우트(`app/`):**
  - `app/page.tsx` — 랜딤(index). 서버 컴포넌트. 섹션 CSS는 `app/landing.css`.
  - `app/ai-interview/`, `app/ai-assessment/` — 제품 상세 페이지(2026-11 개편, GNB '제품▾'). 서버 컴포넌트, ISR 3600. **섹션 CSS는 홈과 같은 `app/landing.css`를 import해 그대로 쓴다**(복붙 금지). 히어로는 홈과 다른 밝은 `ProductHero`(제품 이미지), 나머지는 공용 컴포넌트(`ClientLogos`·`StepFlow`·`TeamSection`·`SecuritySection`·`TypeTabs`·`ProductFlow`·`FinalCta`). **제품 화면 이미지는 실제 제품 캡처를 가공해 쓴다(2026-11-25 피드백)** — 얼굴은 실루엣, 이름·메일·실제 고객사 공고·경쟁사 이름은 빼고, 응시 시간·가중치·토큰·비용 숫자는 지운다(가공 스크립트·원본 매핑은 `_docs/홈페이지 개편/도식/캡처가공/`). 응시 환경은 크기를 섞은 벤토(`.env-bento`, 큰 카드 1 + 작은 카드 2, 흰 바탕), 단계 카드는 `StepFlow`의 `img`(흰 카드, 화면 이미지에 그림자). AI 면접도 같은 흐름으로 맞췄다(11/25, 13→11개): 히어로(어두운 바탕) → 고객사 로고 → 문제 띠 → 진행 방식(면접 진행 + 리포트 4종, `ReportRows`의 `before`로 한 지그재그) → 면접 유형 → 도입 3단계(화면 이미지) → 부정행위 감지 → 보안 → FAQ → 다른 제품 안내 → 마지막 CTA(+ 차별점 띠). AI 역량검사는 "중복되고 길다"는 피드백에 프로그래머스 AI 역량평가 흐름을 참고해 10개로 줄였다(11/25): 히어로 → 고객사 로고(`ClientLogos`, 11/26 추가) → 문제(어두운 띠 `.band.dark` — 남색→블랙 그라데이션, 문제→해결 세 쌍 `.pair-list` — 카드 하나에 문제(x) 한 줄·해결(체크) 한 줄을 가운데 맞춰 카드 세 장을 쌓는 카드형(11/26 레이아웃 1안), 화면에 들어오면 카드가 차례로 떠오르며 문제 → 해결 줄 순서로 나타나는 모션은 `components/PairGrid.tsx`. 두 제품 페이지 공용) → 진행 방식(③~⑥) → 과제 유형 → 과제 만들기 → 응시 환경 → 보안 → FAQ → 다른 제품 안내 → 마지막 CTA (지원자 응시 과정·채용팀 기능은 FAQ로 옮김). 배경은 흰색↔연한 블루가 번갈아. 같은 말을 두 섹션에서 반복하지 않는다. 기획은 `_docs/홈페이지 개편/`(로컬, git 미추적).
  - `app/apply/` — 도입 문의 폼(고관여). `page.tsx`(서버, metadata) + `ApplyForm.tsx`(클라이언트 → `/api/submit-signup` 호출; 검증·저장·알림은 서버가 한다).
  - `app/brochure/` — 서비스소개서 신청(저관여 리드). `page.tsx`(서버) + `BrochureForm.tsx`(클라이언트 → `/api/send-brochure` 호출) + `BrochurePreview.tsx`. 두 폼의 공통 검증은 `lib/leadForm.ts`(개인 메일·**대학 메일(ac.kr·edu·해외 ac.xx/edu.xx — `isUnivEmail`, 2026-10-30; 초중고·유치원·`go.kr`은 막지 않는다)**·국내 전화번호 형식 — 클라이언트 즉시 피드백용)와 **서버 전용** `lib/leadGuard.ts`(`validateLead` — 일회용 메일 8,792개 + 무료 메일 제공자 4,466개 대조 + 메일 도메인 DNS 확인). 대학 도메인 판정 `isUnivDomain`은 이벤트 지원 폼(`lib/eventApply.ts`)이 **허용** 조건으로 같이 쓴다 — 바꾸면 양쪽이 함께 바뀐다. ⚠️ 공개 목록엔 **국내 제공자(daum.net·kakao.com·nate.com)가 빠져 있어** 국내분은 `leadForm.ts`가 직접 관리한다 — 둘 다 필요하다. 갱신은 `node scripts/sync-email-blocklists.mjs`.
  - `app/blog/` — 블로그 목록. `page.tsx`(서버, Supabase에서 published 글 SSR) + `BlogClient.tsx`(클라이언트, 카테고리 필터).
  - `app/blog/[id]/` — 블로그 상세. 서버 컴포넌트, `generateMetadata`로 글별 OG. 본문은 `lib/postRender.ts`(간이 마크다운)로 렌더.
  - `app/admin/` — 블로그 관리. `page.tsx`(noindex) + `AdminClient.tsx`(**Supabase Auth 로그인 게이트** + CRUD).
  - `app/privacy`, `app/terms`, `app/terms-applicant` — 법적 페이지(서버). `app/not-found.tsx` — 404.
- **공유 디자인 토큰·컴포넌트 CSS는 `app/globals.css` (SSOT).** `:root` 변수(`--blue`,`--ink`,`--soft`,`--r`,`--shadow` 등)·버튼(`.btn*`)·`.eyebrow`·GNB(`header`/`nav`)·푸터(`footer`)·모달(`.bro-*`)·챗봇(`.cbot*`)·법적 페이지(`.legal`)가 모두 여기. 루트 `layout.tsx`에서 1회 import. **공유 컴포넌트를 바꿀 땐 `app/globals.css`만 고치면 전 페이지가 함께 바뀐다.**
- **페이지 고유 CSS는 라우트 폴더에 co-located** (`app/landing.css`, `app/apply/apply.css`, `app/blog/blog.css`, `app/blog/[id]/post.css`, `app/admin/admin.css`). 해당 page에서 import. 클래스는 전역 스코프(원본 정적 사이트와 동일 동작).
- **공유 컴포넌트(`components/`):** `SiteHeader`(섹션 인지형 GNB·메뉴. '제품▾' 펼침 메뉴 항목은 `PRODUCTS` 배열 하나를 데스크톱·모바일이 함께 쓴다), `SiteFooter`, `Chatbot`(FAQ 챗봇), `HeroParticles`(canvas 입자 모션, 히어로·CTA 공용), `Analytics`·`UtmCapture`·`ViewCounter`. 모두 `layout.tsx`에 마운트되거나 page에서 사용. `"use client"`. 홈·제품 페이지가 같이 쓰는 섹션은 서버 컴포넌트 `PageHero`(홈 전용 다크 히어로, 강조어는 `HeroWord`. 바탕은 `FlutedGlassBg` — 브랜드 배경 이미지(SNS 대문: 왼쪽 밝은 블루·오른쪽 남색, 세로 골 유리)를 WebGL 셰이더로 그려 경계가 천천히 흔들린다. 바탕이 밝아 버튼은 `btn-white`, 설명 글은 흰색. 입자 수렴 모션은 뺐다 — 마지막 CTA에만)·`LaunchPopup`(AI 역량검사 출시 팝업, 홈 `app/page.tsx`에만 마운트 — AI 역량검사 클릭 유도용이라 최대한 짧게 — 제목 'AI 역량검사 출시'·한 줄·버튼만. 그리팅 팝업 참고 왼쪽 남색 판 + 오른쪽 빛줄기 위 작은 흰 리포트 예시 카드(평가 항목 이름 4개·'추천', 점수 숫자 없음, 카드도 링크, 모바일은 카드 숨김), 딤은 `.evp-dim` 재사용, X는 세션 동안·'오늘 하루 보지 않기'는 KST 날짜까지 숨김. 스타일 `.lp-*` in `app/landing.css`)·`ProductHero`(제품 상세 페이지 히어로 — 밝은 바탕 + 오른쪽 제품 이미지 `public/hero-*.webp`, 두 제품 모두 밝은 바탕 + 같은 어두운 제품 화면(#181818 계열, 2026-11-25 AI 면접도 AI 역량검사 색으로 맞춤). AI 역량검사는 실제 응시 화면 캡처를 가공한 것, AI 면접은 캡처가 없어 같은 색으로 캡처 배치대로 그린 것(지원자 영상 칸은 사용자가 준 목업 인물 사진, 11/26) — 둘 다 `_docs/홈페이지 개편/도식/캡처가공/make.mjs`. 화면 그림은 `HeroStage`(바탕·점선·레이어 — ProductFlow 썸네일과 공용). `layers`·`lines`를 주면 바탕 위에 투명 레이어를 겹쳐 레이어마다 움직인다 — AI 역량검사는 `public/hero-assessment-*.webp`, AI 면접은 `public/hero-interview-*.webp`(화면·AI 면접관 카드·리포트·칩, 캔버스 600×448 — `size`로 맞춤). 레이어에 `orb`를 주면 그 레이어와 함께 움직이는 오브를 겹친다.)·`LiveOrb`(움직이는 AI 면접관 오브, 클라이언트 — 제품과 같은 `lib/interviewerOrb.js`를 dynamic import해 이미지 속 정지 오브 자리를 바탕색으로 덮고 말하기 모드로 그린다. 원본은 `_docs/홈페이지 개편/AI면접관_orb/`)·`AskDemo`(AI 면접 '면접 진행' 그림 — 히어로 AI 면접관 카드와 같은 모양을 HTML로, 질문 → 꼬리질문 + `LiveOrb`)·`AssistDemo`(AI 역량검사 '과제 화면' 그림 — 히어로 AI 어시스턴트 카드를 HTML로, 지시 → AI 답) — 둘 다 `DemoPanel`(연한 판 + 화면에 들어오면 `.ad-1` → `.ad-2`가 차례로 나타나는 9초 반복 모션)·`StepFlow`(3단계 카드 줄, 단계마다 `img`를 주면 카드 아래에 실제 화면을 꽉 차게 붙인다 — `.pstep.has-shot`)·`TeamSection`(채용팀 기능, 두 제품 공용)·`ClientLogos`(도입사 로고 마퀴)·`ReportRows`(리포트 4종)·`MotionDiagram`(모션 도식 — 이미지가 아니라 페이지에 바로 넣는 SVG, `components/motionDiagrams.ts`. AI 면접 리포트 4종(줄 써짐·원 그래프/막대·육각형 모양 변화·강점·약점 카드 동시 등장)과 AI 역량검사 진행 방식 3장(과정 평가 리플레이·AI 인터뷰 대화·평가와 근거). 다시 뽑기는 `_docs/홈페이지 개편/도식/모션도식_만들기_make-motion.py`, 11/26)·`IntegritySection`(부정행위 감지 — 가운데 제목 + 탭 3개(11/26): '감지 항목' = 벤토(11/26 E안 — AI 역량검사 응시 환경의 `.env-bento`·`.eb-card` 재사용, `.ig-bento`): 왼쪽 큰 카드 '얼굴·시선·안경 검사' = 정면 카메라(`public/integrity-face.webp`, 목업 '실 정면-2'를 16:9로, 얼굴은 모서리 4개·시선은 두 눈을 감싸는 가는 직사각형(`GazeHud` SVG), 배지 3개(얼굴 1명·시선 추적·안경 검사)는 왼쪽 위·오른쪽·아래로 펼쳐 점선으로 연결), 오른쪽 작은 카드 3장(`SHOTS`) = 탭 이탈·보조 모니터(화면 공유 `integrity-screen.webp` — AI 면접 히어로 화면의 창 부분, AI 면접관 카드는 지움)·측면 카메라(`integrity-side.webp`, 목업 '실 측면-2')·손·키보드(`integrity-hands.webp`, 목업 '키보드와 손'). 측면 사진은 모니터 끝만 살짝 걸리게, 손 사진은 모니터가 빠지게 잘랐다. 카드 글이 예전 오른쪽 항목 목록을 대신한다. 4장 배치 시안 A~F는 `_docs/홈페이지 개편/부정행위감지_4장_레이아웃_시안.html` (정면 카메라 표시는 CSS 모션 7초 반복 — 모서리가 얼굴을 잡고 → 두 눈 직사각형 → 점선·배지 차례로) / '실시간 모니터링' = 채용팀 메뉴 '실시간 모니터링'(SC-Platform `/recruiter/home/live-proctoring`)을 HTML로 그린 예시 `.lv`(11/26 M2안 — 왼쪽 진행 중 목록, 'AI 감지' 지원자가 맨 위 / 오른쪽 그 지원자의 화면 공유·정면·측면 카메라를 크게, CSS 모션 8초 반복 — 감지가 뜨면 그 지원자가 둘째 줄에서 맨 위로 올라오며 'AI 감지'로 바뀐다) + 설명. 응시 중 바로 잡히는 건 시선 이탈·여러 얼굴·얼굴 미감지·시험 화면 이탈뿐(약 10초 갱신), 회사별로 켜는 베타라 그렇게 밝힌다 / '감지 리포트' = 벤토(11/26 R3 — 감지 항목 탭과 같은 결): 큰 카드 = 면접 영상의 시선 이탈 장면(`public/integrity-away.webp`, 목업 '실 정면-시선 아래로'를 16:9로) + 두 눈 측정 박스·아래로 꺾이는 시선 화살표·'시선 이탈' 배지 + 타임라인, 작은 카드 3장 = 종류·시각 기록 → 그 장면으로 이동 → 판단은 채용팀이(감지 종류·시각은 예시 값). 레이아웃 시안은 `_docs/홈페이지 개편/감지리포트_레이아웃_시안.html`·`실시간모니터링_레이아웃_시안.html`. 홈은 `withLink`)·`Tabs`(공용 탭 — 알약 탭 줄 `.tt-list`·`.tt-tab` + 패널, 패널 배치는 `panelClass`로. `TypeTabs`·`IntegritySection`이 같이 씀)·`SecuritySection`(좌우 분할 — 왼쪽 제목·ISO 인증 마크, 오른쪽 보안 항목 목록)·`FaqList`(FAQ 목록)·`SoftCta`(중간 안내 한 줄+버튼 — 홈 서비스소개서 안내)·`TypeTabs`(유형 섹션 — 면접 유형·과제 유형을 탭으로 고르기, 11/26. 그림은 `TypeDemo` — 도입 단계 이미지와 같은 결의 창을 HTML로 그려 글이 한 글자씩 써지고 요소가 차례로 나타남(채용공고·이력서는 흰 창, 과제 3종은 실제 응시 화면 색), 좌표는 360×240 기준을 cqw로. 원본 이미지 `public/type-*.webp`는 남겨 둠)·`ProductFlow`(제품 페이지 끝 다른 제품 안내·홈 05 — 함께 쓰는 순서: AI 면접 → AI 역량검사 → 대면 면접 세 단계, 1·2단계 그림은 각 제품 히어로 화면 `HeroStage`, 3단계는 반대로 카드 전체가 어둡고(`.pf-step.dark`, 문제 띠와 같은 남색→블랙) 그림 속 '핵심 후보' 화면은 흰색(`public/f2f-*.webp`, 가상 이름 + 사용자가 준 목업 인물 사진), 카드 사이 흰 원 꺾쇠, 상대 제품 카드에만 버튼, 11/26)·`FinalCta`(마지막 CTA, `points`를 주면 버튼 아래 차별점 띠 — AI 역량검사) — 스타일은 `app/landing.css`. 제품 이름·주소·한 줄 설명은 `lib/products.ts`(GNB·푸터·홈 카드·ProductFlow 공용 — 단계 설명 `when`, 히어로 화면 데이터 `HERO`(바탕·레이어·점선·크기, ProductHero와 ProductFlow 썸네일이 같이 씀)도 여기), ISO 인증 목록은 `lib/certs.ts`(푸터·보안 섹션 공용). 제품 문구의 사실 근거·금지 표현은 `_docs/홈페이지 개편/AI면접_AI역량검사_차이_소개자료.md`. ⚠️ `CostCalculator.tsx`는 **어디에도 마운트돼 있지 않다**(미사용). 소개서 리드는 옛 `BrochureModal`이 아니라 `app/brochure/` 라우트가 담당한다.
- **섹션 = 랜딩 구조 (정의된 이름·번호·id).** `app/page.tsx`는 번호 매겨진 섹션 스택이다. 정식 목록(2026-11 개편, 11/26 정리): 01 히어로(`#hero`), 02 도입사(`#clients`), 03 문제(`#flood` — 제품 페이지와 같은 문제(x) → 해결(체크) 카드 `PairGrid light`, 연한 하늘색 바탕, 통계 4개가 문제 줄), 04 역할·깔때기(`#role`, 흰 바탕), 05 해결·제품 2종(`#products` — 카드 위 그림은 `AskDemo`·`AssistDemo`), 06 함께 쓰는 순서(`#flow`, `ProductFlow` — `current` 없이 두 제품 카드 모두 버튼, 3단계 카드에 검사 결과 등급 뱃지), 07 부정행위 감지(`#integrity`), 08 보안(`#security`), 09 성과·후기(`#voices` — 케이스 카드 2장(넥슨·대량 채용 / 디피니트·경력직, `CASES` in `app/page.tsx`, 11/26 후기 말풍선 대체 — 블로그 썸네일(`public/cases/*.webp`) + 회사명 공개 + 카드 전체가 원문 블로그 링크, 근거는 `_docs/홈페이지 개편/케이스스터디_정리.md`) 아래 서비스소개서 안내. 속도·비용 절감 성과 카드는 추산·예시 계산이라 실제 사례 옆에 두지 않으려고 11/26 뺐다), 10 FAQ(`#faq`, 홈만 흰 바탕 `.faq.white`), 11 마지막 CTA(`#final`). 리포트 4종·도입 3단계는 홈에서 뺐다(제품 페이지에만). 배경은 흰색↔연한 블루가 번갈아 오도록 둔다(공용 섹션 틀 `.band`/`.band.soft`). GNB는 섹션 앵커를 쓰지 않는다 — 메뉴는 제품▾(`/ai-interview`·`/ai-assessment`)·블로그·서비스소개서·이벤트(2026-11-24). 부정행위 감지·보안은 메뉴가 아니라 홈·제품 페이지 본문에서 보여준다.
- **섹션 인지형 GNB:** `[data-nav="dark"]` 섹션(히어로·FINAL) 위에선 헤더 반전(흰 로고). 색 전환 클래스(`header.nav-invert`/`.nav-solid`)는 `globals.css`(SSOT), 감지 로직은 `SiteHeader.tsx`의 `syncHeader`.
- **폰트·아이콘은 자체 호스팅 서브셋(2026-08-10 성능 최적화):** `layout.tsx`가 `pretendard.css`(woff2 청크만 jsdelivr)와 `fontawesome.css`를 import한다. 아이콘은 `<i className="fa-...">`로 쓰되, **`app/fontawesome.css`에 정의된 아이콘만 쓸 수 있다** — `public/fonts/`의 woff2도 pyftsubset으로 잘라낸 상태라 목록에 없는 이름을 쓰면 버튼은 동작해도 글리프가 렌더되지 않는다(2026-08-21 `fa-flask` 사례). 새 아이콘이 꼭 필요하면 CSS 룰 추가 + 폰트 재서브셋이 함께 필요하다. Supabase는 `@supabase/supabase-js`(npm).
- **정적 에셋은 `public/`** (로고 SVG, 리포트 PNG/webp, 파비콘, `brochure-aiview.pdf`, `logos/`, `charts/`, `robots.txt`, `sitemap.xml`). 절대경로(`/supercoder-nav.svg`)로 참조.
- **구 `.html` URL은 `next.config.mjs` redirects로 클린 URL에 308 매핑**(`/apply.html`→`/apply` 등). 기존 인바운드 링크·SEO 보존.

## 렌더링·캐시 (2026-10-19 · 2026-11-18, Vercel 무료 한도 대응)

- **공개 페이지는 전부 ISR, 주기는 길게.** 목록성 페이지(랜딩·도입문의·소개서·블로그 목록·RSS·사이트맵·업데이트 목록·이벤트 전체)는 `revalidate = 3600`, 내용이 어드민 저장으로만 바뀌는 상세·법적 문서(블로그·업데이트 상세, 약관/개인정보와 날짜 이력, `legal/[slug]`)는 `86400`. **`force-dynamic`을 다시 넣지 않는다** — 봇 요청마다 서버 렌더가 돌아 Hobby Active CPU 한도(월 4h)를 넘겼다(2026-10-19).
- **주기를 다시 짧게(분 단위로) 줄이지 않는다.** ISR 재생성 1회마다 HTML+RSC가 8KB 단위로 쓰기(ISR Writes)에 잡힌다. 2분·5분 주기에 `/blog`가 전체 본문을 실어 회당 1.2MB를 쓰면서 무료 한도(월 20만)를 다 썼다(2026-11-18).
- **루트 layout에서 읽는 캐시는 전 페이지 주기의 상한이 된다.** `lib/siteTags.ts`의 `unstable_cache` 주기가 5분이었을 때 모든 페이지가 5분으로 끌려 내려갔다. 지금은 1일 + `/api/revalidate`에서 `site-tags` 태그 무효화. 레이아웃에 데이터 조회를 추가하면 `npm run build` 출력의 Revalidate 열을 확인한다.
- **목록 페이지에 본문(content)을 싣지 않는다.** `/blog`는 `POST_LIST_COLUMNS`(`lib/supabase.ts`)만 조회한다. 그래서 블로그 검색은 제목·요약·카테고리·태그만 대상이다. RSS는 최신 20개.
- **"저장하면 바로 반영"은 `/api/revalidate`가 담당.** 어드민(`AdminClient.tsx`)은 posts·updates·faq·legal_docs·page_seo·site_settings 저장/삭제 직후 `revalidateSite(paths?)`(`lib/revalidateClient.ts`)를 호출한다. 서버는 Supabase 세션 토큰을 검증하고 `admins`에 있는 이메일만 통과시킨 뒤 `revalidatePath`를 실행한다. 새 어드민 저장 지점을 만들면 같은 호출을 붙인다.
- **예약 발행(publish_at)은 최대 1시간 지연**될 수 있다(목록·RSS·사이트맵 ISR 주기). 정확한 시각이 중요하면 그 시각에 어드민에서 아무 저장이나 한 번 하거나 `/api/revalidate`를 호출한다.
- **middleware.ts는 제거됨.** `*.vercel.app` 접근 noindex 헤더는 `next.config.mjs`의 `headers()`(host 조건)로 옮겼다. 미들웨어가 필요해지면 호출 비용을 먼저 따진다.

## Backend (Supabase)

- **프로젝트:** `supercoder-aiview` (ref `ymzlcghqamkynuvotzgh`, region ap-northeast-2). org `uwuwftckkxbtbqjlsrav`.
- **연결:** `lib/supabase.ts` — `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` 환경변수(.env.local · Vercel)에서 publishable(공개) 키 주입. publishable 키는 RLS로 보호되어 노출 안전. **`.env.example` 참고. service_role 키는 절대 클라이언트/깃에 넣지 않는다.**
- **테이블 / RLS:**
  - `signups` — 도입 문의(apply). **anon은 읽기·쓰기 모두 불가**(2026-09-13 확인). 저장은 서버 `/api/submit-signup`이 service_role로 한다.
  - `brochure_requests` — 서비스소개서 리드. anon 불가. 저장은 `/api/send-brochure`가 service_role로.
  - `subscribers` — 뉴스레터(예비). anon 불가.
  - ⚠️ 리드 폼을 클라이언트에서 직접 insert 하도록 만들면 **RLS에 막혀 조용히 실패**한다(옛 ApplyForm이 이 상태였다). 새 리드 경로는 반드시 서버 라우트를 거친다 — 스팸 검증(`lib/leadGuard.ts`)도 거기에만 있다.
  - `posts` — 블로그. anon `select` 허용(공개 읽기). **`insert`/`update`/`delete`는 `authenticated` + `admins` 테이블에 이메일이 있는 관리자만**(RLS). → admin 페이지는 **Supabase Auth 로그인 필수**. (anon 키만으로는 쓰기 불가.)
  - `admins` — 관리자 이메일 목록. authenticated self-select.
- **신규 관리자 추가:** Supabase Auth에 사용자(이메일+비밀번호) 생성 + `admins`에 같은 이메일 INSERT(대시보드/MCP).

## Running / Build

```bash
npm install
npm run dev      # http://localhost:3000 개발 서버
npm run build    # 프로덕션 빌드(타입체크·린트 포함)
npm start        # 빌드 후 프로덕션 서버
```

`.env.local`에 Supabase 환경변수 필요(`.env.example` 복사). 배포는 Vercel(push 시 자동) + 동일 환경변수 등록.

## 작업 규칙 (Workflow Rules)

### 사용자 응답은 한국어로 (MUST)
사용자에게 설명·요약·진행 보고를 할 때는 **항상 한국어**로 작성한다. (코드·식별자·로그 등 원문은 그대로.)

### UI 컴포넌트 재사용 / 단일 출처 (MUST)
UI 구현 시 **기존 컴포넌트·토큰을 먼저 재사용**한다. 공유 스타일은 `app/globals.css`, 공유 마크업은 `components/`. 페이지별로 복붙하지 않는다 — 한 곳을 고치면 관련 UI가 전부 바뀌도록. 재사용할 게 없으면 새로 만들기 전에 사용자에게 먼저 물어본다.

### 구현 후 검증 (MUST)
commit/push 전에 **항상** `npm run build`로 타입·린트·빌드를 통과시킨다. 화면 변경은 `npm run dev`로 확인하고, 필요 시 스크린샷은 `screenshots/`에 저장한다.

### 브랜치 전략 (MUST)
별도 지시가 없으면 **`dev` 브랜치에서 작업**한다(GitHub default=`dev`). 작업 시작 전 현재 브랜치가 `dev`인지 확인(`git checkout dev`). `main`은 운영(Vercel Production)이므로 **`main`에 직접 push 금지** — 운영 반영은 테스트 후 **PR(`dev`→`main`) 머지로만** 한다(`gh pr create --base main --head dev`). dev에 push하면 Vercel이 preview 배포(`*-git-dev-*.vercel.app`)를 만들어 테스트 가능.

### 새 기능 추가 시 push (MUST)
기능 완료 시 `git add -A` → 의미 있는 commit → `git push`( = `dev`에 push). secret(`.env*`)은 절대 commit하지 않는다(.gitignore 확인).

### 업데이트 글(/update) 본문 스타일 (MUST)
제품 업데이트 글은 **아래 골격을 그대로 유지**한다. 어드민 본문 편집기의 `📄 템플릿 → 제품 업데이트 (표준)`이 이 구조를 그대로 채워 넣는다(`UPDATE_TEMPLATES` in `app/admin/AdminClient.tsx`). 본문은 WYSIWYG(HTML)로 저장되며 `renderBody`(`lib/postRender.ts`)가 그대로 출력한다.

- **대제목은 `<h2>` + 이모지** — `💡 Overview` → `⭐ 주요 업데이트` → `🔧 운영 경험 개선`(하위 `🐞 버그 수정` · `🔐 보안 및 안정성`) → `⚠️ 이용 안내` → `⏳ 계속 업데이트 중인 AI Interview`. 섹션 사이는 `<hr>`.
- **개별 기능은 `<h3>` + 이모지 + 번호** (`📱 1. 지원자 화면 개편`). 회사별 설정이 필요하면 제목 끝에 `(옵션 · 별도 설정 필요)`.
- **항목 나열은 표** — 2열(`항목|내용`, 버그 수정은 `영역|설명`). 표는 반드시 `<div class="post-table-wrap"><table class="post-table">` 로 넣는다. 이 클래스가 있어야 헤더 연한 블루(`--soft-2`)·라운드 테두리가 적용된다(bare `<table>`은 `renderBody`가 자동으로 감싸주지만, 작성 시엔 클래스를 붙인다).
- **짧은 나열은 `<ul>`**, 보안·운영 항목은 `<strong>제목</strong> — 설명` 형식.
- **보충 안내는 `💡 …` 문단**(`<p>`). 인라인 색상·글자 크기(`style="..."`)는 쓰지 않는다 — 색은 전부 CSS 토큰(`app/update/update.css`)이 담당한다.
- **외부 문서(Word·Notion·메일)에서 붙여넣지 말 것** — 통짜 `<pre>`/인라인 스타일이 딸려 와 표·제목 서식이 전부 죽는다. 붙여넣었다면 템플릿을 다시 적용하고 내용만 옮긴다. (편집기가 통짜 `<pre>` 붙여넣기는 문단으로 풀어주지만, 표·제목은 직접 다시 잡아야 한다.)
- **자유 형식 원고는 `표준 서식으로 맞추기` 버튼**으로 정리한다(본문 라벨 옆). 규칙 기반 변환(`lib/updateFormat.ts` → `formatUpdateBody`)이 브라우저에서 바로 돌아 외부 호출·비용이 없다. 하는 일은 **섹션 제목 승격·이모지/번호 부여·`<hr>` 삽입·‘항목 — 설명’ 3줄 이상을 표로·마크다운 잔재 변환·잡태그 제거**까지고, **문장을 다시 쓰거나 순서를 바꾸지는 않는다**(순서는 원고를 따름). 여러 번 눌러도 결과가 같다(멱등). 남는 판단은 편집기에서 손보고 미리보기로 확인한다.
- 저장 전 어드민 **미리보기**로 확인한다. DB는 dev·운영 공유이므로 공개(published) 전환은 **명시적 지시가 있을 때만** 한다.

### 보고서·문서 PDF 스타일 (MUST)

보고용 문서(HTML → PDF)를 만들 때는 **아래 팔레트와 폰트만** 쓴다. 예외 없이 적용한다.

- **폰트는 Pretendard.** `font-family: "Pretendard", -apple-system, BlinkMacSystemFont, sans-serif`. 시스템(`~/Library/Fonts`)에 9개 웨이트가 설치돼 있어 헤드리스 Chrome이 바로 렌더한다. 숫자가 열로 정렬되는 곳엔 `font-variant-numeric: tabular-nums`.
- **배경은 항상 흰색.** PDF는 인쇄물이므로 **다크 모드 블록을 넣지 않는다**(`@media (prefers-color-scheme: dark)`·`[data-theme]` 금지). `body`에 흰 배경을 명시한다.
- **색은 블루 + 그레이 + 레드뿐.** 초록·주황 등 다른 색상 계열을 추가하지 않는다. 상태 표기(완료/보류/제외)도 이 세 가지 안에서 농도로 구분한다.
- **레드는 유일한 강조색**이다. 경고·초과·중단처럼 진짜 눈에 걸려야 하는 곳에만 쓰고, 남발하지 않는다.

```css
:root {
  --ground:    #FFFFFF;  /* 페이지 배경 — 항상 흰색 */
  --surface:   #FFFFFF;  /* 카드 */
  --surface-2: #F5F8FF;  /* 표 헤더 등 옅은 면 (로고 블루 5%) */
  --ink:       #141C2E;  /* 본문 (17.0:1) */
  --ink-2:     #4C5870;  /* 보조 텍스트 (7.15:1) */
  --muted:     #6D7689;  /* 캡션·라벨 (4.56:1, AA 하한) */
  --line:      #E2E8F5;  /* 테두리 */
  --line-soft: #EDF1F9;
  --blue:      #3A6FFF;  /* 로고 주색 — 큰 수치·테두리·그래픽 전용 */
  --blue-d:    #2144A5;  /* 로고 진한색 — 작은 파란 글씨·링크 (8.62:1) */
  --blue-soft: #EFF3FF;  /* 블루 옅은 면 (로고 블루 8%) */
  --red:       #C62828;  /* 유일한 강조색 (5.62:1) */
  --red-soft:  #FBEAEA;
}
```

색 출처는 로고 파일 `속성 1=logo.svg`(`#3A6FFF` 12곳, `#2144A5` 1곳)다. 사이트 CSS의 `--blue: #2E6CF0`(`app/globals.css`)과는 미세하게 다르니, **문서에는 로고 값을 쓴다.**

⚠️ **`--blue`(#3A6FFF)는 흰 배경에서 4.29:1이라 본문 크기 글자에 쓰면 WCAG AA 미달**이다. 큰 수치(24px 이상 볼드)·테두리·아이콘에만 쓰고, 작은 파란 글씨는 `--blue-d`(#2144A5)를 쓴다. 회색은 전부 블루 쪽으로 살짝 치우친 값이라 무채색 회색을 섞지 않는다.

PDF 생성은 헤드리스 Chrome으로 한다. 프로세스가 종료되지 않고 걸릴 수 있는데, **파일은 이미 생성돼 있으니** 타임아웃 뒤 경로를 확인하면 된다.

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-pdf-header-footer \
  --user-data-dir=<스크래치패드>/chrome-pdf \
  --print-to-pdf=docs/<이름>.pdf \
  "file:///절대경로/docs/<이름>.html"
```

## MCP 연결 (Connected Integrations)
- **Vercel** — 배포/프로젝트 관리
- **Supabase** — DB/백엔드
