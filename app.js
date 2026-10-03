// Preloader Immersivo
/* document.body.classList.add("loading"); // Bloquea el scroll al inicio

window.addEventListener("load", () => {
  const preloader = document.getElementById("kova-preloader");

  // Sincronizar el desvanecimiento con el final de la animación de la barra (0.8s retraso + 2.2s duración)
  setTimeout(() => {
    preloader.classList.add("fade-out");
    document.body.classList.remove("loading");

    // Limpiar el DOM después de la transición
    setTimeout(() => preloader.remove(), 900);
  }, 3000);
}); */

document.body.classList.add("loading");

// Configuración básica de Three.js
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Luces para el toque premium
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const goldLight = new THREE.PointLight(0xc9a24e, 2, 50); // Luz dorada
goldLight.position.set(3, 4, 3);
scene.add(goldLight);

const fillLight = new THREE.PointLight(0xffffff, 0.8, 50);
fillLight.position.set(-3, 0, 3);
scene.add(fillLight);

// --- Construcción del Frasco Estilizado ---
const perfumeGroup = new THREE.Group();

// 1. Cuerpo del frasco (Cristal negro pulido)
const bodyGeo = new THREE.BoxGeometry(1.8, 2.2, 0.8);
const bodyMat = new THREE.MeshStandardMaterial({ 
  color: 0x050505, 
  metalness: 0.9, 
  roughness: 0.1 
});
const body = new THREE.Mesh(bodyGeo, bodyMat);
perfumeGroup.add(body);

// 2. Cuello (Dorado)
const neckGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.4, 32);
const goldMat = new THREE.MeshStandardMaterial({ 
  color: 0xc9a24e, 
  metalness: 1, 
  roughness: 0.2 
});
const neck = new THREE.Mesh(neckGeo, goldMat);
neck.position.y = 1.3;
perfumeGroup.add(neck);

// 3. Tapa (Dorado reflectante)
const capGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.9, 32);
const cap = new THREE.Mesh(capGeo, goldMat);
cap.position.y = 1.95;
perfumeGroup.add(cap);

scene.add(perfumeGroup);

// --- Partículas (Aura de fragancia) ---
const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 200;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
  // Distribuir partículas en una esfera alrededor del frasco
  posArray[i] = (Math.random() - 0.5) * 8; 
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMat = new THREE.PointsMaterial({
  size: 0.04,
  color: 0xe6c878, // gold2
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending
});
const particleMesh = new THREE.Points(particlesGeo, particlesMat);
scene.add(particleMesh);

// Posicionar un poco más arriba para dejar espacio al texto
perfumeGroup.position.y = 0.5;
particleMesh.position.y = 0.5;

// Animación Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  // Rotación y levitación suave del frasco
  perfumeGroup.rotation.y = elapsedTime * 0.4;
  perfumeGroup.position.y = 0.5 + Math.sin(elapsedTime * 1.5) * 0.15;

  // Rotación lenta del aura de partículas
  particleMesh.rotation.y = elapsedTime * 0.1;
  particleMesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;

  renderer.render(scene, camera);
}
animate();

// Ajuste al redimensionar ventana
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Desvanecer preloader al cargar
window.addEventListener('load', () => {
  const preloader = document.getElementById('kova-3d-preloader');
  
  // Retraso de 2.5s para asegurar que se vea la animación 3D y la barra cargue
  setTimeout(() => {
    preloader.classList.add('fade-out');
    document.body.classList.remove('loading');
    
    // Limpiar Three.js de la memoria tras ocultarlo
    setTimeout(() => {
      preloader.remove();
      renderer.dispose();
      scene.clear();
    }, 1000);
  }, 2500); 
});

