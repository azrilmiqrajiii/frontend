import { useEffect, useState } from "react";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [menus, setMenus] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMenus = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/menus`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Failed to load menu");

        const data = await res.json();
        setMenus(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
    return () => controller.abort();
  }, []);

  return (
    <div
      className="relative min-h-screen flex flex-col bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('/images/bg-nature.webp')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div className="relative z-10 flex justify-end gap-2 px-4 pt-4 md:px-10">
        <img
          src="/images/id.png"
          className="w-7 h-5 cursor-pointer hover:scale-110 transition"
        />
        <img
          src="/images/uk.png"
          className="w-7 h-5 cursor-pointer hover:scale-110 transition"
        />
      </div>

      <nav className="relative z-10 mx-4 mt-4 md:mx-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl text-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/images/header.png"
              className="w-10 md:w-12 drop-shadow-lg"
            />
            <div className="text-xs md:text-sm font-semibold leading-tight tracking-wide">
              SATUAN PENJAMINAN MUTU
              <div className="font-light opacity-80">
                POLITEKNIK PARIWISATA LOMBOK
              </div>
            </div>
          </div>

          <div
            className="md:hidden cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <XMarkIcon className="w-6 transition" />
            ) : (
              <Bars3Icon className="w-6 transition" />
            )}
          </div>

          <ul className="hidden md:flex items-center gap-10 text-sm font-medium">
            <li className="hover:text-sky-300 transition cursor-pointer">
              HOME
            </li>
            <li className="hover:text-sky-300 transition cursor-pointer">
              ABOUT
            </li>
            <li className="hover:text-sky-300 transition cursor-pointer">
              MORE
            </li>
            <Link to="/login">
              <ArrowRightOnRectangleIcon className="w-5 hover:text-sky-300 transition" />
            </Link>
          </ul>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-4 px-6 pb-5 text-sm">
            <span className="hover:text-sky-300 transition">HOME</span>
            <span className="hover:text-sky-300 transition">ABOUT</span>
            <span className="hover:text-sky-300 transition">MORE</span>
            <Link to="/login" className="flex items-center gap-2">
              <ArrowRightOnRectangleIcon className="w-5" /> Login
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-5xl w-full mt-14 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-56 bg-white/20 rounded-xl" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-red-300 mt-10 bg-red-500/20 px-6 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl w-full mt-16">
            {menus.map((m) => (
              <div
                key={m._id}
                className="group relative rounded-3xl bg-white/80 backdrop-blur-xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-3 cursor-pointer"
              >
                <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 group-hover:ring-sky-400/40 transition" />

                <div className="relative h-48 overflow-hidden">
                  <img
                    src={m.image}
                    onError={(e) => (e.target.src = "/images/fallback.jpg")}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition" />
                </div>

                <div className="relative px-6 py-5 text-center">
                  <h3 className="text-sm md:text-base font-semibold text-slate-800 tracking-wide group-hover:text-sky-600 transition">
                    {m.title}
                  </h3>

                  <div className="mt-3 h-[2px] w-10 bg-sky-500 mx-auto rounded-full group-hover:w-16 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 flex flex-col items-center gap-6 text-center animate-fade-in">
          <div className="relative overflow-hidden rounded-full shadow-2xl">
            <div className="px-14 py-4 bg-gradient-to-r from-white via-white/95 to-transparent">
              <span className="text-xl md:text-3xl font-semibold text-black whitespace-nowrap">
                Excellent Institution
              </span>
            </div>
          </div>

          <p className="max-w-3xl text-white text-sm md:text-base leading-relaxed px-4 opacity-90">
            The Quality Assurance Unit (SPM) of Politeknik Pariwisata Lombok is
            responsible for designing, implementing, and evaluating the internal
            quality assurance system to build a sustainable culture of
            excellence in education, research, and community service.
          </p>
        </div>
      </section>
    </div>
  );
}
