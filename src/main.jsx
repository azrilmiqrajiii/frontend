import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import RequireAuth from "./auth/RequireAuth.jsx";
import LoginPage from "./pages/Login.jsx";
import AdminProdi from "./pages/AdminProdi.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import NotFound from "./pages/notFound.jsx";
import Forbidden from "./pages/forbidden.jsx";
import Unit from "./pages/unit.jsx";
import HomePage from "./pages/home.jsx";
import AdminProdiLayout from "./components/Layouts/AdminProdiLayouts.jsx";
import Dashboard from "./pages/adminProdi/Dashboard.jsx";
import VisiMisi from "./pages/adminProdi/visiMisi.jsx";

const router = createBrowserRouter([
  { path: "/", element: <HomePage />, errorElement: <NotFound /> },
  { path: "/403", element: <Forbidden /> },

  { path: "/login", element: <LoginPage /> },

  {
    path: "/admin-prodi",
    element: (
      <RequireAuth role="ADMIN_PRODI">
        <AdminProdiLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "visi-misi", element: <VisiMisi /> },
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

  // {
  //   path: "/dosen",
  //   element: (
  //     <RequireAuth role="DOSEN">
  //       <Dosen />
  //     </RequireAuth>
  //   ),
  // },

  // {
  //   path: "/mahasiswa",
  //   element: (
  //     <RequireAuth role="MAHASISWA">
  //       <Mahasiswa />
  //     </RequireAuth>
  //   ),
  // },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
