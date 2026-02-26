import { Outlet } from "react-router-dom";
import NavbarDosen from "../Fragments/NavbarDosen";

export default function SPMLayouts() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <NavbarDosen />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}