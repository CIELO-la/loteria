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

// TAREA: estatus del juego como "jugando" o se armó o se acabó
class Cantor {
	constructor(barajaId) {
		// remote store setup
		//deposito = dbSub();

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

	iniciar = async (callback) => {

		const deposito = await dbSub();

		this.cartas = this.barajar(this.cartas);

		// TAREA: leer o modificar
		console.log(deposito);
		deposito.update({
			barajaId: this.barajaId,
			cartas: this.cartas,
			cantadas: 0,
			estatus: 'jugando'
		});

		this.timer = setInterval(
			() => {
				const cartaCantada = this.cantar();
				
				deposito.update({
					cantadas: this.cantadas,
				});

				callback({
					type: "carta",
					cartaCantada
				});
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
			return;
		}
		const carta = { ...this.cartas[this.cantadas] };
		this.cantadas++;
		return carta;
	};

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
