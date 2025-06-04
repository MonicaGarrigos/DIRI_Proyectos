import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { AppDispatch, RootState } from "../redux/store";
import { Link, useNavigate } from "react-router-dom";
import './Login.css';

function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { error, loading } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap(); 
      navigate("/home"); // redirige si login fue exitoso
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  // Traducir errores comunes
  const getFriendlyError = (err: string | null): string | null => {
    if (!err) return null;
    if (err.includes("auth/invalid-credential") || err.includes("auth/wrong-password")) {
      return "Correo o contraseña incorrectos.";
    }
    if (err.includes("auth/user-not-found")) {
      return "No existe una cuenta con este correo.";
    }
    return "Error: " + err;
  };

  return (
    <div className="login-container">
      <div className="auth-card">
        <h2 className="auth-title">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Cargando..." : "Entrar"}
          </button>

          {error && <p className="auth-error">{getFriendlyError(error)}</p>}
        </form>

        <p className="auth-link-text">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="auth-link">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
