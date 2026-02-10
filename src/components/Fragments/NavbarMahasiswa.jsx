import { useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import Button from "../Elements/Button";

export default function NavbarMahasiswa() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-14 bg-white shadow flex items-center justify-between px-6">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-slate-700">
          Sistem Informasi SPM
        </span>
        <span className="text-xs text-slate-500">
          Mahasiswa {user?.prodi?.replaceAll("_", " ")}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600">{user?.name}</span>
        <Button variant="danger" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
