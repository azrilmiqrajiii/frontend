import { useEffect, useState } from "react";
import useAuth from "../../context/useAuth";
import { visiMisiAPI } from "../../api/visiMisi.api";
import Button from "../../components/Elements/Button";

const YEARS = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];

export default function VisiMisi() {
  const { user } = useAuth();
  const [year, setYear] = useState("2026");
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await visiMisiAPI.get(user.prodi, year);
    if (res.data) {
      setData(res.data);
      setVisi(res.data.visi || "");
      setMisi(res.data.misi || "");
    } else {
      setData(null);
      setVisi("");
      setMisi("");
    }
  };

  useEffect(() => {
    if (user) load();
  }, [year, user]);

  const save = async () => {
    setLoading(true);
    const f = new FormData();
    f.append("visi", visi);
    f.append("misi", misi);
    f.append("tahun", year);
    if (file) f.append("file", file);
    await visiMisiAPI.save(user.prodi, f);
    await load();
    setLoading(false);
  };

  const remove = async () => {
    await visiMisiAPI.remove(data._id);
    setVisi("");
    setMisi("");
    setData(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F3D62]">Visi & Misi</h1>
          <p className="text-slate-500">
            Kelola pernyataan resmi program studi per tahun akademik
          </p>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="px-6 py-3 rounded-xl bg-white shadow focus:ring-2 focus:ring-blue-300"
          >
            {YEARS.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>

          {data ? (
            <span className="px-4 py-2 rounded-full text-xs bg-green-100 text-green-700">
              Sudah ada data
            </span>
          ) : (
            <span className="px-4 py-2 rounded-full text-xs bg-red-500 text-white">
              Belum ada data
            </span>
          )}
        </div>
      </div>

      {/* MAIN */}
      <div className="bg-white rounded-3xl shadow-xl p-10 space-y-10">
        {/* VISI & MISI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-slate-500 mb-2">Visi Program Studi</p>
            <textarea
              value={visi}
              onChange={(e) => setVisi(e.target.value)}
              placeholder="Tuliskan visi  Program Studi..."
              className="w-full h-50 p-6 rounded-2xl bg-slate-100 focus:ring-2 focus:ring-blue-300 resize-none"
            />
          </div>

          <div>
            <p className="text-sm text-slate-500 mb-2">Misi Program Studi</p>
            <textarea
              value={misi}
              onChange={(e) => setMisi(e.target.value)}
              placeholder="Tuliskan Misi untuk mewujudkan visi..."
              className="w-full h-50 p-6 rounded-2xl bg-slate-100 focus:ring-2 focus:ring-blue-300 resize-none"
            />
          </div>
        </div>

        {/* FILE UPLOAD */}
        <div className="space-y-3">
          <p className="text-sm text-slate-500">
            Dokumen pendukung (PDF max 5MB)
          </p>

          <div className="flex items-center gap-4">
            <label className="px-6 py-3 bg-blue-50 text-blue-700 rounded-xl cursor-pointer hover:bg-blue-100 transition">
              Pilih File
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
            </label>

            <div className="text-sm text-slate-600 bg-green-200 rounded-md hover:bg-green-400 py-3 px-2">
              {file
                ? file.name
                : data?.file
                ? data.file.split("/").pop()
                : "Belum ada file"}
            </div>
          </div>

          {data?.file && (
            <a
              href={data.file}
              target="_blank"
              className="
      inline-flex items-center gap-2
      mt-2 px-4 py-2
      bg-slate-100 hover:bg-slate-200
      text-slate-700 rounded-lg
      text-sm transition
    "
            >
              📄 Lihat file tersimpan
            </a>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-start items-center gap-4 pt-6">
          <Button
            onClick={save}
            loading={loading}
            className="px-10 py-3 rounded-xl bg-blue-[#1E6F9F] hover:bg-blue-[#0F3D62]] text-white shadow-lg"
          >
            {data ? "Update Perubahan" : "Simpan Data"}
          </Button>
          {data && (
            <Button
              onClick={remove}
              className="px-6 py-3 rounded-xl bg-red-500 text-red-600 hover:bg-red-800"
            >
              Hapus
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
