import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { app } from "../firebaseConfig";

const db = getFirestore(app);
const ordersCollection = collection(db, "orders");

export async function saveOrder(order: any) {
  try {
    const docRef = await addDoc(ordersCollection, order);
    console.log("Pedido guardado con ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar el pedido:", error);
    throw error;
  }
}

export async function getOrders() {
  try {
    const querySnapshot = await getDocs(ordersCollection);
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return orders;
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    throw error;
  }
}
