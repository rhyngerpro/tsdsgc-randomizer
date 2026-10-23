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
    { value: 'human',   icon: ICONS + 'race_human.png',   label: 'Human' },
    { value: 'giant',   icon: ICONS + 'race_giant.png',   label: 'Giant' },
    { value: 'demon',   icon: ICONS + 'race_demon.png',   label: 'Demon' },
    { value: 'goddess', icon: ICONS + 'race_goddess.png', label: 'Goddess' },
    { value: 'fairy',   icon: ICONS + 'race_fairy.png',   label: 'Fairy' },
    { value: 'unknown', icon: ICONS + 'race_unknown.png', label: 'Unknown' },
  ],
  attribute: [
    { value: 'strength', icon: ICONS + 'attribute_strength.png', label: 'Strength (Red)' },
    { value: 'dark',     icon: ICONS + 'attribute_dark.png',     label: 'Darkness' },
    { value: 'speed',    icon: ICONS + 'attribute_speed.png',    label: 'Speed (Blue)' },
    { value: 'light',    icon: ICONS + 'attribute_light.png',    label: 'Light' },
    { value: 'hp',       icon: ICONS + 'attribute_hp.png',       label: 'HP (Green)' },
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
