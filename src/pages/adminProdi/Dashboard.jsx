import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  GraduationCap,
  Award,
  Users,
  Building2,
  Microscope,
  Layers,
  ArrowRight,
  Lock,
  AlertTriangle,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import useAuth from "../../context/useAuth";
import Button from "../../components/Elements/Button";

const PRIMARY = "#1E6F9F";

const modules = [
  { name: "Visi & Misi", total: 1, ready: true, path: "visi-misi", icon: FileText },
  { name: "Kurikulum", total: 8, ready: true, path: "kurikulum", icon: BookOpen },
  { name: "Capaian Pembelajaran", total: 12, ready: true, path: "lulusan/capaian-pembelajaran", icon: GraduationCap },
  { name: "Prestasi Mahasiswa", total: 20, ready: true, path: "lulusan", icon: Award },
  { name: "Proses Pembelajaran", total: 0, ready: false, path: "#", icon: Layers },
  { name: "Pendidik & Tendik", total: 0, ready: false, path: "#", icon: Users },
  { name: "Sarana & Prasarana", total: 0, ready: false, path: "#", icon: Building2 },
  { name: "Penelitian & PKM", total: 0, ready: false, path: "#", icon: Microscope },
];

const pieData = [
  { name: "Siap", value: modules.filter(m => m.ready).length },
  { name: "Belum", value: modules.filter(m => !m.ready).length },
];

const ModuleTile = ({ m, onClick }) => {
  const Icon = m.icon;
  return (
    <div
      onClick={m.ready ? onClick : undefined}
      className={`relative rounded-[36px] p-6 transition-all duration-300
        ${
          m.ready
            ? "bg-white/80 backdrop-blur-lg shadow-[0_24px_90px_rgba(0,0,0,0.14)] hover:-translate-y-1 cursor-pointer"
            : "bg-slate-100/50 opacity-60 cursor-not-allowed"
        }`}
    >
      <div className="flex items-start gap-4">
        <div
          className="p-4 rounded-3xl"
          style={{ backgroundColor: `${PRIMARY}20`, color: PRIMARY }}
        >
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{m.name}</p>
          <p className="text-xs text-slate-500">
            Total data: <b>{m.total}</b>
          </p>
        </div>
      </div>

      {!m.ready && (
        <Lock size={16} className="absolute top-5 right-5 text-slate-400" />
      )}

      {m.ready && (
        <ArrowRight
          size={18}
          className="absolute bottom-6 right-6 text-slate-400 opacity-0 hover:opacity-100"
        />
      )}
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const year = time.getFullYear();
  const totalData = modules.reduce((a, b) => a + b.total, 0);
  const incomplete = modules.filter(m => !m.ready);

  return (
    <div className="space-y-20">
      {/* LIVE CONTEXT */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div
            className="p-4 rounded-3xl"
            style={{ backgroundColor: `${PRIMARY}20`, color: PRIMARY }}
          >
            <LayoutDashboard size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-slate-800">
              Executive Command Center
            </h1>
            <p className="text-sm text-slate-500">
              {user?.prodi?.replaceAll("_", " ")} • Tahun {year}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-500">
            {time.toLocaleDateString("id-ID")}
          </p>
          <p className="text-xl font-semibold text-slate-800">
            {time.toLocaleTimeString("id-ID")}
          </p>
        </div>
      </div>

      {/* KPI STREAM */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
        {[
          ["Total Modul", modules.length],
          ["Modul Aktif", modules.filter(m => m.ready).length],
          ["Total Entri Data", totalData],
          ["Kesiapan Sistem", "75%"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="bg-white/85 backdrop-blur-lg rounded-[36px] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.15)]"
          >
            <p className="text-xs text-slate-500">{label}</p>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-3xl font-semibold text-slate-800">{value}</p>
              <Activity size={18} color={PRIMARY} />
            </div>
          </div>
        ))}
      </div>

      {/* DATA STORY */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 bg-white rounded-[40px] p-10 shadow-[0_30px_120px_rgba(0,0,0,0.15)]">
          <h2 className="text-sm font-semibold text-slate-700 mb-6">
            Distribusi Data Mutu
          </h2>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={modules}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill={PRIMARY} radius={[14, 14, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-[40px] p-10 shadow-[0_30px_120px_rgba(0,0,0,0.15)]">
          <h2 className="text-sm font-semibold text-slate-700 mb-6">
            Kesiapan Modul
          </h2>
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={110}
                outerRadius={150}
                paddingAngle={4}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? PRIMARY : "#CBD5E1"} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PRIORITY */}
      <div className="bg-white rounded-[40px] p-10 shadow-[0_30px_120px_rgba(0,0,0,0.15)]">
        <div className="flex items-start gap-6">
          <div
            className="p-5 rounded-3xl"
            style={{ backgroundColor: `${PRIMARY}20`, color: PRIMARY }}
          >
            <AlertTriangle size={32} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Priority Radar
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>
                • <b>{incomplete.length}</b> modul belum tersedia dan perlu
                ditindaklanjuti.
              </li>
              <li>
                • Fokus utama minggu ini: <b>Capaian Pembelajaran</b> &
                <b> Prestasi Mahasiswa</b>.
              </li>
              <li>
                • Total <b>{totalData}</b> data tercatat hingga saat ini.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* MODULE MATRIX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10">
        {modules.map(m => (
          <ModuleTile
            key={m.name}
            m={m}
            onClick={() => navigate(m.path)}
          />
        ))}
      </div>

      {/* FINAL CTA */}
      <div className="rounded-[40px] p-12 bg-white shadow-[0_34px_140px_rgba(0,0,0,0.18)] flex flex-col md:flex-row justify-between items-center gap-10">
        <div>
          <h3 className="text-2xl font-semibold text-slate-800">
            Sistem Siap Dikembangkan Lebih Lanjut
          </h3>
          <p className="text-sm text-slate-500 max-w-xl">
            Dashboard ini dirancang untuk berkembang dengan data real-time,
            analitik lanjutan, dan kecerdasan buatan.
          </p>
        </div>

        <Button
          onClick={() => navigate("lulusan/capaian-pembelajaran")}
          className="px-12 py-4 flex items-center gap-3"
          style={{ backgroundColor: PRIMARY, color: "white" }}
        >
          Lanjutkan Pengisian <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
}
