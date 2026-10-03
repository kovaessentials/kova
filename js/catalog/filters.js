import { products } from '../data/products.js';
import { state, $ } from '../state/state.js';

export function filtered(){
  const q=$('searchInput').value.toLowerCase().trim();
  return products.filter(p=>
    (state.filters.category==='todos'||p.category===state.filters.category)&&
    (state.filters.family==='todos'||p.family===state.filters.family)&&
    (state.filters.collection==='todos'||p.collection===state.filters.collection)&&
    (!state.filters.favorites||state.favorites.has(p.id))&&
    (!q||[p.name,p.ref,p.desc,p.family,...p.tags].join(' ').toLowerCase().includes(q))
  );
}

export function updateFavButtons(){
  const b=$('favFilter');
  b.classList.toggle('active',state.filters.favorites);
  b.innerHTML=state.filters.favorites?'<i class="fa-solid fa-heart"></i> Solo favoritos':'<i class="fa-regular fa-heart"></i> Solo favoritos';
}

export function clearFilters(){
  state.filters={category:'todos',family:'todos',collection:'todos',favorites:false};
  $('searchInput').value='';
  $('categoryFilter').value='todos';
  $('familyFilter').value='todos';
  $('collectionFilter').value='todos';
}
