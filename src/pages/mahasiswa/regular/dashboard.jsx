import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  User,
  ClipboardList,
  Star,
  LayoutDashboard,
  Menu,
  ChevronLeft,
} from "lucide-react";

const menus = [
  { name: "Profil", path: "profil", icon: User },
  {
    name: "Refleksi Harian Incharge",
    path: "refleksi-harian",
    icon: ClipboardList,
  },
  { name: "Penilaian Tempat Magang", path: "penilaian-magang", icon: Star },
];

function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside
      className={`bg-white border-r border-slate-200 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } min-h-screen`}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
        {!collapsed && (
          <h2 className="text-sm font-semibold text-slate-700">Mahasiswa</h2>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-slate-100"
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="p-3 space-y-2">
        {menus.map((menu) => {
          const Icon = menu.icon;
          return (
            <NavLink
              key={menu.path}
              to={menu.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={18} />
              {!collapsed && <span>{menu.name}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

function ContentWrapper() {
  return (
    <div className="flex-1 bg-white min-h-screen flex flex-col">
      <header className="border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-2 text-slate-700">
          <LayoutDashboard size={18} />
          <span className="font-medium text-sm">Dashboard Mahasiswa</span>
        </div>
      </header>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default function MahasiswaDashboard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex w-full min-h-screen bg-white">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <ContentWrapper />
    </div>
  );
}
