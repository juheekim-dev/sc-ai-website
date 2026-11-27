"use client";

import { useEffect, useRef } from "react";

/**
 * 홈 히어로 바탕 — '플루티드 글래스'(세로 골이 진 유리 너머의 빛).
 * 11/26 마지막 결정: 브랜드 배경 이미지(SNS 대문 — 프리픽 이미지 '배경만_링크드인 대문'·'[최종] 페이스북 대문')와 같은 모양으로.
 * 이미지를 그대로 깔면 히어로 비율에 맞춰 늘어나고 멈춰 있어서, 같은 색·골을 셰이더로 다시 그렸다(문구·로고는 넣지 않는다).
 *
 * - 색: 브랜드 키컬러(로고 속성 1=logo.svg) — 왼쪽 #3A6FFF, 오른쪽 #2144A5(아래로 갈수록 아주 조금 밝게). 가운데쯤에서 넘어간다.
 *   (처음엔 이미지에서 뽑은 하늘빛 #4EA2FF 계열이었고, "톤을 죽여줘"로 채도를 뺐다가 11/26 "브랜드 키컬러값이 들어가야" → 키컬러 그대로)
 * - 물결: 경계선이 세로로 물결치며 흐르고, 골 안 굴절이 위아래로 일렁이고, 밝기 물결이 사선으로 지나간다(키컬러를 중심으로 ±).
 * - 유리 골(52px — 이미지의 골 폭을 히어로 너비로 환산)마다 바탕을 좌우 반전·확대해 샘플 → 경계에서 골마다 색이 엇갈리는 계단 무늬,
 *   골 가운데는 살짝 밝고 경계에는 가는 홈.
 * - 처음부터 다 그려진 상태로 계속 움직인다(차오르는 등장 모션 없음).
 * 이전 안(블루·보라·남색이 흐르는 아래쪽 빛, 시안 A-1)은 git e64339c·bb9fbfe, 시안은 _docs/홈페이지 개편/홈히어로_플루티드글래스_시안.html.
 *
 * palette로 색을 바꿔 끼운다 — "brand"(기본, 홈 히어로·마지막 CTA) / "assessment"(AI 역량검사 응시 화면 색 — 출시 팝업 LaunchPopup, 11/26).
 *   assessment: 응시 화면(public/hero-assessment-base.webp, 주 배경 #181818)보다 한 단계 어두운 차콜 #1A1A1A(왼쪽) → #0C0C0C(오른쪽).
 *   처음엔 화면 속 선택 표시 블루 빛을 물결 따라 흘렸으나 11/26 뺐다. 물결·골 모양은 두 팔레트가 같다.
 *
 * WebGL 프래그먼트 셰이더 하나로 그린다. 30fps 제한, 히어로가 화면 밖이거나 탭이 숨겨지면 멈춘다.
 * prefers-reduced-motion이면 정지 화면 한 장. WebGL이 없으면 그리지 않는다(.hero-bg 그라데이션이 대체 바탕).
 * 위치·크기는 app/landing.css(.hero-bg #hero-glass).
 */

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 r;uniform float t;uniform float rib;
// 팔레트 — 왼쪽 아래·위(cL0·cL1), 오른쪽 아래·위(cR0·cR1), 물결 따라 흐르는 빛(cA, 세기 ka)
uniform vec3 cL0;uniform vec3 cL1;uniform vec3 cR0;uniform vec3 cR1;uniform vec3 cA;uniform float ka;
// 바탕 색 — x·y는 0~1(y는 아래가 0). 왼쪽·오른쪽 두 면, 경계가 물결친다
vec3 base(float x,float y){
  vec3 L=mix(cL0,cL1,y), R=mix(cR0,cR1,y);
  // 경계선이 세로로 물결치며 흐른다(두 겹 사인)
  float e=.5+.05*sin(t*.35)+.045*sin(y*4.2+t*.9)+.02*sin(y*9.-t*1.4);
  vec3 c=mix(L,R,smoothstep(e-.04,e+.04,x));
  // 물결 따라 흐르는 빛(assessment 팔레트) — 경계 근처를 따라 위아래로 일렁인다
  c+=cA*ka*exp(-pow((x-e+.12)/.22,2.))*(.6+.4*sin(y*5.+t*.8));
  // 밝기 물결이 사선으로 천천히 지나간다
  c*=1.+.07*sin(x*7.-y*2.5-t*1.1)+.04*sin(x*13.+y*4.+t*.7);
  return c;
}
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){
  vec2 p=gl_FragCoord.xy;
  float s=floor(p.x/rib), f=fract(p.x/rib);
  float y=p.y/r.y;
  // 골 안에서 좌우 반전·확대(굴절) — 굴절 중심이 위아래로 일렁여 유리가 물결치는 듯
  float xs=(s+.5)*rib+(f-.5)*rib*-1.6+sin(y*7.+t*1.2+s*.6)*rib*.22;
  vec3 c=mix(base(xs/r.x,y),base(p.x/r.x,y),.3);
  c*=.95+.07*sin(f*3.14159);               // 골 가운데 살짝 밝게
  c*=mix(.9,1.,smoothstep(0.,.05,f));      // 골 경계 가는 홈
  c+=smoothstep(.93,1.,f)*.025;            // 한쪽 끝 옅은 테
  c+=(hash(p)-.5)*.012;                    // 띠 무늬(밴딩) 방지
  gl_FragColor=vec4(c,1.);
}`;

const hex = (h: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];

// [왼쪽 아래, 왼쪽 위, 오른쪽 아래, 오른쪽 위, 흐르는 빛, 빛 세기]
const PALETTES = {
  // 브랜드 키컬러(로고) — 왼쪽 #3A6FFF, 오른쪽 #2144A5. 아래로 갈수록 아주 조금 밝게
  brand: { c: ["#4A80FF", "#3A6FFF", "#274DB0", "#2144A5", "#000000"], ka: 0 },
  // AI 역량검사 응시 화면 — 차콜. 11/26 "청록색 안 들어가도 되니 좀 더 어둡게" → 흐르는 빛(선택 표시 블루) 끄고 한 단계 어둡게
  assessment: { c: ["#1A1A1A", "#151515", "#0F0F0F", "#0C0C0C", "#000000"], ka: 0 },
} as const;

export default function FlutedGlassBg({ canvasId, palette = "brand", rib = 52 }: { canvasId: string; palette?: keyof typeof PALETTES; rib?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const gl = c.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "r");
    const uT = gl.getUniformLocation(prog, "t");
    const uRib = gl.getUniformLocation(prog, "rib");
    const P = PALETTES[palette];
    (["cL0", "cL1", "cR0", "cR1", "cA"] as const).forEach((n, i) => gl.uniform3f(gl.getUniformLocation(prog, n), ...hex(P.c[i])));
    gl.uniform1f(gl.getUniformLocation(prog, "ka"), P.ka);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => {
      c.width = Math.round(c.offsetWidth * dpr);
      c.height = Math.round(c.offsetHeight * dpr);
      gl.viewport(0, 0, c.width, c.height);
      gl.uniform2f(uR, c.width, c.height);
      gl.uniform1f(uRib, rib * dpr); // 유리 골 폭(기본 52px)
    };
    const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    const draw = (ms: number) => {
      gl.uniform1f(uT, 6 + (reduce ? 0 : (ms - t0) / 1000));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    size();
    if (reduce) {
      draw(t0);
      const onResize = () => { size(); draw(t0); };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    let raf = 0, last = 0, visible = true;
    const loop = (ms: number) => {
      raf = requestAnimationFrame(loop);
      if (ms - last < 33) return; // 30fps
      last = ms;
      draw(ms);
    };
    const start = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); });
    io.observe(c);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const onResize = () => { size(); draw(performance.now()); };
    window.addEventListener("resize", onResize);
    draw(t0);
    start();

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
    };
  }, [palette, rib]);

  return <canvas ref={ref} id={canvasId} aria-hidden="true" />;
}
