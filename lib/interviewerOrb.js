/*!
 * AI 면접관 orb — canvas 2D 버전 (three.js 없음, 의존성 없음)
 *
 * 슈퍼코더 AI 면접 화면의 면접관 입자 구를 그대로 옮겼습니다. 구 모양·입자 수·색·움직임 값은 제품과 같습니다.
 *   원본(SC-Platform, 2026-11-24 기준)
 *   - fe/src/components/ui/3d-visualizer-v2.tsx  구 만들기·입자·회전·흔들림
 *   - fe/src/lib/orb-colors.ts                   팔레트(dark: 어두운 배경, light: 흰 배경)
 *   - fe/src/lib/orb-motion.ts                   움직임(speak · idle · still)
 * 제품은 three.js(WebGL)로 그리고, 이 파일은 같은 계산을 2D 캔버스에 찍습니다. 점이 겹칠 때 섞이는 방식만 근사합니다.
 *
 * 사이트 모듈판(2026-11-25): _docs/홈페이지 개편/AI면접관_orb/orb.js에서 즉시 실행 함수만 풀고 mount를 export 했다(계산·값은 같음).
 *   사이트에서는 components/LiveOrb.tsx가 dynamic import로 불러 이미지 위 오브 자리에 겹쳐 그린다.
 *
 * 사용(원본 스크립트판)
 *   <canvas id="orb"></canvas>
 *   <script src="orb.js"></script>
 *   const orb = InterviewerOrb.mount(document.getElementById('orb'), { size: 320, palette: 'light', mode: 'idle' });
 *   orb.setMode('speak');           // 'speak' 말하는 중 · 'idle' 대기(느린 물결) · 'still' 멈춤
 *   orb.setAmp(0.2);                // speak의 음량(0~1). 함수도 됨: orb.setAmp(() => level). 주지 않으면 말하는 흉내를 냄
 *   orb.destroy();
 *
 * 옵션: size(CSS px, 기본 320) · palette('dark' | 'light', 기본 'light') · mode(기본 'idle') · autoplay(기본 true)
 *       zoom(기본 5/3: 구가 캔버스의 약 85%를 채움, 함께 둔 이미지와 같은 구도. 1이면 제품 화면 구도로 약 50%)
 *       random(노이즈 시드용 함수, 기본 Math.random)
 * 화면 밖에 있으면 그리지 않고, 사용자가 '동작 줄이기'를 켰으면 한 장만 그립니다.
 *
 * 노이즈: simplex-noise 4.0.3의 createNoise3D를 옮김.
 *   Copyright (c) 2024 Jonas Wagner — MIT License
 *   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 *   documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 *   rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 *   persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice
 *   and this permission notice shall be included in all copies or substantial portions of the Software.
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.
 */
