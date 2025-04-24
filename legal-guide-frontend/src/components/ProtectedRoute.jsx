import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ admin }) => {
  const { isAuth, isAdmin } = useAuth();

  if (!isAuth) return <Navigate to="/login" replace />;

  if (admin && !isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
