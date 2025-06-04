import { database } from '../firebaseConfig'
import { ref, push, get, child } from 'firebase/database'
import { Order } from '../redux/orderSlice'

// * Integración de Firebase para persistencia usando Firestore
// * Funciones: saveOrder() y getOrders()

// Guardar pedido en Realtime Database
export async function saveOrder(order: Order): Promise<string> {
  const ordersRef = ref(database, 'orders')
  const newOrderRef = await push(ordersRef, order)
  return newOrderRef.key as string
}

// Obtener todos los pedidos desde Realtime Database
export async function getOrders(): Promise<Order[]> {
  const dbRef = ref(database)
  const snapshot = await get(child(dbRef, 'orders'))

  if (snapshot.exists()) {
    const data = snapshot.val()
    return Object.entries(data).map(([key, value]) => ({
      id: key,
      ...(value as Order)
    }))
  } else {
    return []
  }
}
