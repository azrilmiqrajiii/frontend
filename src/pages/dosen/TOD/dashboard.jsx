import { User, ClipboardCheck, Users, FileCheck, FileText } from "lucide-react";
import DosenDashboardLayout from "../../../components/Layouts/DosenDashboardLayouts";

export default function DosenTODDashboard() {
  return (
    <DosenDashboardLayout
      title="Dosen TOD"
      accent="blue"
      menus={[
        { label: "Profil", path: "profil", icon: User },
        {
          label: "Penilaian",
          icon: ClipboardCheck,
          children: [
            {
              label: "Kesesuaian CPMK",
              path: "kesesuaian-cpmk",
              icon: FileCheck,
            },
            { label: "Bukti Kinerja", path: "bukti-kinerja", icon: FileText },
            { label: "Analisis Kasus", path: "analisis-kasus", icon: FileText },
          ],
        },
        {
          label: "Mahasiswa Incharge",
          path: "mahasiswa-incharge",
          icon: Users,
        },
      ]}
    />
  );
}
