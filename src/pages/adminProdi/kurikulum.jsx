import { useEffect, useState, useCallback } from "react";
import useAuth from "../../context/useAuth";
import { kurikulumAPI } from "../../api/kurikulum.api";
import Button from "../../components/Elements/Button";
import FileDrop from "../../components/Fragments/FileDrop";
import { Plus, ArrowUp, ArrowDown, Trash2, Upload, Check } from "lucide-react";

const YEARS = ["2024", "2025", "2026"];

const emptyRow = {
  semester: "",
  kode: "",
  nama: "",
  sksKuliah: false,
  sksSeminar: false,
  sksPraktikum: false,
  rps: "",
};

const cleanName = (url) =>
  decodeURIComponent(url.split("/").pop()).replace(/^\d+-/, "");

const SkCheckbox = ({ active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`h-4 w-4 rounded border flex transition ${
      active
        ? "bg-[#1E6F9F] border-[#1E6F9F] text-white"
        : "border-slate-300 hover:border-[#1E6F9F]"
    }`}
  >
    {active && <Check size={13} />}
  </button>
);

const IconButton = ({ icon: Icon, label, onClick, danger }) => (
  <div className="relative group flex justify-center">
    <button
      type="button"
      onClick={onClick}
      className={`h-9 w-9 rounded-lg border flex items-center justify-center transition ${
        danger
          ? "border-red-300 text-red-500 hover:bg-red-50"
          : "border-slate-300 text-slate-600 hover:bg-blue-[#1E6F9F]/10 hover:text-[#1E6F9F]"
      }`}
    >
      <Icon size={18} icon={Icon} />
    </button>
    <div className="pointer-events-none absolute ml-2 right-full top-1/2 -translate-y-12 whitespace-nowrap rounded-md bg-slate-800 px-3 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition">
      {label}
    </div>
  </div>
);

