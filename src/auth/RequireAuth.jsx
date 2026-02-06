import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function RequireAuth({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) return <Navigate to="/403" replace />;

  return children ? children : <Outlet />;
}
