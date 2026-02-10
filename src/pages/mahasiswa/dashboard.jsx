import useAuth from "../../context/useAuth";

export default function MahasiswaDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_40%)]" />
        <div className="relative">
          <p className="text-sm uppercase tracking-widest text-white/80">
            Dashboard Mahasiswa
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight">
            Selamat datang, {user.name}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/90">
            Sistem Informasi Satuan Penjaminan Mutu
          </p>

          <div className="mt-5 inline-flex items-center gap-3 rounded-full bg-white/15 px-5 py-2 backdrop-blur">
            <span
              className={`h-2 w-2 rounded-full ${
                user.profileComplete ? "bg-emerald-400" : "bg-yellow-400"
              }`}
            />
            <span className="text-xs font-medium">
              {user.profileComplete
                ? "Profil Mahasiswa Lengkap"
                : "Profil Belum Lengkap"}
            </span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Stat
          label="Program Studi"
          value={user.prodi?.replaceAll("_", " ") || "-"}
        />
        <Stat
          label="Semester"
          value={user.semester ? `Semester ${user.semester}` : "-"}
        />
        <Stat label="Departemen" value={user.departemen || "-"} />
        <Stat
          label="Status Mahasiswa"
          value={user.profileComplete ? "Aktif" : "Belum Lengkap"}
          accent={user.profileComplete}
        />
      </section>

      <section>
        <h2 className="mb-6 text-lg font-semibold text-slate-700">
          Layanan Akademik & Mutu
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Service
            title="Evaluasi Dosen oleh Mahasiswa"
            desc="Penilaian proses pembelajaran dan kinerja dosen"
            tag="EDOM"
          />
          <Service
            title="Survei Kepuasan Mahasiswa"
            desc="Masukan untuk peningkatan layanan dan mutu institusi"
            tag="SURVEI"
          />
          <Service
            title="Tracer Study"
            desc="Pendataan lulusan dan kesiapan dunia kerja"
            tag="ALUMNI"
          />
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="rounded-2xl bg-white/70 p-5 shadow-md backdrop-blur transition hover:-translate-y-1 hover:shadow-lg">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p
        className={`mt-2 text-lg font-semibold ${
          accent ? "text-emerald-600" : "text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Service({ title, desc, tag }) {
  return (
    <div className="group relative rounded-2xl bg-white/80 p-6 shadow-md backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute right-5 top-5 rounded-full bg-blue-600/10 px-3 py-1 text-xs font-semibold text-blue-700">
        {tag}
      </div>

      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{desc}</p>

      <div className="mt-6 text-sm font-medium text-blue-600 opacity-0 transition group-hover:opacity-100">
        Buka →
      </div>
    </div>
  );
}
