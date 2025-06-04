import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Acceso denegado</h2>
      <p>No tienes permisos para acceder a esta página.</p>
      <Link to="/home">
        <button style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
          Volver a inicio
        </button>
      </Link>
    </div>
  );
}

export default Unauthorized;
