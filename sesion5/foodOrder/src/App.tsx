

import { useState } from 'react';
import './App.css'
import { MenuItem } from './entities/entities';
import Foods from './components/Foods';
import React from 'react';
export const foodItemsContext = React.createContext<MenuItem[]>([]);


function App() {
  const [isChooseFoodPage, setIsChooseFoodPage] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      "id": 1,
      "name": "Hamburguesa de Pollo",
      "quantity": 40,
      "desc": "Hamburguesa de pollo frito - … y mayonesa",
      "price": 24,
      "image": "cb.jpg"
    },
    {
      "id": 2,
      "name": "Hamburguesa Vegetariana",
      "quantity": 40,
      "desc": "Hamburguesa de espinacas - … y judias",
      "price": 30,
      "image": "vb.jpg"
    },
    {
      "id": 3,
      "name": "Patatas fritas",
      "quantity": 50,
      "desc": "Patatas fritas",
      "price": 10,
      "image": "chips.jpg"
    },
    {
      "id": 4,
      "name": "Helado",
      "quantity": 60,
      "desc": "Helado de vainilla",
      "price": 5,
      "image": "ic.jpg"
    },
  ]);

  const handleUpdateMenuItems = (updateItems: MenuItem[]) => {
    setMenuItems(updateItems);
  }

  return (
    <foodItemsContext.Provider value={menuItems}>

      <div className="App">
        <button className="toggleButton" onClick={() =>
          setIsChooseFoodPage
            (!isChooseFoodPage)}>{isChooseFoodPage ? "Disponibilidad" : "Pedir Comida"}
        </button>
        <h3 className="title">Comida Rápida Online</h3>
        {!isChooseFoodPage && (
          <>
            <h4 className="subTitle">Menús</h4>
            <ul className="ulApp">
              {menuItems.map((item) => {
                return (
                  <li key={item.id} className="liApp">
                    <p>{item.name}</p><p>#{item.quantity}</p>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {isChooseFoodPage && <Foods foodItems={menuItems} onUpdateMenuItems={handleUpdateMenuItems}></Foods>}
      </div>
    </foodItemsContext.Provider>

  )
}

export default App
