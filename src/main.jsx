import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import RequireAuth from "./auth/RequireAuth.jsx";
import LoginPage from "./pages/login.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import NotFound from "./pages/notFound.jsx";
import Unit from "./pages/unit.jsx";
import HomePage from "./pages/home.jsx";
import Dashboard from "./pages/adminProdi/Dashboard.jsx";
import VisiMisi from "./pages/adminProdi/visiMisi.jsx";
import AdminProdiLayouts from "./components/Layouts/AdminProdiLayouts.jsx";
import Kurikulum from "./pages/adminProdi/kurikulum.jsx";
import RequireGuest from "./auth/RequireGuest.jsx";
import KompetensiLulusan from "./pages/adminProdi/kompetensiLulusan.jsx";
import CapaianPembelajaran from "./pages/adminProdi/kompetensiLulusan/capaianPembelajaran.jsx";
import PrestasiMahasiswa from "./pages/adminProdi/kompetensiLulusan/prestasiMahasiswa.jsx";
import WaktuTungguLulusan from "./pages/adminProdi/kompetensiLulusan/waktuTungguLulusan.jsx";
import MahasiswaLayouts from "./components/Layouts/MahasiswaLayouts.jsx";
import ChangePassword from "./pages/mahasiswa/changePassword.jsx";
import CompleteProfile from "./pages/mahasiswa/completeProfile.jsx";
import MahasiswaGuard from "./auth/MahasiswaGuard.jsx";
import MahasiswaDashboard from "./pages/mahasiswa/dashboard.jsx";
import MahasiswaEntry from "./auth/MahasiswaEntry.jsx";
import ChangePasswordGuard from "./auth/ChangePasswordGuard.jsx";
import DosenLayouts from "./components/Layouts/DosenLayouts.jsx";
import DosenEntry from "./auth/DosenEntry.jsx";
import ChangePasswordGuardDosen from "./auth/ChangePasswordGuardDosen.jsx";
import DosenChangePassword from "./pages/dosen/dosenChangePassword.jsx";
import DosenCompleteProfile from "./pages/dosen/dosenCompleteProfile.jsx";
import DosenGuard from "./auth/DosenGuard.jsx";
import DosenDashboard from "./pages/dosen/dosenDashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireGuest>
        <HomePage />
      </RequireGuest>
    ),
    errorElement: <NotFound />,
  },

  {
    path: "/login",
    element: (
      <RequireGuest>
        <LoginPage />
      </RequireGuest>
    ),
  },

  {
    path: "/admin-prodi",
    element: (
      <RequireAuth role="ADMIN_PRODI">
        <AdminProdiLayouts />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "visi-misi", element: <VisiMisi /> },
      { path: "kurikulum", element: <Kurikulum /> },
      {
        path: "lulusan",
        element: <KompetensiLulusan />,
        children: [
          { index: true, element: <CapaianPembelajaran /> },
          { path: "capaian-pembelajaran", element: <CapaianPembelajaran /> },
          { path: "prestasi-mahasiswa", element: <PrestasiMahasiswa /> },
          { path: "waktu-tunggu", element: <WaktuTungguLulusan /> },
        ],
      },
    ],
  },

  {
    path: "/unit",
    element: (
      <RequireAuth role="UNIT">
        <Unit />
      </RequireAuth>
    ),
  },
  {
    path: "/dosen",
    element: <DosenLayouts />,
    children: [
      { index: true, element: <DosenEntry /> },

      {
        element: <ChangePasswordGuardDosen />,
        children: [
          { path: "change-password", element: <DosenChangePassword /> },
        ],
      },

      { path: "complete-profile", element: <DosenCompleteProfile /> },

      {
        element: <DosenGuard />,
        children: [{ path: "dashboard", element: <DosenDashboard /> }],
      },
    ],
  },

  {
    path: "/mahasiswa",
    element: <MahasiswaLayouts />,
    children: [
      { index: true, element: <MahasiswaEntry /> },

      { path: "change-password", element: <ChangePassword /> },

      { path: "complete-profile", element: <CompleteProfile /> },

      {
        element: <MahasiswaGuard />,
        children: [{ path: "dashboard", element: <MahasiswaDashboard /> }],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