const products = [
  {
    id: 1,
    name: "1 Million",
    ref: "Gold Digger",
    category: "hombre",
    img: "img/img-002.png",
    desc: "Una fragancia audaz con notas amaderadas y toques de cuero y especias, perfecta para destacar en la noche.",
    variants: [
      { size: "20 ml", priceUSD: 20 },
      { size: "50 ml", priceUSD: 35 },
    ],
  },
  {
    id: 2,
    name: "Tom Ford F'n Fabulous",
    ref: "F'n Marvelous",
    category: "unisex",
    img: "img/img-003.png",
    desc: "Un aroma cuero-oriental sofisticado y exclusivo, enriquecido con almendra amarga y haba tonka.",
    variants: [
      { size: "20 ml", priceUSD: 20 },
      { size: "50 ml", priceUSD: 35 },
    ],
  },
  {
    id: 3,
    name: "Sauvage Elixir",
    ref: "Savage Spell",
    category: "hombre",
    img: "img/img-004.png",
    desc: "Concentración extraordinaria de notas especiadas, lavanda fresca y un fondo de maderas ricas.",
    variants: [
      { size: "20 ml", priceUSD: 20 },
      { size: "50 ml", priceUSD: 35 },
    ],
  },
  {
    id: 4,
    name: "Christian Clive Blonde Amber",
    ref: "Goldie Luxe",
    category: "unisex",
    img: "img/goldie_luxe.jpg",
    desc: "Ámbar cálido, notas frutales y un toque de ron que evocan elegancia atemporal.",
    variants: [
      { size: "20 ml", priceUSD: 20 },
      { size: "50 ml", priceUSD: 35 },
    ],
  },
  {
    id: 5,
    name: "Creed Queen of Silk",
    ref: "Sew Over You",
    category: "mujer",
    img: "img/sew_over_you.jpg",
    desc: "Una esencia envolvente con flores blancas, vainilla suave y notas amaderadas delicadas.",
    variants: [
      { size: "20 ml", priceUSD: 20 },
      { size: "50 ml", priceUSD: 35 },
    ],
  },
  {
    id: 6,
    name: "YSL Libre",
    ref: "Libre-Ate Me",
    category: "mujer",
    img: "img/img-005.png",
    desc: "El equilibrio perfecto entre la lavanda francesa y la flor de azahar marroquí.",
    variants: [
      { size: "20 ml", priceUSD: 20 },
      { size: "50 ml", priceUSD: 35 },
    ],
  },
  {
    id: 7,
    name: "JPG Le Male Elixir",
    ref: "Alpha Elixir",
    category: "hombre",
    img: "img/alpha_elixir.jpg",
    desc: "Intenso y sensual con notas dulces de haba tonka, menta fresca y benjuí.",
    variants: [
      { size: "20 ml", priceUSD: 20 },
      { size: "50 ml", priceUSD: 35 },
    ],
  },
  {
    id: 8,
    name: "Tom Ford Electric Cherry",
    ref: "Cherry Spark",
    category: "unisex",
    img: "img/img-006.png",
    desc: "Cereza ácida combinada con jazmín dulce y pimienta rosada vibrante.",
    variants: [
      { size: "20 ml", priceUSD: 20 },
      { size: "50 ml", priceUSD: 35 },
    ],
  },
  {
    id: 9,
    name: "Bleu de Chanel",
    ref: "Azure Depth",
    category: "hombre",
    img: "img/img-007.png",
    desc: "Una fragancia aromática y amaderada de carácter independiente y elegante.",
    variants: [
      { size: "20 ml", priceUSD: 20 },
      { size: "50 ml", priceUSD: 35 },
    ],
  },
  {
    id: 10,
    name: "Azzaro Most Wanted",
    ref: "Wanted Dead or Adored",
    category: "hombre",
    img: "img/img-010.png",
    desc: "Un aroma amaderado oriental de alta intensidad con cardamomo, toffee y madera de ámbar.",
    variants: [
      { size: "20 ml", priceUSD: 20 },
      { size: "50 ml", priceUSD: 35 },
    ],
  },
  {
    id: 11,
    name: "YSL Y",
    ref: "Why Not",
    category: "hombre",
    img: "img/img-011.png",
    desc: "Aroma fresco y profundo con notas de bergamota, salvia y madera de cedro.",
    variants: [
      { size: "20 ml", priceUSD: 20 },
      { size: "50 ml", priceUSD: 35 },
    ],
  },
  {
    id: 12,
    name: "JPG Ultra Male",
    ref: "Alpha Noir",
    category: "hombre",
    img: "img/img-012.png",
    desc: "Una explosión de pera dulce, lavanda negra y vainilla amaderada.",
    variants: [
      { size: "20 ml", priceUSD: 20 },
      { size: "50 ml", priceUSD: 35 },
    ],
  },
  {
    id: 13,
    name: "Viktor Rolf Spicebomb Extreme",
    ref: "Spice to Meet You",
    category: "hombre",
    img: "img/img-013.png",
    desc: "Combinación explosiva de especias cálidas, comino, canela y tabaco rico.",
    variants: [
      { size: "20 ml", priceUSD: 20 },
      { size: "50 ml", priceUSD: 35 },
    ],
  },
  {
    id: 14,
    name: "Tom Ford Ombré Leather",
    ref: "Leather Late Than Never",
    category: "unisex",
    img: "img/img-014.png",
    desc: "Cuero texturizado, cardamomo y jazmín que proyectan libertad y profundidad.",
    variants: [
      { size: "20 ml", priceUSD: 20 },
      { size: "50 ml", priceUSD: 35 },
    ],
  },
  {
    id: 15,
    name: "Born in Roma Intense",
    ref: "When in Roma",
    category: "hombre",
    img: "img/img-015.png",
    desc: "Un homenaje moderno con notas de vainilla magnética y jazmín solar.",
    variants: [
      { size: "20 ml", priceUSD: 20 },
      { size: "50 ml", priceUSD: 35 },
    ],
  },
  {
    id: 17,
    name: "Ex Nihilo Blue Talisman",
    ref: "Ya Blue Me Away",
    category: "unisex",
    img: "img/img-017.png",
    desc: "Pera, bergamota, flor de azahar y maderas que crean un amuleto olfativo único.",
    variants: [
      { size: "20 ml", priceUSD: 20 },
      { size: "50 ml", priceUSD: 35 },
    ],
  },
  {
    id: 18,
    name: "Acqua di Giò Profumo",
    ref: "Holy Ship You Clean Up Nice",
    category: "hombre",
    img: "img/holy_ship.jpg",
    desc: "Frescura marina combinada con la profundidad del incienso y el pachulí.",
    variants: [
      { size: "20 ml", priceUSD: 20 },
      { size: "50 ml", priceUSD: 35 },
    ],
  },
  {
    id: 19,
    name: "Miss Dior",
    ref: "Cherry On Top",
    category: "mujer",
    img: "img/cherry_on_top.jpg",
    desc: "Un bouquet floral elegante con notas de rosa de Grasse, peonía y un toque fresco y romántico.",
    variants: [{ size: "30 ml", priceUSD: 20 }],
  },
  {
    id: 20,
    name: "Tom Ford Tobacco Vanille",
    ref: "Cigars & Ice Cream",
    category: "unisex",
    img: "img/cigars_ice_cream.jpg",
    desc: "Una opulenta mezcla de hoja de tabaco, especias aromáticas, vainilla dulce y cacao suave.",
    variants: [{ size: "30 ml", priceUSD: 20 }],
  },
  {
    id: 21,
    name: "YSL MYSLF",
    ref: "Eternal Bergamot",
    category: "hombre",
    img: "img/eternal_bergamot.jpg",
    desc: "Una fragancia floral-amaderada moderna centrada en la bergamota fresca y la flor de azahar.",
    variants: [{ size: "30 ml", priceUSD: 20 }],
  },
  {
    id: 22,
    name: "Paco Rabanne Invictus",
    ref: "Exor",
    category: "hombre",
    img: "img/exor.jpg",
    desc: "Aroma fresco y vibrante con acorde marino, pomelo radiante y un fondo de madera de gualaco.",
    variants: [{ size: "30 ml", priceUSD: 20 }],
  },
  {
    id: 23,
    name: "Louis Vuitton Ombre Nomade",
    ref: "Incense Oud",
    category: "unisex",
    img: "img/incense_oud.jpg",
    desc: "Un viaje sensorial intenso cargado de madera de Oud, lágrimas de incienso y toques de frambuesa.",
    variants: [{ size: "30 ml", priceUSD: 20 }],
  },
  {
    id: 24,
    name: "Versace Eros",
    ref: "Mint Ocean",
    category: "hombre",
    img: "img/mint_ocean.jpg",
    desc: "Una explosión de frescura con menta, manzana verde y limón italiano respaldados por haba tonka.",
    variants: [{ size: "30 ml", priceUSD: 20 }],
  },
  {
    id: 25,
    name: "Sauvage Elixir",
    ref: "Desert Elixir",
    category: "hombre",
    img: "img/desert_elixir.webp",
    desc: "Una interpretación intensa y especiada, con lavanda, cítricos y un fondo amaderado.",
    variants: [{ size: "30 ml", priceUSD: 25 }],
  },
  {
    id: 26,
    name: "Bleu de Chanel",
    ref: "Blue Eclipse",
    category: "hombre",
    img: "img/blue_eclipse.webp",
    desc: "Un perfil aromático y amaderado, fresco y elegante, pensado para el uso diario.",
    variants: [{ size: "30 ml", priceUSD: 25 }],
  },
  {
    id: 27,
    name: "Carolina Herrera Good Girl",
    ref: "Midnight Heel",
    category: "mujer",
    img: "img/midnight_heel.webp",
    desc: "Una mezcla envolvente de flores blancas, almendra y un fondo cálido y sofisticado.",
    variants: [{ size: "30 ml", priceUSD: 25 }],
  },
  {
    id: 28,
    name: "Azzaro The Most Wanted",
    ref: "Final Hour",
    category: "hombre",
    img: "img/final_hour.webp",
    desc: "Dulce, cálida y especiada, con cardamomo, caramelo y maderas de ámbar.",
    variants: [{ size: "30 ml", priceUSD: 25 }],
  },
  {
    id: 29,
    name: "YSL Y",
    ref: "Why Y",
    category: "hombre",
    img: "img/why_y.webp",
    desc: "Fresca y aromática, con manzana, salvia y maderas en un perfil limpio y moderno.",
    variants: [{ size: "30 ml", priceUSD: 25 }],
  },
  {
    id: 30,
    name: "Rabanne 1 Million",
    ref: "Crown Fortune",
    category: "hombre",
    img: "img/crown_fortune.webp",
    desc: "Un acorde cálido y especiado con cítricos, canela y una base dulce y amaderada.",
    variants: [{ size: "30 ml", priceUSD: 25 }],
  },
];

