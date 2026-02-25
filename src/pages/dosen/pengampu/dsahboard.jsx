import {
  User,
  ClipboardCheck,
  FileCheck,
  FileText,
} from "lucide-react";
import DosenDashboardLayout from "../../../components/Layouts/DosenDashboardLayouts";

export default function DosenPengampuDashboard() {
  return (
    <DosenDashboardLayout
      title="Dosen Pengampu"
      accent="blue"
      menus={[
        { label: "Profil", path: "profil", icon: User },
        {
          label: "Penilaian",
          icon: ClipboardCheck,
          children: [
            { label: "Kesesuaian CPMK", path: "kesesuaian-cpmk", icon: FileCheck },
            { label: "Bukti Kinerja", path: "bukti-kinerja", icon: FileText },
            { label: "Analisis Kasus", path: "analisis-kasus", icon: FileText },
          ],
        },
      ]}
    />
  );
}