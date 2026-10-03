import { products } from '../data/products.js';
import { $, money } from '../state/state.js';
import { addComboItem, updateCart } from '../cart/cart.js';
import { openCart } from '../modal/modal.js';
import { persist } from '../state/state.js';

export function updateCombo(){
  const checked=[...document.querySelectorAll('.combo-check:checked')];
  let sub=checked.reduce((s,c)=>s+Number(c.dataset.price),0),n=checked.length;
  let pct=n>=6?.15:n>=4?.10:n>=2?.05:0,disc=sub*pct;
  $('comboQty').textContent=n;$('comboSubtotal').textContent=money(sub);$('comboDiscount').textContent=disc?`−${money(disc)}`:'$0 USD';$('comboTotal').textContent=money(sub-disc);$('comboHint').textContent=n<2?'Selecciona al menos 2 fragancias.':`Descuento aplicado: ${Math.round(pct*100)}%`;$('addCombo').disabled=n<2;
}
export function renderCombo(){
  $('comboList').innerHTML=products.map(p=>{const v=p.variants[0];return `<label class="combo-option"><input class="combo-check" type="checkbox" value="${p.id}" data-price="${v.priceUSD}"><span><b>${p.ref}</b><small style="display:block;color:#999">${v.size} • ${v.priceUSD} USD</small></span></label>`}).join('');
  document.querySelectorAll('.combo-check').forEach(x=>x.addEventListener('change',updateCombo));
}
export function addCombo(){
  const selected=[...document.querySelectorAll('.combo-check:checked')].map(x=>Number(x.value));
  if(selected.length<2)return;
  selected.forEach(id=>addComboItem(id));
  persist();updateCart();openCart();
  document.querySelectorAll('.combo-check').forEach(x=>x.checked=false);updateCombo();
}
