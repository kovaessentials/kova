// KOVA — visor 3D de frascos (Duppé, Eternals, Compound One). Se carga solo cuando se abre el panel 3D.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// Medidas y etiquetas tomadas de las fotos de cada colección. Todos los frascos son cilíndricos.
const SPECS = {
  duppe: { r: 0.7, h: 2.5, cb: 0.12, ct: 0.14, base: 0.24, fill: 0.93, cap: { r: 0.45, h: 0.9, ribs: 4, gap: 0.035 }, neck: 0.08, liquid: '#c9a46b',
    label: { kind: 'duppe', theta: 2.6, hf: 0.72, yf: 0.43, name: ['LEATHER LATE', 'THAN NEVER'] } },
  eternals: { r: 0.8, h: 2.05, cb: 0.18, ct: 0.2, base: 0.34, fill: 0.88, cap: { r: 0.38, h: 0.95, matte: true }, neck: 0.1, liquid: '#d6a823',
    label: { kind: 'eternal', theta: 2.1, hf: 0.62, yf: 0.5, name: ['CIGARS &', 'ICECREAM'] } },
  compoundone: { r: 0.75, h: 1.95, cb: 0.16, ct: 0.12, base: 0.32, fill: 0.88, cap: { r: 0.46, h: 1.0, ribs: 5, gap: 0.04 }, neck: 0.06, collar: true, liquid: '#e3edf1',
    label: { kind: 'compound', theta: 2.2, hf: 0.5, yf: 0.5, name: ['Midnight Heel'] } },
};
const MONO = "ui-monospace, Menlo, 'Courier New', monospace", SANS = "Montserrat, Arial, sans-serif", SERIF = "'Playfair Display', Georgia, serif";

/* ---------- geometría ---------- */
function latheProfile(r, h, cb, ct, seg = 72) {
  const p = [new THREE.Vector2(0, 0)];
  for (let i = 0; i <= 8; i++) { const a = (i / 8) * Math.PI / 2; p.push(new THREE.Vector2(r - cb + Math.sin(a) * cb, cb - Math.cos(a) * cb)); }
  for (let i = 0; i <= 8; i++) { const a = (i / 8) * Math.PI / 2; p.push(new THREE.Vector2(r - ct + Math.cos(a) * ct, h - ct + Math.sin(a) * ct)); }
  p.push(new THREE.Vector2(0, h));
  return new THREE.LatheGeometry(p, seg);
}

