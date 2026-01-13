import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7FA] text-center px-6">
      <h1 className="text-6xl font-bold text-[#0F3D62]">404</h1>
      <p className="text-slate-600 mt-4 text-lg">Halaman tidak ditemukan</p>

      <Link
        to="/login"
        className="mt-6 inline-block px-6 py-3 rounded-xl bg-[#1E6F9F] text-white font-medium hover:bg-[#0F3D62] transition"
      >
        Kembali ke Halaman Sebelumnya
      </Link>
    </div>
  );
}
