import { useEffect, useState, useCallback } from "react";
import useAuth from "../../context/useAuth";
import { visiMisiAPI } from "../../api/visiMisi.api";
import Button from "../../components/Elements/Button";
import FileDrop from "../../components/Fragments/FileDrop";

const YEARS = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];

export default function VisiMisi() {
  const { user } = useAuth();
  const [year, setYear] = useState("2026");
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const res = await visiMisiAPI.get(user.prodi, Number(year));
      if (res.data) {
        setData(res.data);
        setVisi(res.data.visi || "");
        setMisi(res.data.misi || "");
      } else {
        setData(null);
        setVisi("");
        setMisi("");
      }
      setFile(null);
      setErrors({});
    } catch {
      setData(null);
    }
  }, [user, year]);

  useEffect(() => {
    load();
  }, [load]);

  const validate = () => {
    const e = {};
    if (!visi.trim()) e.visi = "Visi wajib diisi";
    else if (visi.trim().length < 40) e.visi = "Visi minimal 40 karakter";

    if (!misi.trim()) e.misi = "Misi wajib diisi";
    else if (misi.trim().length < 80) e.misi = "Misi minimal 80 karakter";

    if (file) {
      if (file.type !== "application/pdf") e.file = "Dokumen harus PDF";
      if (file.size > 5 * 1024 * 1024) e.file = "Ukuran maksimal 5MB";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const f = new FormData();
      f.append("visi", visi);
      f.append("misi", misi);
      f.append("tahun", Number(year));
      if (file) f.append("file", file);
      await visiMisiAPI.save(user.prodi, f);
      await load();
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    try {
      await visiMisiAPI.remove(data._id);
      setVisi("");
      setMisi("");
      setData(null);
      setFile(null);
      setErrors({});
    } catch (err) {
      alert("error", err);
    }
  };

  const fieldClass = (err) =>
    `w-full p-6 rounded-2xl border transition outline-none ${
      err
        ? "border-red-400 focus:ring-red-300"
        : "border-slate-200 focus:ring-[rgba(30,111,159,0.35)]"
    } focus:ring-2 bg-slate-50 focus:bg-white`;

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Visi & Misi Program Studi
          </h1>
          <p className="text-slate-500 mt-1">
            Pernyataan strategis dan arah pengembangan prodi
          </p>

          <div className="mt-3">
            {data ? (
              <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                ● Data tersedia
              </span>
            ) : (
              <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
                ● Belum tersedia
              </span>
            )}
          </div>
        </div>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-5 py-3 rounded-xl bg-white border border-slate-200 shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[rgba(30,111,159,0.35)]"
        >
          {YEARS.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-[28px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] p-10 space-y-8">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Visi</label>
          <textarea
            value={visi}
            onChange={(e) => setVisi(e.target.value)}
            onBlur={validate}
            className={`${fieldClass(errors.visi)} h-44`}
            placeholder="Tuliskan visi program studi"
          />
          <p
            className={`text-xs ${
              errors.visi ? "text-red-500" : "text-slate-400"
            }`}
          >
            {errors.visi || "Minimal 40 karakter"}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Misi</label>
          <textarea
            value={misi}
            onChange={(e) => setMisi(e.target.value)}
            onBlur={validate}
            className={`${fieldClass(errors.misi)} h-44`}
            placeholder="Tuliskan misi program studi"
          />
          <p
            className={`text-xs ${
              errors.misi ? "text-red-500" : "text-slate-400"
            }`}
          >
            {errors.misi || "Minimal 80 karakter"}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-700">
            Dokumen Pendukung (Opsional)
          </p>

          <FileDrop file={file} setFile={setFile} />

          {errors.file && <p className="text-xs text-red-500">{errors.file}</p>}

          {data?.file && (
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Dokumen Visi & Misi
                </p>
                <p className="text-xs text-slate-500">File sudah tersimpan</p>
              </div>

              <a
                href={data.file}
                target="_blank"
                className="px-6 py-2 rounded-xl bg-[#1E6F9F] text-white text-sm font-semibold hover:opacity-90 transition"
              >
                Lihat Dokumen
              </a>
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            onClick={save}
            loading={loading}
            className="px-10 py-3 rounded-xl bg-[#1E6F9F] text-white hover:opacity-90"
          >
            Simpan Perubahan
          </Button>

          {data && (
            <Button
              onClick={remove}
              className="px-8 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600"
            >
              Hapus Data
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
