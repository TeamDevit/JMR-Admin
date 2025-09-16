import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function MainLayout({ handleLogout, userRole }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar handleLogout={handleLogout} userRole={userRole} />
      <div className="flex-1 overflow-y-auto md:ml-64">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
