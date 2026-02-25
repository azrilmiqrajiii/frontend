import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function MahasiswaGuard() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  if (!user.passwordChanged)
    return <Navigate to="/mahasiswa/change-password" replace />;

  if (!user.profileComplete)
    return <Navigate to="/mahasiswa/complete-profile" replace />;

  const isSupervisorPath = location.pathname.startsWith(
    "/mahasiswa/supervisor",
  );
  const isRegularPath = location.pathname.startsWith("/mahasiswa/dashboard");

  if (user.isSupervisorTILC && isRegularPath)
    return <Navigate to="/mahasiswa/supervisor" replace />;

  if (!user.isSupervisorTILC && isSupervisorPath)
    return <Navigate to="/mahasiswa/dashboard" replace />;

  return <Outlet />;
}
