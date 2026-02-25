import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import RequireAuth from "./auth/RequireAuth.jsx";
import RequireGuest from "./auth/RequireGuest.jsx";
import MahasiswaGuard from "./auth/MahasiswaGuard.jsx";
import ChangePasswordGuard from "./auth/ChangePasswordGuard.jsx";
import DosenGuard from "./auth/DosenGuard.jsx";

import AuthProvider from "./context/AuthProvider.jsx";

import NotFound from "./pages/notFound.jsx";
import LoginPage from "./pages/login.jsx";
import HomePage from "./pages/home.jsx";

import AdminProdiLayouts from "./components/Layouts/AdminProdiLayouts.jsx";
import Dashboard from "./pages/adminProdi/Dashboard.jsx";
import VisiMisi from "./pages/adminProdi/visiMisi.jsx";
import Kurikulum from "./pages/adminProdi/kurikulum.jsx";
import KompetensiLulusan from "./pages/adminProdi/kompetensiLulusan.jsx";
import CapaianPembelajaran from "./pages/adminProdi/kompetensiLulusan/capaianPembelajaran.jsx";
import PrestasiMahasiswa from "./pages/adminProdi/kompetensiLulusan/prestasiMahasiswa.jsx";
import WaktuTungguLulusan from "./pages/adminProdi/kompetensiLulusan/waktuTungguLulusan.jsx";

import Unit from "./pages/unit.jsx";

import MahasiswaLayouts from "./components/Layouts/MahasiswaLayouts.jsx";
import MahasiswaDashboard from "./pages/mahasiswa/regular/dashboard.jsx";
import SupervisorDashboard from "./pages/mahasiswa/supervisor/dashboard.jsx";
import ChangePassword from "./pages/mahasiswa/changePassword.jsx";
import CompleteProfile from "./pages/mahasiswa/completeProfile.jsx";
import MahasiswaEntry from "./auth/MahasiswaEntry.jsx";

import DosenLayouts from "./components/Layouts/DosenLayouts.jsx";
import DosenEntry from "./auth/DosenEntry.jsx";
import DosenDashboard from "./pages/dosen/dosenDashboard.jsx";
import DosenChangePassword from "./pages/dosen/dosenChangePassword.jsx";
import DosenCompleteProfile from "./pages/dosen/dosenCompleteProfile.jsx";
import ChangePasswordGuardDosen from "./auth/ChangePasswordGuardDosen.jsx";
import DosenPengampuDashboard from "./pages/dosen/pengampu/dsahboard.jsx";
import DosenTODDashboard from "./pages/dosen/TOD/dashboard.jsx";
import DosenKaprodiDashboard from "./pages/dosen/kaprodi/dashboard.jsx";

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
        children: [
          {
            path: "dashboard",
            element: <DosenPengampuDashboard />,
            children: [
              {
                index: true,
                element: (
                  <div className="text-lg font-semibold">
                    Dashboard Dosen Pengampu
                  </div>
                ),
              },
              {
                path: "profil",
                element: <div className="text-lg font-semibold">Profil</div>,
              },
              {
                path: "kesesuaian-cpmk",
                element: (
                  <div className="text-lg font-semibold">Kesesuaian CPMK</div>
                ),
              },
              {
                path: "bukti-kinerja",
                element: (
                  <div className="text-lg font-semibold">Bukti Kinerja</div>
                ),
              },
              {
                path: "analisis-kasus",
                element: (
                  <div className="text-lg font-semibold">Analisis Kasus</div>
                ),
              },
            ],
          },

          {
            path: "tod",
            element: <DosenTODDashboard />,
            children: [
              {
                index: true,
                element: (
                  <div className="text-lg font-semibold">
                    Dashboard Dosen TOD
                  </div>
                ),
              },
              {
                path: "profil",
                element: <div className="text-lg font-semibold">Profil</div>,
              },
              {
                path: "kesesuaian-cpmk",
                element: (
                  <div className="text-lg font-semibold">Kesesuaian CPMK</div>
                ),
              },
              {
                path: "bukti-kinerja",
                element: (
                  <div className="text-lg font-semibold">Bukti Kinerja</div>
                ),
              },
              {
                path: "analisis-kasus",
                element: (
                  <div className="text-lg font-semibold">Analisis Kasus</div>
                ),
              },
              {
                path: "mahasiswa-incharge",
                element: (
                  <div className="text-lg font-semibold">
                    Mahasiswa Incharge
                  </div>
                ),
              },
            ],
          },

          {
            path: "kaprodi",
            element: <DosenKaprodiDashboard />,
            children: [
              {
                index: true,
                element: (
                  <div className="text-lg font-semibold">Dashboard Kaprodi</div>
                ),
              },
              {
                path: "profil",
                element: <div className="text-lg font-semibold">Profil</div>,
              },
              {
                path: "kesesuaian-cpmk",
                element: (
                  <div className="text-lg font-semibold">Kesesuaian CPMK</div>
                ),
              },
              {
                path: "bukti-kinerja",
                element: (
                  <div className="text-lg font-semibold">Bukti Kinerja</div>
                ),
              },
              {
                path: "analisis-kasus",
                element: (
                  <div className="text-lg font-semibold">Analisis Kasus</div>
                ),
              },
              {
                path: "dosen-tod",
                element: <div className="text-lg font-semibold">Dosen TOD</div>,
              },
            ],
          },
        ],
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
        children: [
          {
            path: "dashboard",
            element: <MahasiswaDashboard />,
            children: [
              {
                index: true,
                element: (
                  <div className="text-lg font-semibold">
                    Dashboard Mahasiswa
                  </div>
                ),
              },
              {
                path: "profil",
                element: <div className="text-lg font-semibold">Profil</div>,
              },
              {
                path: "refleksi-harian",
                element: (
                  <div className="text-lg font-semibold">
                    Refleksi Harian Incharge
                  </div>
                ),
              },
              {
                path: "penilaian-magang",
                element: (
                  <div className="text-lg font-semibold">
                    Penilaian Tempat Magang
                  </div>
                ),
              },
            ],
          },

          {
            path: "supervisor",
            element: <SupervisorDashboard />,
            children: [
              {
                index: true,
                element: (
                  <div className="text-lg font-semibold">
                    Dashboard Supervisor
                  </div>
                ),
              },
              {
                path: "profil",
                element: <div className="text-lg font-semibold">Profil</div>,
              },
              {
                path: "dbsh-supervisor",
                element: (
                  <div className="text-lg font-semibold">DBSH Supervisor</div>
                ),
              },
              {
                path: "pesilak",
                element: <div className="text-lg font-semibold">Pesilak</div>,
              },
              {
                path: "rekap-otomatis",
                element: (
                  <div className="text-lg font-semibold">Rekap Otomatis</div>
                ),
              },
            ],
          },
        ],
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
