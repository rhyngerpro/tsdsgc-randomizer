# Grand Cross Randomizer

Randomizador de equipos para The Seven Deadly Sins: Grand Cross (HTML + CSS + JavaScript moderno con módulos).

## Cómo abrirlo
1. Abre esta carpeta en VS Code (Archivo → Abrir carpeta).
2. Instala la extensión **Live Server** (Ritwick Dey).
3. Clic derecho en `index.html` → **Open with Live Server**.

> Con doble clic NO funciona: los módulos de JavaScript y `fetch` necesitan un servidor.

## Qué hace cada archivo
| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura de la página |
| `css/styles.css` | Colores y diseño (tema oscuro/claro) |
| `js/data.js` | Carga `data/characters.json` |
| `js/filters.js` | Opciones de filtros y la regla OR / AND |
| `js/randomizer.js` | El sorteo y la regla de no repetir (sin tocar la pantalla) |
| `js/ui.js` | Dibuja filtros, casillas y botones |
| `js/main.js` | Conecta todo: botones y estado |
| `data/characters.json` | Lista de personajes |
| `tests/randomizer.test.mjs` | Pruebas: `node --test tests/randomizer.test.mjs` |

## Cómo agregar un personaje
Agrega un bloque al final de `data/characters.json` (cuida las comas) y copia su imagen a `assets/images/`:

```json
{
  "name": "Meliodas Lostvayne [Ejemplo]",
  "image": "assets/images/[Ejemplo] Meliodas Lostvayne.png",
  "grade": "ssr",
  "races": ["demon"],
  "attributes": ["strength"],
  "baseNames": ["Meliodas"]
}
```

- `grade`: `ur`, `ssr`, `sr` o `r`
- `races`: `human`, `giant`, `demon`, `goddess`, `fairy`, `unknown` (puede haber varias)
- `attributes`: `strength` (rojo), `speed` (azul), `hp` (verde), `light`, `darkness` (puede haber varios)
- `baseNames`: el/los personajes "de fondo". Dos personajes que compartan un nombre base no salen juntos. Un dual lleva dos: `["Merlin", "Escanor"]`. Escríbelo igual siempre (`"Meliodas"`, no `"Meliodas "`).

## Reglas del sorteo
- Filtros: dentro de un grupo basta cumplir una opción; entre grupos hay que cumplir todos. Se leen al sortear, no cambian el equipo actual.
- No se repite el nombre base entre el comodín y los 4 slots.
- Si no hay suficientes personajes distintos, los slots sobrantes quedan vacíos y sale un aviso.
