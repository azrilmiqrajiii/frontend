import { useEffect, useState } from "react";
import { refleksiAPI } from "../../../api/refleksi.ap";
import { Loader2, Upload, CalendarDays, Clock } from "lucide-react";

export default function RefleksiHarian() {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    tanggalIncharge: "",
    waktuIncharge: "",
    peranSupervisi: "",
    keputusanPenting: "",
    masalahSolusi: "",
    pembelajaran: "",
    rencana: "",
    jenisKegiatan: "",
    matkul: "",
  });

  const [file, setFile] = useState(null);

  const fetchHistory = async () => {
    try {
      const res = await refleksiAPI.getAll();
      setHistory(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!file) return alert("Upload bukti aktivitas");

    const formData = new FormData();

    Object.keys(form).forEach((k) => {
      formData.append(k, form[k]);
    });

    formData.append("buktiFoto", file);

    try {
      setLoading(true);
      await refleksiAPI.create(formData);

      setForm({
        tanggalIncharge: "",
        waktuIncharge: "",
        peranSupervisi: "",
        keputusanPenting: "",
        masalahSolusi: "",
        pembelajaran: "",
        rencana: "",
        jenisKegiatan: "",
        matkul: "",
      });

      setFile(null);
      setPreview(null);

      fetchHistory();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan refleksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

      {/* FORM */}
      <form
        onSubmit={submit}
        className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6"
      >
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <CalendarDays size={18} />
          Refleksi Harian Incharge
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600">
              Tanggal Incharge
            </label>
            <input
              type="date"
              value={form.tanggalIncharge}
              onChange={(e) => handleChange("tanggalIncharge", e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">
              Waktu Incharge
            </label>
            <input
              type="time"
              value={form.waktuIncharge}
              onChange={(e) => handleChange("waktuIncharge", e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        {[
          ["peranSupervisi", "Peran Supervisi Hari Ini"],
          ["keputusanPenting", "Keputusan Penting"],
          ["masalahSolusi", "Masalah dan Solusi"],
          ["pembelajaran", "Pembelajaran Kepemimpinan"],
          ["rencana", "Rencana Kedepan"],
        ].map(([field, label]) => (
          <div key={field}>
            <label className="text-sm font-medium text-slate-600">
              {label}
            </label>
            <textarea
              value={form[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              rows="3"
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        ))}

        <div className="border-t pt-6 space-y-3">
          <div className="font-medium text-slate-700">Logbook Harian</div>

          <input
            placeholder="Jenis Kegiatan"
            value={form.jenisKegiatan}
            onChange={(e) => handleChange("jenisKegiatan", e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2"
          />

          <input
            placeholder="Matkul Terkait"
            value={form.matkul}
            onChange={(e) => handleChange("matkul", e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2"
          />
        </div>

        <div className="border-t pt-6">
          <label className="text-sm font-medium text-slate-600">
            Upload Bukti Aktivitas
          </label>

          <label className="mt-2 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 cursor-pointer hover:bg-slate-50">
            <div className="text-center space-y-2">
              <Upload className="mx-auto text-slate-400" size={24} />
              <div className="text-sm text-slate-500">
                Klik untuk upload foto aktivitas
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </label>

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-4 w-48 rounded-xl border"
            />
          )}
        </div>

        <button
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={16} />}
          Simpan Refleksi
        </button>
      </form>

      {/* HISTORY */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit sticky top-6">
        <div className="font-semibold text-slate-800 mb-4">
          Riwayat Refleksi
        </div>

        <div className="space-y-3">
          {history.map((h) => (
            <div
              key={h._id}
              className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <CalendarDays size={14} />
                {new Date(h.tanggalIncharge).toLocaleDateString()}
              </div>

              <div className="text-xs text-slate-500 mt-1">
                {h.logbook?.jenisKegiatan}
              </div>
            </div>
          ))}

          {history.length === 0 && (
            <div className="text-sm text-slate-400">
              Belum ada refleksi
            </div>
          )}
        </div>
      </div>
    </div>
  );
}