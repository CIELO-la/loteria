import { initializeApp } from 'firebase/app';
import {
	getFirestore, collection, doc, getDoc, setDoc, deleteDoc, onSnapshot,
	query, where, limit, getDocs
} from 'firebase/firestore';
import { v4 as uuid4 } from 'uuid';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase and Firestore config
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
const firestore = getFirestore(fireapp);

export const dbSub = async () => {
	// read firestore collection
	const collectionName = 'games';
	const games = collection(firestore, collectionName);

	// closure/local storage for individual game doc -- intended READ ONLY
	const gameStore = {
		id: null,
		ref: null,
		unsub: () => null,
	};

	// object for client db access
	return ({
		// individual docs
		create: async gameId => (
			// create new empty document
			await setDoc(doc(games, gameId), {}, { merge : false })
		),
		remove: async gameId => await deleteDoc(doc(games, gameId.toString())),
		sub: async (gameId, gameStateCallback) => {
			if (!gameId) {
				console.log(`cannot sub to document with gameId: ${gameId}`);
				return;
			}
			// read doc from collection
			const gameSnapshot = await getDoc(doc(games, gameId));
			if (!gameSnapshot.exists()) {
				console.log(`No such game document: ${gameId}`);
				return;
			}
			// remember doc and listen for updates 
			gameStore.id = gameId;
			gameStore.ref = gameSnapshot.ref;
			gameStore.unsub = await onSnapshot(
				gameStore.ref,
				gameStateCallback
			);
			return gameStore.unsub;
		},
		unsub: async () => {
			// run onSnapshot return function
			await gameStore.unsub();
			// clear game and listener assignments
			gameStore.id = null;
			gameStore.ref = null;
			gameStore.unsub = () => null;
		},
		update: async gameData => {
			if (!gameStore.ref) {
				console.log(`Failed to update - invalid game doc ref: ${gameStore.ref}`);
				return;
			};
			await setDoc(gameStore.ref, gameData, { merge : true });
		},
		// local fetch
		read: () => gameStore.ref ? gameStore.ref.data() : null,
		id: () => gameStore.id,
		// TODO: list to find/browse games
		list: async () => {
			const q = query(games, where("jugadores", "<", 6), limit(5));
			const qSnapshot = await getDocs(q);
			qSnapshot.map(gDoc => console.log(gDoc.id, " contains ", gDoc.data()));
			return qSnapshot.map(gDoc => gDoc.id);
		},
	});
};

// Firestore initial read
export const gameSub = async (gameId, gameStateCallback) => {
	// new or joined game
	const isNewGame = gameId === null;
	const gameDocId = isNewGame ? uuid4() : gameId;

	// Fetch game doc
	async function getGame() {
	  const gamesCollection = collection(firestore, 'games');
	  // add new game to collection
	  if (isNewGame) {
	  	await setDoc(doc(gamesCollection, gameDocId), {}, { merge : false });
	  }
	  // read and return docs in collection
	  const gameSnapshot = await getDoc(doc(gamesCollection, gameDocId));
	  if (gameSnapshot.exists()) {
	    console.log("Game store document data:", gameSnapshot.ref);
	  } else {
	    // doc.data() left undefined
	    console.log("No such game document!");
	  }
	  return gameSnapshot;
	}
	const game = await getGame();
	const gameRef = game.ref;

	return ({
		id: () => gameDocId,
		// Attach listener for updates
		// callback gets passed gameDoc => gameDoc.data()
	 	// onSnapshot returns function to call to unattach
		unsub: onSnapshot(gameRef, gameStateCallback),
		// get game data
		read: () => game.data(),
		// set game data
		update: async docObj => await setDoc(gameRef, docObj, { merge: true }),
	});
};
