import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { User2, Loader2, AlertTriangle, CheckCircle2, X } from "lucide-react";

const PRODI_OPTIONS = [
  { label: "Seni Kuliner", value: "SENI_KULINER" },
  { label: "Divisi Kamar", value: "DIVISI_KAMAR" },
  { label: "Tata Hidang", value: "TATA_HIDANG" },
  { label: "Usaha Perjalanan Wisata", value: "USAHA_PERJALANAN_WISATA" },
];

export default function DosenTOD() {
  const [selectedProdi, setSelectedProdi] = useState("");
  const [dosen, setDosen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [error, setError] = useState("");

  const fetchDosen = async (prodi) => {
    if (!prodi) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/kaprodi/dosen-tod?prodi=${prodi}`);
      setDosen(res.data?.data || []);
    } catch {
      setError("Gagal memuat data dosen");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!confirmData) return;

    setProcessingId(confirmData.id);

    try {
      await axios.patch(`/kaprodi/set-dosen-tod/${confirmData.id}`, {
        active: confirmData.active,
      });
      fetchDosen(selectedProdi);
    } catch {
      setError("Gagal memproses tindakan");
    } finally {
      setProcessingId(null);
      setConfirmData(null);
    }
  };

  useEffect(() => {
    fetchDosen(selectedProdi);
  }, [selectedProdi]);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Manajemen Dosen TOD
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Pilih program studi dan tetapkan satu dosen sebagai TOD
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
                     focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
          <Loader2 size={18} className="animate-spin text-indigo-500" />
          Memuat daftar dosen...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {!loading && selectedProdi && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
          {dosen.map((d) => {
            const isActive = d.jabatanDosen === "TOD";
            const isProcessing = processingId === d._id;

            return (
              <div
                key={d._id}
                className="relative rounded-3xl bg-white p-6
                           shadow-xl shadow-slate-200/60
                           hover:shadow-indigo-200/60
                           transition-all duration-300"
              >
                {isActive && (
                  <div className="absolute top-4 right-4 text-indigo-600">
                    <CheckCircle2 size={20} />
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="h-12 w-12 rounded-2xl
                               bg-gradient-to-br from-indigo-500 to-purple-600
                               flex items-center justify-center text-white"
                  >
                    <User2 size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">{d.name}</p>
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
                  className={`w-full py-3 rounded-2xl text-sm font-medium transition
                    ${
                      isActive
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-[1.02]"
                    }
                    ${isProcessing ? "opacity-70 cursor-not-allowed" : ""}
                  `}
                >
                  {isProcessing
                    ? "Memproses..."
                    : isActive
                      ? "Nonaktifkan TOD"
                      : "Jadikan TOD"}
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
                <h3 className="font-semibold text-lg">Konfirmasi Tindakan</h3>
              </div>
              <button onClick={() => setConfirmData(null)}>
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              {confirmData.active
                ? `Yakin ingin menetapkan ${confirmData.name} sebagai Dosen TOD?`
                : `Yakin ingin menonaktifkan ${confirmData.name} sebagai Dosen TOD?`}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmData(null)}
                className="px-4 py-2 rounded-xl text-sm bg-slate-100 hover:bg-slate-200"
              >
                Batal
              </button>

              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-xl text-sm bg-indigo-600 text-white hover:bg-indigo-700"
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
