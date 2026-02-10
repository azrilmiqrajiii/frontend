import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function MahasiswaGuard() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  if (!user.passwordChanged)
    return <Navigate to="/mahasiswa/change-password" replace />;

  if (!user.profileComplete)
    return <Navigate to="/mahasiswa/complete-profile" replace />;

  return <Outlet />;
}
