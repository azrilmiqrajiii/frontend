import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  CheckCircle2,
  User2,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";

const PRODI_OPTIONS = [
  { label: "Seni Kuliner", value: "SENI_KULINER" },
  { label: "Divisi Kamar", value: "DIVISI_KAMAR" },
  { label: "Tata Hidang", value: "TATA_HIDANG" },
  { label: "Usaha Perjalanan Wisata", value: "USAHA_PERJALANAN_WISATA" },
];

export default function SPMDashboard() {
  const [selectedProdi, setSelectedProdi] = useState("");
  const [dosen, setDosen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  const fetchData = async (prodi) => {
    if (!prodi) return;
    setLoading(true);
    try {
      const res = await axios.get(`/spm/dosen?prodi=${prodi}`);
      setDosen(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!confirmData) return;

    setProcessingId(confirmData.id);
    try {
      await axios.patch(`/spm/set-kaprodi/${confirmData.id}`, {
        active: confirmData.active,
      });
      fetchData(selectedProdi);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
      setConfirmData(null);
    }
  };

  useEffect(() => {
    fetchData(selectedProdi);
  }, [selectedProdi]);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Manajemen Kaprodi
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Pilih program studi dan tetapkan satu dosen sebagai Kaprodi
        </p>
      </div>

      <div className="max-w-md">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Program Studi
        </label>

        <select
          value={selectedProdi}
          onChange={(e) => setSelectedProdi(e.target.value)}
          className="w-full rounded-2xl px-5 py-3 bg-white shadow-lg
                     focus:outline-none focus:ring-2 focus:ring-emerald-400
                     transition-all duration-300"
        >
          <option value="">Pilih Program Studi</option>
          {PRODI_OPTIONS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <Loader2 size={18} className="animate-spin text-emerald-500" />
          Memuat daftar dosen...
        </div>
      )}

      {!loading && selectedProdi && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
          {dosen.length === 0 && (
            <div className="text-sm text-slate-500">
              Tidak ada dosen pada program studi ini
            </div>
          )}

          {dosen.map((d) => {
            const isActive = d.jabatanDosen === "KAPRODI";
            const isProcessing = processingId === d._id;

            return (
              <div
                key={d._id}
                className="relative rounded-3xl bg-white p-6
                           shadow-xl shadow-slate-200/60
                           hover:shadow-emerald-200/60
                           transition-all duration-300"
              >
                {isActive && (
                  <div className="absolute top-4 right-4 text-emerald-500">
                    <CheckCircle2 size={20} />
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="h-12 w-12 rounded-2xl
                               bg-linear-to-br from-emerald-500 to-teal-600
                               flex items-center justify-center text-white shadow-md"
                  >
                    <User2 size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      {d.name}
                    </p>
                    <p className="text-xs text-slate-500 break-all mt-1">
                      {d.email}
                    </p>
                  </div>
                </div>

                <button
                  disabled={isProcessing}
                  onClick={() =>
                    setConfirmData({
                      id: d._id,
                      name: d.name,
                      active: !isActive,
                    })
                  }
                  className={`w-full py-3 rounded-2xl text-sm font-medium
                              transition-all duration-300
                              ${
                                isActive
                                  ? "bg-red-500 hover:bg-red-600 text-white"
                                  : "bg-linear-to-r from-emerald-500 to-teal-600 text-white hover:scale-[1.02] hover:shadow-lg"
                              }
                              ${isProcessing ? "opacity-70 cursor-not-allowed" : ""}
                              `}
                >
                  {isProcessing
                    ? "Memproses..."
                    : isActive
                    ? "Nonaktifkan Kaprodi"
                    : "Jadikan Kaprodi"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {confirmData && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3 text-amber-600">
                <AlertTriangle size={22} />
                <h3 className="font-semibold text-lg">
                  Konfirmasi Tindakan
                </h3>
              </div>
              <button onClick={() => setConfirmData(null)}>
                <X size={18} className="text-slate-500 hover:text-slate-700" />
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              {confirmData.active
                ? `Apakah Anda yakin ingin menetapkan ${confirmData.name} sebagai Kaprodi?`
                : `Apakah Anda yakin ingin menonaktifkan ${confirmData.name} sebagai Kaprodi?`}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmData(null)}
                className="px-4 py-2 rounded-xl text-sm bg-slate-100 hover:bg-slate-200 transition"
              >
                Batal
              </button>

              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-xl text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}