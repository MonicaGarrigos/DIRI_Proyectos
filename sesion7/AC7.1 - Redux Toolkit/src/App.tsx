import { useEffect, useState } from 'react'
import './App.css'
import { MenuItem } from './entities/entities'
import Foods from './components/Foods'
import React from 'react'
import { onValue, ref, set } from 'firebase/database'
import { database } from './firebaseConfig'
import logger from './services/logging'
import ErrorBoundary from './services/errorBoundary'
import OrderList from './components/OrderList'

// Contexto global para compartir los menús
export const foodItemsContext = React.createContext<MenuItem[]>([])

function App() {
  const [isChooseFoodPage, setIsChooseFoodPage] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  // Logging básico para validación
  useEffect(() => {
    logger.debug("Debug level log")
    logger.info("Info level log")
    logger.warn("Warning level log")
    logger.error("Error level log")
  }, [])

  useEffect(() => {
    const menuItemsRef = ref(database, 'menuItems')

    onValue(menuItemsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const menuItemsArray: MenuItem[] = Object.entries(data).map(([, value]) => {
          if (
            typeof value === 'object' && value !== null &&
            'id' in value && 'name' in value && 'quantity' in value &&
            'desc' in value && 'price' in value && 'image' in value
          ) {
            return {
              id: value.id as number,
              name: value.name as string,
              quantity: value.quantity as number,
              desc: value.desc as string,
              price: value.price as number,
              image: value.image as string,
            }
          } else {
            console.error("Invalid menu item data:", value)
            return null
          }
        }).filter(item => item !== null) as MenuItem[]

        setMenuItems(menuItemsArray)
      } else {
        const initialMenuItems: MenuItem[] = [
          {
            id: 1,
            name: "Hamburguesa de Pollo",
            quantity: 40,
            desc: "Hamburguesa de pollo frito con lechuga y mayonesa",
            price: 24,
            image: "cb.jpg"
          },
          {
            id: 2,
            name: "Hamburguesa Vegetariana",
            quantity: 40,
            desc: "Hamburguesa de espinacas y judías",
            price: 30,
            image: "vb.jpg"
          },
          {
            id: 3,
            name: "Patatas fritas",
            quantity: 50,
            desc: "Patatas fritas crujientes",
            price: 10,
            image: "chips.jpg"
          },
          {
            id: 4,
            name: "Helado",
            quantity: 60,
            desc: "Helado de vainilla",
            price: 5,
            image: "ic.jpg"
          }
        ]
        setMenuItems(initialMenuItems)
        set(menuItemsRef, initialMenuItems)
      }
    })
  }, [])

  const handleUpdateMenuItems = (updatedItems: MenuItem[]) => {
    setMenuItems(updatedItems)
    const menuItemsRef = ref(database, 'menuItems')
    set(menuItemsRef, updatedItems)
  }

  return (
    <ErrorBoundary fallback={<div><h1>Cargando...</h1></div>}>
      <foodItemsContext.Provider value={menuItems}>
        <div className="App">
          <button className="toggleButton" onClick={() => setIsChooseFoodPage(!isChooseFoodPage)}>
            {isChooseFoodPage ? "Disponibilidad" : "Pedir Comida"}
          </button>

          <h3 className="title">Comida Rápida Online</h3>

          {!isChooseFoodPage && (
            <>
              <h4 className="subTitle">Menús</h4>

              {menuItems.length === 0 ? (
                <p>No hay menús disponibles en este momento.</p> // Validación por si Firebase falla
              ) : (
                <ul className="ulApp">
                  {menuItems.map(item => (
                    <li key={item.id} className="liApp">
                      <p>{item.name}</p><p>#{item.quantity}</p>
                    </li>
                  ))}
                </ul>
              )}

              <OrderList />
            </>
          )}

          {isChooseFoodPage && (
            <Foods
              foodItems={menuItems}
              onUpdateMenuItems={handleUpdateMenuItems}
            />
          )}
        </div>
      </foodItemsContext.Provider>
    </ErrorBoundary>
  )
}

export default App
