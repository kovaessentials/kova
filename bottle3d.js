// KOVA — visor 3D de frascos
// Duppé / Eternals / Compound One
//
// Si existe un modelo GLB para la colección, se utiliza el modelo real.
// Si no existe o falla la carga, se utiliza el frasco procedural original.
//
// Compatible con el visor actual de KOVA.
// Three.js 0.160.0

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';


// ============================================================
// ESPECIFICACIONES DE LOS FRASCOS PROCEDURALES
// ============================================================

const SPECS = {

  duppe: {
    r: 0.7,
    h: 2.5,
    cb: 0.12,
    ct: 0.14,
    base: 0.24,
    fill: 0.93,

    cap: {
      r: 0.45,
      h: 0.9,
      ribs: 4,
      gap: 0.035
    },

    neck: 0.08,
    liquid: '#c9a46b',

    label: {
      kind: 'duppe',
      theta: 2.6,
      hf: 0.72,
      yf: 0.43,
      name: ['LEATHER LATE', 'THAN NEVER']
    }
  },

  eternals: {
    r: 0.8,
    h: 2.05,
    cb: 0.18,
    ct: 0.2,
    base: 0.34,
    fill: 0.88,

    cap: {
      r: 0.38,
      h: 0.95,
      matte: true
    },

    neck: 0.1,
    liquid: '#d6a823',

    label: {
      kind: 'eternal',
      theta: 2.1,
      hf: 0.62,
      yf: 0.5,
      name: ['CIGARS &', 'ICECREAM']
    }
  },

  compoundone: {
    r: 0.75,
    h: 1.95,
    cb: 0.16,
    ct: 0.12,
    base: 0.32,
    fill: 0.88,

    cap: {
      r: 0.46,
      h: 1.0,
      ribs: 5,
      gap: 0.04
    },

    neck: 0.06,
    collar: true,
    liquid: '#e3edf1',
    lop: 0.5,

    label: {
      kind: 'compound',
      theta: 2.2,
      hf: 0.5,
      yf: 0.5,
      name: ['Midnight Heel']
    }
  }

};


// ============================================================
// MODELOS 3D REALES
// ============================================================
//
// IMPORTANTE:
// Estos archivos deben existir dentro de:
//
// /models/
//
// Es decir:
//
// models/
// ├── leather_late_than_never.glb
// ├── cigars_and_icecream.glb
// └── compound_one_creamy_vanilla.glb
//
// ============================================================

const MODEL3D = {

  duppe: './models/leather_late_than_never.glb',

  eternals: './models/cigars_and_icecream.glb',

  compoundone: './models/compound_one_creamy_vanilla.glb'

};


// ============================================================
// FUENTES
// ============================================================

const MONO =
  "ui-monospace, Menlo, 'Courier New', monospace";

const SANS =
  "Montserrat, Arial, sans-serif";

const SERIF =
  "'Playfair Display', Georgia, serif";


// ============================================================
// GEOMETRÍA PROCEDURAL
// ============================================================

function latheProfile(r, h, cb, ct, seg = 72) {

  const p = [
    new THREE.Vector2(0, 0)
  ];

  for (let i = 0; i <= 8; i++) {

    const a =
      (i / 8) * Math.PI / 2;

    p.push(
      new THREE.Vector2(
        r - cb + Math.sin(a) * cb,
        cb - Math.cos(a) * cb
      )
    );
  }

  for (let i = 0; i <= 8; i++) {

    const a =
      (i / 8) * Math.PI / 2;

    p.push(
      new THREE.Vector2(
        r - ct + Math.cos(a) * ct,
        h - ct + Math.sin(a) * ct
      )
    );
  }

  p.push(
    new THREE.Vector2(0, h)
  );

  return new THREE.LatheGeometry(p, seg);
}


// ============================================================
// TEXTO ESPACIADO
// ============================================================

function spaced(x, t, cx, y, sp) {

  const w =
    [...t].reduce(
      (s, c) =>
        s +
        x.measureText(c).width +
        sp,
      -sp
    );

  let px = cx - w / 2;

  [...t].forEach(c => {

    x.fillText(c, px, y);

    px +=
      x.measureText(c).width +
      sp;

  });
}


