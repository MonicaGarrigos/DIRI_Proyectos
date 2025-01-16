import { useContext, useState } from "react";
import { MenuItem } from "../entities/entities";
import FoodOrder from "./FoodOrder";
import { foodItemsContext } from "../App";

interface FoodsProps {
    foodItems: MenuItem[];
    onUpdateMenuItems: (item:MenuItem[]) => void;   //Para actualizar la cantidad de los menús al hacer el pedido
}

function Foods(props: FoodsProps) {
    const [selectedFood, setSelectedFood] = useState<MenuItem | null>(null);
    const menuITems = useContext(foodItemsContext);
    const handleFoodClick = (food:MenuItem)=>{
        setSelectedFood(food);
    }

    const handleReturnToMEnu = () => {
        setSelectedFood(null);
    }

    if(selectedFood){
        return <FoodOrder 
            food={selectedFood} 
            onReturnToMEnu={handleReturnToMEnu} 
            onUpdateMenuItems={props.onUpdateMenuItems}> 
        </FoodOrder>
    }
    return (
        <>
            <h4 className="foodTitle">Choose from our Menu</h4>
            <ul className="ulFoods">
                {props.foodItems.map((item) => {
                    return (
                        <li key={item.id} 
                            className="liFoods"
                            onClick={()=> handleFoodClick(item)}>
                            <img
                                className="foodImg"
                                src={`/images/${item.image}`}
                                alt={item.name}
                            /><div className="foodItem">
                                <p className="foodDesc">{item.desc}</p>
                                <p className="foodPrice">{item.price}$</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </>
    );
};
export default Foods;