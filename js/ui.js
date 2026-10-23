// ui.js — Todo lo que dibuja o lee la pantalla (el DOM).
// No decide nada del sorteo: solo muestra lo que main.js le pasa.

import { FILTER_GROUPS } from './filters.js';

const SLOT_COUNT = 4;

// ---------- Filtros ----------

// Crea las casillas de cada grupo usando la lista de FILTER_GROUPS.
export function renderFilters() {
  for (const [groupName, options] of Object.entries(FILTER_GROUPS)) {
    const fieldset = document.getElementById(`filter-${groupName}`);

    for (const option of options) {
      const label = document.createElement('label');
      label.className = 'filter-option';
      label.title = option.label;

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = groupName;
      input.value = option.value;

      const icon = document.createElement('img');
      icon.src = option.icon;
      icon.alt = option.label;

      label.append(input, icon);

      // Razas: además del ícono mostramos el texto
      if (groupName === 'race') {
        const text = document.createElement('span');
        text.textContent = option.label;
        label.append(text);
      }

      fieldset.append(label);
    }
  }
}

// Lee qué casillas están marcadas.
// Devuelve algo como { grade: ['ur'], race: [], attribute: ['light','dark'] }
export function readFilters() {
  const filters = {};
  for (const groupName of Object.keys(FILTER_GROUPS)) {
    const checked = document.querySelectorAll(
      `#filter-${groupName} input:checked`
    );
    filters[groupName] = [...checked].map((input) => input.value);
  }
  return filters;
}

// ---------- Equipo ----------

// Dibuja una tarjeta de personaje (o una vacía si character es null).
function createCard(character) {
  const wrapper = document.createElement('div');
  wrapper.className = 'card-wrapper';

  const card = document.createElement('div');
  card.className = 'card' + (character ? '' : ' empty');

  if (character) {
    const img = document.createElement('img');
    // encodeURI convierte espacios y corchetes del nombre del archivo
    img.src = encodeURI(character.image);
    img.alt = character.name;
    card.append(img);
  }
  wrapper.append(card);

  const name = document.createElement('p');
  name.className = 'card-name';
  name.textContent = character ? character.name : '';
  wrapper.append(name);

  return wrapper;
}

// Dibuja las 5 casillas. `handlers.onReroll(i)` se llama al pulsar el botón de un slot.
export function renderTeam(state, handlers) {
  const team = document.getElementById('team');
  team.replaceChildren(); // vacía el contenedor

  // Casilla 0: comodín
  const wildcardCell = createCard(state.wildcard);
  wildcardCell.classList.add('wildcard');
  team.append(wildcardCell);

  // Casillas 1 a 4: el escuadrón
  for (let i = 0; i < SLOT_COUNT; i++) {
    const cell = createCard(state.slots[i]);

    // El botón de recarga solo aparece después de la primera tirada del escuadrón
    if (state.squadDrawn) {
      const btn = document.createElement('button');
      btn.className = 'reroll';
      btn.title = `Cambiar slot ${i + 1}`;
      btn.setAttribute('aria-label', `Cambiar slot ${i + 1}`);
      btn.innerHTML = '<img src="assets/images/refresh-white.svg" alt="">';
      btn.addEventListener('click', () => handlers.onReroll(i));
      cell.append(btn);
    }
    team.append(cell);
  }

  // Los textos de los botones principales cambian después de la primera vez
  document.getElementById('wildcard-btn').textContent =
    state.wildcardDrawn ? 'Change character' : 'Select character';
  document.getElementById('squad-btn').textContent =
    state.squadDrawn ? 'Change squad' : 'Select squad';
}

// ---------- Avisos y opciones ----------

export function setNotice(text = '') {
  document.getElementById('notice').textContent = text;
}

export function setCompact(isCompact) {
  document.getElementById('team').classList.toggle('compact', isCompact);
}

export function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
}
