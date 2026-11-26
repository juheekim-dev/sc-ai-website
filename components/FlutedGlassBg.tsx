"use client";

import { useEffect, useRef } from "react";

/**
 * 홈 히어로 바탕 — '플루티드 글래스'(세로 골이 진 유리 너머의 빛).
 * 11/26 마지막 결정: 브랜드 배경 이미지(SNS 대문 — 프리픽 이미지 '배경만_링크드인 대문'·'[최종] 페이스북 대문')와 같은 모양으로.
 * 이미지를 그대로 깔면 히어로 비율에 맞춰 늘어나고 멈춰 있어서, 같은 색·골을 셰이더로 다시 그렸다(문구·로고는 넣지 않는다).
 *
 * - 색(이미지에서 뽑은 값): 왼쪽 밝은 블루 #3E73FC(위) → #4EA2FF(아래), 오른쪽 남색 #2546A0 계열(아래로 조금 밝게).
 *   가운데쯤에서 넘어가고, 그 경계가 천천히 좌우로 흔들린다. 옅은 빛이 가로로 천천히 지나간다.
 * - 유리 골(52px — 이미지의 골 폭을 히어로 너비로 환산)마다 바탕을 좌우 반전·확대해 샘플 → 경계에서 골마다 색이 엇갈리는 계단 무늬,
 *   골 가운데는 살짝 밝고 경계에는 가는 홈.
 * - 처음부터 다 그려진 상태로 계속 움직인다(차오르는 등장 모션 없음).
 * 이전 안(블루·보라·남색이 흐르는 아래쪽 빛, 시안 A-1)은 git e64339c·bb9fbfe, 시안은 _docs/홈페이지 개편/홈히어로_플루티드글래스_시안.html.
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
// 바탕 색 — x·y는 0~1(y는 아래가 0). 왼쪽 밝은 블루, 오른쪽 남색, 경계가 천천히 흔들린다
vec3 base(float x,float y){
  vec3 L=mix(vec3(.306,.635,1.),vec3(.243,.451,.988),y);   // #4EA2FF → #3E73FC
  vec3 R=mix(vec3(.176,.318,.682),vec3(.145,.275,.616),y);  // #2D51AE → #25469D
  float e=.5+.05*sin(t*.35)+.02*sin(t*.9+y*3.);
  vec3 c=mix(L,R,smoothstep(e-.035,e+.035,x));
  // 옅은 빛이 가로로 천천히 지나간다
  float sweep=exp(-pow((x-fract(t*.045)*1.6+.3)/.18,2.));
  return c+sweep*vec3(.05,.07,.1);
}
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){
  vec2 p=gl_FragCoord.xy;
  float s=floor(p.x/rib), f=fract(p.x/rib);
  float xs=(s+.5)*rib+(f-.5)*rib*-1.6;     // 골 안에서 좌우 반전·확대(굴절)
  float y=p.y/r.y;
  vec3 c=mix(base(xs/r.x,y),base(p.x/r.x,y),.3);
  c*=.95+.07*sin(f*3.14159);               // 골 가운데 살짝 밝게
  c*=mix(.9,1.,smoothstep(0.,.05,f));      // 골 경계 가는 홈
  c+=smoothstep(.93,1.,f)*.025;            // 한쪽 끝 옅은 테
  c+=(hash(p)-.5)*.012;                    // 띠 무늬(밴딩) 방지
  gl_FragColor=vec4(c,1.);
}`;

export default function FlutedGlassBg({ canvasId }: { canvasId: string }) {
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

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => {
      c.width = Math.round(c.offsetWidth * dpr);
      c.height = Math.round(c.offsetHeight * dpr);
      gl.viewport(0, 0, c.width, c.height);
      gl.uniform2f(uR, c.width, c.height);
      gl.uniform1f(uRib, 52 * dpr); // 유리 골 폭 52px
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
  }, []);

  return <canvas ref={ref} id={canvasId} aria-hidden="true" />;
}
