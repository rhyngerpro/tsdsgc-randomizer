// main.js — Conecta todo: carga datos, escucha botones y llama al sorteo.

import { loadCharacters } from './data.js';
import { applyFilters } from './filters.js';
import { drawMany, drawOne } from './randomizer.js';
import {
  renderFilters, readFilters, renderTeam,
  setNotice, setCompact, setTheme,
} from './ui.js';

// Estado de la aplicación: lo que se ve en pantalla ahora mismo.
const state = {
  wildcard: null,              // personaje del comodín (o null)
  slots: [null, null, null, null], // slots 1 a 4
  wildcardDrawn: false,        // ¿ya se sorteó el comodín alguna vez?
  squadDrawn: false,           // ¿ya se sorteó el escuadrón alguna vez?
};

let allCharacters = [];

// Personajes que cumplen los filtros AHORA (los filtros se leen al sortear).
function currentPool() {
  return applyFilters(allCharacters, readFilters());
}

function refresh() {
  renderTeam(state, { onReroll: rerollSlot });
}

// ---------- Acciones ----------

// Botón "Select/Change squad": sortea los 4 slots a la vez.
// No repite personajes entre sí ni con el comodín.
function drawSquad() {
  const drawn = drawMany(currentPool(), 4, [state.wildcard]);

  // Si salieron menos de 4, los slots restantes quedan vacíos (null)
  state.slots = [0, 1, 2, 3].map((i) => drawn[i] ?? null);
  state.squadDrawn = true;

  if (drawn.length < 4) {
    setNotice(
      drawn.length === 0
        ? 'Ningún personaje cumple esos filtros.'
        : `Con esos filtros solo hay ${drawn.length} personaje(s) distinto(s).`
    );
  } else {
    setNotice('');
  }
  refresh();
}

// Botón "Select/Change character": sortea solo el comodín.
// No repite personajes que ya estén en los 4 slots.
function drawWildcard() {
  const pool = currentPool().filter((c) => c.id !== state.wildcard?.id);
  const picked = drawOne(pool, state.slots);

  state.wildcardDrawn = true;
  if (picked) {
    state.wildcard = picked;
    setNotice('');
  } else {
    setNotice('No hay otro personaje disponible con esos filtros.');
  }
  refresh();
}

// Botón de recarga de un slot: cambia solo ese slot.
// No repite al comodín ni a los otros 3 slots.
function rerollSlot(index) {
  const others = state.slots.filter((_, i) => i !== index);
  const current = state.slots[index];

  const pool = currentPool().filter((c) => c.id !== current?.id);
  const picked = drawOne(pool, [state.wildcard, ...others]);

  if (picked) {
    state.slots[index] = picked;
    setNotice('');
  } else {
    setNotice('No hay otro personaje disponible con esos filtros.');
  }
  refresh();
}

// ---------- Inicio ----------

function setupOptions() {
  // Plegar / desplegar filtros
  const toggle = document.getElementById('filters-toggle');
  const panel = document.getElementById('filters-panel');
  toggle.addEventListener('click', () => {
    const open = panel.classList.toggle('hidden') === false;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.chevron').textContent = open ? '▴' : '▾';
  });

  // Versión compacta
  document.getElementById('compact-toggle')
    .addEventListener('change', (e) => setCompact(e.target.checked));

  // Tema claro/oscuro (se recuerda entre visitas)
  const themeToggle = document.getElementById('theme-toggle');
  try {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setTheme(saved);
      themeToggle.checked = saved === 'light';
    }
  } catch { /* si el navegador bloquea localStorage, no pasa nada */ }

  themeToggle.addEventListener('change', (e) => {
    const theme = e.target.checked ? 'light' : 'dark';
    setTheme(theme);
    try { localStorage.setItem('theme', theme); } catch { /* ignorar */ }
  });
}

async function init() {
  renderFilters();
  setupOptions();

  try {
    allCharacters = await loadCharacters();
  } catch (error) {
    setNotice('Error al cargar los personajes. ¿Abriste la página con Live Server?');
    console.error(error);
    return;
  }

  document.getElementById('squad-btn').addEventListener('click', drawSquad);
  document.getElementById('wildcard-btn').addEventListener('click', drawWildcard);
  refresh(); // dibuja las 5 casillas vacías
}

init();
