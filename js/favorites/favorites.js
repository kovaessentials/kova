import { state } from '../state/state.js';
import { persist } from '../state/state.js';
import { render } from '../catalog/render.js';
import { updateFavButtons } from '../catalog/filters.js';

export function toggleFavorite(id){
  state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);
  persist();
  render();
  updateFavButtons();
}
