import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mahasiswaAPI } from "../../api/mahasiswa.api";
import Button from "../../components/Elements/Button";
import OnboardingStepper from "../../components/Fragments/OnBoardingStepper";
import useAuth from "../../context/useAuth";

const PRODI_OPTIONS = [
  "TATA_HIDANG",
  "DIVISI_KAMAR",
  "SENI_KULINER",
  "USAHA_PERJALANAN_WISATA",
];

const PERAN_OPTIONS = ["REGULER", "MAGANG", "PKL"];

export default function CompleteProfile() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nim: "",
    semester: "",
    prodi: "",
    departemen: "",
    peran: "",
    periodePraktik: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.nim ||
      !form.semester ||
      !form.prodi ||
      !form.departemen ||
      !form.peran
    )
      return setError("Semua data wajib diisi");

    if (Number(form.semester) < 1 || Number(form.semester) > 14)
      return setError("Semester tidak valid");

    setLoading(true);
    try {
      await mahasiswaAPI.completeProfile({
        ...form,
        semester: Number(form.semester),
      });
      await refreshUser(); // 🔥 penting
      navigate("/mahasiswa/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center pt-14">
      <div className="w-full max-w-xl">
        <OnboardingStepper step={2} />
        <form
          onSubmit={submit}
          className="w-full max-w-xl rounded-xl bg-white p-6  shadow-sm"
        >
          <h1 className="text-xl font-semibold text-slate-800">
            Lengkapi Profil Mahasiswa
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Data ini digunakan untuk keperluan akademik dan penjaminan mutu
          </p>

          {error && (
            <div className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">NIM</label>
              <input
                value={form.nim}
                onChange={(e) => setForm({ ...form, nim: e.target.value })}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Nomor Induk Mahasiswa"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Semester
              </label>
              <input
                type="number"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
                className="mt-1 w-full rounded border border-slate-300  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="1 - 14"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Program Studi
              </label>
              <select
                value={form.prodi}
                onChange={(e) => setForm({ ...form, prodi: e.target.value })}
                className="mt-1 w-full rounded border border-slate-300  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Pilih Prodi</option>
                {PRODI_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Departemen
              </label>
              <input
                value={form.departemen}
                onChange={(e) =>
                  setForm({ ...form, departemen: e.target.value })
                }
                className="mt-1 w-full rounded border border-slate-300  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Departemen / Unit"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Peran Mahasiswa
              </label>
              <select
                value={form.peran}
                onChange={(e) => setForm({ ...form, peran: e.target.value })}
                className="mt-1 w-full rounded border border-slate-300  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Pilih Peran</option>
                {PERAN_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Periode Praktik (Opsional)
              </label>
              <input
                value={form.periodePraktik}
                onChange={(e) =>
                  setForm({ ...form, periodePraktik: e.target.value })
                }
                className="mt-1 w-full rounded border border-slate-300  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Contoh: Jan - Jun 2026"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="mt-6 w-full">
            {loading ? "Menyimpan..." : "Simpan & Masuk Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
}
