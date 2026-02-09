import MahasiswaLayout from "../../components/Layouts/MahasiswaLayouts";
import useAuth from "../../context/useAuth";

export default function DashboardMahasiswa() {
  const { user } = useAuth();

  return (
    <MahasiswaLayout>
      <div className="space-y-6">
        <h1 className="text-lg font-semibold text-slate-800">
          Selamat datang, {user.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-lg p-4">
            <p className="text-xs text-slate-500">NIM</p>
            <p className="font-medium">{user.nim}</p>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <p className="text-xs text-slate-500">Program Studi</p>
            <p className="font-medium">{user.prodi}</p>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <p className="text-xs text-slate-500">Semester</p>
            <p className="font-medium">{user.semester}</p>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <p className="text-xs text-slate-500">Departemen</p>
            <p className="font-medium">{user.departemen}</p>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <p className="text-xs text-slate-500">Peran</p>
            <p className="font-medium">{user.peran}</p>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <p className="text-xs text-slate-500">Periode Praktik</p>
            <p className="font-medium">{user.periodePraktik}</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            Silakan lanjutkan pengisian data laporan sesuai kebutuhan.
          </p>
        </div>
      </div>
    </MahasiswaLayout>
  );
}
