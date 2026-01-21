import { useEffect, useState, useCallback } from "react";
import useAuth from "../../context/useAuth";
import { kurikulumAPI } from "../../api/kurikulum.api";
import Button from "../../components/Elements/Button";
import FileDrop from "../../components/Fragments/FileDrop";
import { Plus, ArrowUp, ArrowDown, Trash2, Upload } from "lucide-react";

const YEARS = ["2024", "2025", "2026"];

const emptyRow = {
  semester: "",
  kode: "",
  nama: "",
  sksKuliah: "",
  sksSeminar: "",
  sksPraktikum: "",
  rps: "",
};

const cleanName = (url) =>
  decodeURIComponent(url.split("/").pop()).replace(/^\d+-/, "");

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
      setRemovePdf(false);
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

  const addRow = () => {
    setRows([...rows, { ...emptyRow }]);
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

  const save = async () => {
    try {
      setLoading(true);
      setError("");
      const f = new FormData();
      f.append("tahun", year);
      f.append("matkul", JSON.stringify(rows));
      if (pdf instanceof File) f.append("pdf", pdf);
      if (removePdf) f.append("removePdf", "1");
      await kurikulumAPI.save(user.prodi, f);
      await load();
    } catch {
      setError("Gagal menyimpan kurikulum");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">
            Kurikulum Program Studi
          </h1>
          <p
            className={`text-xs ${
              dirty ? "text-amber-600" : "text-emerald-600"
            }`}
          >
            {dirty ? "Belum disimpan" : "Tersimpan"}
          </p>
        </div>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-sm"
        >
          {YEARS.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="relative flex gap-4">
        <div className="flex-1 overflow-auto rounded-xl border border-slate-300">
          <table className="min-w-250 w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-slate-100 border-b border-slate-300 z-10 text-center">
              <tr className="text-slate-700 text-xs">
                <th
                  rowSpan={2}
                  className="px-3 py-2 border border-slate-300 font-semibold"
                >
                  No
                </th>
                <th
                  rowSpan={2}
                  className="px-3 py-2 border border-slate-300 font-semibold"
                >
                  Semester
                </th>
                <th
                  rowSpan={2}
                  className="px-3 py-2 border border-slate-300 font-semibold"
                >
                  Kode
                </th>
                <th
                  rowSpan={2}
                  className="px-3 py-2 border border-slate-300 font-semibold"
                >
                  Nama Mata Kuliah
                </th>
                <th
                  colSpan={3}
                  className="px-3 py-2 border border-slate-300 font-semibold bg-slate-200"
                >
                  Bobot Kredit (SKS)
                </th>
                <th
                  rowSpan={2}
                  className="px-3 py-2 border border-slate-300 font-semibold"
                >
                  RPS
                </th>
              </tr>

              <tr className="text-slate-600 text-xs">
                <th className="px-3 py-2 border border-slate-300 font-medium">
                  Kuliah / Proposal / Tutorial
                </th>
                <th className="px-3 py-2 border border-slate-300 font-medium">
                  Seminar
                </th>
                <th className="px-3 py-2 border border-slate-300 font-medium">
                  Praktikum / Praktik Lapangan
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r._id || i}
                  onClick={() => setActive(i)}
                  className={`${
                    active === i ? "bg-[#1E6F9F]/10" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-3 py-2 border border-slate-300 text-slate-500">
                    {i + 1}
                  </td>

                  {["semester", "kode", "nama"].map((k) => (
                    <td key={k} className="px-3 py-2 border border-slate-300">
                      <input
                        value={r[k] || ""}
                        onChange={(e) => update(i, k, e.target.value)}
                        className="w-full bg-transparent outline-none"
                      />
                    </td>
                  ))}

                  {["sksKuliah", "sksSeminar", "sksPraktikum"].map((k) => (
                    <td
                      key={k}
                      className="px-3 py-2 border border-slate-300 text-center"
                    >
                      <input
                        value={r[k] || ""}
                        onChange={(e) => update(i, k, e.target.value)}
                        className="w-10 bg-transparent outline-none text-center"
                      />
                    </td>
                  ))}

                  <td className="px-3 py-2 border border-slate-300">
                    {r.rps ? (
                      <div className="flex items-center gap-2 max-w-45">
                        <a
                          href={r.rps}
                          target="_blank"
                          className="text-xs text-[#1E6F9F] underline truncate"
                        >
                          {cleanName(r.rps)}
                        </a>
                        <button
                          onClick={() => removeRps(r)}
                          className="p-1 rounded hover:bg-red-100 text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 text-xs cursor-pointer text-slate-500 hover:text-[#1E6F9F]">
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
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 pt-10">
          {[
            { icon: Plus, label: "Tambah baris", action: addRow },
            { icon: ArrowUp, label: "Sisip di atas", action: insertAbove },
            { icon: ArrowDown, label: "Sisip di bawah", action: insertBelow },
            { icon: Trash2, label: "Hapus baris", action: removeRow },
          ].map(({ icon: Icon, label, action }) => (
            <div key={label} className="relative group">
              <button
                onClick={action}
                className="h-9 w-9 rounded-full flex items-center justify-center
                border border-slate-300 bg-white
                hover:bg-[#1E6F9F]/10 hover:border-[#1E6F9F]"
              >
                <Icon size={16} />
              </button>
              <div
                className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2
  px-2 py-1 text-xs rounded bg-slate-800 text-white
  opacity-0 group-hover:opacity-100 transition"
              >
                {label}
              </div>
            </div>
          ))}
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
