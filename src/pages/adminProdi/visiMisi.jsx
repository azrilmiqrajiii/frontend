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
    } catch {
      setData(null);
    }
  }, [user, year]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!visi.trim()) return alert("Visi wajib diisi");
    if (!misi.trim()) return alert("Misi wajib diisi");

    if (file) {
      if (file.type !== "application/pdf") {
        return alert("File harus PDF");
      }
      if (file.size > 5 * 1024 * 1024) {
        return alert("Ukuran file maksimal 5MB");
      }
    }

    try {
      setLoading(true);
      const f = new FormData();
      f.append("visi", visi);
      f.append("misi", misi);
      f.append("tahun", Number(year));
      if (file) f.append("file", file);

      await visiMisiAPI.save(user.prodi, f);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan data");
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
    } catch (err) {
      alert("error", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0F3D62]">Visi & Misi</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-slate-500">Pernyataan resmi program studi</p>
            {data ? (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                Data sudah tersedia
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
                Data belum tersedia
              </span>
            )}
          </div>
        </div>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-6 py-3 rounded-xl bg-white shadow"
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-10 space-y-8">
        <textarea
          value={visi}
          onChange={(e) => setVisi(e.target.value)}
          className="w-full h-40 p-6 rounded-2xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1E6F9F]"
          placeholder="Visi Program Studi"
        />

        <textarea
          value={misi}
          onChange={(e) => setMisi(e.target.value)}
          className="w-full h-40 p-6 rounded-2xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1E6F9F]"
          placeholder="Misi Program Studi"
        />

        <FileDrop
          file={file}
          setFile={setFile}
          label="Dokumen Pendukung Visi & Misi (PDF)"
        />
        {data?.file && (
          <div className="flex items-center justify-between bg-slate-50 px-6 py-4 rounded-2xl">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Dokumen Visi & Misi
              </p>
              <p className="text-xs text-slate-500">File sudah diunggah</p>
            </div>

            <a
              href={data.file}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition"
            >
              Lihat File
            </a>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            onClick={save}
            loading={loading}
            className="px-10 py-3 rounded-xl bg-[#1E6F9F] text-white"
          >
            Simpan
          </Button>

          {data && (
            <Button
              onClick={remove}
              className="px-8 py-3 rounded-xl bg-red-500 text-white"
            >
              Hapus
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
