import { barajas } from './barajas';

class Caller {
	constructor(barajaId) {
		// TODO:
		// 	- modo de marcar las cartas (véase más abajo)		

		// la baraja
		// estructura -- { id: 1, nombre: '', imagen: '', ... }
		this.cartas = [...barajas[barajaId]].map((carta, id) => ({
			id,
			...carta
		}));

		// tabla para cada jugador -- /* 16 [id, bool] pairs == [cartaId, isMarked] */
		// véase la función registrar y el depósito en store.js
		this.tablas = [];

		this.cantadas = 0;

		/* cuatro ~ n tabla slotIds que estén marcadas */,
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

	const registrar = () => {
		// barajar tabla de 16 índices (cartaId) e indicar si están marcadas (falso)
		this.tablas.push([
			...this.barajar(this.cartas).slice(0, 16).map(carta => (
				[ carta.id, false ]
			)
		]);
		// usar tabla id como jugadorId
		return this.tablas.length-1;
	};

	const iniciar = () => {
		this.cartas = barajar(this.cartas);
	};

	const barajar = cartas => {
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

	const cantar = () => {
		this.cantadas++;
	};

	const marcar = (tablaId, slotId) => {
		const cantadasIndices = [...this.cartas.slice(0, cantadas)].map(carta => carta.id);
		if (cantadasIndices.includes(this.tablas[tablaId][slotId])) {
			// TODO: marcar tabla slot
		}
	};

	const verificar = tablaId => {
		const cantadasIndices = this.cartas.slice(0, this.cantadas).map(carta => carta.id);
		
		// TODO: check that jugador marked them on tabla
		const tablaValores = this.tablas[tablaId].map(cartaId => (
			cantadasIndices.includes(cartaId)
		));
		
		return this.condiciones.reduce(
			(condicion, verificacion) => ([
				...verificacion,
				!(condicion.map(campo => tablaValores[campo]).includes(false))
			]),
			[]
		).includes(true);
	};
}

// So is Caller simply the game logic now, and jugador the app that sends updates?
class Jugador {
	constructor(caller) {
		this.caller = caller;
		this.id = caller.register();
	}
}
