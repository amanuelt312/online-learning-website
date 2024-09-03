import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  databaseURL: import.meta.env.VITE_REACT_APP_databaseURL,
  apiKey: import.meta.env.VITE_REACT_APP_apiKey,
  authDomain: import.meta.env.VITE_REACT_APP_authDomain,
  projectId: import.meta.env.VITE_REACT_APP_projectId,
  storageBucket: import.meta.env.VITE_REACT_APP_storageBucket,
  messagingSenderId: import.meta.env.VITE_REACT_APP_messagingSenderId,
  appId: import.meta.env.VITE_REACT_APP_appId,
  measurementId: import.meta.env.VITE_REACT_APP_measurementId,
};
console.log(firebaseConfig);
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
