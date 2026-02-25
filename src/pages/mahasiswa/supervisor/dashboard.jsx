import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  User,
  ClipboardList,
  FileBarChart2,
  Menu,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function SupervisorDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [dccOpen, setDccOpen] = useState(true);
  const location = useLocation();

  const isDccActive =
    location.pathname.includes("dbsh-supervisor") ||
    location.pathname.includes("pesilak");

  return (
    <div className="flex w-full min-h-screen bg-white">
      <aside
        className={`bg-white border-r border-slate-200 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          {!collapsed && (
            <h2 className="text-sm font-semibold text-slate-700">Supervisor</h2>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-slate-100"
          >
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="p-3 space-y-2 text-sm">
          <NavLink
            to="profil"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <User size={18} />
            {!collapsed && <span>Profil</span>}
          </NavLink>

          <div>
            <button
              onClick={() => setDccOpen(!dccOpen)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${
                isDccActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <ClipboardList size={18} />
                {!collapsed && <span>DCC Harian</span>}
              </div>

              {!collapsed &&
                (dccOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                ))}
            </button>

            {!collapsed && dccOpen && (
              <div className="ml-8 mt-2 space-y-1">
                <NavLink
                  to="dbsh-supervisor"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-slate-600 hover:bg-slate-100"
                    }`
                  }
                >
                  DBSH Supervisor
                </NavLink>

                <NavLink
                  to="pesilak"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-slate-600 hover:bg-slate-100"
                    }`
                  }
                >
                  Pesilak
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="rekap-otomatis"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <FileBarChart2 size={18} />
            {!collapsed && <span>Rekap Otomatis</span>}
          </NavLink>
        </nav>
      </aside>

      <div className="flex-1">
        <header className="border-b border-slate-200 px-6 py-4">
          <h1 className="text-sm font-medium text-slate-700">
            Dashboard Supervisor
          </h1>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
