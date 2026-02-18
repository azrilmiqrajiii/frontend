import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import NavbarDosen from "../Fragments/NavbarDosen";

export default function DosenLayouts() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "DOSEN") return <Navigate to="/unauthorized" replace />;

  return (
    <div className="min-h-screen bg-slate-100">
      <NavbarDosen />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
