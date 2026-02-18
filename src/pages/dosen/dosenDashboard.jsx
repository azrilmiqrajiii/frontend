import useAuth from "../../context/useAuth"

function AnimatedHero({ name }) {
  return (
    <div className="relative overflow-hidden rounded-3xl p-8 shadow-xl
                    bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600">
      
      <div className="absolute inset-0 animate-[aurora_8s_linear_infinite]
                      bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.35),transparent)]
                      opacity-40" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />

      <div className="relative">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Selamat datang,{" "}
          <span className="relative inline-block">
            <span className="absolute inset-0 animate-[shine_3s_ease-in-out_infinite]
                              bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)]
                              bg-[length:200%_100%]
                              text-transparent bg-clip-text">
              {name}
            </span>
            <span className="relative">{name}</span>
          </span>
        </h1>

        <p className="mt-2 text-sm text-emerald-100">
          Dashboard Dosen Sistem Informasi SPM
        </p>
      </div>
    </div>
  )
}

export default function DosenDashboard() {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return null

  const displayName = `${user.name}${user.gelar ? ", " + user.gelar : ""}`

  return (
    <div className="space-y-8">
      <AnimatedHero name={displayName} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm">
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition
                          bg-linear-to-br from-emerald-100/40 to-transparent" />
          <div className="relative">
            <div className="text-sm text-slate-500">NIDN / NOPTK</div>
            <div className="mt-1 text-xl font-semibold text-slate-800">
              {user.nidn || "-"}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm">
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition
                          bg-linear-to-br from-teal-100/40 to-transparent" />
          <div className="relative">
            <div className="text-sm text-slate-500">Homebase</div>
            <div className="mt-1 text-xl font-semibold text-slate-800">
              {user.homebase || "-"}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm">
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition
                          bg-linear-to-br from-cyan-100/40 to-transparent" />
          <div className="relative">
            <div className="text-sm text-slate-500">Status Profil</div>
            <div className="mt-1 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
              Lengkap
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">
            Ringkasan Peran
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Anda terdaftar sebagai dosen aktif dalam Sistem Informasi SPM.
            Gunakan dashboard ini untuk mendukung kegiatan akademik
            dan penjaminan mutu institusi.
          </p>
        </div>

        <div className="rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-white">
            Informasi Sistem
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Modul dosen akan dikembangkan secara bertahap, termasuk EDOM
            dan monitoring mutu akademik.
          </p>
        </div>
      </div>
    </div>
  )
}
