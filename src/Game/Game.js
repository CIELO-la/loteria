import { barajas } from './barajas';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, onSnapshot } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
//
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPRtv5TNdX7muyQwnEgftaPP6p6cObPJM",
  authDomain: "loteria-807ae.firebaseapp.com",
  projectId: "loteria-807ae",
  storageBucket: "loteria-807ae.appspot.com",
  messagingSenderId: "235108927532",
  appId: "1:235108927532:web:ff61e18d3e59a4048d6989"
};
// Initialize Firebase
const fireapp = initializeApp(firebaseConfig);
const db = getFirestore(fireapp);

class Caller {
	constructor(barajaId) {
		// TODO:
		// 	- modo de marcar las cartas (véase más abajo)		

		this.barajaId = barajaId;

		// la baraja
		// estructura == [{ id: 0, nombre: '', imagen: '' }, ...]
		this.cartas = [...barajas[barajaId]].map((carta, id) => ({
			id,
			...carta
		}));

		// tabla para cada jugador == 16 [[cartaId, isMarked], ...]
		// véase la función registrar y el depósito en store.js
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
		// barajar tabla de 16 índices (cartaId) e indicar si están marcadas (falso)
		this.tablas.push([
			...this.barajar(this.cartas).slice(0, 16).map(carta => (
				[ carta, false ]
			))
		]);
		// usar tabla id como jugadorId
		return this.tablas.length-1;
	};

	iniciar = async (callback) => {
		// Get a list of cities from your database
		async function getGame() {
		  const gameCol = collection(db, 'games');
		  const gameSnapshot = await getDocs(gameCol);
		  const gameList = gameSnapshot.docs;
		  return gameList;
		}
		const games = await getGame();
		
		// Choose a game. Right now just pick the first one.
		const selectedGame = games[0];
		const data = selectedGame.data();
		const gameId = selectedGame.id;

		// Subscribe to updates to the game.
		const unsub = onSnapshot(selectedGame.ref, (doc) => {
		    console.log("Current data: ", doc.data());
		});

		this.cartas = this.barajar(this.cartas);

		this.timer = setInterval(
			() => {
				const cartaCantada = this.cantar();
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

// class Jugador {
// 	constructor(caller) {
// 		this.caller = caller;
// 		this.id = caller.register();
// 	}
// }

export default Caller;
