import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Menu, ChevronLeft, ShieldCheck } from "lucide-react";

export default function SPMDashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      <aside
        className={`bg-white border-r border-slate-200 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200">
          {!collapsed && (
            <span className="text-sm font-semibold text-slate-700">
              Super Admin
            </span>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-slate-100"
          >
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="p-3">
          <NavLink
            to=""
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg ${
                isActive
                  ? "bg-emerald-50 text-emerald-600 font-medium"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <ShieldCheck size={18} />
            {!collapsed && <span>Pilih Kaprodi</span>}
          </NavLink>
        </nav>
      </aside>

      <div className="flex-1 bg-slate-50 p-6">
        <div className="bg-white rounded-xl shadow-sm  p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
