import { Navigate } from "react-router-dom";
import useAuth from "../../context/useAuth";

export default function MahasiswaGuard({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || user.role !== "MAHASISWA")
    return <Navigate to="/login" replace />;

  if (!user.passwordChanged)
    return <Navigate to="/mahasiswa/password" replace />;

  if (!user.profileComplete)
    return <Navigate to="/mahasiswa/profile" replace />;

  return children;
}
