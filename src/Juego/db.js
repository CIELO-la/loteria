import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
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

// Firestore initial read
export const dbSub = async (gameId, gameStateCallback) => {
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
