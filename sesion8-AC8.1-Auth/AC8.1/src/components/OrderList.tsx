import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../redux/store"
import { getOrders } from "../redux/orderSlice"
import './OrderList.css'

// * Lista de pedidos mostrada usando estado global con Redux Toolkit

function OrderList() {
  const dispatch = useDispatch<AppDispatch>()

  const orders = useSelector((state: RootState) => state.orders.list)
  const status = useSelector((state: RootState) => state.orders.status)
  const error = useSelector((state: RootState) => state.orders.error)

  useEffect(() => {
    dispatch(getOrders())
  }, [dispatch])

  return (
    <div className="order-list">
      <h2>Pedidos recientes</h2>

      {status === "loading" && <p>Cargando pedidos...</p>}  {/* Feedback visual al obtener pedidos */}
      {status === "failed" && <p style={{ color: "red" }}>Error: {error}</p>}

      {status === "succeeded" && orders.length === 0 && <p>No hay pedidos aún.</p>}

      {status === "succeeded" && orders.length > 0 && (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <strong>{order.customerName}</strong> pidió {order.quantity}× {order.name} - {order.totalPrice}€  
              <br />
              Tel: {order.phone} | Fecha: {new Date(order.date).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default OrderList
