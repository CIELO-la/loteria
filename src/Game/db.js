import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, setDoc, onSnapshot } from 'firebase/firestore';

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
export const dbSub = async () => {
	// Read games docs collection
	async function getGames() {
	  const gamesCollection = collection(firestore, 'games');
	  const gamesSnapshot = await getDocs(gamesCollection);
	  return gamesSnapshot.docs;
	}
	const games = await getGames();

	// TODO: Choose a game. Right now just pick the first one.
	const game = games[0];
	const gameRef = game.ref;

	return ({
		// Attach listener for updates
		unsub: onSnapshot(gameRef, gameDoc => (
		    console.log("Current data: ", gameDoc.data())
		)),
		read: () => game,
		update: docObj => setDoc(gameRef, docObj, { merge: true }),
	});
};
