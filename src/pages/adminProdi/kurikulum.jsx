import { useEffect, useState, useCallback, useRef } from "react";
import useAuth from "../../context/useAuth";
import { kurikulumAPI } from "../../api/kurikulum.api";
import Button from "../../components/Elements/Button";
import { Upload } from "lucide-react";
import FileDrop from "../../components/Fragments/FileDrop";

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

export default function Kurikulum() {
  const { user } = useAuth();
  const [year, setYear] = useState("2026");
  const [rows, setRows] = useState([]);
  const [pdf, setPdf] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const lastRowRef = useRef(null);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const res = await kurikulumAPI.get(user.prodi, Number(year));
      setRows(res.data?.matkul || []);
      setPdf(res.data?.pdf || "");
      setDirty(false);
    } catch {
      setRows([]);
      setPdf("");
    }
  }, [user, year]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    lastRowRef.current?.focus();
  }, [rows.length]);

  const update = (i, k, v) => {
    const d = [...rows];
    d[i][k] = v;
    setRows(d);
    setDirty(true);
  };

  const addRow = () => {
    setRows([...rows, { ...emptyRow }]);
    setDirty(true);
  };

  const validate = () => {
    if (!rows.length) return "Minimal 1 mata kuliah";
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r.semester || isNaN(r.semester))
        return `Baris ${i + 1}: Semester harus angka`;
      if (!r.kode || !r.nama) return `Baris ${i + 1}: Kode & Nama wajib diisi`;
      if (r.sksKuliah === "" || r.sksSeminar === "" || r.sksPraktikum === "")
        return `Baris ${i + 1}: SKS wajib diisi`;
      if (r.rps && !r.rps.match(/\.(xls|xlsx)$/))
        return `Baris ${i + 1}: RPS harus XLS/XLSX`;
    }
    return "";
  };

  const save = async () => {
    const msg = validate();
    if (msg) return setError(msg);
    try {
      setLoading(true);
      setError("");
      const f = new FormData();
      f.append("tahun", Number(year));
      f.append("matkul", JSON.stringify(rows));
      if (pdf instanceof File) f.append("pdf", pdf);
      await kurikulumAPI.save(user.prodi, f);
      await load();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Kurikulum</h1>
          <p className="text-xs text-slate-500">
            {dirty ? "Belum disimpan" : "Data tersimpan"}
          </p>
        </div>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border border-slate-300 px-3 py-1.5 text-sm bg-white rounded"
        >
          {YEARS.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="overflow-auto border border-slate-200 bg-white rounded-md">
        <table className="border-collapse text-sm w-full">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr>
              <th className="border border-slate-300 w-10">No</th>
              <th className="border border-slate-300 px-2">Semester</th>
              <th className="border border-slate-300 px-2">Kode</th>
              <th className="border border-slate-300 px-2">Nama Mata Kuliah</th>
              <th className="border border-slate-300 px-2">SKS K</th>
              <th className="border border-slate-300 px-2">SKS S</th>
              <th className="border border-slate-300 px-2">SKS P</th>
              <th className="border border-slate-300 px-2 w-56">RPS</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className={`border-b border-slate-200 hover:bg-slate-100 ${
                  i % 2 ? "bg-slate-50/50" : "bg-white"
                }`}
              >
                <td className="border-r border-slate-200 text-center">
                  {i + 1}
                </td>

                {[
                  ["semester", "w-16 text-center"],
                  ["kode", "w-24"],
                  ["nama", "min-w-[260px]"],
                  ["sksKuliah", "w-14 text-center"],
                  ["sksSeminar", "w-14 text-center"],
                  ["sksPraktikum", "w-14 text-center"],
                ].map(([k, cls], idx) => (
                  <td key={k} className={`border-r border-slate-200 ${cls}`}>
                    <input
                      ref={
                        i === rows.length - 1 && idx === 0 ? lastRowRef : null
                      }
                      value={r[k]}
                      onChange={(e) => update(i, k, e.target.value)}
                      className="w-full bg-transparent outline-none focus:bg-blue-50 px-1 py-1"
                    />
                  </td>
                ))}

                <td className="px-2 py-1">
                  {dirty ? (
                    <div className="text-xs text-slate-400 italic">
                      Simpan kurikulum dulu
                    </div>
                  ) : r.rps ? (
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={r.rps}
                        target="_blank"
                        className="text-xs text-blue-600 underline truncate max-w-40"
                      >
                        {r.rps.split("/").pop()}
                      </a>
                      <button
                        onClick={() => update(i, "rps", "")}
                        className="text-xs px-2 py-1 border border-red-300 text-red-600 rounded"
                      >
                        Hapus
                      </button>
                    </div>
                  ) : (
                    <label className="inline-flex items-center w-full gap-2 text-xs px-3 py-1.5 border border-dashed border-slate-400 rounded cursor-pointer hover:bg-slate-50">
                      <Upload size={14} />
                      Upload RPS
                      <input
                        type="file"
                        accept=".xls,.xlsx"
                        className="hidden"
                        onChange={async (e) => {
                          try {
                            const f = new FormData();
                            f.append("tahun", year);
                            f.append("rps", e.target.files[0]);
                            const res = await kurikulumAPI.uploadRps(
                              user.prodi,
                              i,
                              f,
                            );
                            update(i, "rps", res.data.rps);
                          } catch {
                            setError("Upload RPS gagal");
                          }
                        }}
                      />
                    </label>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-end">
        <div className="max-w-sm space-y-1">
          <p className="text-xs font-medium text-slate-600">
            Lampiran Kurikulum (PDF · Opsional)
          </p>

          {typeof pdf === "string" && pdf && (
            <a
              href={pdf}
              target="_blank"
              className="text-xs text-blue-600 underline block"
            >
              {pdf.split("/").pop()}
            </a>
          )}

          <FileDrop
            file={pdf instanceof File ? pdf : null}
            setFile={setPdf}
            accept="application/pdf"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={addRow}>+ Baris</Button>
          <Button onClick={save} loading={loading}>
            Simpan
          </Button>
        </div>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
}
