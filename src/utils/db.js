import { initializeApp } from 'firebase/app';
import {
	getFirestore, collection, doc, getDoc, setDoc, deleteDoc, onSnapshot,
	query, where, limit, getDocs
} from 'firebase/firestore';

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

// read store and pass back object with operations
export const dbConnect = async collectionName => {
	// read firestore collection
	const docsCollection = collection(firestore, collectionName);

	// closure/local storage for individual doc
	const localStore = {};
	const resetLocalStore = () => {
		localStore.id = null;
		localStore.ref = null;
		localStore.data = {};
		localStore.unsub = () => {};
	};

	// object for client db access
	return ({
		// individual docs
		create: async docId => {
			// create new empty document
			await setDoc(doc(docsCollection, docId), {}, { merge : false });
		},
		remove: async docId => await deleteDoc(doc(docsCollection, docId.toString())),
		sub: async (docId, stateCallback) => {
			if (!docId) {
				console.log(`cannot sub to document with id: ${docId}`);
				return;
			}
			// read doc from collection
			const docSnapshot = await getDoc(doc(docsCollection, docId));
			if (!docSnapshot.exists()) {
				console.log(`No such document in collection: ${docId}`);
				return;
			}
			// remember doc and listen for updates 
			localStore.id = docId;
			localStore.ref = docSnapshot.ref;
			localStore.data = docSnapshot.data();
			localStore.unsub = await onSnapshot(
				localStore.ref,
				stateCallback
			);
			return localStore.unsub;
		},
		unsub: async () => {
			// run onSnapshot return function
			await localStore.unsub();
			// clear doc and listener assignments
			resetLocalStore();
		},
		update: async newData => {
			if (!localStore.ref) {
				console.log(`Failed to update - invalid doc ref: ${localStore.ref}`);
				return;
			};
			await setDoc(localStore.ref, newData, { merge : true });
		},
		// local sync fetch
		read: () => localStore.data,
		id: () => localStore.id,
		// TODO: list to find/browse docs
		list: async () => {
			const q = query(docsCollection, where("jugadores", "<", 6), limit(5));
			const qSnapshot = await getDocs(q);
			qSnapshot.map(doc => console.log(doc.id, " contains ", doc.data()));
			return qSnapshot.map(doc => doc.id);
		},
	});
};
