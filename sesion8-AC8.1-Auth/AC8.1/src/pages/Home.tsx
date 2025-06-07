import { useEffect, useState } from 'react';
import { MenuItem } from '../entities/entities';
import Foods from '../components/Foods';
import { onValue, ref, set } from 'firebase/database';
import { database } from '../firebaseConfig';
import OrderList from '../components/OrderList';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import './Home.css';
import { logout } from '../redux/authSlice';
import { AppDispatch } from "../redux/store";

function Home() {
  const [isChooseFoodPage, setIsChooseFoodPage] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const menuItemsRef = ref(database, 'menuItems');

    onValue(menuItemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const menuItemsArray: MenuItem[] = Object.entries(data)
          .map(([, value]) => {
            if (
              typeof value === 'object' &&
              value !== null &&
              'id' in value &&
              'name' in value &&
              'quantity' in value &&
              'desc' in value &&
              'price' in value &&
              'image' in value
            ) {
              return {
                id: value.id,
                name: value.name,
                quantity: value.quantity,
                desc: value.desc,
                price: value.price,
                image: value.image,
              };
            } else {
              console.error('Invalid menu item data:', value);
              return null;
            }
          })
          .filter((item) => item !== null) as MenuItem[];

        setMenuItems(menuItemsArray);
      } else {
        const initialMenuItems: MenuItem[] = [
          {
            id: 1,
            name: 'Hamburguesa de Pollo',
            quantity: 40,
            desc: 'Hamburguesa de pollo frito con lechuga y mayonesa',
            price: 24,
            image: 'cb.jpg',
          },
          {
            id: 2,
            name: 'Hamburguesa Vegetariana',
            quantity: 40,
            desc: 'Hamburguesa de espinacas y judías',
            price: 30,
            image: 'vb.jpg',
          },
          {
            id: 3,
            name: 'Patatas fritas',
            quantity: 50,
            desc: 'Patatas fritas crujientes',
            price: 10,
            image: 'chips.jpg',
          },
          {
            id: 4,
            name: 'Helado',
            quantity: 60,
            desc: 'Helado de vainilla',
            price: 5,
            image: 'ic.jpg',
          },
        ];
        setMenuItems(initialMenuItems);
        set(menuItemsRef, initialMenuItems);
      }
    });
  }, []);

  const handleUpdateMenuItems = (updatedItems: MenuItem[]) => {
    setMenuItems(updatedItems);
    const menuItemsRef = ref(database, 'menuItems');
    set(menuItemsRef, updatedItems);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="App">
      <div className="top-bar">
        <button className="toggleButton" onClick={() => setIsChooseFoodPage(!isChooseFoodPage)}>
          {isChooseFoodPage ? 'Disponibilidad' : 'Pedir Comida'}
        </button>

        {user && (
          <button className="logoutButton" onClick={handleLogout}>
            Cerrar sesión
          </button>
        )}
      </div>

      <h3 className="title">Comida Rápida Online</h3>

      {!isChooseFoodPage && (
        <>
          <h4 className="subTitle">Menús</h4>

          {menuItems.length === 0 ? (
            <p>No hay menús disponibles en este momento.</p>
          ) : (
            <ul className="ulApp">
              {menuItems.map((item) => (
                <li key={item.id} className="liApp">
                  <img src={`/images/${item.image}`} alt={item.name} className="menu-image" />
                  <p className="menu-name">{item.name}</p>
                  {isAdmin && <p className="menu-quantity">#{item.quantity}</p>}
                </li>
              ))}
            </ul>
          )}

          <OrderList />
        </>
      )}

      {isChooseFoodPage && user ? (
        <Foods foodItems={menuItems} onUpdateMenuItems={handleUpdateMenuItems} />
      ) : isChooseFoodPage && !user ? (
        <p>Debes iniciar sesión para realizar pedidos.</p>
      ) : null}
    </div>
  );
}

export default Home;
