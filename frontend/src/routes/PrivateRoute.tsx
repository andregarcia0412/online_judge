import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

export const PrivateRoute = () => {
  const { tokens, isLoading } = useAuthContext();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!tokens) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};
