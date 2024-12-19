import { NavLink } from "react-router-dom";


const Header = (): React.JSX.Element =>
    <nav>
        <NavLink to="/">Inicio</NavLink> | <NavLink to="/about">Acerca de...</NavLink>
    </nav>

export default Header;



// El componente NavLink sabe si la ruta está actualmente activa y añade una clase "active" por defecto al enlace