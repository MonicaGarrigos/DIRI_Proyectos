

import { useEffect, useState } from 'react';
import './App.css'
import { MenuItem } from './entities/entities';
import Foods from './components/Foods';
import React from 'react';
import { onValue, ref, set } from 'firebase/database';
import { database } from './firebaseConfig';
import logger from './services/logging';
import ErrorBoundary from './services/errorBoundary';

// ** Contexto global 
export const foodItemsContext = React.createContext<MenuItem[]>([]);


function App() {

  const [count, setCount] = useState(0);

  useEffect(() => {
    logger.debug("Debug level log");
    logger.info("Info level log");
    logger.warn("Warning level log");
    logger.error("Error level log");
  }, []);

  const [isChooseFoodPage, setIsChooseFoodPage] = useState(false);

  // ** Inicializamos como un array vacío el menu
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    // ** Llamamos a la Firebase para obtener los datos
    const menuItemsRef = ref(database, 'menuItmes');  // Referencia a la url donde esta la base de datos
    onValue(menuItemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Validación y tipado correcto
        const menuItemsArray: MenuItem[] = Object.entries(data).map(([key, value]) => {
          // Asegurarse de que 'value' es un objeto y tiene las propiedades de MenuItem
          if (typeof value === 'object' && value !== null && 'id' in value && 'name' in value && 'quantity' in value && 'desc' in value && 'price' in value && 'image' in value) {
            return {
              id: value.id as number,
              name: value.name as string,
              quantity: value.quantity as number,
              desc: value.desc as string,
              price: value.price as number,
              image: value.image as string,
            };
          } else {
            console.error("Invalid menu item data:", value);
            return null; // O un valor por defecto si lo prefieres
          }
        }).filter(item => item !== null) as MenuItem[];

        setMenuItems(menuItemsArray);
      } else {
        // Datos iniciales tipados correctamente
        const initialMenuItems: MenuItem[] = [
          { "id": 1, "name": "Hamburguesa de Pollo", "quantity": 40, "desc": "Hamburguesa de pollo frito - … y mayonesa", "price": 24, "image": "cb.jpg" },
          { "id": 2, "name": "Hamburguesa Vegetariana", "quantity": 40, "desc": "Hamburguesa de espinacas - … y judias", "price": 30, "image": "vb.jpg" },
          { "id": 3, "name": "Patatas fritas", "quantity": 50, "desc": "Patatas fritas", "price": 10, "image": "chips.jpg" },
          { "id": 4, "name": "Helado", "quantity": 60, "desc": "Helado de vainilla", "price": 5, "image": "ic.jpg" },
        ];
        setMenuItems(initialMenuItems);
        set(menuItemsRef, initialMenuItems);
      }
    })
  }, []);

  const handleUpdateMenuItems = (updateItems: MenuItem[]) => {
    setMenuItems(updateItems);

    // ** Guarda los datos actualizados en Firebase
    const menuItmesRef = ref(database, 'menuItmes');
    set(menuItmesRef, updateItems); // Sobreescribe los datos en Firebase
  }

  return (
    <ErrorBoundary fallback={<div><h1>Cargando...</h1></div>}>

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

    </ErrorBoundary>
  )
}

export default App
