import { useEffect, useState } from "react";
import { Upload, Trash2, Save } from "lucide-react";
import Button from "../../../components/Elements/Button";
import useAuth from "../../../context/useAuth";
import { prestasiMahasiswaAPI } from "../../../api/prestasiMahasiswa.api";

const newRow = () => ({
  __key: crypto.randomUUID(),
  namaKegiatan: "",
  tingkat: "",
  prestasi: "",
  bukti: "",
});

const PrestasiMahasiswa = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);

  const [tahun, setTahun] = useState(currentYear);
  const [akademik, setAkademik] = useState([newRow()]);
  const [nonAkademik, setNonAkademik] = useState([newRow()]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const a = await prestasiMahasiswaAPI.list(user.prodi, "akademik", tahun);
      const n = await prestasiMahasiswaAPI.list(
        user.prodi,
        "non-akademik",
        tahun,
      );

      setAkademik(
        a.data.length
          ? a.data.map((r) => ({ ...r, __key: crypto.randomUUID() }))
          : [newRow()],
      );
      setNonAkademik(
        n.data.length
          ? n.data.map((r) => ({ ...r, __key: crypto.randomUUID() }))
          : [newRow()],
      );
    } catch {
      setAkademik([newRow()]);
      setNonAkademik([newRow()]);
    }
  };

  useEffect(() => {
    if (user) load();
  }, [user, tahun]);

  const update = (rows, setRows, i, k, v) => {
    const d = [...rows];
    d[i][k] = v;
    setRows(d);
  };

  const isValidRow = (r) =>
    r.namaKegiatan?.trim() && r.tingkat && r.prestasi?.trim();

  const saveRow = async (row, jenis) => {
    const res = await prestasiMahasiswaAPI.create({
      ...row,
      prodi: user.prodi,
      jenis,
      tahun,
    });
    return { ...res.data, __key: row.__key };
  };

  const saveAll = async () => {
    setLoading(true);
    try {
      setAkademik(
        await Promise.all(
          akademik.map((r) =>
            r._id || !isValidRow(r) ? r : saveRow(r, "akademik"),
          ),
        ),
      );
      setNonAkademik(
        await Promise.all(
          nonAkademik.map((r) =>
            r._id || !isValidRow(r) ? r : saveRow(r, "non-akademik"),
          ),
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const upload = async (rows, setRows, i, file) => {
    if (!file || file.type !== "application/pdf") return;
    const res = await prestasiMahasiswaAPI.upload(rows[i]._id, file);
    update(rows, setRows, i, "bukti", res.data.bukti);
  };

  const remove = async (rows, setRows, i) => {
    const id = rows[i]._id;
    setRows(rows.filter((_, idx) => idx !== i));
    if (id) await prestasiMahasiswaAPI.remove(id);
  };

  const renderBody = (rows, setRows) =>
    rows.map((r, i) => (
      <tr
        key={r._id || r.__key}
        className="w-full bg-transparent outline-none px-2 py-1 rounded-md focus:bg-white focus:ring-1 focus:ring-[#1E6F9F]/30 transition"
      >
        <td className="border border-slate-300 px-3 py-2 text-center">
          {i + 1}
        </td>

        <td className="border border-slate-300 px-3 py-2">
          <input
            value={r.namaKegiatan}
            onChange={(e) =>
              update(rows, setRows, i, "namaKegiatan", e.target.value)
            }
            className="w-full bg-transparent outline-none focus:bg-white/70 px-2 py-1 transition"
          />
        </td>

        {["wilayah", "nasional", "internasional"].map((t) => (
          <td key={t} className="border border-slate-300 px-3 py-2 text-center">
            <input
              type="radio"
              className="accent-[#1E6F9F] scale-110 cursor-pointer"
              checked={r.tingkat === t}
              onChange={() => update(rows, setRows, i, "tingkat", t)}
            />
          </td>
        ))}

        <td className="border border-slate-300 px-3 py-2">
          <input
            value={r.prestasi}
            onChange={(e) =>
              update(rows, setRows, i, "prestasi", e.target.value)
            }
            className="w-full bg-transparent outline-none focus:bg-white/70 px-2 py-1 transition"
          />
        </td>

        <td className="border border-slate-300 px-3 py-2 text-center text-sm">
          {r._id ? (
            r.bukti ? (
              <a
                href={r.bukti}
                target="_blank"
                rel="noreferrer"
                className="text-[#1E6F9F] underline underline-offset-2 hover:text-[#15557A] transition"
              >
                Lihat
              </a>
            ) : (
              <label className="inline-flex items-center gap-1 cursor-pointer text-slate-600 hover:text-[#1E6F9F]">
                <Upload size={14} />
                Upload
                <input
                  hidden
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => upload(rows, setRows, i, e.target.files[0])}
                />
              </label>
            )
          ) : (
            <span className="text-slate-400">Simpan dulu</span>
          )}
        </td>

        <td className="border border-slate-300 px-3 py-2 text-center">
          <button
            onClick={() => remove(rows, setRows, i)}
            className="p-2 rounded-lg hover:bg-red-100 transition"
          >
            <Trash2 size={15} className="text-red-600" />
          </button>
        </td>
      </tr>
    ));

  const Table = ({ title, subtitle, rows, setRows }) => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="overflow-x-auto bg-white border border-slate-200 rounded-2xl shadow-sm">
        <table className="w-full min-w-225 text-sm border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-slate-700 to-slate-800 text-white text-center">
              <th
                rowSpan={2}
                className="border border-slate-600 px-4 py-3 rounded-tl-2xl"
              >
                No
              </th>
              <th rowSpan={2} className="border border-slate-600 px-4 py-3">
                Nama Kegiatan
              </th>
              <th colSpan={3} className="border border-slate-600 px-4 py-3">
                Tingkat
              </th>
              <th rowSpan={2} className="border border-slate-600 px-4 py-3">
                Prestasi
              </th>
              <th rowSpan={2} className="border border-slate-600 px-4 py-3">
                Bukti
              </th>
              <th
                rowSpan={2}
                className="border border-slate-600 px-4 py-3 rounded-tr-2xl"
              >
                Aksi
              </th>
            </tr>
            <tr className="bg-slate-600 text-white text-center">
              <th className="border border-slate-600 px-3 py-2">Wilayah</th>
              <th className="border border-slate-600 px-3 py-2">Nasional</th>
              <th className="border border-slate-600 px-3 py-2">
                Internasional
              </th>
            </tr>
          </thead>
          <tbody>{renderBody(rows, setRows)}</tbody>
        </table>
      </div>

      <Button
        onClick={() => setRows([...rows, newRow()])}
        className="
    px-6 py-3
    rounded-xl
    text-sm font-semibold
    bg-gradient-to-r from-[#1E6F9F] to-[#15557A]
    hover:from-[#15557A] hover:to-[#0F3D62]
    text-white
    shadow-[0_10px_30px_rgba(30,111,159,0.35)]
    active:scale-[0.98]
    transition-all duration-200
  "
      >
        Tambah Baris
      </Button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <select
          value={tahun}
          onChange={(e) => setTahun(Number(e.target.value))}
          className="px-5 py-3 rounded-xl bg-white border border-slate-300 shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1E6F9F]/30 transition"
        >
          {years.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
        <Button
          onClick={saveAll}
          disabled={loading}
          className="
    px-7 py-3
    rounded-xl
    text-sm font-semibold tracking-wide
    bg-gradient-to-r from-emerald-600 to-emerald-700
    hover:from-emerald-700 hover:to-emerald-800
    text-white
    shadow-[0_10px_30px_rgba(16,185,129,0.35)]
    hover:shadow-[0_14px_36px_rgba(16,185,129,0.45)]
    active:scale-[0.98]
    transition-all duration-200
  "
        >
          <Save size={16} />
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>

      <Table
        title="Prestasi Akademik"
        subtitle="Data prestasi mahasiswa pada bidang akademik"
        rows={akademik}
        setRows={setAkademik}
      />

      <Table
        title="Prestasi Non-Akademik"
        subtitle="Data prestasi mahasiswa pada bidang non-akademik"
        rows={nonAkademik}
        setRows={setNonAkademik}
      />
    </div>
  );
};

export default PrestasiMahasiswa;