const global = typeof window !== 'undefined' ? window : globalThis;

  // ---- simplex-noise 4.0.3 createNoise3D -------------------------------------------------------
  var F3 = 1.0 / 3.0;
  var G3 = 1.0 / 6.0;
  var GRAD3 = [1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1];

  function buildPermutationTable(random) {
    var p = new Uint8Array(512);
    var i;
    for (i = 0; i < 256; i++) p[i] = i;
    for (i = 0; i < 255; i++) {
      var r = i + ~~(random() * (256 - i));
      var aux = p[i];
      p[i] = p[r];
      p[r] = aux;
    }
    for (i = 256; i < 512; i++) p[i] = p[i - 256];
    return p;
  }

  function createNoise3D(random) {
    var perm = buildPermutationTable(random || Math.random);
    var gx = new Float64Array(512), gy = new Float64Array(512), gz = new Float64Array(512);
    for (var n = 0; n < 512; n++) {
      var g = (perm[n] % 12) * 3;
      gx[n] = GRAD3[g]; gy[n] = GRAD3[g + 1]; gz[n] = GRAD3[g + 2];
    }
    return function noise3D(x, y, z) {
      var n0, n1, n2, n3;
      var s = (x + y + z) * F3;
      var i = Math.floor(x + s) | 0, j = Math.floor(y + s) | 0, k = Math.floor(z + s) | 0;
      var t = (i + j + k) * G3;
      var x0 = x - (i - t), y0 = y - (j - t), z0 = z - (k - t);
      var i1, j1, k1, i2, j2, k2;
      if (x0 >= y0) {
        if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
        else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
        else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
      } else {
        if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
        else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
        else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      }
      var x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
      var x2 = x0 - i2 + 2.0 * G3, y2 = y0 - j2 + 2.0 * G3, z2 = z0 - k2 + 2.0 * G3;
      var x3 = x0 - 1.0 + 3.0 * G3, y3 = y0 - 1.0 + 3.0 * G3, z3 = z0 - 1.0 + 3.0 * G3;
      var ii = i & 255, jj = j & 255, kk = k & 255;
      var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
      if (t0 < 0) n0 = 0.0;
      else { var gi0 = ii + perm[jj + perm[kk]]; t0 *= t0; n0 = t0 * t0 * (gx[gi0] * x0 + gy[gi0] * y0 + gz[gi0] * z0); }
      var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
      if (t1 < 0) n1 = 0.0;
      else { var gi1 = ii + i1 + perm[jj + j1 + perm[kk + k1]]; t1 *= t1; n1 = t1 * t1 * (gx[gi1] * x1 + gy[gi1] * y1 + gz[gi1] * z1); }
      var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
      if (t2 < 0) n2 = 0.0;
      else { var gi2 = ii + i2 + perm[jj + j2 + perm[kk + k2]]; t2 *= t2; n2 = t2 * t2 * (gx[gi2] * x2 + gy[gi2] * y2 + gz[gi2] * z2); }
      var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
      if (t3 < 0) n3 = 0.0;
      else { var gi3 = ii + 1 + perm[jj + 1 + perm[kk + 1]]; t3 *= t3; n3 = t3 * t3 * (gx[gi3] * x3 + gy[gi3] * y3 + gz[gi3] * z3); }
      return 32.0 * (n0 + n1 + n2 + n3);
    };
  }

  // ---- 제품 값 (3d-visualizer-v2.tsx · orb-colors.ts · orb-motion.ts) ------------------------------
  var STOPS = {
    dark: [0x001f4a, 0x00004d, 0x66001a, 0x6a0dad], // 어두운 배경: 빛나는 입자(더하기 합성)
    light: [0x1e4bff, 0x3a1cff, 0xe2156b, 0xa03bff], // 흰 배경: 시안 1(2026-11-10), 일반 합성
  };
  var MOTION = {
    speak: { noiseScale: 0.35, ampScale: 0.3, timeScale: 1 },
    idle: { noiseScale: 0.18, ampScale: 0, timeScale: 0.35 },
    still: { noiseScale: 0, ampScale: 0, timeScale: 0 },
  };
  var RADIUS = 2.5;
  var DETAIL = 128;
  var CAMERA_Z = 7;
  var TAN_HALF_FOV = Math.tan((75 / 2) * Math.PI / 180);
  var POINT_SIZE = 0.015;
  var OPACITY = 0.8;

  function vertexStops(y, light) {
    var c = light ? STOPS.light : STOPS.dark;
    var alpha;
    if (light) {
      alpha = (y + RADIUS) / (2 * RADIUS);
      if (alpha < 1 / 3) return [c[0], c[1], alpha * 3];
      if (alpha < 2 / 3) return [c[1], c[2], (alpha - 1 / 3) * 3];
      return [c[2], c[3], Math.min(1, (alpha - 2 / 3) * 3)];
    }
    alpha = (y + RADIUS) / (1.5 * RADIUS);
    if (alpha < 0.85) return [c[0], c[1], alpha / 0.85];
    if (alpha < 0.99) return [c[1], c[2], (alpha - 0.85) / 0.5];
    return [c[2], c[3], (alpha - 0.99) / 0.5];
  }

  // three.js는 색을 선형 공간에서 섞고 화면에는 sRGB로 냅니다. 같은 순서로 계산합니다.
  function toLinear(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function toSRGB(c) { return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; }
  function hexLinear(h) { return [toLinear(((h >> 16) & 255) / 255), toLinear(((h >> 8) & 255) / 255), toLinear((h & 255) / 255)]; }

  // THREE.SphereGeometry(2.5, 128, 128, 0, 2π·2.5/0.5, 0, 2π)의 꼭짓점과, 인덱스에서 각 꼭짓점이 몇 번 찍히는지.
  // THREE.Points는 인덱스 순서대로 점을 찍으므로 안쪽 꼭짓점은 같은 자리에 여러 번 찍힙니다.
  function buildSphere() {
    var row = DETAIL + 1;
    var count = row * row;
    var pos = new Float32Array(count * 3);
    var mult = new Uint8Array(count);
    var phiLength = Math.PI * 2 * RADIUS / 0.5;
    var thetaLength = Math.PI * 2;
    var iy, ix, i = 0;
    for (iy = 0; iy <= DETAIL; iy++) {
      var v = iy / DETAIL;
      for (ix = 0; ix <= DETAIL; ix++) {
        var u = ix / DETAIL;
        pos[i++] = -RADIUS * Math.cos(u * phiLength) * Math.sin(v * thetaLength);
        pos[i++] = RADIUS * Math.cos(v * thetaLength);
        pos[i++] = RADIUS * Math.sin(u * phiLength) * Math.sin(v * thetaLength);
      }
    }
    for (iy = 0; iy < DETAIL; iy++) {
      for (ix = 0; ix < DETAIL; ix++) {
        var a = iy * row + ix + 1, b = iy * row + ix, c = (iy + 1) * row + ix, d = (iy + 1) * row + ix + 1;
        if (iy !== 0) { mult[a]++; mult[b]++; mult[d]++; }
        if (iy !== DETAIL - 1) { mult[b]++; mult[c]++; mult[d]++; }
      }
    }
    return { pos: pos, mult: mult, count: count };
  }

  function buildStyles(sphere, light) {
    var styles = new Array(sphere.count);
    for (var i = 0; i < sphere.count; i++) {
      var s = vertexStops(sphere.pos[i * 3 + 1], light);
      var from = hexLinear(s[0]), to = hexLinear(s[1]), t = s[2];
      var r = toSRGB(from[0] + (to[0] - from[0]) * t) * 255;
      var g = toSRGB(from[1] + (to[1] - from[1]) * t) * 255;
      var b = toSRGB(from[2] + (to[2] - from[2]) * t) * 255;
      var k = sphere.mult[i];
      if (light) {
        // 일반 합성: 불투명도 0.8로 k번 겹쳐 찍은 것 = 한 번에 1 - 0.2^k
        styles[i] = 'rgba(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ',' + (1 - Math.pow(1 - OPACITY, k)).toFixed(3) + ')';
      } else {
        // 더하기 합성: 0.8씩 k번 더한 밝기를 한 번에 더함
        var m = OPACITY * k;
        styles[i] = 'rgb(' + Math.min(255, Math.round(r * m)) + ',' + Math.min(255, Math.round(g * m)) + ',' + Math.min(255, Math.round(b * m)) + ')';
      }
    }
    return styles;
  }

  // 홈페이지 데모용: 소리가 없을 때 말하는 흉내(초당 약 4음절, 두 구절 사이에 쉼)
  function demoSpeechAmp(sec) {
    var x = sec % 4.2;
    var syll = 0.55 + 0.45 * Math.abs(Math.sin(Math.PI * 4.2 * x));
    function ramp(a, b, v) { return Math.min(1, Math.max(0, (v - a) / (b - a))); }
    var phrase = Math.max(
      Math.min(ramp(0.15, 0.45, x), 1 - ramp(1.55, 1.85, x)),
      Math.min(ramp(2.15, 2.45, x), 1 - ramp(3.55, 3.85, x))
    );
    return 0.03 + 0.2 * syll * phrase;
  }

  function mount(canvas, options) {
    var opts = options || {};
    var size = opts.size || 320;
    var palette = opts.palette === 'dark' ? 'dark' : 'light';
    var mode = MOTION[opts.mode] ? opts.mode : 'idle';
    var autoplay = opts.autoplay !== false;
    // 카메라는 제품 그대로 두고, 더 큰 캔버스에 그린 뒤 가운데만 보여 주는 것과 같게 확대합니다(모양은 그대로).
    var zoom = opts.zoom > 0 ? opts.zoom : 5 / 3;
    var noise3D = createNoise3D(opts.random || Math.random);
    var sphere = buildSphere();
    var styles = buildStyles(sphere, palette === 'light');
    var amp = null;
    var ctx = canvas.getContext('2d');
    var dpr = 1, W = 0, H = 0;
    var rotX = 0, rotY = 0;
    var start = 0, raf = 0, visible = true, destroyed = false;
    var reduce = typeof global.matchMedia === 'function' && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      dpr = Math.max(1, Math.min(3, global.devicePixelRatio || 1));
      W = H = Math.round(size * dpr);
      canvas.width = W;
      canvas.height = H;
      canvas.style.width = size + 'px';
      canvas.style.height = size + 'px';
    }

    function currentAmp(sec) {
      if (mode !== 'speak') return 0;
      if (typeof amp === 'function') return Math.max(0, Math.min(1, +amp() || 0));
      if (typeof amp === 'number') return Math.max(0, Math.min(1, amp));
      return demoSpeechAmp(sec);
    }

    // t: 노이즈 시간(제품의 elapsed × timeScale) · a: 음량 · 회전은 rotX/rotY
    function draw(t, a) {
      var m = MOTION[mode];
      var pos = sphere.pos, mult = sphere.mult;
      var cy = Math.cos(rotY), sy = Math.sin(rotY), cx = Math.cos(rotX), sx = Math.sin(rotX);
      var half = H / 2, scale = half * zoom, sizeScale = POINT_SIZE * scale;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = palette === 'dark' ? 'lighter' : 'source-over';
      for (var i = 0, p = 0; i < sphere.count; i++, p += 3) {
        if (mult[i] === 0) continue;
        var x = pos[p], y = pos[p + 1], z = pos[p + 2];
        if (m.noiseScale !== 0 || a !== 0) {
          var len = Math.sqrt(x * x + y * y + z * z) || 1;
          var d = (noise3D(x + t, y + t, z + t) * m.noiseScale + a * m.ampScale) * 0.5;
          x += (x / len) * d; y += (y / len) * d; z += (z / len) * d;
        }
        // three.js Euler 'XYZ': Y로 돌린 뒤 X로 돌림
        var x1 = x * cy + z * sy;
        var z1 = -x * sy + z * cy;
        var y2 = y * cx - z1 * sx;
        var z2 = y * sx + z1 * cx;
        var depth = CAMERA_Z - z2;
        if (depth <= 0.2) continue;
        var sxp = half + (x1 / (depth * TAN_HALF_FOV)) * scale;
        var syp = half - (y2 / (depth * TAN_HALF_FOV)) * scale;
        var ps = Math.max(1, sizeScale / depth);
        ctx.fillStyle = styles[i];
        if (ps < 3) {
          ctx.fillRect(sxp - ps / 2, syp - ps / 2, ps, ps);
        } else {
          ctx.beginPath();
          ctx.arc(sxp, syp, ps / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    function frame(now) {
      if (destroyed) return;
      raf = global.requestAnimationFrame(frame);
      if (!visible) return;
      if (!start) start = now;
      var sec = (now - start) / 1000;
      draw(sec * MOTION[mode].timeScale, currentAmp(sec));
      rotY += 0.0005;
      rotX += 0.0002;
    }

    function play() {
      if (raf || destroyed) return;
      if (reduce || !autoplay) { draw(0, 0); return; }
      raf = global.requestAnimationFrame(frame);
    }

    resize();
    var io = null;
    if (typeof global.IntersectionObserver === 'function') {
      io = new global.IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; });
      io.observe(canvas);
    }
    play();

    return {
      setMode: function (next) { if (MOTION[next]) { mode = next; if (reduce || !autoplay) draw(0, 0); } },
      setAmp: function (value) { amp = value; },
      setPalette: function (next) {
        palette = next === 'dark' ? 'dark' : 'light';
        styles = buildStyles(sphere, palette === 'light');
        if (reduce || !autoplay) draw(0, 0);
      },
      /** 한 장 그리기(이미지 뽑기·테스트용). frames: 회전에 쓸 프레임 수(제품은 프레임마다 Y 0.0005, X 0.0002 회전) */
      drawAt: function (t, a, frames) {
        rotY = (frames || 0) * 0.0005;
        rotX = (frames || 0) * 0.0002;
        draw(t || 0, a || 0);
      },
      destroy: function () {
        destroyed = true;
        if (raf) global.cancelAnimationFrame(raf);
        if (io) io.disconnect();
      },
    };
  }

  // 모듈판: 전역(window.InterviewerOrb) 대신 export


export { mount };
