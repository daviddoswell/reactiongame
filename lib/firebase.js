import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAf0kNMLTqKb9RGVwnZOWpb4ZH_44Pyol8",
  authDomain: "reactiontime-3df00.firebaseapp.com",
  projectId: "reactiontime-3df00",
  storageBucket: "reactiontime-3df00.appspot.com",
  messagingSenderId: "693866062946",
  appId: "1:693866062946:web:372a151e766cc458a05d3b",
  measurementId: "G-BL4EJ6LHM2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
