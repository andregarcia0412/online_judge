import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

export const PrivateRoute = () => {
  const { userData, isLoading } = useAuthContext();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!userData) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};
