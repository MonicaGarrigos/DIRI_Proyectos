// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, set, update } from "firebase/database";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6doZsECRG97D44gM3LEpwQFiI_d0-4nw",
  authDomain: "diri-sesion6.firebaseapp.com",
  databaseURL: "https://diri-sesion6-default-rtdb.firebaseio.com",
  projectId: "diri-sesion6",
  storageBucket: "diri-sesion6.firebasestorage.app",
  messagingSenderId: "313362529882",
  appId: "1:313362529882:web:8ce497270792a5b2f02263",
  measurementId: "G-QGMHGGY3FF"
};

const app = initializeApp(firebaseConfig)
const database = getDatabase(app); // Obtiene la instancia de la base de datos
export const auth = getAuth(app);

export { app, database, ref, set, onValue, update }; // Exporta las funciones que voy a usar para almacenar todo los datos en mi bbdd