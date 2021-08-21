class Caller {
	constructor() {
		// TODO:
		// 	- this.baraja : card uuids
		// 	- this.cartas : card objects (imgs, sounds, lang text)
		// 	- need a function to create a baraja for the game
		// 	- need a way to mark card on tabla (see TODOs below)

		// tabla para cada jugador
		this.tablas = [
			[/* 16 [uuid, bool] pairs == [cartaId, isMarked] */],
			...
		];
		// la baraja
		this.cartas = [
			{ id: 1, nombre: '', img: '', ... },
			...
		];
		this.cantadas = 0;
		this.condiciones = [
			[ /* four/n tabla slot ids */ ],
			...
		];
	}

	// TODO: player id associated c tabla
	const registrar = () => {
		// tabla array of just carta ids
		this.tablas.push([
			...this.barajar(this.cartas).slice(0, 16).map(carta => carta.id)
		]);
		// latest tabla id as player
		return this.tablas.length-1;
	};

	const iniciar = () => {
		this.cartas = barajar(this.cartas);
	};

	const barajar = cartas => {
		const cartasBarajadas = [...cartas];
		// TODO: insert a knuth shuffle
		return cartasBarajadas;
	};

	const cantar = () => {
		this.cantadas++;
	};

	const marcar = (tablaId, slotId) => {
		const cantadasIndices = [...this.cartas.slice(0, cantadas)].map(carta => carta.id);
		if (cantadasIndices.includes(this.tablas[tablaId][slotId])) {
			// TODO: mark tabla slot somewhow
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
