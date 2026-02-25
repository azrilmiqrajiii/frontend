import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function MahasiswaEntry() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  if (!user.passwordChanged)
    return <Navigate to="/mahasiswa/change-password" replace />;

  if (!user.profileComplete)
    return <Navigate to="/mahasiswa/complete-profile" replace />;

  if (user.isSupervisorTILC)
    return <Navigate to="/mahasiswa/supervisor" replace />;

  return <Navigate to="/mahasiswa/dashboard" replace />;
}
