import { barajas } from './barajas';
import { dbSub } from './db';
import { estatus } from './estatus';

/* Game-db interactions
 * 1) lock someone in as writer when load
 * 2) writer's Cantor writes the barajaId and shuffled cartaIds
 * 3) everyone reads barajaId and shuffled cartaIds from db
 * 4) writer's Cantor updates the cantada index each call and checks status
 * 		- latest card called was previous card (i-1); total called slice up to i
 * 		- if status is win go to 6
 * 5) everyone gets snapshot with updated cantada index (necessary?)
 * 6) ganar status
 * 7) empate status
 */

class Cantor {
	constructor(barajaId, jugadorId, isHost=false) {

		console.log(this.colorear(jugadorId));

		// remote store
		this.deposito = null;

		// TODO: placeholder for authorization!
		this.isHost = isHost;

		// referencia a las cartas no barajadas
		this.barajaId = isHost ? barajaId : null;

		// las cartaIds
		this.cartas = [];

		// tabla tiene 16 [[cartaId, estaMarcada], ...]
		// véase las funciones .iniciar, .crearTabla y el depósito
		this.tabla = [];

		this.jugadorId = jugadorId;
		this.jugadoresColores = []; 	// [[jugadorId, colorHex], ...]

		this.cantadas = 0;

		this.timer = null;
		this.seAcabo = false;

		// cuatro/n tabla slotIds que estén marcadas
		this.condiciones = [
			// horiz
			[0, 1, 2, 3],
			[4, 5, 6, 7],
			[8, 9, 10, 11],
			[12, 13, 14, 15],
			// vert
			[0, 4, 8, 12],
			[1, 5, 9, 13],
			[2, 6, 10, 14],
			[3, 7, 11, 15],
			// cuadr
			[0, 1, 4, 5],
			[1, 2, 5, 6],
			[2, 3, 6, 7],
			[4, 5, 8, 9],
			[5, 6, 9, 10],
			[6, 7, 10, 11],
			[8, 9, 12, 13],
			[9, 10, 13, 14],
			[10, 11, 14, 15],
			[0, 3, 12, 15],
		];
	}

	// convertir cadena en color
	// modificación de https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
	colorear = texto => {
		const txtHash = texto.split('').reduce((hash, letra) => (
			letra.charCodeAt(0) + ((hash << 5) - hash)
		), 0);
	    const color = '#' + [0, 1, 2].map(i => (
	   		('00' + ((txtHash >> (i * 8)) & 0xFF).toString(16)).substr(-2)
	    )).join('');
	    return color;
	};

	crearTabla = () => (
		// barajar tabla de 16 cartas e indicar si están marcadas
		[
			...this.barajar(this.cartas).slice(0, 16).map(cartaId => (
				[ cartaId, false ]
			))
		]
	);

	registrar = async (juegoId, callback) => {
		// TAREA: error de vuelta si no hay juego
		if (!this.isHost && !juegoId) {
			console.log(`Game.js -- no hay ni host ni juego`);
			return;
		} else {
			console.log(`leyendo juego ${!juegoId ? 'nuevo' : juegoId}`);
		}

		// objeto con métodos para leer y modificar - véase el db.js
		this.deposito = await dbSub(juegoId, gameDoc => {
			const datos = gameDoc.data();
			// lobby y configuración inicial
			if (datos.estatus === estatus.registrar) {
				// almacenar datos locales del juego
				this.barajaId = datos.barajaId;
				this.jugadores = datos.jugadores.map(jugadorId => [
					jugadorId,
					this.colorear(jugadorId),
				]);
				// elegir baraja y barajar cartas para tabla
				if (!barajas[this.barajaId]) {
					// TAREA: salir del juego si no hay baraja
					console.log(`baraja no definida: ${this.barajaId}`);
				}
				this.tabla = this.crearTabla();
				// mostrar lobby
				return callback({
					estatusActual: datos.estatus,
					barajaId: datos.barajaId,
					cartaCantada: {},
					ganador: datos.ganador,
				});
			}
			// empezar
			if (datos.estatus === estatus.iniciar) {
				this.jugadores = datos.jugadores.map(jugadorId => [
					jugadorId,
					this.colorear(jugadorId),
				]);
				this.barajaId = datos.barajaId;
				return callback({
					estatusActual: datos.estatus,
					barajaId: datos.barajaId,
					cartaCantada: {},
					ganador: datos.ganador,
				});
			}
			// ganador
			else if (datos.estatus === estatus.ganar) {
				this.parar();
				return callback({
					estatusActual: datos.estatus,
					barajaId: datos.barajaId,
					cartaCantada: {},
					ganador: datos.ganador,
				});
			}
			// resultó empate
			else if (datos.estatus === estatus.empate) {
				this.parar();
				return callback({
					estatusActual: datos.estatus,
					barajaId: datos.barajaId,
					cartaCantada: {},
					ganador: datos.ganador,
				});
			}
			// jugar
			else {
				this.cantadas = datos.cantadas;
				return callback({
					estatusActual: datos.estatus,
					barajaId: datos.barajaId,
					cartaCantada: this.leerCartaCantada(),
					ganador: datos.ganador,
				});
			}
		});

		// primera lectura, primera actualización
		if (this.isHost) {
			this.cartas = this.barajar([
				...Object.keys(barajas[this.barajaId])
			]);
			await this.deposito.update({
				barajaId: this.barajaId,
				cartas: this.cartas,
				cantadas: 0,
				estatus: estatus.registrar,
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
		if (this.isHost) {
			this.deposito.update({
				estatus: estatus.iniciar,
			});
		}

		// TAREA: pasos entre entrada y primera carta
		// -- ¡Corre y se va corriendo! --
		
		// solo escribe el host - los demás agarran los datos actualizados
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
							estatus: estatus.empate,
						});
					}
				},
				4500
			);
		}
	};

	parar = () => {
		this.isHost && clearInterval(this.timer);
		this.seAcabo = true;
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
		if (this.seAcabo) { return; }

		const indicesCantados = this.yaCantadas();
		
		// si se marcaron
		const tablaValores = this.tabla.map(carta => (
			carta[1] && indicesCantados.includes(carta[0])
		));

		console.log("Verificando valores tabla:", tablaValores);
		
		// si ganó
		const esGanador = this.condiciones.reduce(
			(verificacionesPrevias, condicion) => ([
				...verificacionesPrevias,
				!(condicion.map(campo => tablaValores[campo]).includes(false))
			]),
			[]
		).includes(true);

		console.log("es ganador:", esGanador);
		
		// se acaba el juego
		if (esGanador) {
			this.deposito.update({
				estatus: estatus.ganar,
				ganador: this.jugadorId
			});
		}

		return esGanador;
	};
}

export default Cantor;
