import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function DosenGuard() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "DOSEN") return <Navigate to="/unauthorized" replace />;

  if (!user.passwordChanged)
    return <Navigate to="/dosen/change-password" replace />;

  if (!user.profileComplete)
    return <Navigate to="/dosen/complete-profile" replace />;

  const path = location.pathname;

  const isDashboard = path.startsWith("/dosen/dashboard");
  const isTOD = path.startsWith("/dosen/tod");
  const isKaprodi = path.startsWith("/dosen/kaprodi");

  if (user.jabatanDosen === "TOD") {
    if (!isTOD) return <Navigate to="/dosen/tod" replace />;
  }

  if (user.jabatanDosen === "KAPRODI") {
    if (!isKaprodi) return <Navigate to="/dosen/kaprodi" replace />;
  }

  if (!user.jabatanDosen) {
    if (!isDashboard) return <Navigate to="/dosen/dashboard" replace />;
  }

  return <Outlet />;
}
