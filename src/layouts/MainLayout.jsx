import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-950 via-slate-800 to-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {/* Render the page inside layout */}
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
