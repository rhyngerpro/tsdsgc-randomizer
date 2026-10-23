// randomizer.js — La lógica del sorteo. No toca la pantalla (eso es ui.js).
//
// IDEA CLAVE: dos personajes son "repetidos" si comparten AL MENOS un nombre base.
//   Meliodas [Lostvayne] y Meliodas [Rey Demonio]  -> repetidos
//   "Elizabeth & Meliodas" y "Meliodas Demon"       -> repetidos (comparten Meliodas)

// Mezcla una lista de forma justa (algoritmo Fisher-Yates).
// Devuelve una copia, no modifica la original.
export function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Junta todos los nombres base de varios personajes en un Set.
// (un Set es una lista sin repetidos y con búsqueda rápida)
export function collectBaseNames(characters) {
  const names = new Set();
  for (const character of characters) {
    if (!character) continue; // los slots vacíos son null
    character.baseNames.forEach((name) => names.add(name));
  }
  return names;
}

// ¿Este personaje choca con alguno de los nombres ya usados?
function conflicts(character, usedNames) {
  return character.baseNames.some((name) => usedNames.has(name));
}

// Sortea hasta `count` personajes del `pool` (ya filtrado) sin repetir nombres base.
// `taken` = personajes que ya están en el equipo y no deben repetirse.
// Si no alcanzan, devuelve menos de `count` (el resto serán slots vacíos).
export function drawMany(pool, count, taken = []) {
  const used = collectBaseNames(taken);
  const result = [];

  for (const candidate of shuffle(pool)) {
    if (result.length === count) break;
    if (conflicts(candidate, used)) continue;
    result.push(candidate);
    candidate.baseNames.forEach((name) => used.add(name));
  }
  return result;
}

// Sortea UN personaje. Devuelve null si no hay ninguno válido.
export function drawOne(pool, taken = []) {
  return drawMany(pool, 1, taken)[0] ?? null;
}
