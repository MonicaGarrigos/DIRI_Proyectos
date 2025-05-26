import { FormEvent, MouseEventHandler, useContext, useState } from "react"
import { MenuItem } from "../entities/entities"
import './foodOrder.css'
import { update } from "firebase/database"
import { database, ref } from "../firebaseConfig"
import logger from "../services/logging"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../redux/store"
import { addOrder } from "../redux/orderSlice"
import { updateQuantity } from "../redux/menuSlice"
import { foodItemsContext } from "../App"



interface FoodOrderProps {
  onReturnToMEnu: MouseEventHandler<HTMLButtonElement> | undefined
  food: MenuItem
  onUpdateMenuItems: (updatedItems: MenuItem[]) => void
}

function FoodOrder(props: FoodOrderProps) {
  const [quantity, setQuantity] = useState(1)
  const [isOrdered, setIsOrdered] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  const menuItems: MenuItem[] = useContext(foodItemsContext)

  const dispatch = useDispatch<AppDispatch>()
  const orderStatus = useSelector((state: RootState) => state.orders.status)
  const orderError = useSelector((state: RootState) => state.orders.error)

  const totalPrice = props.food.price * quantity

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(event.target.value))
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (quantity < 0) {
      const error = new Error("La cantidad no puede ser negativa.")
      logger.error(error.message)
      throw error
    }

    // Actualiza cantidades en el menú local y en Firebase
    const updatedMenuItems = menuItems.map((item) => {
      if (item.id === props.food.id) {
        return { ...item, quantity: Math.max(0, item.quantity - quantity) }
      }
      return item
    })
    props.onUpdateMenuItems(updatedMenuItems)

    const updates: { [key: string]: any } = {}
    updates[`/menuItems/${props.food.id - 1}/quantity`] = Math.max(0, props.food.quantity - quantity)
    update(ref(database), updates)

    dispatch(updateQuantity({ id: props.food.id, quantity: Math.max(0, props.food.quantity - quantity) }))

    const newOrder = {
      name: props.food.name,
      quantity,
      phone,
      date: new Date().toISOString(),
      customerName: name,
      product: props.food.id,
      totalPrice
    }

    dispatch(addOrder(newOrder)).then(() => {
      logger.info("Pedido guardado correctamente.") // * Logging de evento exitoso
      setIsOrdered(true)
    }).catch((err) => {
      logger.error("Error al guardar pedido: " + err.message) // * Logging de errores
    })
  }

  return (
    <div className="food-order-container">
      {isOrdered ? (
        <div className="confirmation">
          <p>Pedido enviado. Recibirá un SMS una vez esté listo para recoger.</p>
          <button onClick={props.onReturnToMEnu}>Volver al menú</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h3>{props.food.name}</h3>
          <p>{props.food.desc}</p>
          <img src={`/images/${props.food.image}`} alt={props.food.name} />
          <p>{props.food.price}€</p>

          <label htmlFor="quantity">Cantidad:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
          />

          <label htmlFor="name">Nombre:</label>
          <input type="text" id="name" value={name} onChange={handleNameChange} required />

          <label htmlFor="phone">Teléfono:</label>
          <input type="tel" id="phone" value={phone} onChange={handlePhoneChange} required />

          <p>Total: {totalPrice}€</p>

          {orderStatus === 'loading' && <p>Guardando pedido...</p>}                 {/* Feedback visual de carga */}
          {orderStatus === 'failed' && <p className="error">{orderError}</p>}       {/* Muestra errores de pedido */}

          <button type="submit" disabled={orderStatus === 'loading'}>Enviar pedido</button>
          <button type="button" onClick={props.onReturnToMEnu}>Volver al menú</button>
        </form>
      )}
    </div>
  )
}

export default FoodOrder
