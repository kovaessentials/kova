import { $, state } from '../state/state.js';
import { render } from '../catalog/render.js';
import { clearFilters, updateFavButtons } from '../catalog/filters.js';
import { lockPage, unlockPage } from '../modal/modal.js';

export function initNavigation(){
  $('exploreBtn').addEventListener('click',()=>{const isOpen=$('explore').classList.toggle('open');if(isOpen)lockPage();else unlockPage()});
  document.addEventListener('click',e=>{if(!$('explore').contains(e.target)&&$('explore').classList.contains('open')){$('explore').classList.remove('open');unlockPage()}});
  document.querySelectorAll('.explore-menu button').forEach(b=>b.addEventListener('click',()=>{
    if(b.dataset.category){
      state.filters.category=b.dataset.category;$('categoryFilter').value=b.dataset.category;state.filters.family='todos';state.filters.collection='todos';state.filters.favorites=false;$('familyFilter').value='todos';$('collectionFilter').value='todos';render();$('catalog').scrollIntoView({behavior:'smooth'});
    }else if(b.dataset.jump){
      if(b.dataset.jump==='favorites'){state.filters.category='todos';state.filters.family='todos';state.filters.collection='todos';state.filters.favorites=true;$('categoryFilter').value='todos';$('familyFilter').value='todos';$('collectionFilter').value='todos';render();updateFavButtons();$('catalog').scrollIntoView({behavior:'smooth'});}
      else document.getElementById(b.dataset.jump)?.scrollIntoView({behavior:'smooth'});
    }
    $('explore').classList.remove('open');unlockPage();
  }));
  document.querySelectorAll('.collection').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.collection){state.filters.collection=b.dataset.collection;$('collectionFilter').value=b.dataset.collection;render();$('catalog').scrollIntoView({behavior:'smooth'})}}));
}

export function initFilters(){
  $('searchInput').addEventListener('input',render);
  $('categoryFilter').addEventListener('change',e=>{state.filters.category=e.target.value;render()});
  $('familyFilter').addEventListener('change',e=>{state.filters.family=e.target.value;render()});
  $('collectionFilter').addEventListener('change',e=>{state.filters.collection=e.target.value;render()});
  $('favFilter').addEventListener('click',()=>{state.filters.favorites=!state.filters.favorites;render();updateFavButtons()});
  $('clearFilters').addEventListener('click',()=>{clearFilters();render();updateFavButtons()});
  $('quickFav').addEventListener('click',()=>{ $('filterDrawer').classList.add('open');state.filters.favorites=true;render();updateFavButtons();$('catalog').scrollIntoView({behavior:'smooth'})});
  $('filterToggle').addEventListener('click',()=>{const open=$('filterDrawer').classList.toggle('open');$('filterToggle').classList.toggle('open',open)});
}

export function initSearch(){
  $('searchToggle').addEventListener('click',()=>{const open=$('searchPanel').classList.toggle('open');if(open){setTimeout(()=>$('searchInput').focus(),40)}else $('searchInput').blur()});
  $('searchSubmit').addEventListener('click',()=>{$('searchPanel').classList.remove('open');$('searchInput').blur()});
  $('searchInput').addEventListener('keydown',e=>{if(e.key==='Escape'){$('searchPanel').classList.remove('open');$('searchInput').blur()}});
}
