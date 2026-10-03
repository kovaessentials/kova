import { loadCart, loadFavorites, saveCart, saveFavorites } from '../storage/storage.js';

export const state = {
  cart: loadCart(),
  favorites: new Set(loadFavorites()),
  filters: { category:'todos', family:'todos', collection:'todos', favorites:false }
};

export const $ = id => document.getElementById(id);
export const money = n => `$${n.toFixed(2).replace('.00','')} USD`;
export function persist(){
  saveCart(state.cart);
  saveFavorites(state.favorites);
}
