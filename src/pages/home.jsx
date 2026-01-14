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

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + "/api/menus")
      .then((res) => res.json())
      .then(setMenus);
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/bg-nature.webp')" }}
    >
      <div className="flex justify-end gap-2 px-4 pt-4 md:px-10">
        <img src="/images/id.png" className="w-7 h-5 cursor-pointer" />
        <img src="/images/uk.png" className="w-7 h-5 cursor-pointer" />
      </div>

      <nav className="mx-4 mt-4 rounded-2xl bg-slate-700 text-white md:mx-10">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <img src="/images/header.png" className="w-10 md:w-12" />
            <div className="text-xs md:text-sm font-semibold leading-tight">
              SATUAN PENJAMINAN MUTU
              <div className="font-light">POLTEKPAR LOMBOK</div>
            </div>
          </div>

          <div className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? (
              <XMarkIcon className="w-6" />
            ) : (
              <Bars3Icon className="w-6" />
            )}
          </div>

          <ul className="hidden md:flex items-center gap-8 text-sm">
            <li className="hover:text-sky-300 cursor-pointer">Home</li>
            <li className="hover:text-sky-300 cursor-pointer">About</li>
            <li className="hover:text-sky-300 cursor-pointer">More</li>
            <Link to="/login">
              <ArrowRightOnRectangleIcon className="w-5 hover:text-sky-300" />
            </Link>
          </ul>
        </div>

        {open && (
          <div className="flex flex-col gap-4 px-5 pb-5 text-sm md:hidden">
            <span>Home</span>
            <span>About</span>
            <span>More</span>
            <Link to="/login" className="flex items-center gap-2">
              <ArrowRightOnRectangleIcon className="w-5" /> Login
            </Link>
          </div>
        )}
      </nav>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {menus.map((m) => (
            <div
              key={m._id}
              className="overflow-hidden rounded-xl bg-white shadow hover:shadow-xl transition"
            >
              <img src={m.image} className="h-32 w-full object-cover sm:h-40" />
              <div className="p-3 text-center text-sm font-medium text-gray-700">
                {m.title}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center px-6 pb-20 text-center">
        <div className="mb-8 rounded-full bg-white/60 px-10 py-3 text-lg backdrop-blur md:text-xl">
          Excellent Institution
        </div>

        <p className="max-w-3xl text-xs leading-relaxed text-white md:text-sm">
          The Quality Assurance Unit (SPM) of Politeknik Pariwisata Lombok is
          responsible for designing, implementing, and evaluating the internal
          quality assurance system to build a sustainable quality culture.
        </p>
      </section>
    </div>
  );
}