const meta = {
  1: ["Oriental", "duppe", ["Dulce", "Amaderada"]],
  2: ["Cuero", "duppe", ["Cuero", "Oriental"]],
  3: ["Oriental", "duppe", ["Especiada", "Amaderada"]],
  4: ["Ámbar", "duppe", ["Ámbar", "Frutal"]],
  5: ["Floral", "duppe", ["Floral", "Amaderada"]],
  6: ["Floral", "duppe", ["Floral", "Fresca"]],
  7: ["Gourmand", "duppe", ["Dulce", "Fresca"]],
  8: ["Frutal", "duppe", ["Frutal", "Floral"]],
  9: ["Amaderada", "duppe", ["Fresca", "Amaderada"]],
  10: ["Gourmand", "duppe", ["Dulce", "Especiada"]],
  11: ["Fresca", "duppe", ["Fresca", "Amaderada"]],
  12: ["Gourmand", "duppe", ["Dulce", "Frutal"]],
  13: ["Oriental", "duppe", ["Especiada", "Amaderada"]],
  14: ["Cuero", "duppe", ["Cuero", "Amaderada"]],
  15: ["Gourmand", "duppe", ["Dulce", "Floral"]],
  17: ["Fresca", "duppe", ["Frutal", "Fresca"]],
  18: ["Fresca", "duppe", ["Marina", "Amaderada"]],
  19: ["Floral", "eternals", ["Floral", "Frutal"]],
  20: ["Gourmand", "eternals", ["Dulce", "Especiada"]],
  21: ["Floral", "eternals", ["Floral", "Fresca"]],
  22: ["Fresca", "eternals", ["Fresca", "Frutal"]],
  23: ["Oriental", "eternals", ["Oud", "Amaderada"]],
  24: ["Fresca", "eternals", ["Fresca", "Gourmand"]],
  25: ["Oriental", "compoundone", ["Especiada", "Amaderada"]],
  26: ["Amaderada", "compoundone", ["Fresca", "Amaderada"]],
  27: ["Floral", "compoundone", ["Floral", "Oriental"]],
  28: ["Gourmand", "compoundone", ["Dulce", "Especiada"]],
  29: ["Fresca", "compoundone", ["Fresca", "Amaderada"]],
  30: ["Gourmand", "compoundone", ["Dulce", "Especiada"]],
};

