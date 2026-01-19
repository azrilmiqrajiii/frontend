import { NavLink } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";

const Sidebar = ({ open, onClose }) => {
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
    <>
      <aside
        className={`
        fixed md:static z-40 inset-y-0 left-0
        w-72 bg-white shadow-lg p-4 overflow-y-auto
        transform transition-transform
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        <div className="flex justify-between items-center mb-4 md:hidden">
          <div className="font-bold text-[#0F3D62]">Menu</div>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1">
          {menu.map((m) => (
            <NavLink
              key={m.path}
              to={m.path}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-semibold ${
                  isActive
                    ? "bg-blue-100 text-[#1E6F9F]"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              {m.label}
            </NavLink>
          ))}

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
            <div className="ml-4 space-y-1">
              {laporanKinerja.map((m) => (
                <NavLink
                  key={m.path}
                  to={m.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded text-sm ${
                      isActive
                        ? "bg-blue-50 text-[#1E6F9F]"
                        : "text-slate-600 hover:bg-slate-100"
                    }`
                  }
                >
                  {m.label}
                </NavLink>
              ))}

              <button
                onClick={() => setTilcOpen(!tilcOpen)}
                className="w-full flex justify-between items-center px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Integrasi TILC
                <ChevronDown
                  size={14}
                  className={`transition ${tilcOpen ? "rotate-180" : ""}`}
                />
              </button>

              {tilcOpen && (
                <div className="ml-4 space-y-1">
                  {tilc.map((t) => (
                    <div
                      key={t}
                      className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded"
                    >
                      {t}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>
      </aside>

      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
        />
      )}
    </>
  );
};
export default Sidebar;
