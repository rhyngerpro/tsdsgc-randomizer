// filters.js — Opciones de filtros y la regla para decidir si un personaje pasa.
//
// REGLA:
//  - Dentro de un grupo basta cumplir UNA opción marcada (OR).
//  - Entre grupos hay que cumplir TODOS (AND).
//  - Un grupo sin nada marcado no filtra.

const ICONS = 'assets/images/';

// Lista de opciones. `value` debe coincidir con lo que dice el JSON.
export const FILTER_GROUPS = {
  grade: [
    { value: 'ur',  icon: ICONS + 'ur.png',  label: 'UR' },
    { value: 'ssr', icon: ICONS + 'ssr.png', label: 'SSR' },
    { value: 'sr',  icon: ICONS + 'sr.png',  label: 'SR' },
    { value: 'r',   icon: ICONS + 'r.png',   label: 'R' },
  ],
  race: [
    { value: 'human',   icon: ICONS + 'race_human.png',   label: 'Humano' },
    { value: 'giant',   icon: ICONS + 'race_giant.png',   label: 'Gigante' },
    { value: 'demon',   icon: ICONS + 'race_demon.png',   label: 'Demonio' },
    { value: 'goddess', icon: ICONS + 'race_goddess.png', label: 'Diosa' },
    { value: 'fairy',   icon: ICONS + 'race_fairy.png',   label: 'Hada' },
    { value: 'unknown', icon: ICONS + 'race_unknown.png', label: 'Desconocida' },
  ],
  attribute: [
    { value: 'strength', icon: ICONS + 'attribute_strength.png', label: 'Rojo (fuerza)' },
    { value: 'dark',     icon: ICONS + 'attribute_dark.png',     label: 'Oscuridad' },
    { value: 'speed',    icon: ICONS + 'attribute_speed.png',    label: 'Azul (velocidad)' },
    { value: 'light',    icon: ICONS + 'attribute_light.png',    label: 'Luz' },
    { value: 'hp',       icon: ICONS + 'attribute_hp.png',       label: 'Verde (HP)' },
  ],
};

// Un filtro activo se ve así: { grade: ['ur','ssr'], race: ['fairy'], attribute: [] }

// El JSON escribe "darkness" pero el ícono se llama "dark". Unificamos aquí.
function normalizeAttribute(value) {
  return value === 'darkness' ? 'dark' : value;
}

// ¿Este personaje cumple el filtro?
export function matchesFilters(character, filters) {
  const gradeOk =
    filters.grade.length === 0 || filters.grade.includes(character.grade);

  const raceOk =
    filters.race.length === 0 ||
    character.races.some((race) => filters.race.includes(race));

  const attributeOk =
    filters.attribute.length === 0 ||
    character.attributes.some((attr) =>
      filters.attribute.includes(normalizeAttribute(attr))
    );

  // AND entre grupos
  return gradeOk && raceOk && attributeOk;
}

// Devuelve solo los personajes que pasan el filtro.
export function applyFilters(characters, filters) {
  return characters.filter((character) => matchesFilters(character, filters));
}
