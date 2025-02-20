import React, { useState } from 'react';
import '../App.css';
import { authService } from '../services/IAuthService';


const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const handleLogin = async (e:
        React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential
                = await authService.signIn(email, password);
            console.log("Usuario autenticado:", userCredential.user);
            navigate('/dashboard');
        } catch (error: any) {
            console.error("Error al iniciar sesión:", error);
            setError(error.message);
        }
    }; return (
        <form onSubmit={handleLogin}>
            <h2>Iniciar Sesión</h2>
            <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Ingresar</button>
            {error && <p className="error-message">{error}</p>}
        </form>
    );
};