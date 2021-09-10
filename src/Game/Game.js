import { barajas } from './barajas';
import { dbSub } from './db';

/* Game-db interactions
 *
 * 1) lock someone in as writer when load
 * 2) writerʻs Cantor writes the barajaId and shuffled deck
 * 3) everyone reads barajaId and shuffled deck from db
 * 4) writer's Cantor updates the cantada index each call and checks status
 * 		- if status is win go to 6
 * 5) everyone reads the cantada index (every whatever?)
 *
 * 6) winner status, display win message
 * 7) draw status - how to handle?
 *
 */

// for step #1, determining writer (host):
//  - APP: I start game
// 		(- GAME & STORE: add players: [playerId, ...], host: playerId)
// 		- GAME: wait for Game.js to talk to Firestore
// 		- STORE: write new doc { playerId }
// 		- GAME: tell me I'm host and from now on I write
// - APP: I join game
// 		- GAME: give me document id to snapshot listen
// 		https://firebase.google.com/docs/firestore/query-data/listen

// TAREA: estatus del juego como "jugando" o se armó o se acabó
class Cantor {
	constructor(barajaId, isHost) {
		// remote store setup
		//deposito = dbSub();

		// TODO: placeholder for authorization!
		this.isHost = isHost;

		// referencia a las cartas no barajadas
		this.barajaId = barajaId;

		// las cartas barajadas
		// estructura == [{ id: '', nombre: '', imagen: '', ... }, ...]
		this.cartas = [...barajas[barajaId]].map((carta, id) => ({
			id,
			...carta
		}));

		// tabla para cada jugador == 16 [[cartaId, estaMarcada], ...]
		// véase la función .registrar y el depósito
		this.tablas = [];

		this.cantadas = 0;

		this.timer = null;

		// cuatro/n tabla slotIds que estén marcadas
		this.condiciones = [
			[0, 1, 2, 3],
			[4, 5, 6, 7],
			[8, 9, 10, 11],
			[12, 13, 14, 15],
			[0, 4, 8, 12],
			[1, 5, 9, 13],
			[2, 6, 10, 14],
			[3, 7, 11, 15],
		];
	}

	registrar = () => {
		// barajar tabla de 16 cartas e indicar si están marcadas
		this.tablas.push([
			...this.barajar(this.cartas).slice(0, 16).map(carta => (
				[ carta, false ]
			))
		]);
		// usar tabla id como jugadorId
		return this.tablas.length-1;
	};

	iniciar = async (juegoId, callback) => {
		// TAREA: error de vuelta si no hay juego
		if (!this.isHost && !juegoId) {
			console.log(`Game.js -- no hay ni host ni juego`);
			return;
		}

		// objeto con métodos para leer y modificar - véase el db.js
		const deposito = await dbSub(juegoId, gameDoc => {
			this.cantar();
			console.log(`Reading data from snapshot to call card ${gameDoc.data().cantadas}`);
			return callback({
				type: 'carta',
				cartaCantada: this.cantar(),
				estatus: gameDoc.data().estatus
			});
		});

		this.cartas = this.barajar(this.cartas);

		// TAREA: leer o modificar
		console.log(deposito);
		if (this.isHost) {
			deposito.update({
				barajaId: this.barajaId,
				cartas: this.cartas,
				cantadas: 0,
				estatus: 'iniciar'
			});
		} else {
			const game = deposito.read();
			this.barajaId = game.barajaId;
			this.cartas = game.cartas;
			this.cantadas = game.cantadas;
			// nomás leer los dados y encarregar las cartas barajadas
			// o sea: 
			// this.cartas = getDoc() -> game.cartas;
			// JUST ARRAY OF [cardId,] -- look up in baraja by id not array

			// y luego en vez del intervalo
			// getDoc or onSnapshot
			// this.cantadas = game.cantadas;
			// callback ({ type: 'carta', cartaCantada: this.leerUltima() });
		}

		// sólo para el host los demás agarran los dados actualizados
		this.timer = setInterval(
			() => {
				const cartaCantada = this.cantar();
				if (this.isHost) {
					this.isHost && deposito.update({
						cantadas: this.cantadas,
						estatus: 'jugar'
					});
				}
			},
			4500
		);
	};

	stop = () => {
		clearInterval(this.timer);
	};

	barajar = cartas => {
		const cartasBarajadas = [...cartas].reverse();
		let temp, j;
		cartas.map((_, i) => {
			j = Math.floor(Math.random() * (i + 1));
			temp = cartasBarajadas[i];
			cartasBarajadas[i] = cartasBarajadas[j];
			cartasBarajadas[j] = temp;
			return null;
		});
		return cartasBarajadas;
	};

	cantar = () => {
		if (this.cantadas >= this.cartas.length) {
			// TAREA: empate
			return;
		}
		const carta = this.leerUltima();
		this.cantadas++;
		return carta;
	};

	leerUltima = () => ({ ...this.cartas[this.cantadas] });

	yaCantadas = () => this.cartas.slice(0, this.cantadas).map(carta => carta.id);

	marcar = (tablaId, slotId) => {
		const indicesCantados = this.yaCantadas();
		if (indicesCantados.includes(this.tablas[tablaId][slotId][0].id)) {
			this.tablas[tablaId][slotId][1] = true;
		}
		return this.tablas[tablaId][slotId][1];
	};

	verificar = tablaId => {
		const indicesCantados = this.yaCantadas();
		
		// si se marcaron
		const tablaValores = this.tablas[tablaId].map(carta => (
			carta[1] && indicesCantados.includes(carta[0])
		));
		
		// si ganó
		return this.condiciones.reduce(
			(condicion, verificacion) => ([
				...verificacion,
				!(condicion.map(campo => tablaValores[campo]).includes(false))
			]),
			[]
		).includes(true);
	};
}

export default Cantor;