export default function Kurikulum() {
  const { user } = useAuth();
  const [year, setYear] = useState("2026");
  const [rows, setRows] = useState([]);
  const [pdf, setPdf] = useState(null);
  const [removePdf, setRemovePdf] = useState(false);
  const [active, setActive] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await kurikulumAPI.get(user.prodi, year);
      setRows(res.data?.matkul || []);
      setPdf(res.data?.pdf || null);
      setDirty(false);
      setActive(0);
    } catch {
      setRows([]);
      setPdf(null);
    }
  }, [user, year]);

  useEffect(() => {
    load();
  }, [load]);

  const update = (i, k, v) => {
    const d = [...rows];
    d[i][k] = v;
    setRows(d);
    setDirty(true);
  };

  const setSks = (i, type) => {
    const d = [...rows];
    d[i] = {
      ...d[i],
      sksKuliah: false,
      sksSeminar: false,
      sksPraktikum: false,
      [type]: true,
    };
    setRows(d);
    setDirty(true);
  };

  const addRow = () => {
    setRows((prev) => [...prev, { ...emptyRow }]);
    setActive(rows.length);
    setDirty(true);
  };

  const insertAbove = () => {
    const d = [...rows];
    d.splice(active, 0, { ...emptyRow });
    setRows(d);
    setDirty(true);
  };

  const insertBelow = () => {
    const d = [...rows];
    d.splice(active + 1, 0, { ...emptyRow });
    setRows(d);
    setActive(active + 1);
    setDirty(true);
  };

  const removeRow = () => {
    if (!rows[active]) return;
    setRows(rows.filter((_, i) => i !== active));
    setActive(Math.max(active - 1, 0));
    setDirty(true);
  };

  const uploadRps = async (row, file) => {
    try {
      const f = new FormData();
      f.append("tahun", year);
      f.append("rps", file);
      const res = await kurikulumAPI.uploadRps(user.prodi, row._id, f);
      update(rows.indexOf(row), "rps", res.data.rps);
    } catch {
      setError("Upload RPS gagal");
    }
  };

  const removeRps = async (row) => {
    try {
      await kurikulumAPI.removeRps(user.prodi, row._id, year);
      update(rows.indexOf(row), "rps", "");
    } catch {
      setError("Gagal menghapus RPS");
    }
  };

  const validate = () => {
    for (const r of rows) {
      if (!r.nama) throw new Error("Nama mata kuliah wajib diisi");
      if (!r.sksKuliah && !r.sksSeminar && !r.sksPraktikum)
        throw new Error(`SKS wajib dipilih pada ${r.nama}`);
    }
  };

  const save = async () => {
    try {
      setLoading(true);
      setError("");
      validate();
      const f = new FormData();
      f.append("tahun", year);
      f.append("matkul", JSON.stringify(rows));
      if (pdf instanceof File) f.append("pdf", pdf);
      if (removePdf) f.append("removePdf", "1");
      await kurikulumAPI.save(user.prodi, f);
      await load();
    } catch (e) {
      setError(e.message || "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">Kurikulum Program Studi</h1>
          <p
            className={`text-xs ${dirty ? "text-amber-600" : "text-emerald-600"}`}
          >
            {dirty ? "Belum disimpan" : "Tersimpan"}
          </p>
        </div>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-3 py-2 rounded-lg border-2 border-slate-300"
        >
          {YEARS.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 overflow-auto rounded-[32px] bg-white shadow-[0_28px_110px_rgba(0,0,0,0.14)]">
          <table className="min-w-300 w-full border-collapse text-sm border border-slate-300/70">
            <thead>
              <tr className="bg-[#1E6F9F] text-white shadow-inner">
                <th rowSpan={2} className="border-2 px-3 py-3 text-center">
                  No
                </th>
                <th rowSpan={2} className="border-2 px-3 py-3 text-center">
                  Semester
                </th>
                <th rowSpan={2} className="border-2 px-3 py-3 text-center">
                  Kode
                </th>
                <th rowSpan={2} className="border-2 px-4 py-3 text-center">
                  Nama Mata Kuliah
                </th>
                <th colSpan={3} className="border-2 px-4 py-3 text-center">
                  Bobot Kredit (SKS)
                </th>
                <th rowSpan={2} className="border-2 px-4 py-3 text-center">
                  RPS
                </th>
              </tr>
              <tr className="bg-slate-600 text-white">
                <th
                  className="border border-slate-200
 px-3 py-2 text-center"
                >
                  Kuliah
                </th>
                <th
                  className="border border-slate-200
 px-3 py-2 text-center"
                >
                  Seminar
                </th>
                <th
                  className="border border-slate-200
 px-3 py-2 text-center"
                >
                  Praktikum
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r._id || i}
                  onClick={() => setActive(i)}
                  className={`transition ${
                    active === i ? "bg-[#1E6F9F]/15" : "hover:bg-slate-50/80"
                  }`}
                >
                  <td
                    className="border border-slate-300/70
 px-3 py-2 text-center"
                  >
                    {i + 1}
                  </td>
                  <td
                    className="border border-slate-300/70
 px-3 py-2 text-center"
                  >
                    <input
                      value={r.semester}
                      onChange={(e) => update(i, "semester", e.target.value)}
                      className="w-full rounded-md  outline-0 px-2 py-1 text-center"
                    />
                  </td>
                  <td
                    className="border border-slate-300/70
 px-3 py-2 text-center"
                  >
                    <input
                      value={r.kode}
                      onChange={(e) => update(i, "kode", e.target.value)}
                      className="w-full bg-transparent outline-none px-2 py-1 text-center focus:bg-white/70 transition"
                    />
                  </td>
                  <td
                    className="border border-slate-300/70
 px-4 py-2"
                  >
                    <input
                      value={r.nama}
                      onChange={(e) => update(i, "nama", e.target.value)}
                      className="w-full rounded-md outline-0 px-3 py-1.5"
                    />
                  </td>
                  <td
                    className="border border-slate-300/70
 px-3 py-2 text-center "
                  >
                    <SkCheckbox
                      active={r.sksKuliah}
                      onClick={() => setSks(i, "sksKuliah")}
                    />
                  </td>
                  <td
                    className="border border-slate-300/70
 px-3 py-2 text-center"
                  >
                    <SkCheckbox
                      active={r.sksSeminar}
                      onClick={() => setSks(i, "sksSeminar")}
                    />
                  </td>
                  <td
                    className="border border-slate-300/70
 px-3 py-2 text-center"
                  >
                    <SkCheckbox
                      active={r.sksPraktikum}
                      onClick={() => setSks(i, "sksPraktikum")}
                    />
                  </td>
                  <td
                    className="border border-slate-300/70
 px-4 py-2 text-center"
                  >
                    {r._id ? (
                      r.rps ? (
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={r.rps}
                            target="_blank"
                            className="text-xs text-cyan-500 underline truncate max-w-35"
                          >
                            {cleanName(r.rps)}
                          </a>
                          <button
                            onClick={() => removeRps(r)}
                            className="text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ) : (
                        <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                          <Upload size={14} />
                          Upload
                          <input
                            type="file"
                            accept=".xls,.xlsx"
                            hidden
                            onChange={(e) =>
                              e.target.files && uploadRps(r, e.target.files[0])
                            }
                          />
                        </label>
                      )
                    ) : (
                      <span className="text-xs text-slate-400">
                        Simpan dulu
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 pt-14 shrink-0">
          <IconButton icon={Plus} label="Tambah baris" onClick={addRow} />
          <IconButton
            icon={ArrowUp}
            label="Sisipkan di atas"
            onClick={insertAbove}
          />
          <IconButton
            icon={ArrowDown}
            label="Sisipkan di bawah"
            onClick={insertBelow}
          />
          <IconButton
            icon={Trash2}
            label="Hapus baris"
            danger
            onClick={removeRow}
          />
        </div>
      </div>

      <div className="flex justify-between items-end">
        <FileDrop
          file={pdf}
          accept="application/pdf"
          setFile={(f) => {
            setPdf(f);
            setRemovePdf(false);
            setDirty(true);
          }}
          onRemove={() => {
            setPdf(null);
            setRemovePdf(true);
            setDirty(true);
          }}
        />
        <Button onClick={save} loading={loading}>
          Simpan
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
