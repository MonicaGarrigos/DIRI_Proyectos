import { FormEvent, MouseEventHandler, useContext, useState } from "react";
import { MenuItem } from "../entities/entities";
import { foodItemsContext } from "../App";
import './foodOrder.css'
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
    setQuantity(parseInt(event.target.value) || 1);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // no recarga la página
    setIsOrdered(true);
    // Crear una copia del array menuItems y actualizar la cantidad del item pedido
    const updatedMenuItems = menuItems.map((item) => {
      if (item.id === props.food.id) {
        return { ...item, quantity: Math.max(0, item.quantity - quantity) };
      }
      return item;
    });

    props.onUpdateMenuItems(updatedMenuItems);
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
            min="1"
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