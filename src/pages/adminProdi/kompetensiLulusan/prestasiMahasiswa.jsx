import { useEffect, useState } from "react";
import { Upload, Trash2, Save } from "lucide-react";
import useAuth from "../../../context/useAuth";
import { prestasiMahasiswaAPI } from "../../../api/prestasiMahasiswa.api";

const emptyRow = {
  namaKegiatan: "",
  tingkat: "",
  prestasi: "",
  bukti: "",
};

const PrestasiMahasiswa = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);

  const [tahun, setTahun] = useState(currentYear);
  const [akademik, setAkademik] = useState([{ ...emptyRow }]);
  const [nonAkademik, setNonAkademik] = useState([{ ...emptyRow }]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const a = await prestasiMahasiswaAPI.list(user.prodi, "akademik", tahun);
      const n = await prestasiMahasiswaAPI.list(
        user.prodi,
        "non-akademik",
        tahun,
      );
      setAkademik(a.data.length ? a.data : [{ ...emptyRow }]);
      setNonAkademik(n.data.length ? n.data : [{ ...emptyRow }]);
    } catch {
      setAkademik([{ ...emptyRow }]);
      setNonAkademik([{ ...emptyRow }]);
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
    return res.data;
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
      <tr key={r._id || i} className="hover:bg-slate-50">
        <td className="border border-slate-300 px-3 py-2 text-center text-slate-700">
          {i + 1}
        </td>

        <td className="border border-slate-300 px-3 py-2">
          <input
            value={r.namaKegiatan}
            onChange={(e) =>
              update(rows, setRows, i, "namaKegiatan", e.target.value)
            }
            className="w-full bg-transparent text-sm outline-none focus:bg-slate-50"
          />
        </td>

        {["wilayah", "nasional", "internasional"].map((t) => (
          <td key={t} className="border border-slate-300 px-3 py-2 text-center">
            <input
              type="radio"
              className="accent-[#1E6F9F] scale-110"
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
            className="w-full bg-transparent text-sm outline-none focus:bg-slate-50"
          />
        </td>

        <td className="border border-slate-300 px-3 py-2 text-center text-sm">
          {r._id ? (
            r.bukti ? (
              <a
                href={r.bukti}
                target="_blank"
                className="underline text-[#1E6F9F]"
              >
                Lihat
              </a>
            ) : (
              <label className="inline-flex items-center gap-1 cursor-pointer text-slate-700 hover:text-[#1E6F9F]">
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
          <button onClick={() => remove(rows, setRows, i)}>
            <Trash2 size={15} className="text-red-600" />
          </button>
        </td>
      </tr>
    ));

  const Table = ({ title, subtitle, rows, setRows }) => (
    <div className="space-y-2">
      <div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="overflow-auto">
        <table className="w-full min-w-[900px] border border-slate-400 border-collapse text-sm bg-white">
          <thead className="bg-slate-100">
            <tr>
              <th rowSpan={2} className="border border-slate-400 px-3 py-2">
                No
              </th>
              <th rowSpan={2} className="border border-slate-400 px-3 py-2">
                Nama Kegiatan
              </th>
              <th colSpan={3} className="border border-slate-400 px-3 py-2">
                Tingkat
              </th>
              <th rowSpan={2} className="border border-slate-400 px-3 py-2">
                Prestasi
              </th>
              <th rowSpan={2} className="border border-slate-400 px-3 py-2">
                Bukti
              </th>
              <th rowSpan={2} className="border border-slate-400 px-3 py-2">
                Aksi
              </th>
            </tr>
            <tr>
              <th className="border border-slate-400 px-3 py-2">Wilayah</th>
              <th className="border border-slate-400 px-3 py-2">Nasional</th>
              <th className="border border-slate-400 px-3 py-2">
                Internasional
              </th>
            </tr>
          </thead>
          <tbody>{renderBody(rows, setRows)}</tbody>
        </table>
      </div>

      <button
        onClick={() => setRows([...rows, { ...emptyRow }])}
        className="border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
      >
        Tambah Baris
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <select
          value={tahun}
          onChange={(e) => setTahun(Number(e.target.value))}
          className="px-5 py-3 rounded-xl bg-white border border-slate-200 shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[rgba(30,111,159,0.35)]"
        >
          {years.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>

        <button
          onClick={saveAll}
          disabled={loading}
          className="inline-flex items-center gap-2 border border-slate-300 px-4 py-1.5 text-sm hover:bg-slate-50"
        >
          <Save size={14} />
          Simpan
        </button>
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
