import { useEffect, useState, useCallback } from "react";
import useAuth from "../../context/useAuth";
import { visiMisiAPI } from "../../api/visiMisi.api";
import Button from "../../components/Elements/Button";
import FileDrop from "../../components/Fragments/FileDrop";

const YEARS = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];
const PRIMARY = "#1E6F9F";

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
    await visiMisiAPI.remove(data._id);
    setVisi("");
    setMisi("");
    setData(null);
    setFile(null);
    setErrors({});
  };

  const field = (err) =>
    `w-full rounded-[28px] px-8 py-6 bg-white/85 backdrop-blur outline-none transition
     focus:ring-2 focus:ring-[rgba(30,111,159,0.35)]
     ${err ? "ring-2 ring-red-400" : ""}`;

  return (
    <div className="max-w-7xl mx-auto space-y-14">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800">
            Visi & Misi Program Studi
          </h1>
          <p className="text-slate-500 mt-1">
            Pernyataan strategis dan arah pengembangan program studi
          </p>

          <div className="mt-4">
            {data ? (
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700">
                ● Data tersedia
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                ● Belum tersedia
              </span>
            )}
          </div>
        </div>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-6 py-3 rounded-2xl bg-white/80 backdrop-blur shadow-md text-sm font-medium outline-none focus:ring-2 focus:ring-[rgba(30,111,159,0.35)]"
        >
          {YEARS.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white/85 backdrop-blur rounded-[36px] shadow-[0_24px_90px_rgba(0,0,0,0.12)] p-12 space-y-12">
        {/* VISI */}
        <section className="space-y-3 ">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Visi
          </h2>
          <textarea
            value={visi}
            onChange={(e) => setVisi(e.target.value)}
            onBlur={validate}
            className={`${field(errors.visi)} h-48 border-4 border-slate-200 `}
            placeholder="Tuliskan visi program studi sebagai arah jangka panjang"
          />
          <p
            className={`text-xs ${errors.visi ? "text-red-500" : "text-slate-400"}`}
          >
            {errors.visi || "Minimal 40 karakter"}
          </p>
        </section>

        {/* MISI */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Misi
          </h2>
          <textarea
            value={misi}
            onChange={(e) => setMisi(e.target.value)}
            onBlur={validate}
            className={`${field(errors.misi)} h-52 border-4 border-slate-200 `}
            placeholder="Tuliskan misi sebagai langkah strategis untuk mencapai visi"
          />
          <p
            className={`text-xs ${errors.misi ? "text-red-500" : "text-slate-400 "}`}
          >
            {errors.misi || "Minimal 80 karakter"}
          </p>
        </section>

        {/* FILE */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Dokumen Pendukung
          </h2>

          <FileDrop file={file} setFile={setFile} />

          {errors.file && <p className="text-xs text-red-500">{errors.file}</p>}

          {data?.file && (
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-8 py-5">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Dokumen Visi & Misi
                </p>
                <p className="text-xs text-slate-500">File telah tersimpan</p>
              </div>

              <a
                href={data.file}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-2xl text-sm font-semibold text-white"
                style={{ backgroundColor: PRIMARY }}
              >
                Lihat Dokumen
              </a>
            </div>
          )}
        </section>

        {/* ACTION */}
        <div className="flex gap-5 pt-6">
          <Button
            onClick={save}
            loading={loading}
            className="px-12 py-4 rounded-2xl text-white"
            style={{ backgroundColor: PRIMARY }}
          >
            Simpan Perubahan
          </Button>

          {data && (
            <Button
              onClick={remove}
              className="px-10 py-4 rounded-2xl bg-red-500 text-white hover:bg-red-600"
            >
              Hapus Data
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
