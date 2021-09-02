import { barajas } from './barajas';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, onSnapshot } from 'firebase/firestore';

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

// TAREA: estatus del juego como "jugando" o se armó o se acabó
class Cantor {
	constructor(barajaId) {
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
		/* FIRESTORE */
		async function getGames() {
		  const gamesCollection = collection(db, 'games');
		  const gamesSnapshot = await getDocs(gamesCollection);
		  return gamesSnapshot.docs;
		}
		const games = await getGames();
		const gamesRef = collection(db, 'games');
		//games.map(gSnapshot => console.log("game id, ref: ", gSnapshot.id, gSnapshot.ref));
		//console.log("firebase.firestore.collection('games'): UNDEFINED");
		console.log("gamesRef: ", gamesRef);
		console.log("gamesRef.firestore: ", gamesRef.firestore);
		console.log("gamesRef.firestore.add: ", gamesRef.firestore.add);
		console.log("games (doc list): ", games);
		console.log("games.add: ", games.add);
		console.log("games[0] (single doc): ", games[0]);
		console.log("games[0].add: ", games[0].add);
		//
		// Choose a game. Right now just pick the first one.
		const game = games[0];
		//console.log("game data: ", game);
		const gameData = game.data();
		const gameId = game.id;
		//
		// attach listener for updates
		const unsub = onSnapshot(game.ref, gameDoc => {
		    //console.log("Current data: ", gameDoc.data());
		});
		/* /FIRESTORE */

		// const updateDB = cantadas => {
		// 	console.log(onSnapshot);
		// 	db.collection('games').doc(game.id).update({ 'cantadas' : cantadas });
		// };

		this.cartas = this.barajar(this.cartas);

		this.timer = setInterval(
			() => {
				const cartaCantada = this.cantar();
				
				// updateDB(this.cantadas);

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
