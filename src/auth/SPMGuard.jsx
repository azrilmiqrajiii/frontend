import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function SPMGuard() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "SPM") return <Navigate to="/forbidden" replace />;

  return <Outlet />;
}
