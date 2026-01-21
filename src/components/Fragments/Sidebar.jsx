import { NavLink } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";

const Sidebar = ({ open, onClose }) => {
  const [kinerjaOpen, setKinerjaOpen] = useState(true);
  const [lulusanOpen, setLulusanOpen] = useState(true);
  const [tilcOpen, setTilcOpen] = useState(false);

  const menu = [
    { path: "", label: "Dashboard" },
    { path: "led", label: "Laporan Evaluasi Diri" },
  ];

  const kompetensiLulusan = [
    {
      key: "a",
      path: "lulusan/capaian-pembelajaran",
      label: "Capaian Pembelajaran",
    },
    {
      key: "b",
      path: "lulusan/prestasi-mahasiswa",
      label: "Prestasi Mahasiswa",
    },
    { key: "c", path: "lulusan/waktu-tunggu", label: "Waktu Tunggu Lulusan" },
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
          <div className="font-semibold text-[#0F3D62]">Menu</div>
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
            className="w-full flex justify-between items-center px-4 py-2 rounded-lg
              text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Laporan Kinerja
            <ChevronDown
              size={16}
              className={`transition ${kinerjaOpen ? "rotate-180" : ""}`}
            />
          </button>

          {kinerjaOpen && (
            <div className="ml-3 space-y-1">
              <NavLink
                to="visi-misi"
                className="flex gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded"
              >
                <span className="w-5 text-right text-xs font-semibold text-slate-400">
                  1.
                </span>
                <span>Visi & Misi</span>
              </NavLink>

              <NavLink
                to="kurikulum"
                className="flex gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded"
              >
                <span className="w-5 text-right text-xs font-semibold text-slate-400">
                  2.
                </span>
                <span>Kurikulum</span>
              </NavLink>

              <button
                onClick={() => setLulusanOpen(!lulusanOpen)}
                className="w-full flex gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded"
              >
                <span className="w-5 text-right text-xs font-semibold text-slate-400">
                  3.
                </span>
                <span className="flex-1 text-left">Kompetensi Lulusan</span>
                <ChevronDown
                  size={14}
                  className={`transition ${lulusanOpen ? "rotate-180" : ""}`}
                />
              </button>

              {lulusanOpen && (
                <div className="ml-8 space-y-1">
                  {kompetensiLulusan.map((s) => (
                    <NavLink
                      key={s.path}
                      to={s.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex gap-2 px-3 py-1.5 rounded text-xs ${
                          isActive
                            ? "bg-blue-50 text-[#1E6F9F]"
                            : "text-slate-500 hover:bg-slate-100"
                        }`
                      }
                    >
                      <span className="w-4 text-right">{s.key}.</span>
                      <span>{s.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}

              {[
                ["4.", "pembelajaran", "Proses Pembelajaran"],
                ["5.", "pendidik", "Pendidik & Tendik"],
                ["6.", "sarana", "Sarana & Prasarana"],
                ["7.", "mahasiswa", "Mahasiswa & Lulusan"],
                ["8.", "penelitian", "Penelitian & PKM"],
              ].map(([no, path, label]) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={onClose}
                  className="flex gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded"
                >
                  <span className="w-5 text-right text-xs font-semibold text-slate-400">
                    {no}
                  </span>
                  <span>{label}</span>
                </NavLink>
              ))}

              <button
                onClick={() => setTilcOpen(!tilcOpen)}
                className="w-full flex gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded"
              >
                <span className="w-5 text-right text-xs font-semibold text-slate-400">
                  9.
                </span>
                <span className="flex-1 text-left">Integrasi TILC</span>
                <ChevronDown
                  size={14}
                  className={`transition ${tilcOpen ? "rotate-180" : ""}`}
                />
              </button>

              {tilcOpen && (
                <div className="ml-8 space-y-1">
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
