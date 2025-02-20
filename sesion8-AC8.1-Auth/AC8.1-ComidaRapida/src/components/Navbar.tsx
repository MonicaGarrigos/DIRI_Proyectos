import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { authService, Role } from '../services/IAuthService';
import { AuthContext } from '../services/contexts/AuthContext';

const Navbar: React.FC = () => {
    const { user, roles } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await authService.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };
    return (
        <nav className="navbar">
            <ul className="nav-menu">
                <li><Link to="/">Home</Link></li>
                {user && <li><Link to="/dashboard">Dashboard</Link></li>}
                {user && roles && roles.includes(Role.ADMIN) && (
                    <li><Link to="/admin">Admin</Link></li>)
                }
                {!user && <li><Link to="/login">Login</Link></li>}
                {!user && <li><Link to="/register">Registro</Link></li>}
                {user && <li><button onClick={handleLogout}>Logout</button></li>}
            </ul>
        </nav>
    );
};

export default Navbar;