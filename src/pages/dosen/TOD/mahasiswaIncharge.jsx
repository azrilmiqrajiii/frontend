import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { User2, CheckCircle2, Loader2 } from "lucide-react";

export default function MahasiswaIncharge() {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get("/tod/mahasiswa");
      setMahasiswa(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSupervisor = async (id, isActive) => {
    const confirmAction = window.confirm(
      isActive
        ? "Nonaktifkan mahasiswa ini sebagai Supervisor TILC?"
        : "Tetapkan mahasiswa ini sebagai Supervisor TILC?",
    );

    if (!confirmAction) return;

    setProcessingId(id);

    try {
      await axios.patch(`/tod/set-supervisor/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 size={18} className="animate-spin" />
        Memuat data mahasiswa...
      </div>
    );

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Manajemen Mahasiswa Incharge
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Tetapkan mahasiswa sebagai Supervisor TILC
        </p>
      </div>

      {/* LIST MAHASISWA */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mahasiswa.length === 0 && (
          <div className="text-sm text-slate-500">
            Tidak ada mahasiswa pada program studi ini
          </div>
        )}

        {mahasiswa.map((m) => {
          const isActive = m.isSupervisorTILC;
          const isProcessing = processingId === m._id;

          return (
            <div
              key={m._id}
              className="rounded-3xl bg-white p-6 shadow-lg transition hover:shadow-xl"
            >
              {/* PROFILE */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                  <User2 size={20} />
                </div>

                <div>
                  <p className="font-semibold text-slate-900">{m.name}</p>
                  <p className="text-xs text-slate-500">{m.nim}</p>
                </div>

                {isActive && (
                  <CheckCircle2
                    size={20}
                    className="ml-auto text-emerald-500"
                  />
                )}
              </div>

              {/* BUTTON */}
              <button
                disabled={isProcessing}
                onClick={() => toggleSupervisor(m._id, isActive)}
                className={`w-full py-3 rounded-2xl text-sm font-medium transition
                ${
                  isActive
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:scale-[1.02]"
                }
                ${isProcessing ? "opacity-70 cursor-not-allowed" : ""}
                `}
              >
                {isProcessing
                  ? "Memproses..."
                  : isActive
                    ? "Nonaktifkan Supervisor"
                    : "Jadikan Supervisor"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
