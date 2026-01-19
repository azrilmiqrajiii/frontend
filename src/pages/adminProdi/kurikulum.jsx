import { useEffect, useState, useCallback, useRef } from "react";
import useAuth from "../../context/useAuth";
import { kurikulumAPI } from "../../api/kurikulum.api";
import Button from "../../components/Elements/Button";
import { Upload, X } from "lucide-react";
import FileDrop from "../../components/Fragments/FileDrop";

const YEARS = ["2024", "2025", "2026"];

const emptyRow = {
  semester: "",
  kode: "",
  nama: "",
  sksKuliah: "",
  sksSeminar: "",
  sksPraktikum: "",
  rps: null,
};

export default function Kurikulum() {
  const { user } = useAuth();
  const [year, setYear] = useState("2026");
  const [rows, setRows] = useState([]);
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const lastRowRef = useRef(null);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const res = await kurikulumAPI.get(user.prodi, Number(year));
      setRows(res.data?.matkul || []);
      setPdf(null);
      setDirty(false);
    } catch {
      setRows([]);
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
      if (r.rps && !r.rps.name.match(/\.(xls|xlsx)$/))
        return `Baris ${i + 1}: RPS harus xls/xlsx`;
    }
    if (pdf && !pdf.type.includes("pdf")) return "Dokumen pendukung harus PDF";
    return "";
  };

  const save = async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setError("");
      setLoading(true);
      const f = new FormData();
      f.append("tahun", Number(year));
      f.append(
        "matkul",
        JSON.stringify(rows.map((r) => ({ ...r, rps: undefined }))),
      );
      if (pdf) f.append("pdf", pdf);
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
          className="border border-slate-300 px-3 py-1.5 text-sm bg-white"
        >
          {YEARS.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="overflow-auto border border-slate-300 bg-white">
        <table className="border-collapse text-sm w-full">
          <thead className="sticky top-0 bg-slate-100 z-10">
            <tr>
              <th className="border border-slate-300 w-10 text-center font-semibold">
                No
              </th>
              {[
                "Semester",
                "Kode",
                "Nama Mata Kuliah",
                "SKS K",
                "SKS S",
                "SKS P",
                "RPS",
              ].map((h) => (
                <th
                  key={h}
                  className="border border-slate-300 px-2 py-1.5 font-semibold text-left"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className={`${i % 2 ? "bg-slate-50" : "bg-white"} hover:bg-blue-50/40`}
              >
                <td className="border border-slate-300 text-center text-slate-500 bg-slate-50">
                  {i + 1}
                </td>

                {[
                  ["semester", "w-16 text-center", "text"],
                  ["kode", "w-24", "text"],
                  ["nama", "min-w-[280px]", "text"],
                  ["sksKuliah", "w-14 text-center", "text"],
                  ["sksSeminar", "w-14 text-center", "text"],
                  ["sksPraktikum", "w-14 text-center", "text"],
                ].map(([k, cls, type], idx) => (
                  <td key={k} className={`border border-slate-300 px-1 ${cls}`}>
                    <input
                      ref={
                        i === rows.length - 1 && idx === 0 ? lastRowRef : null
                      }
                      type={type}
                      inputMode={
                        k.includes("sks") || k === "semester"
                          ? "numeric"
                          : "text"
                      }
                      value={r[k]}
                      onChange={(e) => update(i, k, e.target.value)}
                      className="w-full bg-transparent outline-none px-1 py-1 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                ))}

                <td className="border border-slate-300 w-10 text-center">
                  {r.rps ? (
                    <button
                      onClick={() => update(i, "rps", null)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  ) : (
                    <label className="cursor-pointer text-slate-500 hover:text-blue-600">
                      <Upload size={14} />
                      <input
                        type="file"
                        accept=".xls,.xlsx"
                        className="hidden"
                        onChange={(e) => update(i, "rps", e.target.files[0])}
                      />
                    </label>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-end justify-between gap-6 pt-1">
        <div className="max-w-sm">
          <p className="text-xs font-medium text-slate-600 mb-1">
            Lampiran Kurikulum (PDF · Opsional)
          </p>
          <FileDrop
            file={pdf}
            setFile={setPdf}
            accept="application/pdf"
            label=""
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={addRow}
            className="px-3 py-1.5 text-sm bg-slate-500 hover:bg-slate-600"
          >
            + Baris
          </Button>
          <Button
            onClick={save}
            loading={loading}
            disabled={loading}
            className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white"
          >
            Simpan
          </Button>
        </div>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
}
