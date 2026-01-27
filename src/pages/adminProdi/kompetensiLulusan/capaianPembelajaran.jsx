import { useEffect, useState } from "react";
import { Plus, Trash2, Upload, Save } from "lucide-react";
import { capaianPembelajaranAPI } from "../../../api/capaianPembelajaran.api";
import useAuth from "../../../context/useAuth";

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
    if (id) {
      try {
        await capaianPembelajaranAPI.remove(id);
      } catch (err) {
        alert(err);
      }
    }
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-semibold text-slate-800">
            Capaian Pembelajaran Lulusan
          </h2>
          <p
            className={`text-xs ${
              dirty ? "text-amber-600" : "text-emerald-600"
            }`}
          >
            {dirty ? "Perubahan belum disimpan" : "Data tersimpan"}
          </p>
        </div>

        <button
          onClick={save}
          disabled={loading || !dirty}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md
            ${
              loading || !dirty
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-[#1E6F9F] text-white hover:bg-[#185a80]"
            }`}
        >
          <Save size={16} />
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>

      <div className="overflow-auto rounded-xl">
        <table className="min-w-275 w-full border-collapse text-sm">
          <thead className="bg-slate-100 text-center">
            <tr className="text-slate-700">
              <th
                rowSpan={2}
                className=" border border-slate-300 bg-slate-200 px-3 py-2"
              >
                No
              </th>
              <th
                rowSpan={2}
                className="border border-slate-300 bg-slate-200 px-3 py-2"
              >
                Tahun Lulus
              </th>
              <th
                rowSpan={2}
                className="border border-slate-300 bg-slate-200 px-3 py-2"
              >
                Jumlah Lulusan
              </th>
              <th
                rowSpan={2}
                className="border border-slate-300 bg-slate-200 px-3 py-2"
              >
                Masa Studi (Tahun)
              </th>
              <th
                colSpan={3}
                className="border border-slate-300  px-3 py-2 bg-slate-200"
              >
                Indeks Prestasi Kumulatif (IPK)
              </th>
              <th
                rowSpan={2}
                className="border border-slate-300 px-3 py-2 bg-slate-200"
              >
                SK Yudisium
              </th>
              <th
                rowSpan={2}
                className="border border-slate-300 px-3 py-2 bg-slate-200"
              >
                Aksi
              </th>
            </tr>
            <tr className="text-slate-600">
              <th className="border border-slate-300 px-3 py-2 bg-slate-200">
                Minimal
              </th>
              <th className="border border-slate-300 px-3 py-2 bg-slate-200">
                Rata-rata
              </th>
              <th className="border border-slate-300 px-3 py-2 bg-slate-200">
                Maksimal
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={r._id || i} className="hover:bg-slate-50">
                <td className="border border-slate-300 px-3 py-2 text-center">
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
                    className="border border-slate-300 px-3 py-2 text-center"
                  >
                    <input
                      type="number"
                      value={r[k] ?? ""}
                      onChange={(e) => update(i, k, e.target.value)}
                      className="w-20 bg-transparent outline-none text-center"
                    />
                  </td>
                ))}

                <td className="border border-slate-300 px-3 py-2 text-center">
                  {r._id ? (
                    r.skYudisium ? (
                      <a
                        href={r.skYudisium}
                        target="_blank"
                        className="text-xs text-[#1E6F9F] underline"
                      >
                        Lihat
                      </a>
                    ) : (
                      <label className="inline-flex items-center gap-1 text-xs text-slate-500 cursor-pointer hover:text-[#1E6F9F]">
                        <Upload size={14} />
                        Upload
                        <input
                          type="file"
                          accept="application/pdf"
                          hidden
                          onChange={async (e) => {
                            try {
                              const res = await capaianPembelajaranAPI.uploadSk(
                                r._id,
                                e.target.files[0],
                              );
                              update(i, "skYudisium", res.data.skYudisium);
                            } catch (err) {
                              alert(err);
                            }
                          }}
                        />
                      </label>
                    )
                  ) : (
                    <span className="text-xs text-slate-400">Simpan dulu</span>
                  )}
                </td>

                <td className="border border-slate-300 px-3 py-2 text-center">
                  <button
                    onClick={() => removeRow(i)}
                    className="p-1 rounded hover:bg-red-100 text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addRow}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm
          border border-slate-300 rounded-md
          hover:bg-[#1E6F9F]/10 hover:border-[#1E6F9F]"
      >
        <Plus size={16} />
        Tambah Baris
      </button>
    </div>
  );
}
