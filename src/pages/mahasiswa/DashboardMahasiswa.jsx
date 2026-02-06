import useAuth from "../../context/useAuth";

export default function DashboardMahasiswa() {
  const { user } = useAuth();

  return (
    <div className="grid gap-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold text-slate-800">
          Selamat datang, {user?.name}
        </h1>
        <p className="text-slate-600 mt-2">
          Ini adalah dashboard mahasiswa. Silakan lengkapi data dan ikuti
          aktivitas akademik yang tersedia.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-slate-500">Status Akun</p>
          <p className="font-semibold text-slate-800">Aktif</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-slate-500">Program Studi</p>
          <p className="font-semibold text-slate-800">{user?.prodi || "-"}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-slate-500">Role</p>
          <p className="font-semibold text-slate-800">{user?.role}</p>
        </div>
      </div>
    </div>
  );
}