/* ---------- etiquetas (textos según las fotos) ---------- */
function spaced(x, t, cx, y, sp) {
  const w = [...t].reduce((s, c) => s + x.measureText(c).width + sp, -sp); let px = cx - w / 2;
  [...t].forEach(c => { x.fillText(c, px, y); px += x.measureText(c).width + sp; });
}
function drawTree(x, cx, cy, s) {
  x.strokeStyle = '#111'; x.lineCap = 'round';
  const br = (x0, y0, a, len, d, dir) => {
    if (d === 0) return; const x1 = x0 + Math.cos(a) * len, y1 = y0 - dir * Math.sin(a) * len;
    x.lineWidth = Math.max(1.2, s * 0.016 * d / 3); x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke();
    br(x1, y1, a + 0.5, len * 0.72, d - 1, dir); br(x1, y1, a - 0.5, len * 0.72, d - 1, dir);
  };
  br(cx, cy, Math.PI / 2, s * 0.34, 6, 1);          // copa
  br(cx, cy + s * 0.02, Math.PI / 2, s * 0.2, 4, -1); // raíces
}
function labelCanvas(L, w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
  x.textBaseline = 'alphabetic'; x.fillStyle = '#111'; x.strokeStyle = '#111';
  if (L.kind === 'duppe') {
    x.fillStyle = '#f7f6f2'; x.fillRect(0, 0, w, h); x.fillStyle = '#111';
    x.save(); x.scale(0.8, 1); x.font = `800 ${h * 0.118}px ${SANS}`;
    x.fillText(L.name[0], (w * 0.06) / 0.8, h * 0.16); x.fillText(L.name[1], (w * 0.06) / 0.8, h * 0.285); x.restore();
    x.font = `${h * 0.04}px ${MONO}`; x.fillText('50ml e / 1.7 FL.OZ.LIQ.', w * 0.06, h * 0.355);
    x.lineWidth = h * 0.004; const rule = y => { x.beginPath(); x.moveTo(0, y); x.lineTo(w, y); x.stroke(); };
    rule(h * 0.395); x.font = `${h * 0.046}px ${MONO}`; x.fillText('eau de parfum', w * 0.06, h * 0.455); x.fillText('Natural Spray / Vaporisateur', w * 0.06, h * 0.515);
    rule(h * 0.55); x.fillText('Labelled: in your city', w * 0.06, h * 0.615); x.fillText('On: Date of preparation', w * 0.06, h * 0.675); x.fillText('For:', w * 0.06, h * 0.735);
    rule(h * 0.79); x.beginPath(); x.moveTo(w * 0.46, h * 0.79); x.lineTo(w * 0.46, h); x.stroke();
    x.font = `${h * 0.042}px ${MONO}`; x.fillText('Made in USA', w * 0.07, h * 0.9);
    x.font = `800 ${h * 0.065}px ${SANS}`; x.fillText('DUPPÉ', w * 0.55, h * 0.91);
  } else if (L.kind === 'eternal') {
    x.fillStyle = '#f4f1ea'; x.fillRect(0, 0, w, h); drawTree(x, w / 2, h * 0.3, h * 0.3);
    x.fillStyle = '#111'; x.textAlign = 'left'; x.font = `700 ${h * 0.092}px ${SANS}`;
    spaced(x, L.name[0], w / 2, h * 0.58, h * 0.016); spaced(x, L.name[1], w / 2, h * 0.7, h * 0.016);
    x.font = `500 ${h * 0.05}px ${SANS}`; spaced(x, 'PERFUME OIL', w / 2, h * 0.88, h * 0.008);
  } else {
    x.fillStyle = '#f3f1ec'; x.fillRect(0, 0, w, h); x.lineWidth = h * 0.006; x.strokeRect(w * 0.025, h * 0.05, w * 0.95, h * 0.9);
    x.fillStyle = '#111'; x.font = `700 ${h * 0.145}px ${MONO}`; x.fillText(L.name[0], w * 0.07, h * 0.28);
    x.font = `700 ${h * 0.075}px ${SANS}`; x.fillText('Compound One.', w * 0.07, h * 0.46);
    x.font = `${h * 0.075}px ${MONO}`; x.fillText('Extrait De parfum', w * 0.07, h * 0.62); x.fillText('Labelled: in New York', w * 0.07, h * 0.74); x.fillText('30ML e / 1FL.OZ.', w * 0.07, h * 0.88);
  }
  return c;
}
function labelTexture(L, aspect) {
  const t = new THREE.CanvasTexture(labelCanvas(L, 1536, Math.round(1536 / aspect)));
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

/* ---------- tapa ---------- */
function makeCap(c, capM, chromeM) {
  const g = new THREE.Group();
  if (c.ribs) {
    const n = c.ribs, gap = c.gap, seg = (c.h - gap * (n - 1)) / n; let y = 0;
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(latheProfile(c.r, seg, 0.035, 0.035, 56), capM); m.position.y = y; g.add(m); y += seg;
      if (i < n - 1) { const r = new THREE.Mesh(new THREE.CylinderGeometry(c.r * 0.93, c.r * 0.93, gap + 0.012, 56), chromeM); r.position.y = y + gap / 2; g.add(r); y += gap; }
    }
  } else g.add(new THREE.Mesh(latheProfile(c.r, c.h, 0.05, 0.07, 56), capM));
  return g;
}

