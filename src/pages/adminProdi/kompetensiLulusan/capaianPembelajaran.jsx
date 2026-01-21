import { useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";

const YEARS = ["2024", "2025", "2026"];

const emptyRow = {
  tahunLulus: "",
  jumlahLulusan: "",
  masaStudi: "",
  ipkMin: "",
  ipkAvg: "",
  ipkMax: "",
  sk: "",
};

export default function CapaianPembelajaran() {
  // const [year, setYear] = useState("2026");
  const [rows, setRows] = useState([{ ...emptyRow }]);

  const update = (i, k, v) => {
    const d = [...rows];
    d[i][k] = v;
    setRows(d);
  };

  const addRow = () => {
    setRows([...rows, { ...emptyRow }]);
  };

  const removeRow = (i) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-semibold text-slate-800">
          Capaian Pembelajaran Lulusan
        </h2>

        {/* <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 rounded-md text-sm bg-white"
        >
          {YEARS.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select> */}
      </div>

      <div className="overflow-auto border border-slate-300 rounded-xl">
        <table className="min-w-275 w-full border-collapse text-sm">
          <thead className="bg-slate-100 text-center">
            <tr className="text-slate-700">
              <th rowSpan={2} className="border border-slate-300 px-3 py-2">
                No
              </th>
              <th rowSpan={2} className="border border-slate-300 px-3 py-2">
                Tahun Lulus
              </th>
              <th rowSpan={2} className="border border-slate-300 px-3 py-2">
                Jumlah Lulusan
              </th>
              <th rowSpan={2} className="border border-slate-300 px-3 py-2">
                Masa Studi (Tahun)
              </th>
              <th
                colSpan={3}
                className="border border-slate-300 px-3 py-2 bg-slate-200"
              >
                Indeks Prestasi Kumulatif (IPK)
              </th>
              <th rowSpan={2} className="border border-slate-300 px-3 py-2">
                SK Yudisium
              </th>
              <th rowSpan={2} className="border border-slate-300 px-3 py-2">
                Aksi
              </th>
            </tr>

            <tr className="text-slate-600">
              <th className="border border-slate-300 px-3 py-2">Minimal</th>
              <th className="border border-slate-300 px-3 py-2">Rata-rata</th>
              <th className="border border-slate-300 px-3 py-2">Maksimal</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-slate-50">
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
                      value={r[k]}
                      onChange={(e) => update(i, k, e.target.value)}
                      className="w-20 bg-transparent outline-none text-center"
                    />
                  </td>
                ))}

                <td className="border border-slate-300 px-3 py-2 text-center">
                  {r.sk ? (
                    <span className="text-xs text-[#1E6F9F] underline cursor-pointer">
                      Lihat
                    </span>
                  ) : (
                    <label className="inline-flex items-center gap-1 text-xs text-slate-500 cursor-pointer hover:text-[#1E6F9F]">
                      <Upload size={14} />
                      Upload
                      <input type="file" hidden />
                    </label>
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
