import { products } from '../data/products.js';
import { state, $ } from '../state/state.js';
import { filtered } from './filters.js';

export function render(){
  const items=filtered();
  $('resultCount').textContent=`${items.length} fragancia${items.length===1?'':'s'}`;
  $('catalogGrid').innerHTML=items.length?items.map(p=>card(p)).join(''):`<div class="empty"><i class="fa-solid fa-magnifying-glass" style="font-size:2rem;margin-bottom:12px"></i><p>No encontramos fragancias con esos criterios.</p><button class="tab-btn" onclick="clearFilters()" style="margin-top:14px">Ver todo</button></div>`;
}

export function card(p){
  return `<article class="card" onclick="openDetail(${p.id})"><div class="pic"><span class="tag">${p.category}</span><button class="fav ${state.favorites.has(p.id)?'active':''}" onclick="event.stopPropagation();toggleFav(${p.id})" aria-label="Favorito"><i class="fa-${state.favorites.has(p.id)?'solid':'regular'} fa-heart"></i></button><img src="${p.img}" alt="${p.ref}" onerror="this.style.opacity=.2"></div><div class="card-body"><h3>${p.ref}</h3><div class="inspired">Inspirado en ${p.name}</div><p class="desc">${p.desc}</p><div class="chips"><span class="chip">${p.family}</span>${p.tags.map(t=>`<span class="chip">${t}</span>`).join('')}</div><div class="actions" onclick="event.stopPropagation()"><select class="variant" id="v-${p.id}">${p.variants.map((v,i)=>`<option value="${i}">${v.size} —${v.priceUSD} USD</option>`).join('')}</select><button class="add" onclick="addToCart(${p.id})"><i class="fa-solid fa-bag-shopping"></i> Agregar al carrito</button></div></div></article>`;
}

export function toggleFav(id){
  state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);
}
