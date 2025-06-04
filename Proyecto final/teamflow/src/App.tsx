import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./components/LoginPage";
import Dashboard from "./pages/Dashboard";
import { useAppSelector } from "./redux/hooks";
import ProjectDetail from "./pages/ProjectDetail";
import TopBar from "./components/TopBar";
import Profile from "./pages/Profile";
import AdminPanel from "./components/AdminPanel";

const App: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  console.log("App.tsx - user desde Redux:", user); // DEBUG

  return (
    <>
      {user && <TopBar />}
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas privadas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:id"
          element={
            <PrivateRoute>
              <ProjectDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Ruta solo para administradores */}
        <Route
          path="/admin"
          element={
            <PrivateRoute requireAdmin>
              <AdminPanel />
            </PrivateRoute>
          }
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
};

export default App;
