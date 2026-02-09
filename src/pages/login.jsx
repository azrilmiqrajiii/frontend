import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import FormLogin from "../components/Fragments/FormLogin";
import AuthLayouts from "../components/Layouts/AuthLayouts";

export default function LoginPage() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    switch (user.role) {
      case "ADMIN_PRODI":
        return <Navigate to="/admin-prodi" replace />;

      case "UNIT":
        return <Navigate to="/unit" replace />;

      case "DOSEN":
        return <Navigate to="/dosen" replace />;

      case "MAHASISWA":
        return <Navigate to="/mahasiswa" replace />;

      default:
        return <Navigate to="/forbidden" replace />;
    }
  }

  return (
    <AuthLayouts title="Masuk">
      <FormLogin />
    </AuthLayouts>
  );
}