// ============================================================
// ÁRBOL ETERNALS
// ============================================================

function drawTree(x, cx, cy, s) {

  x.strokeStyle = '#161616';
  x.fillStyle = '#161616';
  x.lineCap = 'round';

  let seed = 7;

  const rnd = () => {

    seed =
      (seed * 16807) %
      2147483647;

    return seed / 2147483647;

  };

  const br = (
    x0,
    y0,
    a,
    len,
    d,
    dir
  ) => {

    if (d === 0) {

      x.beginPath();

      x.arc(
        x0,
        y0,
        s * 0.012,
        0,
        6.283
      );

      x.fill();

      return;
    }

    const x1 =
      x0 + Math.cos(a) * len;

    const y1 =
      y0 - dir * Math.sin(a) * len;

    x.lineWidth =
      Math.max(
        0.9,
        s * 0.016 * d / 5
      );

    x.beginPath();

    x.moveTo(x0, y0);

    x.lineTo(x1, y1);

    x.stroke();

    const sp =
      0.42 + rnd() * 0.12;

    br(
      x1,
      y1,
      a + sp,
      len * (0.72 + rnd() * 0.06),
      d - 1,
      dir
    );

    br(
      x1,
      y1,
      a - sp,
      len * (0.72 + rnd() * 0.06),
      d - 1,
      dir
    );

    if (d > 3 && rnd() > 0.55) {

      br(
        x1,
        y1,
        a + (rnd() - 0.5) * 0.2,
        len * 0.6,
        d - 2,
        dir
      );

    }

  };

  // Tronco
  x.lineWidth = s * 0.02;

  x.beginPath();

  x.moveTo(
    cx,
    cy + s * 0.12
  );

  x.lineTo(
    cx,
    cy
  );

  x.stroke();

  // Copa
  br(
    cx,
    cy,
    Math.PI / 2,
    s * 0.3,
    6,
    1
  );

  // Raíces
  br(
    cx,
    cy + s * 0.12,
    Math.PI / 2,
    s * 0.14,
    4,
    -1
  );

}


// ============================================================
// LABELS PROCEDURALES
// ============================================================

