import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import NavbarMahasiswa from "../Fragments/NavbarMahasiswa";

export default function MahasiswaLayouts() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "MAHASISWA") return <Navigate to="/unauthorized" replace />;

  return (
    <div className="min-h-screen bg-slate-100">
      <NavbarMahasiswa />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