/* ---------- frasco ---------- */
function buildBottle(key) {
  const S = SPECS[key], g = new THREE.Group();
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0, metalness: 0, transparent: true, opacity: 0.14, clearcoat: 1, clearcoatRoughness: 0, envMapIntensity: 2.2, depthWrite: false });
  const liqM = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.03, metalness: 0, transmission: 1, thickness: 1.4, ior: 1.36, attenuationColor: new THREE.Color(S.liquid), attenuationDistance: 0.7, envMapIntensity: 1.2 });
  const capM = new THREE.MeshPhysicalMaterial({ color: 0x0a0a0a, metalness: S.cap.matte ? 0.15 : 0.6, roughness: S.cap.matte ? 0.55 : 0.24, clearcoat: S.cap.matte ? 0 : 1, clearcoatRoughness: 0.1, envMapIntensity: 1.4 });
  const chromeM = new THREE.MeshStandardMaterial({ color: 0xd8d8db, metalness: 1, roughness: 0.14, envMapIntensity: 1.6 });

  const liquid = new THREE.Mesh(latheProfile(S.r - 0.1, S.h * S.fill - S.base, 0.09, 0.05), liqM); liquid.position.y = S.base;
  const body = new THREE.Mesh(latheProfile(S.r, S.h, S.cb, S.ct), glass); body.renderOrder = 2;
  const L = S.label, th = L.theta, lh = S.h * L.hf, arc = S.r * th;
  const label = new THREE.Mesh(new THREE.CylinderGeometry(S.r + 0.012, S.r + 0.012, lh, 96, 1, true, -th / 2, th),
    new THREE.MeshStandardMaterial({ map: labelTexture(L, arc / lh), roughness: 0.6 }));
  label.position.y = S.h * L.yf;
  g.add(liquid, body, label);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(S.cap.r * 0.8, S.cap.r * 0.8, S.neck + 0.05, 40), glass);
  neck.position.y = S.h + S.neck / 2 - 0.02; neck.renderOrder = 2; g.add(neck);
  if (S.collar) { const c = new THREE.Mesh(new THREE.CylinderGeometry(S.cap.r * 1.08, S.cap.r * 1.08, 0.13, 56), chromeM); c.position.y = S.h + 0.02; g.add(c); }
  const cap = makeCap(S.cap, capM, chromeM); cap.position.y = S.h + S.neck - 0.02; g.add(cap);

  const total = S.h + S.neck + S.cap.h; g.position.y = -total / 2;
  return { grp: g, total, liqM };
}

/* ---------- entorno de estudio para los reflejos ---------- */
function makeEnv(renderer) {
  const sc = new THREE.Scene();
  sc.add(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.MeshBasicMaterial({ color: 0x17120a, side: THREE.BackSide })));
  const panel = (w, h, x, y, z, i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(i, i, i * 0.92), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); sc.add(m); };
  panel(6, 4, -5, 3, 4, 7); panel(2, 6, 6, 1, -2, 5); panel(8, 1.5, 0, 7, 0, 3.5); panel(5, 3, 3, 1, 6, 2.5); panel(1.6, 7, -7, 0, -2, 3); panel(3, 1.2, 0, -4, 5, 1.5);
  const pm = new THREE.PMREMGenerator(renderer), tex = pm.fromScene(sc, 0.03).texture; pm.dispose(); return tex;
}
function disposeObj(o) {
  o.traverse(n => { if (n.geometry) n.geometry.dispose(); const m = n.material; if (!m) return; (Array.isArray(m) ? m : [m]).forEach(x => { if (x.map) x.map.dispose(); x.dispose(); }); });
}

