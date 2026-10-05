// KOVA — visor 3D de frascos (Duppé, Eternals, Compound One). Se carga solo cuando se abre el panel 3D.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const SPECS = {
  duppe: { shape: 'box', w: 1.3, d: 1.0, rc: 0.22, h: 1.6, cap: { r: 0.46, h: 0.8, rings: 3 }, neck: 0.1, liquid: '#e2b56a',
    label: { kind: 'mono', name: 'DUPPÉ', lines: ['eau de parfum', 'Natural Spray / Vaporisateur'], foot: 'KOVA' } },
  eternals: { shape: 'round', r: 0.68, h: 1.55, cap: { r: 0.46, h: 0.62, matte: true }, neck: 0.1, liquid: '#b8743a',
    label: { kind: 'serif', name: 'ETERNAL', lines: ['perfume oil'], foot: 'KOVA ESSENTIALS' } },
  compoundone: { shape: 'round', r: 0.72, h: 1.45, cap: { r: 0.44, h: 0.86, ribs: 4 }, neck: 0.1, collar: true, liquid: '#e3edf1',
    label: { kind: 'serif', name: 'Compound One.', lines: ['eau de parfum'], foot: 'KOVA ESSENTIALS' } },
};

/* ---------- geometrías ---------- */
function latheProfile(r, h, cb, ct, seg = 64) {
  const p = [new THREE.Vector2(0, 0)];
  for (let i = 0; i <= 8; i++) { const a = (i / 8) * Math.PI / 2; p.push(new THREE.Vector2(r - cb + Math.sin(a) * cb, cb - Math.cos(a) * cb)); }
  for (let i = 0; i <= 8; i++) { const a = (i / 8) * Math.PI / 2; p.push(new THREE.Vector2(r - ct + Math.cos(a) * ct, h - ct + Math.sin(a) * ct)); }
  p.push(new THREE.Vector2(0, h));
  return new THREE.LatheGeometry(p, seg);
}
function roundedRect(w, d, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -d / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
function slab(w, d, r, h, b) {
  const g = new THREE.ExtrudeGeometry(roundedRect(w - 2 * b, d - 2 * b, Math.max(0.02, r - b)),
    { depth: h - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 4, curveSegments: 10 });
  g.rotateX(-Math.PI / 2); g.translate(0, b, 0); return g; // y: 0..h
}

/* ---------- etiqueta ---------- */
function labelCanvas(L, w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d');
  x.fillStyle = '#f6f4ef'; x.fillRect(0, 0, w, h);
  x.strokeStyle = '#111'; x.lineWidth = Math.max(2, w * 0.004); x.strokeRect(w * 0.03, h * 0.04, w * 0.94, h * 0.92);
  if (L.kind === 'mono') {
    x.fillStyle = '#111'; x.textBaseline = 'top'; x.textAlign = 'left';
    x.font = `800 ${h * 0.2}px Montserrat, Arial, sans-serif`; x.fillText(L.name, w * 0.07, h * 0.1);
    x.font = `${h * 0.062}px ui-monospace, Menlo, monospace`;
    L.lines.forEach((t, i) => x.fillText(t, w * 0.07, h * 0.36 + i * h * 0.09));
    x.beginPath(); x.moveTo(w * 0.03, h * 0.7); x.lineTo(w * 0.97, h * 0.7); x.stroke();
    x.textAlign = 'right'; x.font = `800 ${h * 0.11}px Montserrat, Arial, sans-serif`; x.fillText(L.foot, w * 0.93, h * 0.78);
  } else {
    x.fillStyle = '#111'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = `500 ${h * 0.15}px 'Playfair Display', Georgia, serif`; x.fillText(L.name, w / 2, h * 0.38);
    x.fillStyle = '#9e7724'; x.fillRect(w * 0.42, h * 0.52, w * 0.16, Math.max(2, h * 0.008));
    x.fillStyle = '#333'; x.font = `${h * 0.06}px Montserrat, Arial, sans-serif`;
    L.lines.forEach((t, i) => x.fillText(t, w / 2, h * 0.63 + i * h * 0.08));
    x.fillStyle = '#9e7724'; x.font = `500 ${h * 0.045}px Montserrat, Arial, sans-serif`; x.fillText(L.foot, w / 2, h * 0.86);
  }
  return c;
}
function labelTexture(L, aspect) {
  const t = new THREE.CanvasTexture(labelCanvas(L, 1024, Math.round(1024 / aspect)));
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

/* ---------- tapa ---------- */
function makeCap(c, capM, chromeM) {
  const g = new THREE.Group();
  if (c.ribs) {
    const n = c.ribs, gap = 0.04, seg = (c.h - gap * (n - 1)) / n; let y = 0;
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(latheProfile(c.r, seg, 0.03, 0.03, 48), capM); m.position.y = y; g.add(m); y += seg;
      if (i < n - 1) { const r = new THREE.Mesh(new THREE.CylinderGeometry(c.r * 0.9, c.r * 0.9, gap + 0.01, 48), chromeM); r.position.y = y + gap / 2; g.add(r); y += gap; }
    }
  } else {
    g.add(new THREE.Mesh(latheProfile(c.r, c.h, 0.04, 0.06, 48), capM));
    for (let i = 1; i <= (c.rings || 0); i++) {
      const r = new THREE.Mesh(new THREE.CylinderGeometry(c.r + 0.008, c.r + 0.008, 0.022, 48), chromeM); r.position.y = c.h * (0.2 + i * 0.2); g.add(r);
    }
  }
  return g;
}

/* ---------- frasco completo ---------- */
function buildBottle(key) {
  const S = SPECS[key], g = new THREE.Group();
  const glassM = new THREE.MeshPhysicalMaterial({ color: 0xeaf2f4, roughness: 0.03, metalness: 0, transparent: true, opacity: 0.3, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.7, depthWrite: false });
  const liqM = new THREE.MeshPhysicalMaterial({ color: S.liquid, roughness: 0.1, metalness: 0, transparent: true, opacity: 0.93, clearcoat: 0.7, envMapIntensity: 1.1 });
  const capM = new THREE.MeshPhysicalMaterial({ color: 0x0b0b0b, metalness: S.cap.matte ? 0.15 : 0.6, roughness: S.cap.matte ? 0.6 : 0.26, clearcoat: S.cap.matte ? 0 : 0.9, clearcoatRoughness: 0.12, envMapIntensity: 1.3 });
  const chromeM = new THREE.MeshStandardMaterial({ color: 0xd5d5d8, metalness: 1, roughness: 0.16, envMapIntensity: 1.5 });

  let body, liquid, label;
  if (S.shape === 'box') {
    body = new THREE.Mesh(slab(S.w, S.d, S.rc, S.h, 0.05), glassM);
    liquid = new THREE.Mesh(slab(S.w - 0.36, S.d - 0.36, S.rc * 0.6, S.h * 0.74, 0.04), liqM); liquid.position.y = 0.2;
    const lw = S.w * 0.82, lh = S.h * 0.62;
    label = new THREE.Mesh(new THREE.PlaneGeometry(lw, lh), new THREE.MeshStandardMaterial({ map: labelTexture(S.label, lw / lh), roughness: 0.55 }));
    label.position.set(0, S.h * 0.46, S.d / 2 + 0.012);
  } else {
    body = new THREE.Mesh(latheProfile(S.r, S.h, 0.16, 0.1), glassM);
    liquid = new THREE.Mesh(latheProfile(S.r - 0.1, S.h * 0.76, 0.1, 0.06), liqM); liquid.position.y = 0.17;
    const th = 1.5, lh = S.h * 0.6, arc = S.r * th;
    label = new THREE.Mesh(new THREE.CylinderGeometry(S.r + 0.012, S.r + 0.012, lh, 64, 1, true, -th / 2, th),
      new THREE.MeshStandardMaterial({ map: labelTexture(S.label, arc / lh), roughness: 0.55 }));
    label.position.y = S.h * 0.45;
  }
  liquid.renderOrder = 1; body.renderOrder = 2;
  g.add(liquid, body, label);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(S.cap.r * 0.7, S.cap.r * 0.7, S.neck + 0.04, 40), glassM);
  neck.position.y = S.h + S.neck / 2 - 0.02; neck.renderOrder = 2; g.add(neck);
  if (S.collar) { const c = new THREE.Mesh(new THREE.CylinderGeometry(S.cap.r * 1.04, S.cap.r * 1.04, 0.1, 48), chromeM); c.position.y = S.h + 0.03; g.add(c); }
  const cap = makeCap(S.cap, capM, chromeM); cap.position.y = S.h + S.neck - 0.02; g.add(cap);

  const total = S.h + S.neck + S.cap.h;
  g.position.y = -total / 2;
  return { grp: g, total, liqM };
}

