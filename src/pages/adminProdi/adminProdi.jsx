import { Outlet } from "react-router-dom";
import AdminProdiLayouts from "../../components/Layouts/AdminProdiLayouts";

const AdminProdi = () => {
  return (
    <AdminProdiLayouts>
      <Outlet />
    </AdminProdiLayouts>
  );
};

export default AdminProdi;