products.forEach((p) => {
  const m = meta[p.id] || ["Amaderada", "duppe", []];
  p.family = m[0];
  p.collection = m[1];
  p.tags = m[2] || [];
});
let cart = JSON.parse(localStorage.getItem("kovaCart") || "[]"),
  favorites = new Set(
    JSON.parse(localStorage.getItem("kovaFavorites") || "[]"),
  );
let filters = {
    category: "todos",
    family: "todos",
    collection: "todos",
    favorites: false,
  },
  slides = [...document.querySelectorAll(".hero-slide")],
  slide = 0;
const siteHeader = document.querySelector("header");
function syncHeroHeaderContrast() {
  siteHeader.classList.remove("header-contrast-light");
  const logoImg = document.querySelector(".logo-image");
  if (logoImg) logoImg.src = "img/kova-k-blanca-transparente.png";
}
syncHeroHeaderContrast();
const $ = (id) => document.getElementById(id);
function money(n) {
  return `$${n.toFixed(2).replace(".00", "")} USD`;
}
setInterval(() => {
  slides[slide]?.classList.remove("active");
  slide = (slide + 1) % slides.length;
  slides[slide]?.classList.add("active");
  syncHeroHeaderContrast();
}, 5500);
function save() {
  localStorage.setItem("kovaCart", JSON.stringify(cart));
  localStorage.setItem("kovaFavorites", JSON.stringify([...favorites]));
}
function filtered() {
  const q = $("searchInput").value.toLowerCase().trim();
  return products.filter(
    (p) =>
      (filters.category === "todos" || p.category === filters.category) &&
      (filters.family === "todos" || p.family === filters.family) &&
      (filters.collection === "todos" || p.collection === filters.collection) &&
      (!filters.favorites || favorites.has(p.id)) &&
      (!q ||
        [p.name, p.ref, p.desc, p.family, ...p.tags]
          .join(" ")
          .toLowerCase()
          .includes(q)),
  );
}
function render() {
  const items = filtered();
  $("resultCount").textContent =
    `${items.length} fragancia${items.length === 1 ? "" : "s"}`;
  $("catalogGrid").innerHTML = items.length
    ? items.map((p) => card(p)).join("")
    : `<div class="empty"><i class="fa-solid fa-magnifying-glass" style="font-size:2rem;margin-bottom:12px"></i><p>No encontramos fragancias con esos criterios.</p><button class="tab-btn" onclick="clearFilters()" style="margin-top:14px">Ver todo</button></div>`;
}
function card(p) {
  return `<article class="card" onclick="openDetail(${p.id})"><div class="pic"><span class="tag">${p.category}</span><button class="fav ${favorites.has(p.id) ? "active" : ""}" onclick="event.stopPropagation();toggleFav(${p.id})" aria-label="Favorito"><i class="fa-${favorites.has(p.id) ? "solid" : "regular"} fa-heart"></i></button><img src="${p.img}" alt="${p.ref}" onerror="this.style.opacity=.2"></div><div class="card-body"><h3>${p.ref}</h3><div class="inspired">Inspirado en ${p.name}</div><p class="desc">${p.desc}</p><div class="chips"><span class="chip">${p.family}</span>${p.tags.map((t) => `<span class="chip">${t}</span>`).join("")}</div><div class="actions" onclick="event.stopPropagation()"><select class="variant" id="v-${p.id}">${p.variants.map((v, i) => `<option value="${i}">${v.size} —${v.priceUSD} USD</option>`).join("")}</select><button class="add" onclick="addToCart(${p.id})"><i class="fa-solid fa-bag-shopping"></i> Agregar al carrito</button></div></div></article>`;
}
function toggleFav(id) {
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  save();
  render();
  updateFavButtons();
}
function updateFavButtons() {
  const b = $("favFilter");
  b.classList.toggle("active", filters.favorites);
  b.innerHTML = filters.favorites
    ? '<i class="fa-solid fa-heart"></i> Solo favoritos'
    : '<i class="fa-regular fa-heart"></i> Solo favoritos';
}
function clearFilters() {
  filters = {
    category: "todos",
    family: "todos",
    collection: "todos",
    favorites: false,
  };
  $("searchInput").value = "";
  $("categoryFilter").value = "todos";
  $("familyFilter").value = "todos";
  $("collectionFilter").value = "todos";
  render();
  updateFavButtons();
}
window.clearFilters = clearFilters;
function addToCart(id, variantIndex = null) {
  const p = products.find((x) => x.id === id),
    sel = $(`v-${id}`);
  const v = p.variants[variantIndex ?? Number(sel.value)];
  let item = cart.find((x) => x.id === id && x.size === v.size);
  if (item) item.quantity++;
  else
    cart.push({
      id,
      ref: p.ref,
      name: p.name,
      img: p.img,
      size: v.size,
      priceUSD: v.priceUSD,
      quantity: 1,
    });
  save();
  updateCart();
}
function addCombo() {
  const selected = [...document.querySelectorAll(".combo-check:checked")].map(
    (x) => Number(x.value),
  );
  if (selected.length < 2) return;
  selected.forEach((id) => addComboItem(id));
  save();
  updateCart();
  openCart();
  document.querySelectorAll(".combo-check").forEach((x) => (x.checked = false));
  updateCombo();
}
function addComboItem(id) {
  const p = products.find((x) => x.id === id),
    v = p.variants[0];
  let item = cart.find((x) => x.id === id && x.size === v.size);
  if (item) item.quantity++;
  else
    cart.push({
      id: p.id,
      ref: p.ref,
      name: p.name,
      img: p.img,
      size: v.size,
      priceUSD: v.priceUSD,
      quantity: 1,
    });
}
function updateCart() {
  let total = 0,
    count = 0;
  $("cartItems").innerHTML = cart.length
    ? cart
        .map((x, i) => {
          total += x.priceUSD * x.quantity;
          count += x.quantity;
          return `<div class="cart-item"><img src="${x.img}"><div><b>${x.ref}</b><small style="display:block;color:#777">${x.size} • ${x.priceUSD} USD</small><div class="qty"><button onclick="qty(${i},-1)">−</button><b>${x.quantity}</b><button onclick="qty(${i},1)">+</button><button onclick="removeItem(${i})" style="margin-left:auto;color:#b44;border:0;background:none"><i class="fa-solid fa-trash"></i></button></div></div></div>`;
        })
        .join("")
    : `<div style="text-align:center;color:#888;padding:60px 10px">Tu carrito está vacío.</div>`;
  $("cartCount").textContent = count;
  $("cartTotal").textContent = money(total);
  let msg =
    "Hola! Quisiera realizar el siguiente pedido en *KOVA Essentials*:%0A%0A";
  cart.forEach(
    (x) =>
      (msg += `• *${x.ref}* (${x.size}) × ${x.quantity} — ${x.priceUSD * x.quantity} USD%0A`),
  );
  msg += `%0A*Total:* ${total} USD`;
  $("sendWhatsApp").href = cart.length
    ? `https://wa.me/5355360008?text=${msg}`
    : "#";
}
function qty(i, d) {
  cart[i].quantity += d;
  if (cart[i].quantity <= 0) cart.splice(i, 1);
  save();
  updateCart();
}
function removeItem(i) {
  cart.splice(i, 1);
  save();
  updateCart();
}
function lockPage() {
  document.body.classList.add("modal-open");
}
function unlockPage() {
  if (
    !$("cart").classList.contains("open") &&
    !$("detailModal").classList.contains("open") &&
    !$("explore").classList.contains("open")
  )
    document.body.classList.remove("modal-open");
}
function openCart() {
  $("cart").classList.add("open");
  $("overlay").classList.add("open");
  lockPage();
}
function closeCart() {
  $("cart").classList.remove("open");
  $("overlay").classList.remove("open");
  unlockPage();
}
function openDetail(id) {
  const p = products.find((x) => x.id === id);
  $("detailContent").innerHTML =
    `<div class="detail"><img src="${p.img}"><div><div class="meta">${p.category} • ${p.family}</div><h2>${p.ref}</h2><p style="color:var(--gold);font-weight:600;margin:5px 0 15px">Inspirado en ${p.name}</p><p style="color:#666">${p.desc}</p><div class="chips" style="margin-top:18px">${p.tags.map((t) => `<span class="chip">${t}</span>`).join("")}<span class="chip">${p.collection === "duppe" ? "Duppé" : p.collection === "eternals" ? "Eternals Perfume Oil" : "Compound One"}</span></div><select class="variant" id="detail-v-${p.id}">${p.variants.map((v, i) => `<option value="${i}">${v.size} —${v.priceUSD} USD</option>`).join("")}</select><button class="add" style="margin-top:12px" onclick="addToCart(${p.id},Number(document.getElementById('detail-v-${p.id}').value));$('detailModal').classList.remove('open');unlockPage()">Agregar al carrito</button></div></div>`;
  $("detailModal").classList.add("open");
  lockPage();
}
function updateCombo() {
  const checked = [...document.querySelectorAll(".combo-check:checked")];
  let sub = checked.reduce((s, c) => s + Number(c.dataset.price), 0),
    n = checked.length;
  let pct = n >= 6 ? 0.15 : n >= 4 ? 0.1 : n >= 2 ? 0.05 : 0,
    disc = sub * pct;
  $("comboQty").textContent = n;
  $("comboSubtotal").textContent = money(sub);
  $("comboDiscount").textContent = disc ? `−${money(disc)}` : "$0 USD";
  $("comboTotal").textContent = money(sub - disc);
  $("comboHint").textContent =
    n < 2
      ? "Selecciona al menos 2 fragancias."
      : `Descuento aplicado: ${Math.round(pct * 100)}%`;
  $("addCombo").disabled = n < 2;
}
function renderCombo() {
  $("comboList").innerHTML = products
    .map((p) => {
      const v = p.variants[0];
      return `<label class="combo-option"><input class="combo-check" type="checkbox" value="${p.id}" data-price="${v.priceUSD}"><span><b>${p.ref}</b><small style="display:block;color:#999">${v.size} • ${v.priceUSD} USD</small></span></label>`;
    })
    .join("");
  document
    .querySelectorAll(".combo-check")
    .forEach((x) => x.addEventListener("change", updateCombo));
}

