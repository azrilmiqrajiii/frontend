import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function ChangePasswordGuard() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  if (location.pathname !== "/mahasiswa/change-password") return <Outlet />;

  if (user.passwordChanged) {
    if (!user.profileComplete)
      return <Navigate to="/mahasiswa/complete-profile" replace />;

    return <Navigate to="/mahasiswa/dashboard" replace />;
  }

  return <Outlet />;
}
