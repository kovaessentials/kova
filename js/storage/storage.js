export function loadCart(){
  try{return JSON.parse(localStorage.getItem('kovaCart')||'[]')}catch{return []}
}
export function loadFavorites(){
  try{return JSON.parse(localStorage.getItem('kovaFavorites')||'[]')}catch{return []}
}
export function saveCart(cart){localStorage.setItem('kovaCart',JSON.stringify(cart))}
export function saveFavorites(favorites){localStorage.setItem('kovaFavorites',JSON.stringify([...favorites]))}
