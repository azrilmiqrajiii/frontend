import { useEffect, useState, useCallback } from "react";
import useAuth from "../../context/useAuth";
import { kurikulumAPI } from "../../api/kurikulum.api";
import FileDrop from "../../components/Fragments/FileDrop";
import Button from "../../components/Elements/Button";
import { Plus, Trash2 } from "lucide-react";

const YEARS = [
  { value: "20252026", label: "2025 / 2026" },
  { value: "20242025", label: "2024 / 2025" },
];

export default function Kurikulum() {
  const { user } = useAuth();
  const [year, setYear] = useState("20252026");
  const [items, setItems] = useState([]);
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await kurikulumAPI.get(user.prodi, year);
      setItems(res.data?.matkul || []);
    } catch {
      setItems([]);
    }
  }, [user.prodi, year]);

  useEffect(() => {
    load();
  }, [load]);

  const addItem = () => {
    setItems([
      ...items,
      {
        semester: "",
        kode: "",
        nama: "",
        sksKuliah: "",
        sksSeminar: "",
        sksPraktikum: "",
        rps: null,
      },
    ]);
  };

  const update = (i, key, val) => {
    const copy = [...items];
    copy[i][key] = val;
    setItems(copy);
  };

  const remove = (i) => {
    setItems(items.filter((_, idx) => idx !== i));
  };

  const save = async () => {
    try {
      setLoading(true);
      const form = new FormData();
      form.append("tahun", year);
      form.append("matkul", JSON.stringify(items));
      if (pdf) form.append("file", pdf);
      await kurikulumAPI.save(user.prodi, form);
      load();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Kurikulum</h1>
          <p className="text-sm text-slate-500">
            Kelola struktur mata kuliah dan beban SKS
          </p>
        </div>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-5 py-2.5 rounded-xl bg-white shadow-sm text-sm"
        >
          {YEARS.map((y) => (
            <option key={y.value} value={y.value}>
              {y.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {items.map((m, i) => (
          <div key={i} className="bg-white rounded-3xl shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">
                Mata Kuliah #{i + 1}
              </span>
              <Trash2
                size={16}
                onClick={() => remove(i)}
                className="text-red-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-12 gap-4">
              <input
                placeholder="Semester"
                value={m.semester}
                onChange={(e) => update(i, "semester", e.target.value)}
                className="col-span-2 bg-slate-100 rounded-xl px-4 py-3 text-center"
              />

              <input
                placeholder="Kode Mata Kuliah"
                value={m.kode}
                onChange={(e) => update(i, "kode", e.target.value)}
                className="col-span-3 bg-slate-100 rounded-xl px-4 py-3"
              />

              <input
                placeholder="Nama Mata Kuliah"
                value={m.nama}
                onChange={(e) => update(i, "nama", e.target.value)}
                className="col-span-7 bg-slate-100 rounded-xl px-4 py-3"
              />

              <input
                placeholder="SKS Kuliah"
                value={m.sksKuliah}
                onChange={(e) => update(i, "sksKuliah", e.target.value)}
                className="col-span-2 bg-slate-100 rounded-xl px-4 py-3 text-center"
              />

              <input
                placeholder="SKS Seminar"
                value={m.sksSeminar}
                onChange={(e) => update(i, "sksSeminar", e.target.value)}
                className="col-span-2 bg-slate-100 rounded-xl px-4 py-3 text-center"
              />

              <input
                placeholder="SKS Praktikum / Lapangan"
                value={m.sksPraktikum}
                onChange={(e) => update(i, "sksPraktikum", e.target.value)}
                className="col-span-3 bg-slate-100 rounded-xl px-4 py-3 text-center"
              />

              <div className="col-span-5">
                <FileDrop
                  file={m.rps}
                  setFile={(f) => update(i, "rps", f)}
                  accept=".xlsx,.xls"
                  label="Upload RPS (Opsional)"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="flex items-center gap-2 text-blue-600 text-sm"
      >
        <Plus size={16} /> Tambah Mata Kuliah
      </button>

      {items.length > 0 && (
        <div>
             <div className="bg-white rounded-3xl shadow-sm p-6 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">
            Dokumen Kurikulum (Opsional)
          </h3>
          <p className="text-xs text-slate-500">
            Upload jika tersedia, tidak wajib untuk menyimpan data kurikulum
          </p>
        </div>

        <FileDrop
          file={pdf}
          setFile={setPdf}
          accept="application/pdf"
          label="Upload Dokumen Kurikulum (PDF)"
        />
      </div>
        <div className="fixed bottom-6 left-0 right-0 z-40">
          <div className="max-w-300 mx-auto px-6 flex justify-end">
            <Button
              onClick={save}
              disabled={loading}
              className="
          group relative
          px-10 py-4
          rounded-full
          bg-linear-to-r from-slate-900 to-slate-700
          text-white text-sm font-semibold tracking-wide
          shadow-xl shadow-slate-900/20
          hover:from-slate-800 hover:to-slate-600
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
        "
            >
              <span className="relative z-10">
                {loading ? "Menyimpan Kurikulum..." : "Simpan Kurikulum"}
              </span>

              <span
                className="
            absolute inset-0
            rounded-full
            bg-white/10
            opacity-0
            group-hover:opacity-100
            transition
          "
              />
            </Button>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
