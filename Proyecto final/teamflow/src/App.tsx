import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { useAppSelector } from "./redux/hooks";
import TopBar from "./components/TopBar";

const App: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  console.log("App.tsx - user desde Redux:", user); // DEBUG
  const LoginPage = React.lazy(() => import("./components/LoginPage"));
  const Dashboard = React.lazy(() => import("./pages/Dashboard"));
  const ProjectDetail = React.lazy(() => import("./pages/ProjectDetail"));
  const Profile = React.lazy(() => import("./pages/Profile"));
  const AdminPanel = React.lazy(() => import("./components/AdminPanel"));

  return (
    <>
      {user && <TopBar />}
      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
    </>
  );
};

export default App;
