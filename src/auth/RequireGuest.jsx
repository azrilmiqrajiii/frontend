import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function RequireGuest({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10">Loading...</div>;

  if (user) {
    if (user.role === "ADMIN_PRODI")
      return <Navigate to="/admin-prodi" replace />;
    if (user.role === "UNIT") return <Navigate to="/unit" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
