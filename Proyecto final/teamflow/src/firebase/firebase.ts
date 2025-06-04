import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCioWUlnhM8N3_Vdpix5avkDhWGC8KfCX8",
  authDomain: "teamflow-fda4b.firebaseapp.com",
  databaseURL: "https://teamflow-fda4b-default-rtdb.firebaseio.com",
  projectId: "teamflow-fda4b",
  storageBucket: "teamflow-fda4b.firebasestorage.app",
  messagingSenderId: "278505661875",
  appId: "1:278505661875:web:245c061106503359cc17c6",
  measurementId: "G-V5H06JKW0J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);