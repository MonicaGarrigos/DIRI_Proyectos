import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Unauthorized from "../pages/Unauthorized";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Solo logueados (cualquier rol) */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      {/* Solo admin */}
      <Route
        path="/admin"
        element={
          <PrivateRoute requiredRole="admin">
            <div>Admin Panel</div>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
