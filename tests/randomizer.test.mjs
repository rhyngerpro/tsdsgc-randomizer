// Pruebas de la lógica. Ejecutar con:  node --test tests/randomizer.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { drawMany, drawOne, collectBaseNames } from '../js/randomizer.js';
import { applyFilters } from '../js/filters.js';

const all = JSON.parse(readFileSync(new URL('../data/characters.json', import.meta.url)))
  .map((c, id) => ({ ...c, id }));
const noFilter = { grade: [], race: [], attribute: [] };

test('nunca repite nombres base en 2000 sorteos', () => {
  for (let n = 0; n < 2000; n++) {
    const wildcard = drawOne(all);
    const squad = drawMany(all, 4, [wildcard]);
    const team = [wildcard, ...squad];
    const total = team.reduce((s, c) => s + c.baseNames.length, 0);
    assert.equal(squad.length, 4);
    assert.equal(collectBaseNames(team).size, total);
  }
});

test('los duales bloquean a ambos personajes', () => {
  const dual = all.find((c) => c.baseNames.length === 2 && c.baseNames.includes('Meliodas'));
  for (let n = 0; n < 300; n++) {
    const squad = drawMany(all, 4, [dual]);
    for (const c of squad) {
      assert.ok(!c.baseNames.some((b) => dual.baseNames.includes(b)));
    }
  }
});

test('OR dentro del grupo, AND entre grupos', () => {
  const r = applyFilters(all, { grade: ['ur', 'ssr'], race: ['fairy'], attribute: [] });
  assert.ok(r.length > 0);
  assert.ok(r.every((c) => ['ur', 'ssr'].includes(c.grade) && c.races.includes('fairy')));
  const two = applyFilters(all, { grade: [], race: ['demon', 'fairy'], attribute: [] });
  assert.ok(two.every((c) => c.races.includes('demon') || c.races.includes('fairy')));
  const dark = applyFilters(all, { grade: [], race: [], attribute: ['light'] });
  assert.ok(dark.some((c) => c.attributes.length === 2)); // híbrido luz+oscuridad entra
});

test('sin suficientes personajes devuelve menos de 4 (slots vacíos)', () => {
  const pool = applyFilters(all, { grade: ['ur'], race: ['goddess'], attribute: [] });
  const squad = drawMany(pool, 4);
  assert.ok(squad.length <= pool.length && squad.length < 4);
});
