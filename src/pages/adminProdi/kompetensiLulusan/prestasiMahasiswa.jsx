import { useEffect, useState } from "react";
import { Upload, Trash2 } from "lucide-react";
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
  const [akademik, setAkademik] = useState([{ ...emptyRow }]);
  const [nonAkademik, setNonAkademik] = useState([{ ...emptyRow }]);

  const load = async () => {
    const a = await prestasiMahasiswaAPI.list(user.prodi, "akademik");
    const n = await prestasiMahasiswaAPI.list(user.prodi, "non-akademik");
    setAkademik(a.data.length ? a.data : [{ ...emptyRow }]);
    setNonAkademik(n.data.length ? n.data : [{ ...emptyRow }]);
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const update = (rows, setRows, i, k, v) => {
    const d = [...rows];
    d[i][k] = v;
    setRows(d);
  };

  const upload = async (rows, setRows, i, file) => {
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
      <tr key={r._id || i}>
        <td className="border border-slate-300 px-3 py-2 text-center">
          {i + 1}
        </td>

        <td className="border border-slate-300 px-3 py-2">
          <input
            value={r.namaKegiatan}
            onChange={(e) =>
              update(rows, setRows, i, "namaKegiatan", e.target.value)
            }
            className="w-full bg-transparent outline-none"
          />
        </td>

        {["wilayah", "nasional", "internasional"].map((t) => (
          <td key={t} className="border border-slate-300 px-3 py-2 text-center">
            <input
              type="radio"
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
            className="w-full bg-transparent outline-none"
          />
        </td>

        <td className="border border-slate-300 px-3 py-2 text-center">
          {r._id ? (
            r.bukti ? (
              <a
                href={r.bukti}
                target="_blank"
                className="text-[#1E6F9F] underline text-xs"
              >
                Lihat
              </a>
            ) : (
              <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
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
            <span className="text-xs text-slate-400">Simpan dulu</span>
          )}
        </td>

        <td className="border border-slate-300 px-3 py-2 text-center">
          <button onClick={() => remove(rows, setRows, i)}>
            <Trash2 size={14} className="text-red-500" />
          </button>
        </td>
      </tr>
    ));

  return (
    <div className="space-y-6">
      <div className="overflow-auto rounded-xl">
        <div className="flex justify-end">
          <select
            name="years"
            id="years"
            className="border-2 border-slate-300 rounded-md"
          >
            <option value="">2020</option>
            <option value="">2021</option>
            <option value="">2022</option>
          </select>
        </div>
        <caption className="flex justify-start text-slate-500 font-semibold mb-5">
          Tabel 1 Prestasi Non-Akademik
        </caption>
        {/* TABEL 1 PRESTASI AKADEMIK */}

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
                Nama Kegiatan
              </th>

              <th
                colSpan={3}
                className="border border-slate-300  px-3 py-2 bg-slate-200"
              >
                Tingkat
              </th>
              <th
                rowSpan={2}
                className="border border-slate-300 px-3 py-2 bg-slate-200"
              >
                Prestasi yang dicapai
              </th>
              <th
                rowSpan={2}
                className="border border-slate-300 px-3 py-2 bg-slate-200"
              >
                Bukti Sertifikat
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
                Wilayah
              </th>
              <th className="border border-slate-300 px-3 py-2 bg-slate-200">
                National
              </th>
              <th className="border border-slate-300 px-3 py-2 bg-slate-200">
                Internasional
              </th>
            </tr>
          </thead>
          <tbody>{renderBody(akademik, setAkademik)}</tbody>
        </table>

        <button
          onClick={() => setAkademik([...akademik, { ...emptyRow }])}
          className="inline-flex items-center gap-2 px-3 py-2 my-5 text-sm
          border border-slate-300 rounded-md
          hover:bg-[#1E6F9F]/10 hover:border-[#1E6F9F]"
        >
          Tambah Baris
        </button>

        {/* TABEL 2 PRESTASI NON-AKADEMIK  */}
        <caption className="flex justify-start text-slate-500 font-semibold mb-5 mt-6">
          Tabel 2 Prestasi Non-Akademik
        </caption>
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
                Nama Kegiatan
              </th>

              <th
                colSpan={3}
                className="border border-slate-300  px-3 py-2 bg-slate-200"
              >
                Tingkat
              </th>
              <th
                rowSpan={2}
                className="border border-slate-300 px-3 py-2 bg-slate-200"
              >
                Prestasi yang dicapai
              </th>
              <th
                rowSpan={2}
                className="border border-slate-300 px-3 py-2 bg-slate-200"
              >
                Bukti Sertifikat
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
                Wilayah
              </th>
              <th className="border border-slate-300 px-3 py-2 bg-slate-200">
                National
              </th>
              <th className="border border-slate-300 px-3 py-2 bg-slate-200">
                Internasional
              </th>
            </tr>
          </thead>
          <tbody>{renderBody(nonAkademik, setNonAkademik)}</tbody>
        </table>

        <button
          onClick={() => setNonAkademik([...nonAkademik, { ...emptyRow }])}
          className="inline-flex items-center gap-2 px-3 py-2 my-5 text-sm
          border border-slate-300 rounded-md
          hover:bg-[#1E6F9F]/10 hover:border-[#1E6F9F]"
        >
          Tambah Baris
        </button>
      </div>
    </div>
  );
};

export default PrestasiMahasiswa;