function labelCanvas(L, w, h) {

  const c =
    document.createElement('canvas');

  c.width = w;
  c.height = h;

  const x = c.getContext('2d');

  x.textBaseline = 'alphabetic';

  x.fillStyle = '#111';
  x.strokeStyle = '#111';


  // ----------------------------------------------------------
  // DUPPÉ
  // ----------------------------------------------------------

  if (L.kind === 'duppe') {

    x.fillStyle = '#f7f6f2';

    x.fillRect(
      0,
      0,
      w,
      h
    );

    x.fillStyle = '#111';

    x.save();

    x.scale(
      0.8,
      1
    );

    x.font =
      `800 ${h * 0.118}px ${SANS}`;

    x.fillText(
      L.name[0],
      (w * 0.06) / 0.8,
      h * 0.16
    );

    x.fillText(
      L.name[1],
      (w * 0.06) / 0.8,
      h * 0.285
    );

    x.restore();

    x.font =
      `${h * 0.04}px ${MONO}`;

    x.fillText(
      '50ml e / 1.7 FL.OZ.LIQ.',
      w * 0.06,
      h * 0.355
    );

    x.lineWidth =
      h * 0.004;

    const rule = y => {

      x.beginPath();

      x.moveTo(
        0,
        y
      );

      x.lineTo(
        w,
        y
      );

      x.stroke();

    };

    rule(h * 0.395);

    x.font =
      `${h * 0.046}px ${MONO}`;

    x.fillText(
      'eau de parfum',
      w * 0.06,
      h * 0.455
    );

    x.fillText(
      'Natural Spray / Vaporisateur',
      w * 0.06,
      h * 0.515
    );

    rule(h * 0.55);

    x.fillText(
      'Labelled: in your city',
      w * 0.06,
      h * 0.615
    );

    x.fillText(
      'On: Date of preparation',
      w * 0.06,
      h * 0.675
    );

    x.fillText(
      'For:',
      w * 0.06,
      h * 0.735
    );

    rule(h * 0.79);

    x.beginPath();

    x.moveTo(
      w * 0.46,
      h * 0.79
    );

    x.lineTo(
      w * 0.46,
      h
    );

    x.stroke();

    x.font =
      `${h * 0.042}px ${MONO}`;

    x.fillText(
      'Made in USA',
      w * 0.07,
      h * 0.9
    );

    x.font =
      `800 ${h * 0.065}px ${SANS}`;

    x.fillText(
      'DUPPÉ',
      w * 0.55,
      h * 0.91
    );

  }


  // ----------------------------------------------------------
  // ETERNALS
  // ----------------------------------------------------------

  else if (L.kind === 'eternal') {

    x.fillStyle = '#f4f1ea';

    x.fillRect(
      0,
      0,
      w,
      h
    );

    drawTree(
      x,
      w / 2,
      h * 0.27,
      h * 0.16
    );

    x.fillStyle = '#111';

    x.textAlign = 'left';

    x.font =
      `700 ${h * 0.092}px ${SANS}`;

    spaced(
      x,
      L.name[0],
      w / 2,
      h * 0.58,
      h * 0.016
    );

    spaced(
      x,
      L.name[1],
      w / 2,
      h * 0.7,
      h * 0.016
    );

    x.font =
      `500 ${h * 0.05}px ${SANS}`;

    spaced(
      x,
      'PERFUME OIL',
      w / 2,
      h * 0.88,
      h * 0.008
    );

  }


  // ----------------------------------------------------------
  // COMPOUND ONE
  // ----------------------------------------------------------

  else {

    x.fillStyle = '#f3f1ec';

    x.fillRect(
      0,
      0,
      w,
      h
    );

    x.lineWidth =
      h * 0.006;

    x.strokeRect(
      w * 0.025,
      h * 0.05,
      w * 0.95,
      h * 0.9
    );

    x.fillStyle = '#111';

    x.font =
      `700 ${h * 0.145}px ${MONO}`;

    x.fillText(
      L.name[0],
      w * 0.07,
      h * 0.28
    );

    x.font =
      `700 ${h * 0.075}px ${SANS}`;

    x.fillText(
      'Compound One.',
      w * 0.07,
      h * 0.46
    );

    x.font =
      `${h * 0.075}px ${MONO}`;

    x.fillText(
      'Extrait De parfum',
      w * 0.07,
      h * 0.62
    );

    x.fillText(
      'Labelled: in New York',
      w * 0.07,
      h * 0.74
    );

    x.fillText(
      '30ML e / 1FL.OZ.',
      w * 0.07,
      h * 0.88
    );

  }

  return c;

}


function labelTexture(L, aspect) {

  const t =
    new THREE.CanvasTexture(
      labelCanvas(
        L,
        1536,
        Math.round(1536 / aspect)
      )
    );

  t.colorSpace =
    THREE.SRGBColorSpace;

  t.anisotropy = 8;

  return t;

}


// ============================================================
// TAPA PROCEDURAL
// ============================================================

function makeCap(c, capM, chromeM) {

  const g =
    new THREE.Group();

  if (c.ribs) {

    const n = c.ribs;

    const gap = c.gap;

    const seg =
      (c.h - gap * (n - 1)) / n;

    let y = 0;

    for (
      let i = 0;
      i < n;
      i++
    ) {

      const m =
        new THREE.Mesh(
          latheProfile(
            c.r,
            seg,
            0.035,
            0.035,
            56
          ),
          capM
        );

      m.position.y = y;

      g.add(m);

      y += seg;


      if (i < n - 1) {

        const r =
          new THREE.Mesh(
            new THREE.CylinderGeometry(
              c.r * 0.93,
              c.r * 0.93,
              gap + 0.012,
              56
            ),
            chromeM
          );

        r.position.y =
          y + gap / 2;

        g.add(r);

        y += gap;

      }

    }

  }

  else {

    g.add(
      new THREE.Mesh(
        latheProfile(
          c.r,
          c.h,
          0.05,
          0.07,
          56
        ),
        capM
      )
    );

  }

  return g;

}


// ============================================================
// FRASCO PROCEDURAL
// ============================================================

