import { Outlet } from "react-router-dom"
import { useState } from "react"
import Navbar from "../Fragments/Navbar"
import Sidebar from "../Fragments/Sidebar"

export default function AdminProdiLayouts() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-5 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 min-h-[calc(100vh-140px)]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
