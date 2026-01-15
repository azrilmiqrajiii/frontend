import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../Fragments/Navbar";
import Sidebar from "../Fragments/Sidebar";

export default function AdminProdiLayouts() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