/* ---------- visor ---------- */
export async function createViewer(host) {
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  const cv = renderer.domElement; cv.style.cssText = 'width:100%;height:100%;display:block;touch-action:none;cursor:grab'; host.appendChild(cv);

  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(30, 1, 0.1, 80);
  scene.environment = makeEnv(renderer);
  const keyL = new THREE.DirectionalLight(0xfff0d8, 1.3); keyL.position.set(3, 5, 5); scene.add(keyL);
  const pivot = new THREE.Group(); scene.add(pivot);

  const sc = document.createElement('canvas'); sc.width = sc.height = 256;
  const sx = sc.getContext('2d'), gr = sx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(0,0,0,.6)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); sx.fillStyle = gr; sx.fillRect(0, 0, 256, 256);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 4.6), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; scene.add(shadow);

  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cur = null, bgTex = null, rotY = 0.5, rotX = 0.06, vel = 0, drag = false, lx = 0, ly = 0, lt = 0, running = false, raf = 0, last = 0, spawn = 0;

  function background(w, h) { // mismo degradado que el panel, para que el cristal refracte un fondo real
    const c = document.createElement('canvas'); c.width = Math.max(2, Math.round(w / 3)); c.height = Math.max(2, Math.round(h / 3));
    const x = c.getContext('2d'), cx = c.width * 0.5, cy = c.height * 0.38, rr = Math.hypot(Math.max(cx, c.width - cx), Math.max(cy, c.height - cy)) * 0.62;
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, rr); g.addColorStop(0, '#1d170c'); g.addColorStop(1, '#080808'); x.fillStyle = '#080808'; x.fillRect(0, 0, c.width, c.height); x.fillStyle = g; x.fillRect(0, 0, c.width, c.height);
    if (bgTex) bgTex.dispose(); bgTex = new THREE.CanvasTexture(c); bgTex.colorSpace = THREE.SRGBColorSpace; scene.background = bgTex;
  }
  function size() {
    const w = host.clientWidth || 300, h = host.clientHeight || 500; renderer.setSize(w, h, false); camera.aspect = w / h; background(w, h);
    const k = 2 * Math.tan(camera.fov * Math.PI / 360), tot = cur ? cur.total : 3.4;
    const d = Math.max(tot / (0.42 * k), 3.2 / (k * camera.aspect)), vh = k * d;
    camera.position.set(0, -0.165 * vh + 0.3, d); camera.lookAt(0, -0.165 * vh, 0); camera.updateProjectionMatrix();
  }
  if (window.ResizeObserver) new ResizeObserver(size).observe(host);
  size();

  function show(key) {
    if (cur) { pivot.remove(cur.grp); disposeObj(cur.grp); }
    cur = buildBottle(key); pivot.add(cur.grp); shadow.position.y = -cur.total / 2 - 0.002; spawn = performance.now(); size();
  }
  function setLiquid(hex) { if (cur) cur.liqM.attenuationColor.set(hex); }

  function loop(t) {
    if (!running) return; raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t;
    if (!drag) { vel += ((reduce ? 0 : 0.45) - vel) * Math.min(1, dt * 1.6); rotY += vel * dt; rotX += (0.06 - rotX) * Math.min(1, dt * 2); }
    pivot.rotation.set(rotX, rotY, 0);
    const s = Math.min(1, (performance.now() - spawn) / 450), e = 1 - Math.pow(1 - s, 3); pivot.scale.setScalar(0.88 + 0.12 * e);
    renderer.render(scene, camera);
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  cv.addEventListener('pointerdown', e => { drag = true; cv.setPointerCapture(e.pointerId); lx = e.clientX; ly = e.clientY; lt = e.timeStamp; cv.style.cursor = 'grabbing'; });
  cv.addEventListener('pointermove', e => {
    if (!drag) return; const dx = e.clientX - lx, dtm = Math.max(8, e.timeStamp - lt) / 1000;
    rotY += dx * 0.011; vel = clamp((dx * 0.011) / dtm, -8, 8); rotX = clamp(rotX + (e.clientY - ly) * 0.004, -0.35, 0.5); lx = e.clientX; ly = e.clientY; lt = e.timeStamp;
  });
  const up = () => { drag = false; cv.style.cursor = 'grab'; };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);

  return {
    show, setLiquid, resize: size,
    start() { if (running) return; running = true; last = performance.now(); size(); raf = requestAnimationFrame(loop); },
    stop() { running = false; cancelAnimationFrame(raf); },
    dispose() { running = false; cancelAnimationFrame(raf); if (cur) disposeObj(cur.grp); if (bgTex) bgTex.dispose(); renderer.dispose(); cv.remove(); },
  };
}
