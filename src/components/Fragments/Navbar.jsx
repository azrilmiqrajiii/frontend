import { LogOut, Menu } from "lucide-react";
import useAuth from "../../context/useAuth";

const Navbar = ({ onOpenSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-3">
        <button onClick={onOpenSidebar} className="md:hidden">
          <Menu size={22} />
        </button>
        <div>
          <div className="text-xs text-slate-400">Admin Prodi</div>
          <div className="font-bold text-sm md:text-lg text-[#0F3D62]">
            {user?.prodi?.replaceAll("_", " ")}
          </div>
        </div>
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm"
      >
        <LogOut size={16} />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  );
};
export default Navbar;
