import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dosenAPI } from "../../api/dosen.api";
import Button from "../../components/Elements/Button";
import OnboardingStepper from "../../components/Fragments/OnboardingStepper";
import useAuth from "../../context/useAuth";

const PRODI_OPTIONS = [
  { label: "Seni Kuliner", value: "SENI_KULINER" },
  { label: "Divisi Kamar", value: "DIVISI_KAMAR" },
  { label: "Tata Hidang", value: "TATA_HIDANG" },
  { label: "Usaha Perjalanan Wisata", value: "USAHA_PERJALANAN_WISATA" },
];

export default function CompleteProfile() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    gelar: "",
    nidn: "",
    prodi: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.nidn || !form.prodi)
      return setError("Semua data wajib diisi");

    setLoading(true);
    try {
      await dosenAPI.completeProfile({
        name: form.name.trim(),
        gelar: form.gelar.trim(),
        nidn: form.nidn.trim(),
        prodi: form.prodi,
      });

      await refreshUser();
      navigate("/dosen/dashboard", { replace: true });
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
            Lengkapi Profil Dosen
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
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">
                Nama Lengkap
              </label>
              <input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="Nama lengkap tanpa singkatan"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Gelar Akademik
              </label>
              <input
                value={form.gelar}
                onChange={(e) => handleChange("gelar", e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="Contoh: M.Kom (opsional)"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                NIDN / NOPTK
              </label>
              <input
                value={form.nidn}
                onChange={(e) => handleChange("nidn", e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="Nomor Induk Dosen"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">
                Program Studi
              </label>
              <select
                value={form.prodi}
                onChange={(e) => handleChange("prodi", e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <option value="">Pilih Program Studi</option>
                {PRODI_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
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
