import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function MainLayout() {
  return (
    <div className="flex min-h-screen ">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {/* Render the page inside layout */}
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