$("searchToggle").addEventListener("click", () => {
  const open = $("searchPanel").classList.toggle("open");
  if (open) {
    setTimeout(() => $("searchInput").focus(), 40);
  } else {
    $("searchInput").blur();
  }
});
$("searchSubmit").addEventListener("click", () => {
  $("searchPanel").classList.remove("open");
  $("searchInput").blur();
});
$("searchInput").addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    $("searchPanel").classList.remove("open");
    $("searchInput").blur();
  }
});
$("searchInput").addEventListener("input", render);
$("categoryFilter").addEventListener("change", (e) => {
  filters.category = e.target.value;
  render();
});
$("familyFilter").addEventListener("change", (e) => {
  filters.family = e.target.value;
  render();
});
$("collectionFilter").addEventListener("change", (e) => {
  filters.collection = e.target.value;
  render();
});
$("favFilter").addEventListener("click", () => {
  filters.favorites = !filters.favorites;
  render();
  updateFavButtons();
});
$("clearFilters").addEventListener("click", clearFilters);
$("quickFav").addEventListener("click", () => {
  $("filterDrawer").classList.add("open");
  filters.favorites = true;
  render();
  updateFavButtons();
  $("catalog").scrollIntoView({ behavior: "smooth" });
});
$("filterToggle").addEventListener("click", () => {
  const open = $("filterDrawer").classList.toggle("open");
  $("filterToggle").classList.toggle("open", open);
});
$("cartToggle").addEventListener("click", openCart);
$("closeCart").addEventListener("click", closeCart);
$("overlay").addEventListener("click", closeCart);
$("detailClose").addEventListener("click", () => {
  $("detailModal").classList.remove("open");
  unlockPage();
});
$("detailModal").addEventListener("click", (e) => {
  if (e.target.id === "detailModal") {
    $("detailModal").classList.remove("open");
    unlockPage();
  }
});
$("addCombo").addEventListener("click", addCombo);

