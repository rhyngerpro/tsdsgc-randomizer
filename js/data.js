// data.js — Carga la lista de personajes desde data/characters.json
//
// Cada personaje en el JSON tiene este formato:
// {
//   "name": "Meliodas Lostvayne [Light of the Holy War]",
//   "image": "assets/images/....png",
//   "grade": "ssr",                      // ur | ssr | sr | r   (un solo valor)
//   "races": ["demon"],                  // puede tener varias
//   "attributes": ["strength"],          // puede tener varios (ej. light + darkness)
//   "baseNames": ["Meliodas"]            // el personaje "de fondo"; los duales tienen 2
// }

export async function loadCharacters() {
  // fetch() lee el archivo. Por eso necesitas Live Server (no funciona con doble clic).
  const response = await fetch('data/characters.json');
  if (!response.ok) {
    throw new Error('No se pudo cargar data/characters.json');
  }
  const list = await response.json();

  // Le ponemos un id único a cada personaje según su posición en la lista.
  // Así dos personajes con el mismo nombre no se confunden entre sí.
  return list.map((character, index) => ({ ...character, id: index }));
}
