import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function DosenGuard() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "DOSEN") return <Navigate to="/unauthorized" replace />;

  if (!user.passwordChanged)
    return <Navigate to="/dosen/change-password" replace />;

  if (!user.profileComplete)
    return <Navigate to="/dosen/complete-profile" replace />;

  return <Outlet />;
}
