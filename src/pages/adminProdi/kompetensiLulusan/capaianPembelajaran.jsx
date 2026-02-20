import { useEffect, useState } from "react";
import { Plus, Trash2, Upload, Save } from "lucide-react";
import { capaianPembelajaranAPI } from "../../../api/capaianPembelajaran.api";
import useAuth from "../../../context/useAuth";
import Button from "../../../components/Elements/Button";

const emptyRow = {
  tahunLulus: "",
  jumlahLulusan: "",
  masaStudi: "",
  ipkMin: "",
  ipkAvg: "",
  ipkMax: "",
  skYudisium: "",
};

export default function CapaianPembelajaran() {
  const { user } = useAuth();
  const [rows, setRows] = useState([{ ...emptyRow }]);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await capaianPembelajaranAPI.list(user.prodi);
    setRows(res.data.length ? res.data : [{ ...emptyRow }]);
  };

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

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

  const removeRow = async (i) => {
    const id = rows[i]._id;
    setRows(rows.filter((_, idx) => idx !== i));
    setDirty(true);
    if (id) await capaianPembelajaranAPI.remove(id);
  };

  const save = async () => {
    try {
      setLoading(true);
      await capaianPembelajaranAPI.bulkSave(user.prodi, rows);
      await load();
      setDirty(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">
            Capaian Pembelajaran Lulusan
          </h2>
          <p
            className={`text-sm mt-1 ${
              dirty ? "text-amber-600" : "text-emerald-600"
            }`}
          >
            {dirty ? "Perubahan belum disimpan" : "Data tersimpan"}
          </p>
        </div>

        <Button
          onClick={save}
          disabled={loading || !dirty}
          className="px-6 py-3 rounded-xl text-sm font-semibold shadow-md
             disabled:opacity-50"
        >
          <Save size={16} />
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
        <table className="min-w-300 w-full text-sm text-slate-700 border-collapse">
          <thead>
            <tr className="bg-linear-to-r from-slate-700 to-slate-800 text-white text-center">
              <th
                rowSpan={2}
                className="border border-slate-600 px-4 py-3 rounded-tl-2xl"
              >
                No
              </th>
              <th rowSpan={2} className="border border-slate-600 px-4 py-3">
                Tahun Lulus
              </th>
              <th rowSpan={2} className="border border-slate-600 px-4 py-3">
                Jumlah Lulusan
              </th>
              <th rowSpan={2} className="border border-slate-600 px-4 py-3">
                Masa Studi (Thn)
              </th>
              <th colSpan={3} className="border border-slate-600 px-4 py-3">
                IPK
              </th>
              <th rowSpan={2} className="border border-slate-600 px-4 py-3">
                SK Yudisium
              </th>
              <th
                rowSpan={2}
                className="border border-slate-600 px-4 py-3 rounded-tr-2xl"
              >
                Aksi
              </th>
            </tr>
            <tr className="bg-slate-600 text-white text-center">
              <th className="px-3 py-2 border border-slate-600">Min</th>
              <th className="px-3 py-2 border border-slate-600">Rata-rata</th>
              <th className="px-3 py-2 border border-slate-600">Max</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r._id || i}
                className={`
                transition
                ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                hover:bg-slate-100
              `}
              >
                <td className="px-4 py-3 text-center border border-slate-200 font-medium">
                  {i + 1}
                </td>

                {[
                  "tahunLulus",
                  "jumlahLulusan",
                  "masaStudi",
                  "ipkMin",
                  "ipkAvg",
                  "ipkMax",
                ].map((k) => (
                  <td
                    key={k}
                    className="px-4 py-3 border border-slate-200 text-center"
                  >
                    <input
                      type="number"
                      value={r[k] ?? ""}
                      onChange={(e) => update(i, k, e.target.value)}
                      className="w-full bg-transparent text-center outline-none rounded-md px-2 py-1 focus:bg-white focus:ring-1 focus:ring-[#1E6F9F]/30 transition"
                    />
                  </td>
                ))}

                <td className="px-4 py-3 text-center border border-slate-200 text-sm">
                  {r._id ? (
                    r.skYudisium ? (
                      <a
                        href={r.skYudisium}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#1E6F9F] hover:text-[#15557A] underline transition"
                      >
                        Lihat
                      </a>
                    ) : (
                      <label className="inline-flex items-center gap-1 cursor-pointer text-slate-600 hover:text-[#1E6F9F] transition">
                        <Upload size={14} />
                        Upload
                        <input
                          hidden
                          type="file"
                          accept="application/pdf"
                          onChange={async (e) => {
                            const res = await capaianPembelajaranAPI.uploadSk(
                              r._id,
                              e.target.files[0],
                            );
                            update(i, "skYudisium", res.data.skYudisium);
                          }}
                        />
                      </label>
                    )
                  ) : (
                    <span className="text-slate-400 text-xs">Simpan dulu</span>
                  )}
                </td>

                <td className="px-4 py-3 text-center border border-slate-200">
                  <button
                    onClick={() => removeRow(i)}
                    className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button
        onClick={addRow}
        className="px-6 py-3 rounded-xl text-sm font-semibold shadow-md"
      >
        <Plus size={16} />
        Tambah Baris
      </Button>
    </div>
  );
}