function buildBottle(key) {

  const S =
    SPECS[key];

  const g =
    new THREE.Group();


  const glass =
    new THREE.MeshPhysicalMaterial({

      color: 0xffffff,

      roughness: 0,

      metalness: 0,

      transparent: true,

      opacity: 0.14,

      clearcoat: 1,

      clearcoatRoughness: 0,

      envMapIntensity: 2.2,

      depthWrite: false

    });


  const liqM =
    new THREE.MeshPhysicalMaterial({

      color: S.liquid,

      emissive: S.liquid,

      emissiveIntensity: 0.3,

      roughness: 0.12,

      metalness: 0,

      clearcoat: 1,

      clearcoatRoughness: 0.05,

      transparent: true,

      opacity: S.lop || 0.94,

      envMapIntensity: 1.1

    });


  const capM =
    new THREE.MeshPhysicalMaterial({

      color: 0x0a0a0a,

      metalness:
        S.cap.matte
          ? 0.15
          : 0.6,

      roughness:
        S.cap.matte
          ? 0.55
          : 0.24,

      clearcoat:
        S.cap.matte
          ? 0
          : 1,

      clearcoatRoughness: 0.1,

      envMapIntensity: 1.4

    });


  const chromeM =
    new THREE.MeshStandardMaterial({

      color: 0xd8d8db,

      metalness: 1,

      roughness: 0.14,

      envMapIntensity: 1.6

    });


  const liquid =
    new THREE.Mesh(
      latheProfile(
        S.r - 0.1,
        S.h * S.fill - S.base,
        0.09,
        0.05
      ),
      liqM
    );

  liquid.position.y =
    S.base;

  liquid.renderOrder = 1;


  const body =
    new THREE.Mesh(
      latheProfile(
        S.r,
        S.h,
        S.cb,
        S.ct
      ),
      glass
    );

  body.renderOrder = 2;


  const L =
    S.label;

  const th =
    L.theta;

  const lh =
    S.h * L.hf;

  const arc =
    S.r * th;


  const label =
    new THREE.Mesh(

      new THREE.CylinderGeometry(
        S.r + 0.012,
        S.r + 0.012,
        lh,
        96,
        1,
        true,
        -th / 2,
        th
      ),

      new THREE.MeshStandardMaterial({

        map:
          labelTexture(
            L,
            arc / lh
          ),

        roughness: 0.6

      })

    );


  label.position.y =
    S.h * L.yf;


  g.add(
    liquid,
    body,
    label
  );


  const neck =
    new THREE.Mesh(

      new THREE.CylinderGeometry(
        S.cap.r * 0.8,
        S.cap.r * 0.8,
        S.neck + 0.05,
        40
      ),

      glass

    );


  neck.position.y =
    S.h +
    S.neck / 2 -
    0.02;

  neck.renderOrder = 2;

  g.add(neck);


  if (S.collar) {

    const c =
      new THREE.Mesh(

        new THREE.CylinderGeometry(
          S.cap.r * 1.08,
          S.cap.r * 1.08,
          0.13,
          56
        ),

        chromeM

      );

    c.position.y =
      S.h + 0.02;

    g.add(c);

  }


  const cap =
    makeCap(
      S.cap,
      capM,
      chromeM
    );


  cap.position.y =
    S.h +
    S.neck -
    0.02;

  g.add(cap);


  const total =
    S.h +
    S.neck +
    S.cap.h;


  g.position.y =
    -total / 2;


  return {

    grp: g,

    total,

    liqM

  };

}


// ============================================================
// ENTORNO DE ESTUDIO
// ============================================================

