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
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col"
      style={{ backgroundImage: "url('/images/bg-nature.webp')" }}
    >
      <div className="flex justify-end gap-2 px-4 pt-4 md:px-10">
        <img src="/images/id.png" className="w-7 h-5 cursor-pointer" />
        <img src="/images/uk.png" className="w-7 h-5 cursor-pointer" />
      </div>

      <nav className="mx-4 mt-4 rounded-full bg-[#0F3D62]/90 text-white md:mx-10 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <img src="/images/header.png" className="w-10 md:w-12" />
            <div className="text-xs md:text-sm font-semibold leading-tight">
              SATUAN PENJAMINAN MUTU
              <div className="font-light">POLITEKNIK PARIWISATA LOMBOK</div>
            </div>
          </div>

          <div className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? (
              <XMarkIcon className="w-6" />
            ) : (
              <Bars3Icon className="w-6" />
            )}
          </div>

          <ul className="hidden md:flex items-center gap-10 text-sm font-medium">
            <li className="hover:text-sky-300 cursor-pointer">HOME</li>
            <li className="hover:text-sky-300 cursor-pointer">ABOUT</li>
            <li className="hover:text-sky-300 cursor-pointer">MORE</li>
            <Link to="/login">
              <ArrowRightOnRectangleIcon className="w-5 hover:text-sky-300" />
            </Link>
          </ul>
        </div>

        {open && (
          <div className="flex flex-col gap-4 px-6 pb-5 text-sm md:hidden">
            <span>HOME</span>
            <span>ABOUT</span>
            <span>MORE</span>
            <Link to="/login" className="flex items-center gap-2">
              <ArrowRightOnRectangleIcon className="w-5" /> Login
            </Link>
          </div>
        )}
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-5xl w-full mt-14">
          {menus.map((m) => (
            <div
              key={m._id}
              className="bg-white/90 rounded-xl shadow-lg hover:shadow-2xl transition text-center overflow-hidden"
            >
              <img src={m.image} className="h-40 w-full object-cover" />
              <div className="py-4 text-sm font-semibold text-slate-700">
                {m.title}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-6">
          <div className="relative overflow-hidden rounded-full shadow-md">
            <div className="px-14 py-3 bg-linear-to-r from-white via-white/95 to-transparent">
              <span className="text-xl md:text-2xl font-medium text-black whitespace-nowrap">
                Excellent Institution
              </span>
            </div>
          </div>

          <p className="max-w-3xl text-center text-white text-sm leading-relaxed px-4">
            The Quality Assurance Unit (SPM) of Politeknik Pariwisata Lombok is
            responsible for designing, implementing, and evaluating the internal
            quality assurance system. Its objective is to build a sustainable
            quality culture in education, research, and community service.
          </p>
        </div>
      </section>
    </div>
  );
}
