import { NavLink } from "react-router-dom";
import {
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ClipboardList,
  Folder,
} from "lucide-react";
import { useState } from "react";
import useAuth from "../../context/useAuth";

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [kinerjaOpen, setKinerjaOpen] = useState(true);
  const [lulusanOpen, setLulusanOpen] = useState(true);
  const [tilcOpen, setTilcOpen] = useState(false);

  const isMahasiswa = user?.role === "MAHASISWA";
  const isSupervisor = isMahasiswa && user?.isSupervisorTILC;

  const mainMenu = [
    { path: "", label: "Dashboard", icon: LayoutDashboard },
    { path: "led", label: "Laporan Evaluasi Diri", icon: ClipboardList },
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
          ${collapsed ? "w-20" : "w-56 lg:w-60"}
          bg-white shadow-lg p-3 overflow-y-auto
          transition-all duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-4">
          {!collapsed && (
            <div className="text-sm font-semibold text-[#0F3D62]">Menu</div>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="hidden md:flex p-1 rounded hover:bg-slate-100"
            >
              {collapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>

            <button onClick={onClose} className="md:hidden">
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className="space-y-1">
          {mainMenu.map((m) => {
            const Icon = m.icon;
            return (
              <NavLink
                key={m.path}
                to={m.path}
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-center md:justify-start gap-3 px-3 py-2 rounded-lg text-[13px] font-semibold ${
                    isActive
                      ? "bg-blue-100 text-[#1E6F9F]"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {collapsed ? <Icon size={22} /> : <span>{m.label}</span>}
              </NavLink>
            );
          })}

          {isMahasiswa && !isSupervisor && (
            <NavLink
              to="refleksi"
              onClick={onClose}
              className="flex items-center justify-center md:justify-start gap-3 px-3 py-2 rounded-lg text-[13px] font-semibold text-slate-700 hover:bg-slate-100"
            >
              {collapsed ? (
                <ClipboardList size={22} />
              ) : (
                <span>Refleksi Harian</span>
              )}
            </NavLink>
          )}

          {isSupervisor && (
            <NavLink
              to="supervisor"
              onClick={onClose}
              className="flex items-center justify-center md:justify-start gap-3 px-3 py-2 rounded-lg text-[13px] font-semibold text-slate-700 hover:bg-slate-100"
            >
              {collapsed ? (
                <ClipboardList size={22} />
              ) : (
                <span>DCC Supervisor</span>
              )}
            </NavLink>
          )}

          <button
            onClick={() => setKinerjaOpen((v) => !v)}
            className="w-full flex items-center justify-center md:justify-start gap-3 px-3 py-2 rounded-lg text-[13px] font-semibold text-slate-700 hover:bg-slate-100"
          >
            {collapsed ? (
              <Folder size={22} />
            ) : (
              <>
                <span className="flex-1 text-left">Laporan Kinerja</span>
                <ChevronDown
                  size={14}
                  className={`transition ${kinerjaOpen ? "rotate-180" : ""}`}
                />
              </>
            )}
          </button>

          {!collapsed && kinerjaOpen && (
            <div className="ml-2 space-y-0.5">
              <NavLink
                to="visi-misi"
                className="block px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-100 rounded"
              >
                1. Visi & Misi
              </NavLink>

              <NavLink
                to="kurikulum"
                className="block px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-100 rounded"
              >
                2. Kurikulum
              </NavLink>

              <button
                onClick={() => setLulusanOpen((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-100 rounded"
              >
                <span>3. Kompetensi Lulusan</span>
                <ChevronDown
                  size={14}
                  className={`transition ${lulusanOpen ? "rotate-180" : ""}`}
                />
              </button>

              {lulusanOpen && (
                <div className="ml-6 space-y-0.5">
                  {kompetensiLulusan.map((s) => (
                    <NavLink
                      key={s.path}
                      to={s.path}
                      onClick={onClose}
                      className="block px-2 py-1 text-[12px] text-slate-500 hover:bg-slate-100 rounded"
                    >
                      {s.key}. {s.label}
                    </NavLink>
                  ))}
                </div>
              )}

              {[
                ["4", "pembelajaran", "Proses Pembelajaran"],
                ["5", "pendidik", "Pendidik & Tendik"],
                ["6", "sarana", "Sarana & Prasarana"],
                ["7", "mahasiswa", "Mahasiswa & Lulusan"],
                ["8", "penelitian", "Penelitian & PKM"],
              ].map(([no, path, label]) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={onClose}
                  className="block px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-100 rounded"
                >
                  {no}. {label}
                </NavLink>
              ))}

              <button
                onClick={() => setTilcOpen((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-100 rounded"
              >
                <span>9. Integrasi TILC</span>
                <ChevronDown
                  size={14}
                  className={`transition ${tilcOpen ? "rotate-180" : ""}`}
                />
              </button>

              {tilcOpen && (
                <div className="ml-6 space-y-0.5">
                  {tilc.map((t) => (
                    <div
                      key={t}
                      className="px-2 py-1 text-[12px] text-slate-500"
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