function makeEnv(renderer) {

  const sc =
    new THREE.Scene();


  sc.add(

    new THREE.Mesh(

      new THREE.SphereGeometry(
        10,
        32,
        16
      ),

      new THREE.MeshBasicMaterial({

        color: 0x17120a,

        side:
          THREE.BackSide

      })

    )

  );


  const panel =
    (
      w,
      h,
      x,
      y,
      z,
      i
    ) => {

      const m =
        new THREE.Mesh(

          new THREE.PlaneGeometry(
            w,
            h
          ),

          new THREE.MeshBasicMaterial({

            color:
              new THREE.Color(
                i,
                i,
                i * 0.92
              ),

            side:
              THREE.DoubleSide

          })

        );


      m.position.set(
        x,
        y,
        z
      );

      m.lookAt(
        0,
        0,
        0
      );

      sc.add(m);

    };


  panel(6, 4, -5, 3, 4, 7);

  panel(2, 6, 6, 1, -2, 5);

  panel(8, 1.5, 0, 7, 0, 3.5);

  panel(5, 3, 3, 1, 6, 2.5);

  panel(1.6, 7, -7, 0, -2, 3);

  panel(3, 1.2, 0, -4, 5, 1.5);


  const pm =
    new THREE.PMREMGenerator(
      renderer
    );


  const tex =
    pm.fromScene(
      sc,
      0.03
    ).texture;


  pm.dispose();

  return tex;

}


// ============================================================
// LIBERACIÓN DE MEMORIA
// ============================================================

function disposeObj(o) {

  if (!o) return;

  o.traverse(n => {

    if (n.geometry) {

      n.geometry.dispose();

    }


    const m =
      n.material;

    if (!m) return;


    (
      Array.isArray(m)
        ? m
        : [m]
    ).forEach(x => {

      if (x.map) {

        x.map.dispose();

      }

      x.dispose();

    });

  });

}


// ============================================================
// CARGADOR GLB
// ============================================================

const gltfLoader =
  new GLTFLoader();


// ============================================================
// PREPARAR MODELO GLB
// ============================================================

function prepareGLB(gltf, key) {

  const model =
    gltf.scene;


  // ----------------------------------------------------------
  // Sombras
  // ----------------------------------------------------------

  model.traverse(obj => {

    if (!obj.isMesh) return;

    obj.castShadow = true;
    obj.receiveShadow = true;

    // Asegurar materiales correctos
    if (obj.material) {

      const materials =
        Array.isArray(obj.material)
          ? obj.material
          : [obj.material];

      materials.forEach(mat => {

        if (
          mat.map &&
          'colorSpace' in mat.map
        ) {

          mat.map.colorSpace =
            THREE.SRGBColorSpace;

        }

      });

    }

  });


  // ----------------------------------------------------------
  // Calcular bounding box
  // ----------------------------------------------------------

  const box =
    new THREE.Box3()
      .setFromObject(model);


  const size =
    new THREE.Vector3();

  const center =
    new THREE.Vector3();


  box.getSize(size);

  box.getCenter(center);


  // ----------------------------------------------------------
  // Centrar horizontalmente
  // ----------------------------------------------------------

  model.position.x -=
    center.x;

  model.position.z -=
    center.z;


  // ----------------------------------------------------------
  // Escalar automáticamente
  // ----------------------------------------------------------

  const spec =
    SPECS[key];


  const targetHeight =
    spec.h +
    spec.neck +
    spec.cap.h;


  const currentHeight =
    Math.max(
      size.y,
      0.001
    );


  const scale =
    targetHeight /
    currentHeight;


  model.scale.setScalar(
    scale
  );


  // ----------------------------------------------------------
  // Recalcular bounding box después de escalar
  // ----------------------------------------------------------

  const scaledBox =
    new THREE.Box3()
      .setFromObject(model);


  const scaledCenter =
    new THREE.Vector3();


  scaledBox.getCenter(
    scaledCenter
  );


  model.position.x -=
    scaledCenter.x;

  model.position.z -=
    scaledCenter.z;


  // ----------------------------------------------------------
  // Centrado vertical
  // ----------------------------------------------------------

  const finalBox =
    new THREE.Box3()
      .setFromObject(model);


  const finalCenter =
    new THREE.Vector3();


  finalBox.getCenter(
    finalCenter
  );


  model.position.y -=
    finalCenter.y;


  // ----------------------------------------------------------
  // Crear contenedor
  // ----------------------------------------------------------

  const group =
    new THREE.Group();


  group.add(model);


  // Igual que el procedural:
  // el frasco queda centrado en Y.

  return {

    grp: group,

    total: targetHeight,

    liqM: null,

    glb: true

  };

}


