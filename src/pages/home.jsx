import { useEffect, useState } from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    fetch("https://backend-production-8db8.up.railway.app/api/menus")
      .then((res) => res.json())
      .then((data) => setMenus(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div
      className="
        min-h-screen
        bg-cover
        bg-center
        bg-no-repeat
        px-10
        py-10
      "
      style={{
        backgroundImage: "url('/images/bg-nature.webp')",
      }}
    >
      <div className="flex justify-end items-center gap-3 text-sm mb-4 mx-10">
        <button className="w-8 h-6 hover:scale-110 transition">
          <img src="/images/id.png" alt="indonesia" />
        </button>
        <button className="w-8 h-6 hover:scale-110 transition">
          <img src="/images/uk.png" alt="uk" />
        </button>
      </div>

      <nav className="flex items-center justify-between px-8 py-4 bg-slate-700 text-white rounded-full shadow-md">
        <div className="flex items-center gap-3">
          <img src="/images/header.png" className="w-12" />
          <div className="font-semibold leading-tight text-sm">
            SATUAN PENJAMINAN MUTU <br />
            <span className="font-light">POLITEKNIK PARIWISATA LOMBOK</span>
          </div>
        </div>

        <ul className="flex items-center gap-8 text-sm font-medium">
          <li className="hover:text-sky-300 cursor-pointer">Home</li>
          <li className="hover:text-sky-300 cursor-pointer">About</li>
          <li className="hover:text-sky-300 cursor-pointer">More</li>
          <li>
            {" "}
            <Link to="/login">
              <ArrowRightOnRectangleIcon className="w-5 h-5 hover:text-sky-300" />
            </Link>
          </li>
        </ul>
      </nav>

      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {menus.map((menu) => (
            <div
              key={menu._id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden text-center"
            >
              <img
                src={`http://localhost:5000${menu.image}`}
                alt={menu.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-4 font-medium text-gray-700">{menu.title}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24 flex flex-col items-center gap-6">
        <div
          className="
            inline-flex items-center
            px-16 py-3.5
            rounded-full
            text-[23px]
            font-normal
            backdrop-blur-lg
            bg-linear-to-r
            from-white/75
            via-white/45
            to-white/5
            mb-10
          "
        >
          Excellent Institution
        </div>

        <p className="max-w-3xl text-center text-white text-sm leading-relaxed mt-5">
          The Quality Assurance Unit (SPM) of Politeknik Pariwisata Lombok is
          responsible for designing, implementing, and evaluating the internal
          quality assurance system. Its objective is to build a sustainable
          quality culture in education, research, and community service.
        </p>
      </section>
    </div>
  );
}
