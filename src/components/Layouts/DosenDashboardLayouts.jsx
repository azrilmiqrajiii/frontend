import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, ChevronLeft, ChevronDown, ChevronRight } from "lucide-react";

export default function DosenDashboardLayout({
  title,
  accent = "blue",
  menus,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const activeClass = `bg-${accent}-50 text-${accent}-600 font-medium`;

  return (
    <div className="flex w-full min-h-screen bg-white">
      <aside
        className={`border-r border-slate-200 bg-white transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
          {!collapsed && (
            <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-slate-100 transition"
          >
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="p-3 space-y-2 text-sm">
          {menus.map((menu, idx) => {
            const Icon = menu.icon;
            const isActive = location.pathname.includes(menu.path || "");

            if (menu.children) {
              const isOpen = openMenus[idx] ?? true;
              return (
                <div key={idx}>
                  <button
                    onClick={() => toggleMenu(idx)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
                      isActive
                        ? activeClass
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon size={18} />}
                      {!collapsed && <span>{menu.label}</span>}
                    </div>

                    {!collapsed &&
                      (isOpen ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      ))}
                  </button>

                  {!collapsed && isOpen && (
                    <div className="ml-8 mt-2 space-y-1">
                      {menu.children.map((sub, sIdx) => {
                        const SubIcon = sub.icon;
                        return (
                          <NavLink
                            key={sIdx}
                            to={sub.path}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-3 py-2 rounded-md transition ${
                                isActive
                                  ? activeClass
                                  : "text-slate-600 hover:bg-slate-100"
                              }`
                            }
                          >
                            {SubIcon && <SubIcon size={16} />}
                            {sub.label}
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={idx}
                to={menu.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    isActive ? activeClass : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                {Icon && <Icon size={18} />}
                {!collapsed && <span>{menu.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="border-b border-slate-200 px-6 py-4 bg-white">
          <h1 className="text-sm font-semibold text-slate-700">{title}</h1>
        </header>

        <main className="flex-1 p-6 bg-slate-50">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
