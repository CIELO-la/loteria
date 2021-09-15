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

 // TAREA: jugador con tabla completa puede seleccionar "ganar" después del empate

const estatus = {
	iniciar: 'iniciar',
	jugar: 'jugar',
	ganar: 'ganar',
	empate: 'empate'
};

// TAREA: estatus del juego como "jugando" o se armó o se acabó
class Cantor {
	constructor(barajaId, jugadorId, isHost) {
		// remote store
		this.deposito = null;

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

		// tabla tiene 16 [[cartaId, estaMarcada], ...]
		// véase la función .crearTabla y el depósito
		this.tabla = [];

		this.jugadorId = jugadorId;

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

	crearTabla = () => {
		// barajar tabla de 16 cartas e indicar si están marcadas
		this.tabla = [
			...this.barajar(this.cartas).slice(0, 16).map(cartaId => (
				[ cartaId, false ]
			))
		];
	};

	registrar = async (juegoId, callback) => {
		// TAREA: error de vuelta si no hay juego
		if (!this.isHost && !juegoId) {
			console.log(`Game.js -- no hay ni host ni juego`);
			return;
		} else {
			console.log(`leyendo juego ${!juegoId ? 'nuevo' : juegoId}`);
		}

		// TAREA: en .iniciar
		this.crearTabla();

		// objeto con métodos para leer y modificar - véase el db.js
		this.deposito = await dbSub(juegoId, gameDoc => {
			this.cantadas = gameDoc.data().cantadas;
			
			// ganador
			if (gameDoc.data().estatus === estatus.ganar) {
				this.stop();
				return callback({
					type: gameDoc.data().estatus,
					cartaCantada: {},
					mensaje: `ganó el jugador ${gameDoc.data().ganador}`,
				});
			}
			// resultó empate
			else if (gameDoc.data().estatus === estatus.empate) {
				this.stop();
				return callback({
					type: gameDoc.data().estatus,
					cartaCantada: {},
					mensaje: `no ganó nadie`,
				});
			}
			else {
				return callback({
					type: gameDoc.data().estatus,
					cartaCantada: this.leerCartaCantada(),
					mensaje: ``,
				});
			}
		});

		// primera lectura, primera actualización (sólo host)
		if (this.isHost) {
			this.cartas = this.barajar(this.cartas);
			await this.deposito.update({
				barajaId: this.barajaId,
				cartas: this.cartas,
				cantadas: 0,
				estatus: estatus.iniciar,
				jugadores: [this.jugadorId],
				ganador: null
			});
		} else {
			const game = this.deposito.read();
			this.barajaId = game.barajaId;
			this.cartas = game.cartas;
			this.cantadas = game.cantadas;
			await this.deposito.update({
				jugadores: [...game.jugadores, this.jugadorId]
			});
		}

		return this.deposito.id();
	};

	iniciar = () => {
		// solo para el host los demás agarran los dados actualizados
		if (this.isHost) {
			this.timer = setInterval(
				() => {
					if (this.cantar()) {
						this.deposito.update({
							cantadas: this.cantadas,
							estatus: estatus.jugar,
						});
					} else {
						this.deposito.update({
							estatus: estatus.empate
						});
					}
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
			return false;
		}
		this.cantadas++;
		return true;
	};

	leerCartaCantada = () => (this.cantadas === 0
		? {}
		: this.leerCarta(this.cartas[this.cantadas-1])
	);

	leerCarta = cartaId => ({...barajas[this.barajaId][cartaId]});

	yaCantadas = () => [...this.cartas.slice(0, this.cantadas)];

	marcar = slotId => {
		const indicesCantados = this.yaCantadas();
		if (indicesCantados.includes(this.tabla[slotId][0])) {
			this.tabla[slotId][1] = true;
		}
		return this.tabla[slotId][1];
	};

	verificar = () => {
		const indicesCantados = this.yaCantadas();
		
		// si se marcaron
		const tablaValores = this.tabla.map(carta => (
			carta[1] && indicesCantados.includes(carta[0])
		));
		
		// si ganó
		const esGanador = this.condiciones.reduce(
			(condicion, verificacion) => ([
				...verificacion,
				!(condicion.map(campo => tablaValores[campo]).includes(false))
			]),
			[]
		).includes(true);
		
		// se acaba el juego
		if (esGanador) {
			this.deposito.update({ estatus: estatus.ganar, ganador: this.jugadorId });
		}

		return esGanador;
	};
}

export default Cantor;
