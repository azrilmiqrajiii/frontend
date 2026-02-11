import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import { LogOut, Menu, X } from "lucide-react";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function NavbarMahasiswa() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 h-14 bg-white shadow">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-700">
            Sistem Informasi SPM
          </span>
          <span className="text-xs text-slate-500">
            Mahasiswa {user?.prodi?.replaceAll("_", " ")}
          </span>
        </div>

        <div className="hidden md:flex items-center relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="relative h-9 w-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold
                       transition-all duration-200
                       hover:scale-105 hover:ring-4 hover:ring-blue-200/60"
          >
            {getInitials(user?.name)}
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-72 rounded-2xl bg-slate-800 text-white shadow-2xl p-5 animate-[fadeIn_0.15s_ease-out]">
              <div className="flex flex-col items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-semibold shadow-md">
                  {getInitials(user?.name)}
                </div>

                <div className="text-center">
                  <div className="font-semibold">{user?.name || "-"}</div>
                  <div className="text-sm text-slate-300 break-all">
                    {user?.email || "-"}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg
                             bg-red-500/10 text-red-400
                             hover:bg-red-500/20 transition"
                >
                  <LogOut size={18} />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-slate-100"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-slate-400 bg-white px-4 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
              {getInitials(user?.name)}
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-700">
                {user?.name}
              </span>
              <span className="text-xs text-slate-500 break-all">
                {user?.email}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-red-50 text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
