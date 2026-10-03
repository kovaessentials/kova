import { products } from '../data/products.js';
import { $, state } from '../state/state.js';
import { addToCart } from '../cart/cart.js';

export function lockPage(){document.body.classList.add('modal-open')}
export function unlockPage(){if(!$('cart').classList.contains('open')&&!$('detailModal').classList.contains('open')&&!$('explore').classList.contains('open'))document.body.classList.remove('modal-open')}
export function openCart(){$('cart').classList.add('open');$('overlay').classList.add('open');lockPage()}
export function closeCart(){$('cart').classList.remove('open');$('overlay').classList.remove('open');unlockPage()}
export function openDetail(id){
  const p=products.find(x=>x.id===id);
  $('detailContent').innerHTML=`<div class="detail"><img src="${p.img}"><div><div class="meta">${p.category} • ${p.family}</div><h2>${p.ref}</h2><p style="color:var(--gold);font-weight:600;margin:5px 0 15px">Inspirado en ${p.name}</p><p style="color:#666">${p.desc}</p><div class="chips" style="margin-top:18px">${p.tags.map(t=>`<span class="chip">${t}</span>`).join('')}<span class="chip">${p.collection==='duppe'?'Duppé':p.collection==='eternals'?'Eternals Perfume Oil':'Compound One'}</span></div><select class="variant" id="detail-v-${p.id}">${p.variants.map((v,i)=>`<option value="${i}">${v.size} —${v.priceUSD} USD</option>`).join('')}</select><button class="add" style="margin-top:12px" onclick="addToCart(${p.id},Number(document.getElementById('detail-v-${p.id}').value));document.getElementById('detailModal').classList.remove('open');unlockPage()">Agregar al carrito</button></div></div>`;
  $('detailModal').classList.add('open');lockPage();
}