/* ---------- entorno (reflejos tipo estudio) ---------- */
function makeEnv(renderer) {
  const sc = new THREE.Scene();
  sc.add(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.MeshBasicMaterial({ color: 0x1a1409, side: THREE.BackSide })));
  const panel = (w, h, x, y, z, i) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(i, i, i * 0.93), side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.lookAt(0, 0, 0); sc.add(m);
  };
  panel(6, 4, -5, 3, 4, 6); panel(2, 6, 6, 1, -2, 4); panel(8, 1.5, 0, 7, 0, 3); panel(5, 3, 3, 1, 6, 2); panel(1.5, 6, -7, 0, -2, 2.5);
  const pm = new THREE.PMREMGenerator(renderer);
  const tex = pm.fromScene(sc, 0.03).texture; pm.dispose();
  return tex;
}

function disposeObj(o) {
  o.traverse(n => {
    if (n.geometry) n.geometry.dispose();
    const m = n.material; if (!m) return;
    (Array.isArray(m) ? m : [m]).forEach(x => { if (x.map) x.map.dispose(); x.dispose(); });
  });
}

/* ---------- visor ---------- */
export async function createViewer(host) {
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  const cv = renderer.domElement; cv.style.cssText = 'width:100%;height:100%;display:block;touch-action:none;cursor:grab';
  host.appendChild(cv);

  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  scene.environment = makeEnv(renderer);
  const keyL = new THREE.DirectionalLight(0xfff0d8, 1.4); keyL.position.set(3, 5, 5); scene.add(keyL);
  const pivot = new THREE.Group(); scene.add(pivot);

  const sc = document.createElement('canvas'); sc.width = sc.height = 256;
  const sx = sc.getContext('2d'), gr = sx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); sx.fillStyle = gr; sx.fillRect(0, 0, 256, 256);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; scene.add(shadow);

  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cur = null, rotY = 0.5, rotX = 0.06, vel = 0, drag = false, lx = 0, ly = 0, lt = 0, running = false, raf = 0, last = 0, spawn = 0;

  function size() {
    const w = host.clientWidth || 300, h = host.clientHeight || 400;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    const d = Math.max(8.4, 3.1 / (2 * Math.tan(camera.fov * Math.PI / 360) * camera.aspect));
    camera.position.set(0, 0.35, d); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();
  }
  if (window.ResizeObserver) new ResizeObserver(size).observe(host);
  size();

  function show(key) {
    if (cur) { pivot.remove(cur.grp); disposeObj(cur.grp); }
    cur = buildBottle(key); pivot.add(cur.grp);
    shadow.position.y = -cur.total / 2 - 0.002; spawn = performance.now();
  }
  function setLiquid(hex) { if (cur) cur.liqM.color.set(hex); }

  function loop(t) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t;
    if (!drag) { vel += ((reduce ? 0 : 0.45) - vel) * Math.min(1, dt * 1.6); rotY += vel * dt; rotX += (0.06 - rotX) * Math.min(1, dt * 2); }
    pivot.rotation.set(rotX, rotY, 0);
    const s = Math.min(1, (performance.now() - spawn) / 450), e = 1 - Math.pow(1 - s, 3);
    pivot.scale.setScalar(0.88 + 0.12 * e);
    renderer.render(scene, camera);
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  cv.addEventListener('pointerdown', e => { drag = true; cv.setPointerCapture(e.pointerId); lx = e.clientX; ly = e.clientY; lt = e.timeStamp; cv.style.cursor = 'grabbing'; });
  cv.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - lx, dtm = Math.max(8, e.timeStamp - lt) / 1000;
    rotY += dx * 0.011; vel = clamp((dx * 0.011) / dtm, -8, 8); rotX = clamp(rotX + (e.clientY - ly) * 0.004, -0.35, 0.5);
    lx = e.clientX; ly = e.clientY; lt = e.timeStamp;
  });
  const up = () => { drag = false; cv.style.cursor = 'grab'; };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);

  return {
    show, setLiquid, resize: size,
    start() { if (running) return; running = true; last = performance.now(); size(); raf = requestAnimationFrame(loop); },
    stop() { running = false; cancelAnimationFrame(raf); },
    dispose() { running = false; cancelAnimationFrame(raf); if (cur) disposeObj(cur.grp); renderer.dispose(); cv.remove(); },
  };
}
