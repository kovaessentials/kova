import { products } from '../data/products.js';
import { state, $, money, persist } from '../state/state.js';

export function addToCart(id,variantIndex=null){
  const p=products.find(x=>x.id===id), sel=$(`v-${id}`);
  const v=p.variants[variantIndex??Number(sel.value)];
  let item=state.cart.find(x=>x.id===id&&x.size===v.size);
  if(item)item.quantity++;
  else state.cart.push({id,ref:p.ref,name:p.name,img:p.img,size:v.size,priceUSD:v.priceUSD,quantity:1});
  persist();
  updateCart();
}

export function addComboItem(id){
  const p=products.find(x=>x.id===id),v=p.variants[0];
  let item=state.cart.find(x=>x.id===id&&x.size===v.size);
  if(item)item.quantity++;
  else state.cart.push({id:p.id,ref:p.ref,name:p.name,img:p.img,size:v.size,priceUSD:v.priceUSD,quantity:1});
}

export function updateCart(){
  let total=0,count=0;
  $('cartItems').innerHTML=state.cart.length?state.cart.map((x,i)=>{
    total+=x.priceUSD*x.quantity;count+=x.quantity;
    return `<div class="cart-item"><img src="${x.img}"><div><b>${x.ref}</b><small style="display:block;color:#777">${x.size} • ${x.priceUSD} USD</small><div class="qty"><button onclick="qty(${i},-1)">−</button><b>${x.quantity}</b><button onclick="qty(${i},1)">+</button><button onclick="removeItem(${i})" style="margin-left:auto;color:#b44;border:0;background:none"><i class="fa-solid fa-trash"></i></button></div></div></div>`;
  }).join(''):`<div style="text-align:center;color:#888;padding:60px 10px">Tu carrito está vacío.</div>`;
  $('cartCount').textContent=count;
  $('cartTotal').textContent=money(total);
  let msg='Hola! Quisiera realizar el siguiente pedido en *KOVA Essentials*:%0A%0A';
  state.cart.forEach(x=>msg+=`• *${x.ref}* (${x.size}) × ${x.quantity} — ${x.priceUSD*x.quantity} USD%0A`);
  msg+=`%0A*Total:* ${total} USD`;
  $('sendWhatsApp').href=state.cart.length?`https://wa.me/5355360008?text=${msg}`:'#';
}

export function qty(i,d){state.cart[i].quantity+=d;if(state.cart[i].quantity<=0)state.cart.splice(i,1);persist();updateCart()}
export function removeItem(i){state.cart.splice(i,1);persist();updateCart()}
