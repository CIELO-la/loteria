# Lotería

El juego de cartas de lotería mexicana.

(TAREA: documentar el proyecto aquí)

## Implementacíon

Por ahora realizado con `React`, y custom `js` en `./src/Game`. Antes con `boardgame.io` pero no tuvimos éxito porque nuestra concepto del juego no tiene ni turnos ni fases (aparte del cantor que nomás aumenta la gama de elecciones válidas).

## Tareas

- [X] leer (join) / elegir (host) la baraja antes de iniciar

- [X] ganar
	- [X] la verificación parece tardar hasta el próximo `.cantar`
	- [X] ROTO ya que muchas veces no se llega a verificar hasta las cartas muy últimas
	- [X] uno puede declararse ganador después del empate

- [ ] lobby
	- [X] mostrar los jugadores en el lobby
	- [ ] y más opciones para juntar o ¿nomás selecciona host?
	- [X] mostrar algo para cada jugador (imagen, cuadro)
	- [X] separar la configuración del inicio en `.iniciar`
	- [X] los joiners leen la barajaId cuando conectan
	- [X] crea el host y se juntan los joiners

- [ ] búsqueda
	- [ ] los joiners buscan juegos actuales antes de juntarse en el lobby

- [ ] demo
	- [ ] crear imágenes, audio para la baraja
	- [ ] haz que el setTimeout/.timer espere por el audio
	- [ ] elegir baraja, opciones en una página de arranque

- [ ] diseño
	- ...tareas CSS/HTML

- [X] pero ¿por qué una vez funcionó el reductor con las entradas al revés?
	- ver la función `Juego.verificar` (_un aparte_)
```
// Ejemplo del error semántico
const c = [[0, 1, 2], [1, 2, 3], [2, 3, 4]];
const a = [true, false, true, true, true];
const listOfWins = c.reduce((nextC, accA) => ( 	// en vez de pensar en (acc, next)
	[
		...accA,
		!([...nextC.map(i => a[i])].includes(false))
	]
), []);
// [2, 3, 4, false] en vez de [false, false, true]
console.log(listOfWins);
const didWin = listOfWins.includes(true);
// false en vez de true
console.log(didWin);

// Hipótesis: la penúltima condición determina el valor del booleano final
// las otras nomás almacenan o agregan números
//
// Demostración:
//
// entradas:
//  c = [[0, 1, 2], [1, 2, 3], [2, 3, 4]];
// 	a = [false, false, false, false, false];
// salidas:
// ([], [0, 1, 2]) => [0, 1, 2, false !in []]
// ([0, 1, 2, true], [1, 2, 3])  => [1, 2, 3, false !in [a[0], a[1], a[2], a[true]]]
// ([1, 2, 3, false], [2, 3, 4]) => [2, 3, 4, false !in [a[1], a[2], a[3], a[false]]]
// => [2, 3, 4, false] => false
//
// entradas:
//  c = [[0, 1, 2], [1, 2, 3], [2, 3, 4]];
// 	a = [true, true, true, true, true];
// salidas:
// ([], [0, 1, 2]) => [0, 1, 2, false !in []]
// ([0, 1, 2, true], [1, 2, 3])  => [1, 2, 3, false !in [a[0], a[1], a[2], a[true]]]
// ([1, 2, 3, true], [2, 3, 4]) => [2, 3, 4, false !in [a[1], a[2], a[3], a[false]]]
// => [2, 3, 4, true] => true
//
// entradas:
//  c = [[0, 1, 2], [1, 2, 3], [2, 3, 4]];
// 	a = [false, false, true, true, true];
// salidas:
// ([], [0, 1, 2]) => [0, 1, 2, false !in []]
// ([0, 1, 2, true], [1, 2, 3])  => [1, 2, 3, false !in [a[0], a[1], a[2], a[true]]]
// ([1, 2, 3, false], [2, 3, 4]) => [2, 3, 4, false !in [a[1], a[2], a[3], a[false]]]
// => [2, 3, 4, false] => false
//
// entradas:
//  c = [[0, 1, 2], [1, 2, 3], [2, 3, 4]];
// 	a = [false, true, true, true, false];
// salidas:
// ([], [0, 1, 2]) => [0, 1, 2, false !in []]
// ([0, 1, 2, true], [1, 2, 3])  => [1, 2, 3, false !in [a[0], a[1], a[2], a[true]]]
// ([1, 2, 3, false], [2, 3, 4]) => [2, 3, 4, false !in [a[1], a[2], a[3], a[false]]]
// => [2, 3, 4, true] => true

// probar - seleccionar el botón GANAR después de intercambiar los (acc, next) de nuevo
// - no marcar nada => false
// - marcar cada condición menos Juego.condiciones[penúltima] => false
// - marcar la condición penúltima => true
```
