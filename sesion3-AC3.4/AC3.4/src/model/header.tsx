import { NavLink } from "react-router-dom";

// REQUISITO 1 - Menú de navegación siempre visible que muestre la página activa

const Header = (): React.JSX.Element =>
    <header className="header">  {/* En el css ponemos que el header siempre esté fijo con "position:fixed" */}
    <nav className="nav">
        {/* Utilizo NavLink para identificar la página activa */}
      <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Inicio</NavLink> |
      <NavLink to="/items" className={({ isActive }) => isActive ? 'active' : ''}>Items</NavLink> |
      <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>Acerca de...</NavLink> |
      <NavLink to="/help" className={({ isActive }) => isActive ? 'active' : ''}>Ayuda</NavLink>  {/* REQUISITO 5 - Botón en el menú para la página de ayuda */}
    </nav>
  </header>

export default Header;



// El componente NavLink sabe si la ruta está actualmente activa y añade una clase "active" por defecto al enlace