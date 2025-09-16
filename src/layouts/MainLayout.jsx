import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function MainLayout({ handleLogout, userRole }) {
  return (
    <div className="flex">
      <Sidebar handleLogout={handleLogout} userRole={userRole} />
      <div className="flex-1 ">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
