import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBOXpH3frHC19jsDSpa-kQgoBBthnRkcto",
  authDomain: "caiif-e15bb.firebaseapp.com",
  projectId: "caiif-e15bb",
  storageBucket: "caiif-e15bb.appspot.com",
  messagingSenderId: "132177907093",
  appId: "1:132177907093:web:95460dd962b90d878f3a9c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore();
export const storage = getStorage(app);