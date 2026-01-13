import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7FA] text-center px-6">
      <h1 className="text-5xl font-bold text-[#0F3D62]">403</h1>
      <p className="text-slate-600 mt-4 text-lg">
        Anda tidak memiliki akses ke halaman ini
      </p>

      <Link
        to="/login"
        className="mt-6 inline-block px-6 py-3 rounded-xl bg-[#1E6F9F] text-white hover:bg-[#0F3D62]"
      >
        Kembali ke Login
      </Link>
    </div>
  );
}
