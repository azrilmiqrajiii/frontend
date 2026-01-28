import { useEffect, useState } from "react";
import { Trash2, Plus, Save, Eye } from "lucide-react";
import Button from "../../../components/Elements/Button";
import FileDrop from "../../../components/Fragments/FileDrop";
import useAuth from "../../../context/useAuth";
import { waktuTungguLulusanAPI } from "../../../api/waktuTungguLulusan.api";

const emptyRow = {
  bulanWisuda: "",
  jumlahLulusan: "",
  terlacak: "",
  dipesan: "",
  wt3: "",
  wt6: "",
  wtlebih6: "",
};

const WaktuTungguLulusan = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);

  const [tahun, setTahun] = useState(currentYear);
  const [rows, setRows] = useState([{ ...emptyRow }]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await waktuTungguLulusanAPI.get(user.prodi, tahun);

        if (res.data) {
          setRows(res.data.rows?.length ? res.data.rows : [{ ...emptyRow }]);
          setFile(res.data.file || null);
        } else {
          setRows([{ ...emptyRow }]);
          setFile(null);
        }
      } catch {
        setRows([{ ...emptyRow }]);
        setFile(null);
      }
    };

    if (user && tahun) loadData();
  }, [user, tahun]);

  const update = (i, key, value) => {
    const next = [...rows];
    next[i][key] = value;
    setRows(next);
  };

  const removeRow = (i) => {
    setRows(rows.filter((_, idx) => idx !== i));
  };

  const validate = () => {
    for (const [i, r] of rows.entries()) {
      const jumlah = Number(r.jumlahLulusan) || 0;
      const terlacak = Number(r.terlacak) || 0;
      const wt =
        (Number(r.wt3) || 0) + (Number(r.wt6) || 0) + (Number(r.wtlebih6) || 0);

      if (!r.bulanWisuda) return `Baris ${i + 1}: Bulan wisuda wajib diisi`;
      if (jumlah <= 0) return `Baris ${i + 1}: Jumlah lulusan harus > 0`;
      if (terlacak > jumlah)
        return `Baris ${i + 1}: Terlacak melebihi jumlah lulusan`;
      if (wt > terlacak) return `Baris ${i + 1}: Total WT melebihi terlacak`;
    }

    if (!file) return "File tracer study wajib diunggah";
    return null;
  };

  const handleSave = async () => {
    const msg = validate();
    if (msg) return setError(msg);
    setError(null);

    const fd = new FormData();
    fd.append("tahun", tahun);
    fd.append("rows", JSON.stringify(rows));
    if (file instanceof File) fd.append("file", file);

    await waktuTungguLulusanAPI.save(user.prodi, fd);
    alert("Data berhasil disimpan");
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Waktu Tunggu Lulusan
          </h2>
          <p className="text-sm text-slate-500">
            Data waktu tunggu lulusan memperoleh pekerjaan
          </p>
        </div>

        <select
          value={tahun}
          onChange={(e) => setTahun(Number(e.target.value))}
          className="px-5 py-3 rounded-xl bg-white border border-slate-200 shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[rgba(30,111,159,0.35)]"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
      )}

      {/* TABLE */}
      <div className="bg-white overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm border border-slate-300">
          <thead className="bg-slate-100">
            <tr>
              <th
                rowSpan={2}
                className="border border-slate-300 px-3 py-2 text-left"
              >
                Bulan Wisuda
              </th>
              <th
                rowSpan={2}
                className="border border-slate-300 px-3 py-2 text-center"
              >
                Jumlah
              </th>
              <th
                rowSpan={2}
                className="border border-slate-300 px-3 py-2 text-center"
              >
                Terlacak
              </th>
              <th
                rowSpan={2}
                className="border border-slate-300 px-3 py-2 text-center"
              >
                Dipesan
              </th>
              <th
                colSpan={3}
                className="border border-slate-300 px-3 py-2 text-center"
              >
                Waktu Tunggu (bulan)
              </th>
              <th
                rowSpan={2}
                className="border border-slate-300 px-3 py-2 text-center"
              >
                Aksi
              </th>
            </tr>
            <tr>
              <th className="border border-slate-300 px-3 py-1 text-center">
                &lt; 3
              </th>
              <th className="border border-slate-300 px-3 py-1 text-center">
                &lt; 6
              </th>
              <th className="border border-slate-300 px-3 py-1 text-center">
                &gt; 6
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="border border-slate-300 px-3 py-2">
                  <input
                    value={r.bulanWisuda}
                    onChange={(e) => update(i, "bulanWisuda", e.target.value)}
                    className="w-full bg-transparent outline-none"
                  />
                </td>

                {[
                  "jumlahLulusan",
                  "terlacak",
                  "dipesan",
                  "wt3",
                  "wt6",
                  "wtlebih6",
                ].map((k) => (
                  <td
                    key={k}
                    className="border border-slate-300 px-3 py-2 text-center"
                  >
                    <input
                      type="number"
                      value={r[k]}
                      onChange={(e) => update(i, k, e.target.value)}
                      className="w-full bg-transparent text-center outline-none"
                    />
                  </td>
                ))}

                <td className="border border-slate-300 px-2 py-2 text-center">
                  <button
                    onClick={() => removeRow(i)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD ROW */}
      <Button
        onClick={() => setRows([...rows, { ...emptyRow }])}
        className="flex items-center gap-2"
      >
        <Plus size={16} /> Tambah Baris
      </Button>

      {/* FILE */}
      <div className="bg-white border border-slate-300 p-4 space-y-2">
        <p className="text-sm font-semibold">
          Bukti Laporan Tracer Study (PDF)
        </p>

        <FileDrop file={file} setFile={setFile} accept="application/pdf" />

        {/* {typeof file === "string" && (
          <a
            href={file}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 ml-2"
            title={file.split("/").pop()}
          >
            <Eye size={16} /> Lihat File
          </a>
        )} */}
      </div>

      {/* SAVE */}
      <div className="flex ">
        <Button onClick={handleSave} className="flex items-center gap-2 px-6">
          <Save size={16} /> Simpan Data
        </Button>
      </div>
    </div>
  );
};

export default WaktuTungguLulusan;
