import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import FormLogin from "../components/Fragments/FormLogin";
import AuthLayouts from "../components/Layouts/AuthLayouts";

export default function LoginPage() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user?.role === "ADMIN_PRODI")
    return <Navigate to="/admin-prodi" replace />;

  if (user?.role === "UNIT") return <Navigate to="/unit" replace />;

  if (user?.role === "DOSEN") return <Navigate to="/dosen" replace />;

  if (user?.role === "MAHASISWA") return <Navigate to="/mahasiswa" replace />;

  return (
    <AuthLayouts title="Masuk">
      <FormLogin />
    </AuthLayouts>
  );
}
