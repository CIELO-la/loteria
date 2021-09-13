import { barajas } from './barajas';
import { dbSub } from './db';

/* Game-db interactions
 *
 * 1) lock someone in as writer when load
 * 2) writer's Cantor writes the barajaId and shuffled cartaIds
 * 3) everyone reads barajaId and shuffled cartaIds from db
 * 4) writer's Cantor updates the cantada index each call and checks status
 * 		- latest card called was previous card (i-1); total called slice up to i
 * 		- if status is win go to 6
 * 5) everyone gets snapshot with updated cantada index (necessary?)
 *
 * TAREA:
 * 6) ganar status - how to handle?
 * 		- el ganador escribe para modificar el estatus
 * 7) empate status - how to handle?
 * 		- el host escribe el estatus
 */

// TAREA: estatus del juego como "jugando" o se armó o se acabó
class Cantor {
	constructor(barajaId, isHost) {
		// remote store setup
		//deposito = dbSub();

		// TODO: placeholder for authorization!
		this.isHost = isHost;

		// referencia a las cartas no barajadas
		this.barajaId = barajaId;

		// las cartaIds barajadas
		if (barajas[barajaId]) {
			this.cartas = [ ...Object.keys(barajas[barajaId]) ];
		} else {
			// TAREA: salir del juego si no hay baraja
			console.log(`baraja no definida: ${barajaId}`);
		}

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
			...this.barajar(this.cartas).slice(0, 16).map(cartaId => (
				[ cartaId, false ]
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
		} else {
			console.log(`leyendo juego ${!juegoId ? 'nuevo' : juegoId}`);
		}

		// objeto con métodos para leer y modificar - véase el db.js
		const deposito = await dbSub(juegoId, gameDoc => {
			this.cantadas = gameDoc.data().cantadas;
			return callback({
				type: 'carta',
				cartaCantada: this.leerCartaCantada(),
				estatus: gameDoc.data().estatus
			});
		});

		// TAREA: leer o modificar
		if (this.isHost) {
			this.cartas = this.barajar(this.cartas);
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
		}

		// sólo para el host los demás agarran los dados actualizados
		if (this.isHost) {
			this.timer = setInterval(
				() => {
					this.cantar();
					this.isHost && deposito.update({
						cantadas: this.cantadas,
						estatus: 'jugar'
					});
				},
				4500
			);
		}
	};

	stop = () => this.isHost && clearInterval(this.timer);

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
		this.cantadas++;
		return this.leerCartaCantada();
	};

	leerCartaCantada = () => (this.cantadas === 0
		? {}
		: this.leerCarta(this.cartas[this.cantadas-1])
	);

	leerCarta = cartaId => ({...barajas[this.barajaId][cartaId]});

	yaCantadas = () => [...this.cartas.slice(0, this.cantadas)];

	marcar = (tablaId, slotId) => {
		const indicesCantados = this.yaCantadas();
		if (indicesCantados.includes(this.tablas[tablaId][slotId][0])) {
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
