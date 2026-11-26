"use client";

import { useEffect, useRef } from "react";

/**
 * 홈 히어로 바탕 — '플루티드 글래스'(세로 골이 진 유리 너머로 번지는 빛, 2026-11-26 시안 A-1안).
 * 시안: _docs/홈페이지 개편/홈히어로_플루티드글래스_시안.html
 *
 * - 빛: 화면 아래에 진하게 깔리고 위쪽까지 옅게 번진다. 높이가 천천히 오르내린다.
 * - 색: 브랜드 블루 #2E6CF0 → 보라 → 남색 → 로고 블루 #3A6FFF로 이어지는 띠가 천천히 옆으로 흐른다(한 바퀴 약 20초).
 * - 유리 골(34px)마다 빛을 좌우 반전·확대해 샘플 → 세로 줄무늬, 골 경계에 어두운 홈·밝은 테.
 * - 제목 뒤(가운데)와 버튼 뒤는 눌러서 글·버튼이 묻히지 않게.
 * - 마운트하면 빛이 3초 동안 차오른다.
 *
 * WebGL 프래그먼트 셰이더 하나로 그린다. 30fps 제한, 히어로가 화면 밖이거나 탭이 숨겨지면 멈춘다.
 * prefers-reduced-motion이면 다 차오른 정지 화면 한 장. WebGL이 없으면 그리지 않는다(.hero-bg 그라데이션이 대체 바탕).
 * 위치·크기는 app/landing.css(.hero-bg #hero-glass).
 */

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 r;uniform float t;uniform float rib;uniform float gr;
// 순환 팔레트(0~1): 브랜드 블루 → 보라 → 남색 → 로고 블루 → (다시 브랜드 블루)
vec3 pal(float h){
  h=fract(h)*4.;
  vec3 c0=vec3(.18,.42,.94),c1=vec3(.50,.26,.97),c2=vec3(.14,.16,.62),c3=vec3(.23,.44,1.);
  float k=smoothstep(0.,1.,fract(h));
  if(h<1.)return mix(c0,c1,k); if(h<2.)return mix(c1,c2,k); if(h<3.)return mix(c2,c3,k); return mix(c3,c0,k);
}
// 빛 세기 — 아래 띠(높이가 gr로 차오르고 숨 쉰다) + 위쪽까지 이어지는 옅은 꼬리
float field(vec2 uv){
  float h=(.48+.06*sin(t*.35+uv.x*.8))*gr;
  float L=exp(-pow(uv.y/max(h,.001),2.))*(.8+.2*sin(uv.x*1.7+t*.25));
  return L+.24*gr*exp(-uv.y/1.1)*(.75+.25*sin(uv.x*1.2-t*.2));
}
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){
  vec2 p=gl_FragCoord.xy; float ax=r.x/r.y;
  float s=floor(p.x/rib), f=fract(p.x/rib);
  float xs=(s+.5)*rib+(f-.5)*rib*-2.2; // 골 안에서 좌우 반전·확대(굴절)
  float L=mix(field(vec2(xs,p.y)/r.y),field(p/r.y),.35);
  float L0=field(p/r.y);
  L*=.72+.28*sin(f*3.14159);              // 골 가운데 볼록
  L*=mix(.45,1.,smoothstep(0.,.07,f));     // 골 경계 어두운 홈
  L+=smoothstep(.9,1.,f)*L0*.35;           // 한쪽 끝 밝은 테
  vec2 q=p/r.y-vec2(ax*.5,.56); q.x*=.55;  // 제목 뒤 어둡게
  L*=mix(.25,1.,smoothstep(.12,.5,length(q)));
  vec2 bq=p/r.y-vec2(ax*.5,.26); bq.x*=.5; // 버튼 뒤 살짝 어둡게
  L*=mix(.55,1.,smoothstep(.05,.2,length(bq)));
  L+=(hash(p)-.5)*.02;                     // 띠 무늬(밴딩) 방지
  float hc=xs/r.x*.85-t*.05;               // 골 단위로 색 — 가로로 흐른다
  vec3 M=pal(hc), T=mix(pal(hc+.08),vec3(.86,.84,1.),.5);
  vec3 c=mix(vec3(.008,.01,.05),M,smoothstep(0.,.55,L));
  c=mix(c,T,smoothstep(.45,.95,L));
  c=mix(c,vec3(1.),smoothstep(.9,1.4,L)*.5);
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
    const uGr = gl.getUniformLocation(prog, "gr");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => {
      c.width = Math.round(c.offsetWidth * dpr);
      c.height = Math.round(c.offsetHeight * dpr);
      gl.viewport(0, 0, c.width, c.height);
      gl.uniform2f(uR, c.width, c.height);
      gl.uniform1f(uRib, 34 * dpr); // 유리 골 폭 34px
    };
    const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    const draw = (ms: number) => {
      const k = reduce ? 1 : Math.min(1, (ms - t0) / 3000); // 빛이 3초 동안 차오른다(ease-out)
      gl.uniform1f(uGr, 1 - Math.pow(1 - k, 3));
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
