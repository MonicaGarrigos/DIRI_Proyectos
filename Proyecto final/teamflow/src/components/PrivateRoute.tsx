import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import type { JSX } from "react";

interface PrivateRouteProps {
  children: JSX.Element;
  requireAdmin?: boolean;
}

const PrivateRoute = ({ children, requireAdmin = false }: PrivateRouteProps) => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) return <Navigate to="/login" />;

  // ** Usuario desactivado
  if (user.hasOwnProperty("active") && (user as any).active === false) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateRoute;
