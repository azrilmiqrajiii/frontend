import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mahasiswaAPI } from "../../api/mahasiswa.api";
import axios from "../../api/axios";
import Button from "../../components/Elements/Button";
import OnboardingStepper from "../../components/Fragments/OnBoardingStepper";
import useAuth from "../../context/useAuth";

const PRODI_OPTIONS = [
  { label: "D4 Usaha Perjalanan Wisata", value: "USAHA_PERJALANAN_WISATA" },
  { label: "D3 Tata Hidang", value: "TATA_HIDANG" },
  { label: "D3 Divisi Kamar", value: "DIVISI_KAMAR" },
  { label: "D3 Seni Kuliner", value: "SENI_KULINER" },
];

export default function CompleteProfile() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [periodeOptions, setPeriodeOptions] = useState([]);
  const [loadingPeriode, setLoadingPeriode] = useState(true);

  const [form, setForm] = useState({
    nim: "",
    semester: "",
    prodi: "",
    departemen: "",
    periodePraktik: "",
  });

  useEffect(() => {
    const fetchPeriode = async () => {
      try {
        const res = await axios.get("/periode-praktik");
        setPeriodeOptions(res.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPeriode(false);
      }
    };

    fetchPeriode();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.nim.trim() ||
      !form.semester ||
      !form.prodi ||
      !form.departemen.trim()
    ) {
      return setError("Semua data wajib diisi");
    }

    const semesterNumber = Number(form.semester);
    if (isNaN(semesterNumber) || semesterNumber < 1 || semesterNumber > 14) {
      return setError("Semester harus antara 1 - 14");
    }

    setLoading(true);
    try {
      await mahasiswaAPI.completeProfile({
        ...form,
        nim: form.nim.trim(),
        departemen: form.departemen.trim(),
        semester: semesterNumber,
      });

      await refreshUser();
      navigate("/mahasiswa/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center pt-14 px-4">
      <div className="w-full max-w-xl">
        <OnboardingStepper step={2} />

        <form
          onSubmit={submit}
          className="w-full rounded-xl bg-white p-6 shadow-sm"
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
                onChange={(e) => handleChange("nim", e.target.value)}
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
                min="1"
                max="14"
                value={form.semester}
                onChange={(e) => handleChange("semester", e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="1 - 14"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Program Studi
              </label>
              <select
                value={form.prodi}
                onChange={(e) => handleChange("prodi", e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Pilih Prodi</option>
                {PRODI_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
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
                onChange={(e) => handleChange("departemen", e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Departemen / Unit"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Periode Praktik
              </label>
              <select
                value={form.periodePraktik}
                onChange={(e) => handleChange("periodePraktik", e.target.value)}
                disabled={loadingPeriode}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">
                  {loadingPeriode
                    ? "Memuat periode..."
                    : "Pilih Periode (Opsional)"}
                </option>
                {periodeOptions.map((p) => (
                  <option key={p._id} value={p.nama}>
                    {p.nama}
                  </option>
                ))}
              </select>
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
