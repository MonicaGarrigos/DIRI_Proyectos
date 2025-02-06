import { FormEvent, MouseEventHandler, useContext, useState } from "react";
import { MenuItem } from "../entities/entities";
import { foodItemsContext } from "../App";
import './foodOrder.css'
import { database, ref, update } from "../firebaseConfig";
import { push } from "firebase/database";
import logger from '../services/logging'; 

interface FoodOrderProps {
  onReturnToMEnu: MouseEventHandler<HTMLButtonElement> | undefined;
  food: MenuItem;
  onUpdateMenuItems: (updatedItems: MenuItem[]) => void;
}

function FoodOrder(props: FoodOrderProps) {
  //**  States for name, quantity and phone number
  const [quantity, setQuantity] = useState(1); // cantidad pedida
  const [isOrdered, setIsOrdered] = useState(false); // si está pedido
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const menuItems: MenuItem[] = useContext(foodItemsContext);

  const totalPrice = props.food.price * quantity;

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(event.target.value) );
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // no recarga la página

    if (quantity < 0) { // ** Cantidad negativa --> Error boundary
      const error = new Error("La cantidad no puede ser negativa.");
      logger.error(error.message); // ** Logging
      throw error; // ** Lanza el error para que lo capture el ErrorBoundary
  }

    setIsOrdered(true);
    
    // Crear una copia del array menuItems y actualizar la cantidad del item pedido
    const updatedMenuItems = menuItems.map((item) => {
      if (item.id === props.food.id) {
        return { ...item, quantity: Math.max(0, item.quantity - quantity) };
      }
      return item;
    });

    props.onUpdateMenuItems(updatedMenuItems);

    // ** Actualizar valor cantidad en Firebase 
    const updates: { [key: string]: any } = {}; 
    updates[`/menuItems/${props.food.id - 1}/quantity`] = Math.max(0, props.food.quantity - quantity);
    update(ref(database), updates);


    // ** Guardar el pedido en Firebase
    const ordersRef=ref(database, 'orders');
    const newOrder = {
      name:props.food.name,
      quantity: quantity,
      phone: phone,
      date: new Date().toISOString(),
      customerName: name,
      product: props.food.id,
      totalPrice: totalPrice
    };
    push(ordersRef, newOrder).then(()=>{
      console.log('Pedido agregado con éxito');
    }).catch((error)=>{
      console.log('Error al guardar el pedido en Firebase', error);
    });

  };
  

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
          <button type="submit">Enviar pedido</button>
          <button type="button" onClick={props.onReturnToMEnu}>Volver al menú</button>
        </form>
      )}
    </div>
  );
}

export default FoodOrder;