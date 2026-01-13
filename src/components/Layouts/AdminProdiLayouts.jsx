import { NavLink, Outlet } from "react-router-dom";
import { LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import useAuth from "../../context/useAuth";

export default function AdminProdiLayout() {
  const { user, logout } = useAuth();
  const [kinerjaOpen, setKinerjaOpen] = useState(true);
  const [tilcOpen, setTilcOpen] = useState(false);

  const menu = [
    { path: "", label: "Dashboard" },
    { path: "led", label: "Laporan Evaluasi Diri" },
  ];

  const laporanKinerja = [
    { path: "visi-misi", label: "Visi & Misi" },
    { path: "kurikulum", label: "Kurikulum" },
    { path: "lulusan", label: "Kompetensi Lulusan" },
    { path: "pembelajaran", label: "Proses Pembelajaran" },
    { path: "pendidik", label: "Pendidik & Tendik" },
    { path: "sarana", label: "Sarana & Prasarana" },
    { path: "mahasiswa", label: "Mahasiswa & Lulusan" },
    { path: "penelitian", label: "Penelitian & PKM" },
  ];

  const tilc = [
    "Unit Bahasa",
    "Pusaka",
    "Perpustakaan",
    "Kewirausahaan",
    "P3M",
    "SPI",
    "LSP",
    "IT",
    "Humas",
    "PKN",
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      <header className="h-16 bg-white shadow flex items-center justify-between px-8">
        <div>
          <div className="text-xs text-slate-400">Admin Prodi</div>
          <div className="font-bold text-lg text-[#0F3D62]">
            {user?.prodi?.replaceAll("_", " ")}
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg"
        >
          <LogOut size={18} />
          Logout
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 bg-white shadow-lg p-4 overflow-y-auto">
          <nav className="space-y-1">
            {menu.map((m) => (
              <NavLink
                key={m.path}
                to={m.path}
                end
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                {m.label}
              </NavLink>
            ))}

            <div className="mt-4">
              <button
                onClick={() => setKinerjaOpen(!kinerjaOpen)}
                className="w-full flex justify-between items-center px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
              >
                Laporan Kinerja
                <ChevronDown
                  size={16}
                  className={`transition ${kinerjaOpen ? "rotate-180" : ""}`}
                />
              </button>

              {kinerjaOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  {laporanKinerja.map((m) => (
                    <NavLink
                      key={m.path}
                      to={m.path}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded text-sm transition ${
                          isActive
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-slate-600 hover:bg-slate-100"
                        }`
                      }
                    >
                      {m.label}
                    </NavLink>
                  ))}

                  <div>
                    <button
                      onClick={() => setTilcOpen(!tilcOpen)}
                      className="w-full flex justify-between items-center px-3 py-2 rounded text-sm text-slate-600 hover:bg-slate-100"
                    >
                      Integrasi TILC
                      <ChevronDown
                        size={14}
                        className={`transition ${tilcOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {tilcOpen && (
                      <div className="ml-4 mt-1 space-y-1">
                        {tilc.map((t) => (
                          <div
                            key={t}
                            className="px-3 py-1 text-xs text-slate-500 rounded hover:bg-slate-100 cursor-pointer"
                          >
                            {t}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
