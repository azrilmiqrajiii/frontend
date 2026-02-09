import useAuth from "../../context/useAuth";

export default function MahasiswaLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="h-14 bg-white border-b flex items-center justify-between px-6">
        <span className="font-semibold text-slate-700">
          Dashboard Mahasiswa
        </span>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">{user.name}</span>
          <button onClick={logout} className="text-sm text-red-500">
            Logout
          </button>
        </div>
      </header>

      <main className="p-6">{children}</main>
    </div>
  );
}
