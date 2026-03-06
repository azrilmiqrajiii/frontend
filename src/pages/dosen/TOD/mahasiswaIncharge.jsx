import { useEffect, useMemo, useState } from "react";
import axios from "../../../api/axios";
import { User2, CheckCircle2, Loader2, Search } from "lucide-react";

export default function MahasiswaIncharge() {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchData = async () => {
    try {
      const res = await axios.get("/tod/mahasiswa");
      setMahasiswa(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  // FILTER + SEARCH
  const filteredMahasiswa = useMemo(() => {
    let data = [...mahasiswa];

    // filter supervisor
    if (filter === "SUPERVISOR") {
      data = data.filter((m) => m.isSupervisorTILC === true);
    }

    if (filter === "NON_SUPERVISOR") {
      data = data.filter((m) => m.isSupervisorTILC === false);
    }

    // search nama / nim
    if (debouncedSearch) {
      data = data.filter((m) =>
        `${m.name} ${m.nim}`.toLowerCase().includes(debouncedSearch),
      );
    }

    return data;
  }, [mahasiswa, debouncedSearch, filter]);

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

      {/* SEARCH + FILTER */}
      <div className="flex flex-wrap items-center gap-4">
        {/* SEARCH */}
        <div className="relative w-full max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Cari nama atau NIM..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {/* FILTER */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-200 shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="ALL">Semua Mahasiswa</option>
          <option value="SUPERVISOR">Supervisor</option>
          <option value="NON_SUPERVISOR">Non Supervisor</option>
        </select>
      </div>

      {/* LIST */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMahasiswa.length === 0 && (
          <div className="text-sm text-slate-500">
            Mahasiswa tidak ditemukan
          </div>
        )}

        {filteredMahasiswa.map((m) => {
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

              {/* TOGGLE SWITCH */}
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