// ============================================================
// CARGAR GLB
// ============================================================

async function loadGLB(key) {

  const url =
    MODEL3D[key];


  if (!url) {

    return null;

  }


  try {

    const gltf =
      await gltfLoader.loadAsync(
        url
      );


    if (
      !gltf ||
      !gltf.scene
    ) {

      return null;

    }


    return prepareGLB(
      gltf,
      key
    );

  }

  catch (error) {

    console.warn(
      `[KOVA 3D] No se pudo cargar el modelo GLB de "${key}". Se usará el modelo procedural.`,
      error
    );

    return null;

  }

}


// ============================================================
// VISOR
// ============================================================

export async function createViewer(host) {

  if (
    document.fonts &&
    document.fonts.ready
  ) {

    await document.fonts.ready;

  }


  // ----------------------------------------------------------
  // RENDERER
  // ----------------------------------------------------------

  const renderer =
    new THREE.WebGLRenderer({

      antialias: true,

      alpha: false,

      powerPreference:
        'high-performance'

    });


  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio || 1,
      1.75
    )
  );


  renderer.toneMapping =
    THREE.ACESFilmicToneMapping;


  renderer.toneMappingExposure =
    1.0;


  renderer.outputColorSpace =
    THREE.SRGBColorSpace;


  const cv =
    renderer.domElement;


  cv.style.cssText =
    `
      width:100%;
      height:100%;
      display:block;
      touch-action:none;
      cursor:grab;
    `;


  host.appendChild(cv);


  // ----------------------------------------------------------
  // SCENE / CAMERA
  // ----------------------------------------------------------

  const scene =
    new THREE.Scene();


  const camera =
    new THREE.PerspectiveCamera(
      30,
      1,
      0.1,
      80
    );


  scene.environment =
    makeEnv(renderer);


  // ----------------------------------------------------------
  // LUZ PRINCIPAL
  // ----------------------------------------------------------

  const keyL =
    new THREE.DirectionalLight(
      0xfff0d8,
      1.3
    );


  keyL.position.set(
    3,
    5,
    5
  );


  scene.add(keyL);


  // ----------------------------------------------------------
  // LUZ DE RELLENO
  // ----------------------------------------------------------

  const fillL =
    new THREE.DirectionalLight(
      0xffffff,
      0.55
    );


  fillL.position.set(
    -4,
    2,
    -3
  );


  scene.add(fillL);


  // ----------------------------------------------------------
  // LUZ SUPERIOR
  // ----------------------------------------------------------

  const rimL =
    new THREE.PointLight(
      0xe6c878,
      1.0,
      12
    );


  rimL.position.set(
    0,
    5,
    -3
  );


  scene.add(rimL);


  // ----------------------------------------------------------
  // PIVOT
  // ----------------------------------------------------------

  const pivot =
    new THREE.Group();


  scene.add(pivot);


  // ----------------------------------------------------------
  // SOMBRA
  // ----------------------------------------------------------

  const sc =
    document.createElement(
      'canvas'
    );


  sc.width =
    sc.height =
      256;


  const sx =
    sc.getContext('2d');


  const gr =
    sx.createRadialGradient(
      128,
      128,
      0,
      128,
      128,
      128
    );


  gr.addColorStop(
    0,
    'rgba(0,0,0,.6)'
  );


  gr.addColorStop(
    1,
    'rgba(0,0,0,0)'
  );


  sx.fillStyle = gr;


  sx.fillRect(
    0,
    0,
    256,
    256
  );


  const shadow =
    new THREE.Mesh(

      new THREE.PlaneGeometry(
        4.6,
        4.6
      ),

      new THREE.MeshBasicMaterial({

        map:
          new THREE.CanvasTexture(sc),

        transparent: true,

        depthWrite: false

      })

    );


  shadow.rotation.x =
    -Math.PI / 2;


  scene.add(shadow);


  // ----------------------------------------------------------
  // ESTADO
  // ----------------------------------------------------------

  const reduce =
    window.matchMedia &&
    matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;


  let cur = null;

  let bgTex = null;

  let rotY = 0.5;

  let rotX = 0.06;

  let vel = 0;

  let drag = false;

  let lx = 0;

  let ly = 0;

  let lt = 0;

  let running = false;

  let raf = 0;

  let last = 0;

  let spawn = 0;

  let loadToken = 0;


  // ==========================================================
  // FONDO
  // ==========================================================

  function background(w, h) {

    const c =
      document.createElement(
        'canvas'
      );


    c.width =
      Math.max(
        2,
        Math.round(w / 3)
      );


    c.height =
      Math.max(
        2,
        Math.round(h / 3)
      );


    const x =
      c.getContext('2d');


    const cx =
      c.width * 0.5;


    const cy =
      c.height * 0.38;


    const rr =
      Math.hypot(
        Math.max(
          cx,
          c.width - cx
        ),
        Math.max(
          cy,
          c.height - cy
        )
      ) * 0.62;


    const g =
      x.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        rr
      );


    g.addColorStop(
      0,
      '#1d170c'
    );


    g.addColorStop(
      1,
      '#080808'
    );


    x.fillStyle =
      '#080808';


    x.fillRect(
      0,
      0,
      c.width,
      c.height
    );


    x.fillStyle = g;


    x.fillRect(
      0,
      0,
      c.width,
      c.height
    );


    if (bgTex) {

      bgTex.dispose();

    }


    bgTex =
      new THREE.CanvasTexture(c);


    bgTex.colorSpace =
      THREE.SRGBColorSpace;


    scene.background =
      bgTex;

  }


  // ==========================================================
  // RESIZE
  // ==========================================================

  function size() {

    const w =
      host.clientWidth || 300;


    const h =
      host.clientHeight || 500;


    renderer.setSize(
      w,
      h,
      false
    );


    camera.aspect =
      w / h;


    background(
      w,
      h
    );


    const k =
      2 *
      Math.tan(
        camera.fov *
        Math.PI /
        360
      );


    const tot =
      cur
        ? cur.total
        : 3.4;


    const d =
      Math.max(

        tot /
        (0.42 * k),

        3.2 /
        (k * camera.aspect)

      );


    const vh =
      k * d;


    camera.position.set(
      0,
      -0.165 * vh + 0.3,
      d
    );


    camera.lookAt(
      0,
      -0.165 * vh,
      0
    );


    camera.updateProjectionMatrix();

  }


  if (
    window.ResizeObserver
  ) {

    new ResizeObserver(
      size
    ).observe(host);

  }


  size();


  // ==========================================================
  // MOSTRAR COLECCIÓN
  // ==========================================================

  async function show(key) {

    if (!SPECS[key]) {

      console.warn(
        `[KOVA 3D] Colección desconocida: ${key}`
      );

      return;

    }


    // Token para evitar que una carga
    // antigua sobrescriba una selección nueva.

    const token =
      ++loadToken;


    // --------------------------------------------------------
    // ELIMINAR MODELO ACTUAL
    // --------------------------------------------------------

    if (cur) {

      pivot.remove(
        cur.grp
      );

      disposeObj(
        cur.grp
      );

      cur = null;

    }


    // --------------------------------------------------------
    // ESTADO DE ENTRADA
    // --------------------------------------------------------

    rotY = 0.5;

    rotX = 0.06;

    vel = 0;

    pivot.rotation.set(
      rotX,
      rotY,
      0
    );


    // --------------------------------------------------------
    // PRIMERO INTENTAMOS GLB
    // --------------------------------------------------------

    const glb =
      await loadGLB(key);


    // --------------------------------------------------------
    // SI EL USUARIO YA CAMBIÓ DE COLECCIÓN,
    // DESCARTAR ESTA CARGA
    // --------------------------------------------------------

    if (
      token !== loadToken
    ) {

      if (glb) {

        disposeObj(
          glb.grp
        );

      }

      return;

    }


    // --------------------------------------------------------
    // SI GLB FUNCIONA
    // --------------------------------------------------------

    if (glb) {

      cur = glb;

      pivot.add(
        cur.grp
      );

    }


    // --------------------------------------------------------
    // SI GLB FALLA → PROCEDURAL
    // --------------------------------------------------------

    else {

      cur =
        buildBottle(key);

      pivot.add(
        cur.grp
      );

    }


    // --------------------------------------------------------
    // SOMBRA
    // --------------------------------------------------------

    shadow.position.y =
      -cur.total / 2 -
      0.002;


    spawn =
      performance.now();


    size();

  }


  // ==========================================================
  // CAMBIAR COLOR DE LÍQUIDO
  // ==========================================================

  function setLiquid(hex) {

    if (!cur) return;


    // Los modelos GLB conservan
    // sus materiales reales.

    if (!cur.liqM) {

      return;

    }


    cur.liqM.color.set(
      hex
    );


    cur.liqM.emissive.set(
      hex
    );


    cur.liqM.opacity =
      hex.toLowerCase() ===
      '#e3edf1'
        ? 0.5
        : 0.94;

  }


  // ==========================================================
  // ANIMACIÓN
  // ==========================================================

  function loop(t) {

    if (!running) return;


    raf =
      requestAnimationFrame(
        loop
      );


    const dt =
      Math.min(
        0.05,
        (t - last) / 1000 ||
        0.016
      );


    last = t;


    if (!drag) {

      vel +=
        (
          (reduce
            ? 0
            : 0.45
          ) -
          vel
        ) *
        Math.min(
          1,
          dt * 1.6
        );


      rotY +=
        vel * dt;


      rotX +=
        (
          0.06 -
          rotX
        ) *
        Math.min(
          1,
          dt * 2
        );

    }


    pivot.rotation.set(
      rotX,
      rotY,
      0
    );


    const s =
      Math.min(
        1,
        (
          performance.now() -
          spawn
        ) / 450
      );


    const e =
      1 -
      Math.pow(
        1 - s,
        3
      );


    pivot.scale.setScalar(
      0.88 +
      0.12 * e
    );


    renderer.render(
      scene,
      camera
    );

  }


  // ==========================================================
  // CONTROLES
  // ==========================================================

  const clamp =
    (v, a, b) =>
      Math.max(
        a,
        Math.min(
          b,
          v
        )
      );


  cv.addEventListener(
    'pointerdown',
    e => {

      drag = true;

      cv.setPointerCapture(
        e.pointerId
      );

      lx =
        e.clientX;

      ly =
        e.clientY;

      lt =
        e.timeStamp;

      cv.style.cursor =
        'grabbing';

    }
  );


  cv.addEventListener(
    'pointermove',
    e => {

      if (!drag) return;


      const dx =
        e.clientX -
        lx;


      const dtm =
        Math.max(
          8,
          e.timeStamp -
          lt
        ) / 1000;


      rotY +=
        dx * 0.011;


      vel =
        clamp(
          (
            dx *
            0.011
          ) / dtm,
          -8,
          8
        );


      rotX =
        clamp(
          rotX +
          (
            e.clientY -
            ly
          ) * 0.004,
          -0.35,
          0.5
        );


      lx =
        e.clientX;

      ly =
        e.clientY;

      lt =
        e.timeStamp;

    }
  );


  const up =
    () => {

      drag = false;

      cv.style.cursor =
        'grab';

    };


  cv.addEventListener(
    'pointerup',
    up
  );


  cv.addEventListener(
    'pointercancel',
    up
  );


  cv.addEventListener(
    'pointerleave',
    () => {

      if (drag) {

        drag = false;

        cv.style.cursor =
          'grab';

      }

    }
  );


  // ==========================================================
  // API PÚBLICA
  // ==========================================================

  return {

    show,

    setLiquid,

    resize: size,


    start() {

      if (running)
        return;


      running = true;

      last =
        performance.now();


      size();


      raf =
        requestAnimationFrame(
          loop
        );

    },


    stop() {

      running = false;

      cancelAnimationFrame(
        raf
      );

    },


    dispose() {

      running = false;

      cancelAnimationFrame(
        raf
      );


      loadToken++;


      if (cur) {

        disposeObj(
          cur.grp
        );

        cur = null;

      }


      if (bgTex) {

        bgTex.dispose();

        bgTex = null;

      }


      if (scene.environment) {

        scene.environment.dispose();

      }


      renderer.dispose();

      cv.remove();

    }

  };

}