// Control de apertura/cierre de la hamburguesa y bloqueo de scroll
$("exploreBtn").addEventListener("click", () => {
  const isOpen = $("explore").classList.toggle("open");
  if (isOpen) lockPage();
  else unlockPage();
});
document.addEventListener("click", (e) => {
  if (
    !$("explore").contains(e.target) &&
    $("explore").classList.contains("open")
  ) {
    $("explore").classList.remove("open");
    unlockPage();
  }
});
document.querySelectorAll(".explore-menu button").forEach((b) =>
  b.addEventListener("click", () => {
    if (b.dataset.category) {
      filters.category = b.dataset.category;
      $("categoryFilter").value = b.dataset.category;
      filters.family = "todos";
      filters.collection = "todos";
      filters.favorites = false;
      $("familyFilter").value = "todos";
      $("collectionFilter").value = "todos";
      render();
      $("catalog").scrollIntoView({ behavior: "smooth" });
    } else if (b.dataset.jump) {
      if (b.dataset.jump === "favorites") {
        filters.category = "todos";
        filters.family = "todos";
        filters.collection = "todos";
        filters.favorites = true;
        $("categoryFilter").value = "todos";
        $("familyFilter").value = "todos";
        $("collectionFilter").value = "todos";
        render();
        updateFavButtons();
        $("catalog").scrollIntoView({ behavior: "smooth" });
      } else {
        document
          .getElementById(b.dataset.jump)
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }
    $("explore").classList.remove("open");
    unlockPage();
  }),
);
document.querySelectorAll(".collection").forEach((b) =>
  b.addEventListener("click", () => {
    if (b.dataset.collection) {
      filters.collection = b.dataset.collection;
      $("collectionFilter").value = b.dataset.collection;
      render();
      $("catalog").scrollIntoView({ behavior: "smooth" });
    }
  }),
);
renderCombo();
render();
updateCart();
