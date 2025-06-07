import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { MenuItem } from "../entities/entities";
import FoodOrder from "./FoodOrder";
import './Foods.css';

interface FoodsProps {
    foodItems: MenuItem[];
    onUpdateMenuItems: (item: MenuItem[]) => void;
}

function Foods(props: FoodsProps) {
    const [selectedFood, setSelectedFood] = useState<MenuItem | null>(null);
    const user = useSelector((state: RootState) => state.auth.user);

    if (!user) {
        return <p>Debes iniciar sesión para ver el menú y hacer pedidos.</p>;
    }

    const handleFoodClick = (food: MenuItem) => {
        setSelectedFood(food);
    };

    const handleReturnToMEnu = () => {
        setSelectedFood(null);
    };

    if (selectedFood) {
        return (
            <FoodOrder
                food={selectedFood}
                onReturnToMEnu={handleReturnToMEnu}
                onUpdateMenuItems={props.onUpdateMenuItems}
            />
        );
    }

    return (
        <>
            <h4 className="foodTitle">Comida Rápida Online</h4>
            <p>Selecciona un producto para hacer tu pedido:</p>
            <ul className="ulFoods">
                {props.foodItems.map((item) => (
                    <li key={item.id} className="liFoods" onClick={() => handleFoodClick(item)}>
                        <img className="foodImg" src={`/images/${item.image}`} alt={item.name} />
                        <div className="foodItem">
                            <p className="foodDesc">{item.desc}</p>
                            <p className="foodPrice">{item.price}€</p>
                            {user?.role === "admin" && (
                                <p className="foodStock">Stock: {item.quantity}</p>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default Foods;
