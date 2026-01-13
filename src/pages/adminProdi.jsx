import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import Button from "../components/Elements/Button";
import useAuth from "../context/useAuth";

export default function AdminProdi() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState("Dashboard");
  const [year, setYear] = useState("2025/2026");
  const [mobileOpen, setMobileOpen] = useState(false);

  const menu = [
    "Dashboard",
    "Visi dan Misi",
    "Kurikulum",
    "Kompetensi Lulusan",
    "Proses Pembelajaran",
    "Pendidik dan Tenaga Kependidikan",
    "Sarana dan Prasarana",
    "Pembiayaan",
    "Manajemen dan Tata Kelola",
    "Penilaian Pendidikan",
    "Mahasiswa dan Lulusan",
    "Penelitian dan Pengabdian kepada Masyarakat",
  ];

  const prodiMap = {
    TATA_HIDANG: "Tata Hidang",
    DIVISI_KAMAR: "Divisi Kamar",
    SENI_KULINER: "Seni Kuliner",
    USAHA_PERJALANAN_WISATA: "Usaha Perjalanan Wisata",
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            <Menu size={20} />
          </button>

          <div className="mx-3">
            <div className="text-xs text-slate-400">Admin Prodi</div>
            <div className="font-semibold text-[#0F3D62]">
              {prodiMap[user?.prodi] || "Prodi"}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2 rounded-full hover:bg-slate-100"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-16 left-0 z-50 h-[calc(100vh-64px)] w-72 bg-white shadow-xl
          transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between px-6 py-4 md:hidden">
          <span className="text-sm font-medium">Menu</span>
          <button onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="px-4 pb-6 overflow-y-auto h-full space-y-1">
          {menu.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActive(item);
                setMobileOpen(false);
              }}
              className={`
                w-full text-left px-4 py-2 rounded-xl text-sm transition
                ${
                  active === item
                    ? "bg-[#E6F1F8] text-[#0F3D62] font-medium"
                    : "text-slate-600 hover:bg-slate-100"
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>
      </aside>

      {/* CONTENT */}
      <main className="pt-16 md:ml-72 min-h-screen">
        <div className="max-w-350 mx-auto px-4 md:px-8 py-8 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <h1 className="text-2xl font-semibold text-[#0F3D62]">{active}</h1>

            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-white rounded-xl px-4 py-2 shadow-sm text-sm"
            >
              <option>2025/2026</option>
              <option>2024/2025</option>
              <option>2023/2024</option>
            </select>
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
            {active === "Dashboard" ? (
              <p className="text-slate-600">
                Ringkasan progres standar mutu untuk tahun {year}.
              </p>
            ) : (
              <>
                <p className="text-slate-600">
                  Data <b>{active}</b> untuk tahun <b>{year}</b>.
                </p>

                <div className="mt-6">
                  <Button className="w-auto px-6">Upload Dokumen</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
